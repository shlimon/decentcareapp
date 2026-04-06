import axiosInstance from '@api/axiosInstance';
import useGetMyTravels from '@hooks/useGetMyTravels';
import useParticipantsQuery from '@hooks/useParticipantsQuery';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import AddLocationAltOutlinedIcon from '@mui/icons-material/AddLocationAltOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CancelScheduleSendOutlinedIcon from '@mui/icons-material/CancelScheduleSendOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined';
import { useQueryClient } from '@tanstack/react-query';
import { getAllFailedLogs, removeFailedLog } from '@utils/IdbTravelLogs'; // ← shared util
import { removeEmptyValues } from '@utils/removeEmptyValues';
import {
  AlertTriangle,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Clock,
  RefreshCw,
  XCircle,
} from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ─── helpers ──────────────────────────────────────────────────────────────────

const getWeekRange = (offsetWeeks = 0) => {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7) + offsetWeeks * 7);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return { monday, sunday };
};

const fmt = (d) =>
  d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
  });

const fmtFull = (str) =>
  new Date(str).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

// ─── status normaliser ────────────────────────────────────────────────────────

const normaliseStatus = (apiStatus) => {
  if (!apiStatus) return 'pending';
  const s = apiStatus.toLowerCase();
  if (s === 'auto approved' || s === 'approved') return 'approved';
  if (s === 'declined') return 'declined';
  return 'pending';
};

const mapTravel = (t) => ({
  id: t._id,
  name:
    t.type === 'client'
      ? (t.participant?.name ?? t.requestedFor?.name ?? 'Unknown Participant')
      : 'Company Trip',
  type: t.type,
  date: t.dateForTravel ?? t.date,
  km: t.traveled,
  status: normaliseStatus(t.status),
  purpose: t.tripPurpose ?? null,
  declinedBy: t.verification?.by?.name ?? null,
  declineReason: t.verification?.reason ?? null,
});

// entry = { idbKey: number, data: object } from getAllFailedLogs cursor
// participants list passed in to resolve ID string -> name
const mapIDBEntry = ({ idbKey, data }, participants = []) => {
  const participantId =
    typeof data.participant === 'string'
      ? data.participant
      : (data.participant?._id ?? null);

  const participantName =
    participants.find((p) => p._id === participantId)?.name ?? null;

  return {
    id: `idb_${idbKey}`,
    _idbKey: idbKey,
    _payload: data,
    name:
      data.type === 'client'
        ? (participantName ?? 'Unknown Participant')
        : 'Company Trip',
    type: data.type ?? 'client',
    date: data.date ?? new Date().toISOString(),
    km: data.traveled ?? 0,
    status: 'error',
    purpose: data.tripPurpose ?? null,
    declinedBy: null,
    declineReason: null,
  };
};

// ─── status map ───────────────────────────────────────────────────────────────

const STATUS_MAP = {
  approved: {
    label: 'Approved',
    pill: 'bg-green-50 text-green-600 border border-green-200',
    icon: CheckCheck,
  },
  pending: {
    label: 'Pending',
    pill: 'bg-amber-50 text-amber-500 border border-amber-200',
    icon: Clock,
  },
  error: {
    label: 'Error',
    pill: 'bg-red-50 text-red-400 border border-red-200',
    icon: AlertTriangle,
  },
  declined: {
    label: 'Declined',
    pill: 'bg-red-50 text-red-500 border border-red-200',
    icon: XCircle,
  },
};

// ─── SummaryCard ──────────────────────────────────────────────────────────────

// eslint-disable-next-line no-unused-vars
const SummaryCard = ({ Icon, label, value, color, border }) => (
  <div
    className={`flex flex-col items-center justify-center gap-0.5 px-2 py-2.5 rounded-lg border ${border} bg-white flex-1`}
  >
    <Icon size={15} className={color} />
    <p className={`text-xs ${color} leading-tight`}>{label}</p>
    <p className={`font-medium leading-tight ${color}`}>{value}</p>
  </div>
);

// ─── LogCard ──────────────────────────────────────────────────────────────────

