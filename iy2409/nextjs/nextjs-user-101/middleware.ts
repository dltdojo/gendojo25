import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/app/authn/session';
import { cookies } from 'next/headers';

// Matches any route starting with /admin, including /admin itself.
export const config = {
  matcher: '/admin/:path*',
};

// Creates a consistent JSON error response.
export function createAuthErrorResponse(status: number, message: string): Response {
  return new Response(JSON.stringify({ success: false, message }), { status });
}

export default async function middleware(req: NextRequest): Promise<Response> {
  const sessionCookie = cookies().get('session')?.value;

  // Redirect to login if no session cookie is present.  This is generally preferred over returning a 401
  // directly, as it allows for a more user-friendly redirect to a login page.
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/error/401?msg=Authentication cookie required", req.url)) // Redirect to error 401 page with redirect back to admin after successful login
  }


  try {
    console.debug("middleware: decrypting session cookie"); // Use debug level logging for more granular information
    const session = await decrypt(sessionCookie);

    // Handle invalid or expired session.
    if (!session) {
      return NextResponse.redirect(new URL("/error/401?msg=Authentication cookie required", req.url))
    }

    console.debug("middleware: session data:", session); // Use debug level logging


    // Check for essential user data within the session.
    if (!session.userId) {
      console.error("middleware: Missing userId in session data."); // Use error level for missing critical data
      return createAuthErrorResponse(401, 'Unauthorized: User ID missing in session.'); // More specific error message
    }


    // Optionally, you could check for user roles/permissions here if necessary:
    // if (!session.userRoles.includes('admin')) {
    //   return createAuthErrorResponse(403, 'Forbidden: User does not have admin privileges.');
    // }

    // If all checks pass, proceed to the requested route.
    return NextResponse.next();

  } catch (error: any) {  // Explicitly type error as any
    console.error("middleware: Error during authentication:", error);
    // Generic error message for security in production.  Don't leak internal details.
    return createAuthErrorResponse(500, 'Internal Server Error during authentication.'); 
  }
}