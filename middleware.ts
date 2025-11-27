import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { edgeConfig } from '@/lib/edge-config';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

export async function middleware(request: NextRequest) {
  try {
    const liveTime = await edgeConfig.get<string>('liveTime');
    const indefiniteMaintenance = await edgeConfig.get<boolean>('indefiniteMaintenance');
    console.log("liveTime", liveTime);
    console.log("indefiniteMaintenance", indefiniteMaintenance);
    
    // Check if maintenance is active
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

    // If accessing maintenance page
    if (request.nextUrl.pathname === '/maintenance') {
      // If maintenance is not active, redirect to home page
      if (!isMaintenanceActive) {
        return NextResponse.redirect(new URL('/', request.url));
      }
      // If maintenance is active, allow access to maintenance page
      return NextResponse.next();
    }

    // For all other routes, if maintenance is active, redirect to maintenance page
    if (isMaintenanceActive) {
      return NextResponse.redirect(new URL('/maintenance', request.url));
    }
    
    return NextResponse.next();
  } catch (error) {
    // If Edge Config is not available, allow access to the site
    console.error('Error checking maintenance status in middleware:', error);
    return NextResponse.next();
  }
}