const LogCard = ({ log, onResubmit, isResubmitting }) => {
  const s = STATUS_MAP[log.status] ?? STATUS_MAP.pending;
  const StatusIcon = s.icon;

  return (
    <div
      className={`bg-white rounded-2xl px-3 py-2 border ${
        log.status === 'error' ? 'border-red-200' : 'border-gray-300'
      }`}
    >
      <div className="flex items-start gap-2">
        <div
          className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 ${
            log.type === 'client' ? 'bg-green-100' : 'bg-slate-200'
          }`}
        >
          {log.type === 'client' ? (
            <DirectionsCarFilledOutlinedIcon
              sx={{ fontSize: 18 }}
              className="text-green-700"
            />
          ) : (
            <ApartmentOutlinedIcon
              sx={{ fontSize: 18 }}
              className="text-slate-500"
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-medium text-gray-700 truncate">{log.name}</p>
              <p className="text-xs text-gray-400 mt-0.5 flex gap-0.5 items-center">
                <DateRangeOutlinedIcon
                  sx={{ fontSize: 12 }}
                  className="text-gray-400"
                />
                {fmtFull(log.date)}
              </p>
              {log.purpose && (
                <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                  {log.purpose}
                </p>
              )}
            </div>

            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <div className="flex items-center gap-1.5 flex-wrap justify-end">
                {log.status === 'error' && (
                  <button
                    onClick={() => onResubmit(log)}
                    disabled={isResubmitting}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-primary text-white text-xs disabled:opacity-60 active:scale-95 transition-transform"
                  >
                    <RefreshCw
                      size={10}
                      className={isResubmitting ? 'animate-spin' : ''}
                    />
                    Resubmit
                  </button>
                )}
                <span
                  className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[11px] ${s.pill}`}
                >
                  <StatusIcon size={11} />
                  {s.label}
                </span>
              </div>
              <span className="text-[13px] font-medium text-gray-700 pr-2">
                {log.km} km
              </span>
            </div>
          </div>
        </div>
      </div>

      {log.status === 'declined' && log?.declinedBy && (
        <div className="pl-11">
          <div className="mt-2 bg-red-50 border border-red-100 rounded-xl p-3">
            <p className="text-sm font-medium text-red-500 flex items-center gap-1 mb-1">
              <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 12 }} />
              Declined by {log.declinedBy}
            </p>
            <p className="text-[11px] text-red-400 leading-relaxed pl-3.5">
              {log.declineReason}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── skeleton ─────────────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl px-3 py-2 border border-gray-200 animate-pulse">
    <div className="flex items-start gap-2">
      <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="h-3.5 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-100 rounded w-1/3" />
      </div>
    </div>
  </div>
);

// ─── main ─────────────────────────────────────────────────────────────────────

