import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import AddLocationAltOutlinedIcon from '@mui/icons-material/AddLocationAltOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CancelScheduleSendOutlinedIcon from '@mui/icons-material/CancelScheduleSendOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined';
import {
  AlertTriangle,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Clock,
  RefreshCw,
  XCircle,
} from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ─── helpers ─────────────────────────────────────────────────────────────────

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

// ─── dummy data ───────────────────────────────────────────────────────────────

const DUMMY_LOGS = [
  {
    id: 1,
    name: 'Patrick Kere',
    type: 'client',
    date: '2026-03-24',
    km: 49,
    status: 'approved',
  },
  {
    id: 2,
    name: 'Bob John',
    type: 'client',
    date: '2026-03-24',
    km: 70,
    status: 'pending',
  },
  {
    id: 3,
    name: 'Company Trip',
    type: 'company',
    date: '2026-03-23',
    km: 70,
    status: 'pending',
    purpose: 'Participant Event Item Purchase',
  },
  {
    id: 4,
    name: 'Company Trip',
    type: 'company',
    date: '2026-03-23',
    km: 70,
    status: 'error',
    purpose: 'Visit and external provider',
  },
  {
    id: 5,
    name: 'Bob John',
    type: 'client',
    date: '2026-03-23',
    km: 70,
    status: 'error',
  },
  {
    id: 6,
    name: 'Bob John',
    type: 'client',
    date: '2026-03-23',
    km: 70,
    status: 'declined',
    declinedBy: 'Liz Lorencz',
    declineReason:
      'After investigation the KM was not accurate and needs a re approval from the participant and the team will be in contact with the participant.',
  },
];

// ─── IndexedDB helpers ────────────────────────────────────────────────────────

const openDB = () =>
  new Promise((resolve, reject) => {
    const req = indexedDB.open('km_logs_db', 1);
    req.onupgradeneeded = (e) =>
      e.target.result.createObjectStore('failed_logs', { keyPath: 'id' });
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = (e) => reject(e.target.error);
  });

const removeFromIDB = async (id) => {
  const db = await openDB();
  const tx = db.transaction('failed_logs', 'readwrite');
  tx.objectStore('failed_logs').delete(id);
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

const SummaryCard = ({ Icon, label, value, color, border }) => (
  <div
    className={`flex flex-col items-center justify-center gap-0.5 px-2 py-2.5 rounded-lg border ${border} bg-white flex-1`}
  >
    <Icon size={15} className={color} />
    <p className={`text-xs ${color} leading-tight`}>{label}</p>
    <p className={` font-medium leading-tight ${color}`}>{value}</p>
  </div>
);

// ─── LogCard ──────────────────────────────────────────────────────────────────

const LogCard = ({ log, onResubmit, submitting }) => {
  const s = STATUS_MAP[log.status];
  const StatusIcon = s.icon;

  return (
    <div
      className={`bg-white rounded-2xl px-3 py-2 border ${
        log.status === 'error' ? 'border-red-200' : 'border-gray-300'
      }`}
    >
      <div className="flex items-start gap-2">
        {/* icon */}
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

        {/* content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-medium text-gray-700  truncate">{log.name}</p>
              <p className="text-xs text-gray-400 mt-0.5 flex gap-0.5 items-center">
                <DateRangeOutlinedIcon
                  sx={{ fontSize: 12 }}
                  className="text-gray-400"
                />{' '}
                {fmtFull(log.date)}
              </p>
              {log.purpose && (
                <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                  {log.purpose}
                </p>
              )}
            </div>

            {/* badges + km */}
            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <div className="flex items-center gap-1.5 flex-wrap justify-end">
                {log.status === 'error' && (
                  <button
                    onClick={() => onResubmit(log.id)}
                    disabled={submitting}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-primary text-white text-xs disabled:opacity-60 active:scale-95 transition-transform"
                  >
                    <RefreshCw
                      size={10}
                      className={submitting ? 'animate-spin' : ''}
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

      {/* declined box */}
      {log.status === 'declined' && log.declinedBy && (
        <div className="pl-11">
          <div className="mt-3 bg-red-50 border border-red-100 rounded-xl p-3">
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

// ─── main ─────────────────────────────────────────────────────────────────────

const KMLog = () => {
  const navigate = useNavigate();
  const [weekOffset, setWeekOffset] = useState(0);
  const [logs, setLogs] = useState(DUMMY_LOGS);
  const [resubmitting, setResubmitting] = useState(new Set());

  const { monday, sunday } = getWeekRange(weekOffset);
  const canGoNext = weekOffset < 0;

  const totalKm = logs.reduce((s, l) => s + l.km, 0);
  const counts = {
    approved: logs.filter((l) => l.status === 'approved').length,
    pending: logs.filter((l) => l.status === 'pending').length,
    error: logs.filter((l) => l.status === 'error').length,
    declined: logs.filter((l) => l.status === 'declined').length,
  };

  const handleResubmit = async (id) => {
    setResubmitting((p) => new Set(p).add(id));
    try {
      // simulate API
      await new Promise((r) => setTimeout(r, 900));
      setLogs((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status: 'pending' } : l)),
      );
      await removeFromIDB(id);
    } finally {
      setResubmitting((p) => {
        const next = new Set(p);
        next.delete(id);
        return next;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* sticky top section */}
      <div className="sticky top-0 z-10 bg-gray-50 pt-5 px-4 pb-3 space-y-3">
        {/* nav row */}
        <div className="flex items-center gap-2">
          <div className="flex items-center flex-1 bg-gray-100 border border-gray-200 rounded-full px-2 py-1">
            <button
              onClick={() => setWeekOffset((p) => p - 1)}
              className="p-1.5 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              <ChevronLeft size={24} className="text-gray-500" />
            </button>
            <span className="flex-1 text-center text-base text-gray-700 select-none tracking-tight">
              {fmt(monday)} – {fmt(sunday)}
            </span>
            {canGoNext ? (
              <button
                onClick={() => setWeekOffset((p) => p + 1)}
                className="p-1.5 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors"
              >
                <ChevronRight size={24} className="text-gray-500" />
              </button>
            ) : (
              <div className="w-8" />
            )}
          </div>
          <button
            onClick={() => navigate('/work/travel-log/new-log')}
            className="bg-primary text-base text-white font-medium px-5 py-3 rounded-full shadow-md active:scale-95 transition-transform whitespace-nowrap"
          >
            Log KM
          </button>
        </div>

        {/* summary row */}
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

      {/* log list */}
      <div className="px-4 pt-1 pb-10 flex flex-col gap-3">
        {logs.map((log) => (
          <LogCard
            key={log.id}
            log={log}
            onResubmit={handleResubmit}
            submitting={resubmitting.has(log.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(KMLog);
