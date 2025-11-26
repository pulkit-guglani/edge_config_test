import { getMaintenanceConfig } from "@/lib/edge-config";
import MaintenanceClient from "./maintenance-client";

export default async function MaintenancePage() {
  const { liveTime, indefiniteMaintenance } = await getMaintenanceConfig();

  return (
    <MaintenanceClient
      liveTime={liveTime}
      indefiniteMaintenance={indefiniteMaintenance}
    />
  );
}
