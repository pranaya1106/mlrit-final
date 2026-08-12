import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const LOGIN_PATH = '/admin/login';

/**
 * Gates every /admin route on a valid Supabase session.
 *
 * Runs before the matched page renders, so an unauthenticated visitor is
 * redirected without any admin markup ever reaching the browser.
 */
export async function middleware(request: NextRequest) {
  // The login page is inside /admin, so let it through or the redirect below
  // would bounce against itself forever.
  if (request.nextUrl.pathname === LOGIN_PATH) {
    return NextResponse.next();
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Fail closed: without credentials we cannot prove a session exists, so treat
  // the request as unauthenticated rather than letting it through.
  if (!url || !key) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // getUser() revalidates the token against the auth server; getSession() only
  // decodes whatever the cookie claims, which a client could forge.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
