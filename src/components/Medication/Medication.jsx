import axiosInstance from '@api/axiosInstance';
import React from 'react';
import toast from 'react-hot-toast';

function Medication({ medicationId, participantId, setSelectedMedication }) {
  const [showModal, setShowModal] = React.useState(false);
  const [modalType, setModalType] = React.useState(null);
  const [observationNotes, setObservationNotes] = React.useState('');
  const [refusalReason, setRefusalReason] = React.useState('');
  const [notAdministeredReason, setNotAdministeredReason] = React.useState('');
  const [signatureCanvas, setSignatureCanvas] = React.useState(null);
  const [signatureBase64, setSignatureBase64] = React.useState('');
  const [completedSteps, setCompletedSteps] = React.useState([]);
  const [stepsConfirmed, setStepsConfirmed] = React.useState(false);
  const canvasRef = React.useRef(null);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [medicationData, setMedicationData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  // Auth headers
  const authHeaders = React.useMemo(() => {
    const stored = localStorage.getItem('kmTravelUser');
    const user = stored ? JSON.parse(stored) : null;

    return {
      'Content-Type': 'application/json',
      name: user?.name || '',
      phone: user?.phone || '',
      dob: user?.dob || '',
    };
  }, []);

  // Fetch medication data
  React.useEffect(() => {
    const fetchMedicationData = async () => {
      try {
        setLoading(true);

        const response = await axiosInstance.get(
          `/medication-administrations/participant/${participantId}/administer/${medicationId}`
        );

        const result = response.data;

        if (result?.success && result?.data) {
          setMedicationData(result.data);
        } else {
          toast.error(result?.message || 'Failed to load medication data');
        }
      } catch (err) {
        toast.error('Error fetching medication data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (participantId && medicationId) {
      fetchMedicationData();
    }
  }, [participantId, medicationId, authHeaders]);

  // Initialize canvas
  React.useEffect(() => {
    if (showModal && modalType === 'administer' && canvasRef.current) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      setSignatureCanvas(canvas.getContext('2d'));
    }
  }, [showModal, modalType, stepsConfirmed]);

  // Canvas drawing functions
  const getCoordinates = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    if (e.touches && e.touches.length > 0) {
      // Touch event
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      // Mouse event
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    const coords = getCoordinates(e);
    const ctx = signatureCanvas;
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  };

  const draw = (e) => {
    if (!isDrawing || !signatureCanvas) return;
    e.preventDefault();
    const coords = getCoordinates(e);
    const ctx = signatureCanvas;
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = (e) => {
    if (e) e.preventDefault();
    setIsDrawing(false);
    if (signatureCanvas) {
      signatureCanvas.closePath();
      saveSignature();
    }
  };

  const clearCanvas = () => {
    if (signatureCanvas && canvasRef.current) {
      signatureCanvas.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      setSignatureBase64('');
    }
  };

  const saveSignature = () => {
    if (canvasRef.current) {
      const base64 = canvasRef.current.toDataURL('image/png');
      setSignatureBase64(base64);
    }
  };

  // Handle Administer button click
  const handleAdminister = () => {
    setModalType('administer');
    setShowModal(true);
    setCompletedSteps([]);
    setObservationNotes('');
    setSignatureBase64('');
  };

  // Handle Refused button click
  const handleRefused = () => {
    setModalType('refused');
    setShowModal(true);
    setRefusalReason('');
  };

  // Handle Not Administered button click
  const handleNotAdministered = () => {
    setModalType('notAdministered');
    setShowModal(true);
    setNotAdministeredReason('');
  };

  // Toggle step completion
  const toggleStep = (stepId) => {
    setCompletedSteps((prev) =>
      prev.includes(stepId)
        ? prev.filter((id) => id !== stepId)
        : [...prev, stepId]
    );
  };

  // Check if all steps are completed
  const allStepsCompleted =
    medicationData?.medication?.prnSteps &&
    medicationData?.medication?.prnSteps?.length > 0 &&
    medicationData?.medication?.prnSteps?.every((step) =>
      completedSteps.includes(step?._id)
    );

  // Handle confirming all PRN steps
  const handleConfirmSteps = () => {
    if (allStepsCompleted) {
      setStepsConfirmed(true);
    }
  };

  // Handle modal complete/submit
  const handleModalComplete = async () => {
    let payload;

    if (modalType === 'administer') {
      if (medicationData?.medication?.type === 'prn' && !stepsConfirmed) {
        alert('Please complete all PRN steps and confirm');
        return;
      }

      if (!signatureBase64) {
        alert('Signature is mandatory');
        return;
      }

      payload = {
        status: 'Completed',
        note: observationNotes || '',
        signature: signatureBase64,
      };
    } else if (modalType === 'refused') {
      if (!refusalReason.trim()) {
        alert('Reason for refusal is mandatory');
        return;
      }

      payload = {
        status: 'Refused',
        note: refusalReason.trim(),
        signature: '',
      };
    } else if (modalType === 'notAdministered') {
      if (!notAdministeredReason.trim()) {
        alert('Reason for not administering is mandatory');
        return;
      }

      payload = {
        status: 'Not Administered',
        note: notAdministeredReason.trim(),
        signature: '',
      };
    }

    try {
      const response = await axiosInstance.get(
        `/medication-administrations/participant/${participantId}/administer/${medicationId}`,
        payload
      );

      const result = response.data;

      if (result?.success) {
        alert('Medication administration recorded successfully!');
        setShowModal(false);
        setSelectedMedication(null); // Go back to list
      } else {
        alert(result?.message || 'Failed to record medication administration');
      }
    } catch (error) {
      alert('Error recording medication administration: ' + error.message);
      console.error('API Error:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setObservationNotes('');
    setRefusalReason('');
    setNotAdministeredReason('');
    setSignatureBase64('');
    setCompletedSteps([]);
    setStepsConfirmed(false);
    clearCanvas();
  };

  return (
    <div className="pb-8">
      {loading && (
        <div className="text-center py-8">
          <div className="text-gray-600">Loading medication data...</div>
        </div>
      )}

      {!loading && medicationData && (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setSelectedMedication(null)}
              className="px-3 py-2 bg-gray-400 text-white text-sm font-medium rounded hover:bg-gray-500 transition flex items-center gap-2"
            >
              ← Back
            </button>
          </div>
          {/* Header */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <h2 className="text-gray-900 font-semibold">
                  {medicationData?.participant?.name || 'N/A'}
                </h2>
              </div>
              <span className="text-gray-500 font-medium text-sm">
                {medicationData?.participant?.community || 'N/A'}
              </span>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-3 text-left">
            {/* Medication Name and Strength */}
            <div className="flex justify-between items-center mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold">
                    {medicationData?.medication?.name || 'N/A'}
                  </h2>
                  {medicationData?.medication?.type === 'prn' && (
                    <span className="text-xs text-orange-600 bg-orange-50 border border-orange-500 rounded-full px-2">
                      PRN
                    </span>
                  )}
                </div>

                <div className="text-xs text-gray-600">
                  {medicationData?.medication?.strength
                    ? `${medicationData.medication.strength}mg`
                    : 'N/A'}
                </div>
              </div>

              {/* Action Buttons */}
              <div>
                {(medicationData?.medication?.status === 'scheduled' ||
                  medicationData?.medication?.status === 'as required') && (
                  <div className="flex gap-2 flex-wrap justify-end">
                    <button
                      onClick={handleAdminister}
                      className="px-2 py-1 bg-blue-600 text-white text-[11px] font-medium rounded hover:bg-blue-700 transition"
                    >
                      Administer
                    </button>
                    <button
                      onClick={handleRefused}
                      className="px-2 py-1 bg-red-500 text-white text-[11px] font-medium rounded hover:bg-red-600 transition"
                    >
                      Refused
                    </button>
                    {medicationData?.medication?.type === 'medication' && (
                      <button
                        onClick={handleNotAdministered}
                        className="px-2 py-1 bg-orange-500 text-white text-[11px] font-medium rounded hover:bg-orange-600 transition"
                      >
                        Not Administered
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Route */}
            <div className="border border-gray-300 rounded-lg p-4 bg-white flex items-center gap-3">
              <div className="text-gray-400 text-xl flex-shrink-0">↓</div>
              <div className="flex justify-between w-full items-center gap-2">
                <div className="text-xs text-gray-500">Route</div>
                <div className="text-xs font-medium">
                  {medicationData?.medication?.route || 'N/A'}
                </div>
              </div>
            </div>

            {/* Time / Next Administration */}
            <div className="border border-gray-300 rounded-lg p-4 bg-white flex items-center gap-3">
              <span className="text-gray-400 text-lg flex-shrink-0">⏰</span>
              <div className="flex justify-between w-full items-center gap-2">
                <div className="text-xs text-gray-500">Time</div>
                <div className="text-xs font-medium">
                  {medicationData?.medication?.scheduledTime ||
                    medicationData?.medication?.status ||
                    'As required'}
                </div>
              </div>
            </div>

            {/* Instruction - for Regular Medication */}
            {medicationData?.medication?.instruction && (
              <div className="border border-gray-300 rounded-lg p-4 bg-white flex items-center gap-3">
                <div className="text-gray-400 text-xl flex-shrink-0">💊</div>
                <div className="flex justify-between w-full items-center">
                  <div className="text-xs text-gray-500">Instruction</div>
                  <div className="text-xs font-medium text-gray-800 text-right">
                    {medicationData.medication.instruction}
                  </div>
                </div>
              </div>
            )}

            {/* Note - for Regular Medication */}
            {medicationData?.medication?.type === 'medication' &&
              medicationData?.medication?.note && (
                <div className="border border-gray-300 rounded-lg p-4 bg-white flex items-center gap-3">
                  <div className="text-gray-400 text-xl flex-shrink-0">📋</div>
                  <div className="flex justify-between w-full items-center">
                    <div className="text-xs text-gray-500">Note</div>
                    <div className="text-xs font-medium text-gray-800 text-right">
                      {medicationData.medication.note}
                    </div>
                  </div>
                </div>
              )}

            {/* PRN Note - for PRN Medication */}
            {medicationData?.medication?.type === 'prn' &&
              medicationData?.medication?.note && (
                <div className="border border-gray-300 rounded-lg p-4 bg-white flex items-center gap-3">
                  <div className="text-gray-400 text-xl flex-shrink-0">📝</div>
                  <div className="flex justify-between w-full items-center gap-2">
                    <div className="text-xs text-gray-500">PRN Note</div>
                    <div className="text-xs font-medium text-gray-800 text-right">
                      {medicationData.medication.note}
                    </div>
                  </div>
                </div>
              )}

            {/* Allergies Alert */}
            {medicationData?.medication?.allergies && (
              <div className="border border-gray-300 rounded-lg p-4 bg-[#FEFCEB] flex items-center gap-3">
                <div className="text-yellow-500 text-xl flex-shrink-0">⚠️</div>
                <div className="flex justify-between w-full items-center gap-2">
                  <div className="text-xs text-gray-500">Allergies</div>
                  <div className="text-xs font-medium text-yellow-700 text-right">
                    {medicationData.medication.allergies}
                  </div>
                </div>
              </div>
            )}

            {medicationData?.medication?.allergies && (
              <div className="border border-gray-300 rounded-lg p-4 bg-[#FFF2E6] flex items-center gap-3">
                <div className="text-red-500 text-xl flex-shrink-0">🚨</div>
                <div className="flex justify-between w-full items-center gap-2">
                  <div className="text-xs text-gray-500">Emergency Steps</div>
                  <div className="text-xs font-medium text-yellow-700 text-right">
                    {medicationData.medication.adverseEffectsSteps}
                  </div>
                </div>
              </div>
            )}

            {/* Storage Information */}
            {medicationData?.medication?.storage && (
              <div className="border border-gray-300 rounded-lg p-4 bg-white flex items-center gap-3">
                <div className="text-gray-400 text-xl flex-shrink-0">🔒</div>
                <div className="flex justify-between w-full items-center gap-2">
                  <div className="text-xs text-gray-500">
                    Storage Information
                  </div>
                  <div className="text-xs font-medium text-gray-800 text-right">
                    {medicationData.medication.storage}
                  </div>
                </div>
              </div>
            )}

            {/* Emergency Contact */}
            {medicationData?.emergencyContact && (
              <div className="border border-gray-300 rounded-lg p-4 bg-white flex items-center gap-3">
                <div className="text-gray-400 text-xl flex-shrink-0">👤</div>
                <div className="flex justify-between w-full items-center gap-2">
                  <div className="text-xs text-gray-500">Emergency Contact</div>
                  <div className="text-xs font-medium text-gray-800 text-right space-y-0.5">
                    <div>{medicationData?.emergencyContact?.name || 'N/A'}</div>
                    <div className="text-gray-500">
                      {medicationData?.emergencyContact?.relation || 'N/A'}
                    </div>
                    <div>
                      {medicationData?.emergencyContact?.phone || 'N/A'}
                    </div>
                    <div>
                      {medicationData?.emergencyContact?.email || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && medicationData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Administer Modal */}
            {modalType === 'administer' && (
              <div className="p-6">
                <h2 className="text-lg font-bold mb-4">
                  Administer Medication
                </h2>

                {/* PRN Steps */}
                {medicationData?.medication?.type === 'prn' &&
                  medicationData?.medication?.prnSteps &&
                  !stepsConfirmed && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold mb-3">
                        PRN Steps (All required)
                      </h3>
                      <div className="space-y-2">
                        {medicationData.medication.prnSteps.map((step) => (
                          <label
                            key={step?._id}
                            className="flex items-center cursor-pointer leading-none"
                          >
                            <input
                              type="checkbox"
                              checked={completedSteps.includes(step?._id)}
                              onChange={() => toggleStep(step?._id)}
                              className="w-4 h-4 accent-blue-600"
                            />
                            <span className="text-sm text-gray-700 ml-2 leading-none">
                              {step?.step}
                            </span>
                          </label>
                        ))}
                      </div>

                      <button
                        onClick={handleConfirmSteps}
                        disabled={!allStepsCompleted}
                        className={`mt-4 w-full px-4 py-2 text-white text-sm font-medium rounded transition ${
                          allStepsCompleted
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Administer
                      </button>
                    </div>
                  )}

                {/* Observation Notes and Signature - Show only after steps confirmed or for regular medication */}
                {(stepsConfirmed ||
                  medicationData?.medication?.type === 'medication') && (
                  <>
                    {/* Observation Notes */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Observation Notes (Optional)
                      </label>
                      <textarea
                        value={observationNotes}
                        onChange={(e) => setObservationNotes(e.target.value)}
                        placeholder="Enter observation notes..."
                        className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="4"
                      />
                    </div>

                    {/* Signature Canvas */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Signature (Mandatory)
                      </label>
                      <div className="border-2 border-gray-300 rounded bg-gray-50">
                        <canvas
                          ref={canvasRef}
                          onMouseDown={startDrawing}
                          onMouseMove={draw}
                          onMouseUp={stopDrawing}
                          onMouseLeave={stopDrawing}
                          onTouchStart={startDrawing}
                          onTouchMove={draw}
                          onTouchEnd={stopDrawing}
                          onTouchCancel={stopDrawing}
                          className="w-full h-32 cursor-crosshair touch-none"
                        />
                      </div>
                      <button
                        onClick={clearCanvas}
                        className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                      >
                        Clear Signature
                      </button>
                      {signatureBase64 && (
                        <p className="text-xs text-green-600 mt-1">
                          ✓ Signature saved
                        </p>
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={handleModalComplete}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition"
                      >
                        Complete
                      </button>
                      <button
                        onClick={handleCloseModal}
                        className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 text-sm font-medium rounded hover:bg-gray-400 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Refused Modal */}
            {modalType === 'refused' && (
              <div className="p-6">
                <h2 className="text-lg font-bold mb-4">Medication Refused</h2>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Refusal (Mandatory)
                  </label>
                  <textarea
                    value={refusalReason}
                    onChange={(e) => setRefusalReason(e.target.value)}
                    placeholder="Enter reason for refusal..."
                    className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    rows="4"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleModalComplete}
                    className="flex-1 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded hover:bg-red-600 transition"
                  >
                    Complete
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 text-sm font-medium rounded hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Not Administered Modal */}
            {modalType === 'notAdministered' && (
              <div className="p-6">
                <h2 className="text-lg font-bold mb-4">Not Administered</h2>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Not Administering (Mandatory)
                  </label>
                  <textarea
                    value={notAdministeredReason}
                    onChange={(e) => setNotAdministeredReason(e.target.value)}
                    placeholder="Enter reason..."
                    className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows="4"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleModalComplete}
                    className="flex-1 px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded hover:bg-orange-600 transition"
                  >
                    Complete
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 text-sm font-medium rounded hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(Medication);
