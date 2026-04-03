import BreadCrumb from '@components/reusable/breadCrumb/BreadCrumb';
import { DateSelection, Text, Textarea } from '@components/reusable/FormInputs';
import SearchableSelect from '@components/reusable/SearchableSelect';
import SignatureCanvas from '@components/travel-log/SignatureCanvas';
import useParticipantsQuery from '@hooks/useParticipantsQuery';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

// ─── IndexedDB helper ─────────────────────────────────────────────────────────

async function saveToIndexedDB(entry) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('kmLogs', 1);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('logs')) {
        db.createObjectStore('logs', { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = (e) => {
      const db = e.target.result;
      const tx = db.transaction('logs', 'readwrite');
      const store = tx.objectStore('logs');
      const addReq = store.add({
        ...entry,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
      addReq.onsuccess = () => resolve(addReq.result);
      addReq.onerror = () => reject(addReq.error);
    };

    request.onerror = () => reject(request.error);
  });
}

async function submitKMLog(data) {
  // Replace with your actual API call
  const response = await fetch('/api/km-logs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Network error');
  return response.json();
}

// ─── trip type selector ───────────────────────────────────────────────────────

function TripTypeButton({ type, selected, onClick }) {
  const isClient = type === 'client';
  return (
    <button
      type="button"
      onClick={() => onClick(type)}
      className={`flex-1 flex flex-col items-center justify-center gap-2 py-2 rounded-lg border transition-all active:scale-95 ${
        selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
      }`}
    >
      {isClient ? (
        <DirectionsCarFilledOutlinedIcon
          sx={{ fontSize: 28, color: selected ? '#1b75bb' : '#9ca3af' }}
        />
      ) : (
        <ApartmentOutlinedIcon
          sx={{ fontSize: 28, color: selected ? '#1b75bb' : '#9ca3af' }}
        />
      )}
      <span
        className={`text-sm font-semibold ${selected ? 'text-primary' : 'text-gray-500'}`}
      >
        {isClient ? 'Client Trip' : 'Company Trip'}
      </span>
    </button>
  );
}

// ─── main ─────────────────────────────────────────────────────────────────────

const NewKMLog = () => {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState('client'); // 'client' | 'company'
  const [signature, setSignature] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigation = () => navigate(`/work/travel-log`);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      staffParticipants: null,
      kilometers: '',
      occurDate: new Date().toISOString(),
      description: '',
    },
  });

  // Participants list (react-query)
  const { data: participants = [], isLoading: participantsLoading } =
    useParticipantsQuery();

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    const payload = {
      tripType,
      ...formData,
      signature,
    };

    try {
      await submitKMLog(payload);
      navigate(-1);
    } catch {
      // API failed → persist to IndexedDB for later resubmit
      await saveToIndexedDB(payload);
      navigate(-1);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isClientTrip = tripType === 'client';
  const isCompanyTrip = tripType === 'company';

  return (
    <div className="space-y-5 pt-5 pb-10 px-4">
      <BreadCrumb
        currentPage={`Create New Log`}
        prevPage={`Travel Logs`}
        navigation={navigation}
      />
      <div className="space-y-5">
        <div className=" space-y-5">
          {/* Trip Type */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700">Trip Type</p>
            <div className="flex gap-3">
              <TripTypeButton
                type="client"
                selected={isClientTrip}
                onClick={setTripType}
              />
              <TripTypeButton
                type="company"
                selected={isCompanyTrip}
                onClick={setTripType}
              />
            </div>
          </div>

          {/* Participant (client trip only) */}
          {isClientTrip && (
            <Controller
              name="staffParticipants"
              control={control}
              rules={{ required: 'Please select a participant' }}
              render={({ field }) => (
                <SearchableSelect
                  label="Search Participant"
                  value={field.value}
                  onChange={field.onChange}
                  options={participants}
                  isLoading={participantsLoading}
                  placeholder="Search By Name"
                  error={errors.staffParticipants?.message}
                  required
                />
              )}
            />
          )}

          {/* Kilometers */}
          <Controller
            name="kilometers"
            control={control}
            rules={{
              required: 'Distance is required',
              validate: (v) => {
                const n = Number(v);
                if (isNaN(n) || n <= 0) return 'Please enter a valid distance';
                return true;
              },
            }}
            render={({ field }) => (
              <Text
                label="Kilometers Traveled"
                placeholder="Enter Distance"
                type="number"
                suffix="km"
                {...field}
                error={errors.kilometers?.message}
                required
              />
            )}
          />

          {/* Date (client trip only) */}
          {isClientTrip && (
            <Controller
              name="occurDate"
              control={control}
              rules={{ required: 'Date is required' }}
              render={({ field }) => (
                <DateSelection
                  label="Date"
                  {...field}
                  placeholder="Select date"
                  maxDate={new Date().toISOString()}
                  error={errors.occurDate?.message}
                  required
                />
              )}
            />
          )}

          {/* Purpose of trip (company trip only) */}
          {isCompanyTrip && (
            <Controller
              name="description"
              control={control}
              rules={{ required: 'Purpose is required' }}
              render={({ field }) => (
                <Textarea
                  {...field}
                  label="Purpose of Trip"
                  placeholder="Provide a short description for the purpose of the trip"
                  error={errors.description?.message}
                  required
                />
              )}
            />
          )}

          {/* Signature (client trip only) */}
          {isClientTrip && (
            <div className="space-y-1.5">
              <p className="text-sm font-semibold text-gray-700">
                Participant Signature <span className="text-red-500">*</span>
              </p>
              <SignatureCanvas onSignatureChange={(sig) => setSignature(sig)} />
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-blue-600 disabled:opacity-60 active:scale-[0.98] transition-all text-white font-bold text-base py-4 rounded-lg shadow"
          >
            {isSubmitting ? 'Submitting…' : 'Submit Entry'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(NewKMLog);
