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
     * - maintenance (maintenance page itself)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|maintenance).*)',
  ],
};

export async function middleware(request: NextRequest) {
  // Skip maintenance check for the maintenance page itself
  if (request.nextUrl.pathname === '/maintenance') {
    return NextResponse.next();
  }

  try {
    const liveTime = await edgeConfig.get<string>('liveTime');
    const indefiniteMaintenance = await edgeConfig.get<boolean>('indefiniteMaintenance');
    console.log("liveTime", liveTime);
    console.log("indefiniteMaintenance", indefiniteMaintenance);
    // If indefinite maintenance is enabled, redirect to maintenance page
    if (indefiniteMaintenance) {
      return NextResponse.redirect(new URL('/maintenance', request.url));
    }
    
    // If liveTime exists, check if we're before that time
    if (liveTime) {
      const targetTime = new Date(liveTime).getTime();
      const now = new Date().getTime();
      
      // If current time is before target time, redirect to maintenance
      if (now < targetTime) {
        return NextResponse.redirect(new URL('/maintenance', request.url));
      }
    }
    
    return NextResponse.next();
  } catch (error) {
    // If Edge Config is not available, allow access to the site
    console.error('Error checking maintenance status in middleware:', error);
    return NextResponse.next();
  }
}

