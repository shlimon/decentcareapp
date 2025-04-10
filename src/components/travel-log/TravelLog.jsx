import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axiosInstance';
import useFetchData from '../../hooks/useFetchData';

const TravelLog = () => {
  const user = localStorage.getItem('user_data');
  const userData = JSON.parse(user);
  const userInfo = userData;
  const { data } = useFetchData('/membersWithDetails');
  const signatureRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureData, setSignatureData] = useState('');
  const [userInputs, setUserInputs] = useState([]);
  const canvasContainerRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      participantId: '',
      travelDate: '',
      kilometersTraveled: '',
      participantConsent: false,
      description: '',
    },
  });

  // Watch the consent checkbox
  const consentChecked = watch('participantConsent');

  // Initialize canvas when it becomes visible
  useEffect(() => {
    if (consentChecked && signatureRef.current) {
      const canvas = signatureRef.current;
      const ctx = canvas.getContext('2d');

      // Clear canvas first
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set initial state
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.strokeStyle = 'black';

      // Add placeholder text
      ctx.font = '24px Arial';
      ctx.fillStyle = '#aaaaaa';
      ctx.textAlign = 'center';

      // Add pen icon if needed
      const penIcon = new Image();
      penIcon.src = '/pen-icon.svg'; // Replace with actual pen icon path
      penIcon.onload = () => {
        ctx.drawImage(
          penIcon,
          canvas.width / 2 + 100,
          canvas.height / 2 - 20,
          40,
          40
        );
      };
    }
  }, [consentChecked]);

  // Adjust canvas size to match container on resize
  useEffect(() => {
    if (consentChecked) {
      const resizeCanvas = () => {
        if (signatureRef.current && canvasContainerRef.current) {
          const canvas = signatureRef.current;
          const container = canvasContainerRef.current;

          // Store current drawing
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d');
          tempCanvas.width = canvas.width;
          tempCanvas.height = canvas.height;
          tempCtx.drawImage(canvas, 0, 0);

          // Resize canvas to match container
          canvas.width = container.clientWidth;
          canvas.height = 200;

          // Restore drawing
          const ctx = canvas.getContext('2d');
          ctx.lineWidth = 2;
          ctx.lineCap = 'round';
          ctx.strokeStyle = 'black';
          ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);

          // If no signature data, add placeholder text
          if (!signatureData) {
            ctx.font = '24px Arial';
            ctx.fillStyle = '#aaaaaa';
            ctx.textAlign = 'center';
            ctx.fillText('Sign Here', canvas.width / 2, canvas.height / 2);
          }
        }
      };

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      return () => {
        window.removeEventListener('resize', resizeCanvas);
      };
    }
  }, [consentChecked, signatureData]);

  const handleUserData = async (formData) => {
    // Add staff information
    formData.staffId = userInfo.user.staffId;

    // Add signature data
    formData.signature = signatureData;

    // Here you would add your API call to save data to MongoDB
    try {
      const response = await axiosInstance.post(
        `/staff/travelLogs`,
        JSON.stringify(formData)
      );

      if (response) {
        console.log(response);
        toast.success('Data submitted successfully');
        // reset();
        // setSignatureData('');
      }

      if (response) {
        // Handle success
        console.log(response);
        // Reset form after submission
        reset();
        setSignatureData('');
      } else {
        // Handle error
        console.error('Failed to save travel log');
      }
    } catch (error) {
      console.error('Error saving travel log:', error);
    }
  };

  const handleUserSelected = (id) => {
    const selectedUser = data.find((user) => user._id === id);
    setUserInputs(selectedUser?.userInputList || []);
  };

  // Completely revamped signature pad handlers
  const getCoordinates = (e) => {
    if (!signatureRef.current) return { x: 0, y: 0 };

    const canvas = signatureRef.current;
    const rect = canvas.getBoundingClientRect();

    // Handle both mouse and touch events
    let clientX, clientY;

    // Touch event
    if (e.touches && e.touches[0]) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }
    // Mouse event
    else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    // Calculate the exact position relative to the canvas
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e) => {
    // Prevent scrolling on touch devices
    if (e.touches) e.preventDefault();

    const canvas = signatureRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);

    // Clear placeholder
    if (!signatureData) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    // Prevent scrolling on touch devices
    if (e.touches) e.preventDefault();

    if (!isDrawing) return;

    const canvas = signatureRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);

      // Save the signature data
      const canvas = signatureRef.current;
      if (canvas) {
        setSignatureData(canvas.toDataURL());
      }
    }
  };

  const clearSignature = () => {
    const canvas = signatureRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Add placeholder text
    ctx.font = '24px Arial';
    ctx.fillStyle = '#aaaaaa';
    ctx.textAlign = 'center';
    ctx.fillText('Sign Here', canvas.width / 2, canvas.height / 2);

    setSignatureData('');
  };

  return (
    <div className="w-full p-6">
      <h3 className="text-xl font-bold mb-4">Participant Travel Log</h3>
      <div>
        <form onSubmit={handleSubmit(handleUserData)}>
          <div className="w-full mt-4 mb-6">
            <label className="block mb-1 text-lg font-medium text-gray-700">
              Participant Name
            </label>
            <select
              name="participantId"
              id="participantId"
              {...register('participantId', {
                required: 'Participant is required',
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => handleUserSelected(e.target.value)}
            >
              <option value="">Select a user</option>
              {data?.map((user) => (
                <option value={user._id} key={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
            {errors.participantId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.participantId.message}
              </p>
            )}
          </div>

          <div className="w-full mb-6">
            <label className="block mb-1 text-lg font-medium text-gray-700">
              Travel Date
            </label>
            <input
              type="date"
              {...register('travelDate', {
                required: 'Travel date is required',
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.travelDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.travelDate.message}
              </p>
            )}
          </div>

          <div className="w-full mb-6">
            <label className="block mb-1 text-lg font-medium text-gray-700">
              KM Traveled -
            </label>
            <input
              type="number"
              {...register('kilometersTraveled', {
                required: 'Kilometers traveled is required',
                min: { value: 0, message: 'Must be a positive number' },
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter distance in kilometers"
            />
            {errors.kilometersTraveled && (
              <p className="text-red-500 text-sm mt-1">
                {errors.kilometersTraveled.message}
              </p>
            )}
          </div>

          <div className="w-full mb-6">
            <label className="block mb-1 text-lg font-medium text-gray-700">
              Description
            </label>
            <textarea
              rows={3}
              {...register('description', {
                required: 'Description is required',
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter purpose or notes for the travel"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="w-full mb-6">
            <label className="flex items-center text-lg font-medium text-gray-700">
              Participant Consent <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="mt-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 align-middle"
                  {...register('participantConsent', {
                    required: 'Consent is required',
                  })}
                />
                <span className="text-gray-700 ml-2 leading-none align-middle">
                  I agree the KM's are correct
                </span>
              </label>

              {errors.participantConsent && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.participantConsent.message}
                </p>
              )}
            </div>
          </div>

          {consentChecked && (
            <div className="w-full mb-6">
              <label className="block mb-2 text-lg font-medium text-gray-700">
                Participant Signature <span className="text-red-500">*</span>
              </label>
              <div
                ref={canvasContainerRef}
                className="border border-gray-300 rounded-lg mb-2 overflow-hidden"
              >
                <canvas
                  ref={signatureRef}
                  width="600"
                  height="200"
                  className="w-full bg-white touch-none"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                ></canvas>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={clearSignature}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                >
                  Clear
                </button>
              </div>
              {!signatureData && (
                <div className="flex items-center mt-2 text-red-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>This field is required.</span>
                </div>
              )}
            </div>
          )}

          <div className="mt-6">
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={consentChecked && !signatureData}
            >
              Submit Travel Log
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default React.memo(TravelLog);
