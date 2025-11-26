import { getMaintenanceConfig } from "@/lib/edge-config";
import MaintenanceClient from "./maintenance-client";
import { redirect } from "next/navigation";

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

  return (
    <MaintenanceClient
      liveTime={liveTime}
      indefiniteMaintenance={indefiniteMaintenance}
    />
  );
}