const KMLog = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [weekOffset, setWeekOffset] = useState(0);
  const [idbLogs, setIdbLogs] = useState([]);
  const [resubmitting, setResubmitting] = useState(new Set());

  const { monday, sunday } = getWeekRange(weekOffset);
  const canGoNext = weekOffset < 0;

  const { data, isLoading, isError } = useGetMyTravels(weekOffset);
  const apiLogs = (data?.travels ?? []).map(mapTravel);

  const { data: participants = [] } = useParticipantsQuery();

  // Load IDB on mount, on window focus, and whenever participants list loads
  // so the participant name resolves correctly even if participants arrive late
  const loadIDB = useCallback(async () => {
    try {
      const entries = await getAllFailedLogs();
      setIdbLogs(entries.map((e) => mapIDBEntry(e, participants)));
    } catch (err) {
      console.error('IDB read error:', err);
    }
  }, [participants]);

  useEffect(() => {
    loadIDB();
    window.addEventListener('focus', loadIDB);
    return () => window.removeEventListener('focus', loadIDB);
  }, [loadIDB]);

  // IDB error cards always shown on top regardless of week filter
  const logs = [...idbLogs, ...apiLogs];

  const overview = data?.overview;
  const totalKm = overview?.totalKm ?? logs.reduce((s, l) => s + l.km, 0);
  const counts = {
    approved:
      overview?.approved ?? logs.filter((l) => l.status === 'approved').length,
    pending:
      overview?.pending ?? logs.filter((l) => l.status === 'pending').length,
    error: idbLogs.length,
    declined:
      overview?.declined ?? logs.filter((l) => l.status === 'declined').length,
  };

  const handleResubmit = async (log) => {
    setResubmitting((p) => new Set(p).add(log.id));
    try {
      const { _payload, _idbKey } = log;

      const payload = removeEmptyValues({
        participant: _payload.participant,
        traveled: _payload.traveled,
        date: _payload.date,
        type: _payload.type,
        tripPurpose: _payload.tripPurpose,
        signature: _payload.signature,
      });

      await axiosInstance.post('/travels', payload);

      // ✅ Success → remove from IDB, drop from UI, refetch API list
      await removeFailedLog(_idbKey);
      setIdbLogs((prev) => prev.filter((l) => l.id !== log.id));
      await queryClient.invalidateQueries({ queryKey: ['my-travels'] });
    } catch (err) {
      console.error('Resubmit failed, entry kept in IDB:', err);
    } finally {
      setResubmitting((p) => {
        const next = new Set(p);
        next.delete(log.id);
        return next;
      });
    }
  };

  return (
    <div className="min-h-screen ">
      <div className="sticky top-0 z-10  pt-5 px-4 pb-3 space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center flex-1 bg-gray-100 border border-gray-200 rounded-full px-1 py-2.5">
            <button
              onClick={() => setWeekOffset((p) => p - 1)}
              className="rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              <ChevronLeft size={24} className="text-gray-500" />
            </button>
            <span className="flex-1 text-center text-base text-gray-700 select-none tracking-tight">
              {fmt(monday)} – {fmt(sunday)}
            </span>
            {canGoNext ? (
              <button
                onClick={() => setWeekOffset((p) => p + 1)}
                className="rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors"
              >
                <ChevronRight size={24} className="text-gray-500" />
              </button>
            ) : (
              <div className="w-8" />
            )}
          </div>
          <button
            onClick={() => navigate('/work/travel-log/new-log')}
            className="bg-primary text-base text-white font-medium px-5 py-3 rounded-full shadow-md active:scale-95 transition-transform whitespace-nowrap w-32"
          >
            Log KM
          </button>
        </div>

        <div className="flex gap-1.5">
          <SummaryCard
            Icon={AddLocationAltOutlinedIcon}
            label="Total KM"
            value={totalKm}
            color="text-primary"
            border="border-primary"
          />
          <SummaryCard
            Icon={DoneAllOutlinedIcon}
            label="Approved"
            value={counts.approved}
            color="text-green-600"
            border="border-green-600"
          />
          <SummaryCard
            Icon={AccessTimeOutlinedIcon}
            label="Pending"
            value={counts.pending}
            color="text-amber-500"
            border="border-amber-500"
          />
          <SummaryCard
            Icon={CancelScheduleSendOutlinedIcon}
            label="Error"
            value={counts.error}
            color="text-red-400"
            border="border-red-400"
          />
          <SummaryCard
            Icon={CancelOutlinedIcon}
            label="Declined"
            value={counts.declined}
            color="text-red-500"
            border="border-red-500"
          />
        </div>
      </div>

      <div className="px-4 pt-1 pb-10 flex flex-col gap-3">
        {isLoading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}

        {isError && !isLoading && (
          <div className="text-center py-10 text-gray-400 text-sm">
            Failed to load travel logs. Please try again.
          </div>
        )}

        {!isLoading && !isError && logs.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm">
            No travel logs for this week.
          </div>
        )}

        {!isLoading &&
          logs.map((log) => (
            <LogCard
              key={log.id}
              log={log}
              onResubmit={handleResubmit}
              isResubmitting={resubmitting.has(log.id)}
            />
          ))}
      </div>
    </div>
  );
};

export default React.memo(KMLog);
