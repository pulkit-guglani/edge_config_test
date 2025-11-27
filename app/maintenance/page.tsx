import { getMaintenanceConfig } from "@/lib/edge-config";
import { redirect } from "next/navigation";
import CountdownTimer from "./countdown-timer";

export default async function MaintenancePage() {
  const { liveTime, indefiniteMaintenance } = await getMaintenanceConfig();

  // Check if maintenance is still active
  const isMaintenanceActive = (() => {
    // If indefinite maintenance is enabled, maintenance is active
    if (indefiniteMaintenance) {
      return true;
    }

    // If liveTime exists, check if we're before that time
    if (liveTime) {
      const targetTime = new Date(liveTime).getTime();
      const now = new Date().getTime();
      return now < targetTime;
    }

    // No maintenance active
    return false;
  })();

  // If maintenance is not active, redirect to home page
  if (!isMaintenanceActive) {
    redirect("/");
  }

  // Calculate if we should show countdown timer
  const showCountdown = liveTime && !indefiniteMaintenance;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <div className="mb-8">
          <h1 className="mb-4 text-5xl font-bold text-zinc-900 dark:text-white">
            We&apos;ll be back soon!
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400">
            {indefiniteMaintenance || !liveTime
              ? "We&apos;re currently performing scheduled maintenance. Please check back later."
              : "We&apos;re performing scheduled maintenance and will be back online shortly."}
          </p>
        </div>

        {showCountdown && <CountdownTimer targetTime={liveTime} />}

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
