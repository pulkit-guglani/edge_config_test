'use client';

import { useEffect, useState } from 'react';

interface MaintenanceClientProps {
  liveTime: string | null;
  indefiniteMaintenance: boolean;
}

export default function MaintenanceClient({ liveTime, indefiniteMaintenance }: MaintenanceClientProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    // If liveTime exists, start countdown
    if (liveTime) {
      const targetTime = new Date(liveTime).getTime();
      const now = new Date().getTime();
      
      if (targetTime > now) {
        // Start countdown timer
        const updateTimer = () => {
          const now = new Date().getTime();
          const distance = targetTime - now;

          if (distance > 0) {
            setTimeLeft({
              days: Math.floor(distance / (1000 * 60 * 60 * 24)),
              hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
              minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
              seconds: Math.floor((distance % (1000 * 60)) / 1000),
            });
          } else {
            setTimeLeft(null);
            // Reload page when timer reaches zero
            window.location.reload();
          }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
      }
    }
  }, [liveTime]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <div className="mb-8">
          <h1 className="mb-4 text-5xl font-bold text-zinc-900 dark:text-white">
            We&apos;ll be back soon!
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400">
            {indefiniteMaintenance || !liveTime
              ? 'We&apos;re currently performing scheduled maintenance. Please check back later.'
              : 'We&apos;re performing scheduled maintenance and will be back online shortly.'}
          </p>
        </div>

        {timeLeft && (
          <div className="mb-8">
            <p className="mb-6 text-lg font-semibold text-zinc-700 dark:text-zinc-300">
              Estimated time until we&apos;re back:
            </p>
            <div className="grid grid-cols-4 gap-4">
              <div className="rounded-lg bg-white p-6 shadow-md dark:bg-zinc-900">
                <div className="text-4xl font-bold text-zinc-900 dark:text-white">
                  {timeLeft.days}
                </div>
                <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {timeLeft.days === 1 ? 'Day' : 'Days'}
                </div>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-md dark:bg-zinc-900">
                <div className="text-4xl font-bold text-zinc-900 dark:text-white">
                  {timeLeft.hours}
                </div>
                <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {timeLeft.hours === 1 ? 'Hour' : 'Hours'}
                </div>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-md dark:bg-zinc-900">
                <div className="text-4xl font-bold text-zinc-900 dark:text-white">
                  {timeLeft.minutes}
                </div>
                <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {timeLeft.minutes === 1 ? 'Minute' : 'Minutes'}
                </div>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-md dark:bg-zinc-900">
                <div className="text-4xl font-bold text-zinc-900 dark:text-white">
                  {timeLeft.seconds}
                </div>
                <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {timeLeft.seconds === 1 ? 'Second' : 'Seconds'}
                </div>
              </div>
            </div>
          </div>
        )}

        {indefiniteMaintenance && (
          <div className="mt-8 rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Maintenance is ongoing. No estimated completion time available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

