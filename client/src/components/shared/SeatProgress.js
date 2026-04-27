// Displays course capacity as seat counts and a progress bar.
import React from "react";

// Renders seat usage; receives enrolledCount and maxSeats, returns capacity UI.
function SeatProgress({ enrolledCount, maxSeats }) {
  // Guard against missing or zero maxSeats so the progress calculation stays finite.
  const safeMax = Math.max(maxSeats || 0, 1);
  const percent = Math.min(((enrolledCount || 0) / safeMax) * 100, 100);
  const seatsLeft = Math.max((maxSeats || 0) - (enrolledCount || 0), 0);

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between text-xs font-medium text-slate-500'>
        <span>
          {enrolledCount}/{maxSeats} filled
        </span>
        <span
          className={`rounded-full px-2.5 py-1 ${
            seatsLeft === 0
              ? "bg-rose-100 text-rose-700"
              : seatsLeft <= 2
              ? "bg-amber-100 text-amber-700"
              : "bg-emerald-100 text-emerald-700"
          }`}
        >
          {seatsLeft} seats left
        </span>
      </div>
      <div className='h-2 overflow-hidden rounded-full bg-slate-200'>
        <div
          className={`h-full rounded-full ${
            seatsLeft === 0
              ? "bg-rose-500"
              : seatsLeft <= 2
              ? "bg-amber-500"
              : "bg-emerald-500"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export default SeatProgress;
