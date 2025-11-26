import { createClient } from '@vercel/edge-config';

export const edgeConfig = createClient(process.env.EDGE_CONFIG);

export async function getMaintenanceConfig() {
  try {
    const liveTime = await edgeConfig.get<string>('liveTime');
    const indefiniteMaintenance = await edgeConfig.get<boolean>('indefiniteMaintenance');
    
    return {
      liveTime: liveTime || null,
      indefiniteMaintenance: indefiniteMaintenance || false,
    };
  } catch (error) {
    console.error('Error fetching maintenance config:', error);
    return {
      liveTime: null,
      indefiniteMaintenance: false,
    };
  }
}

