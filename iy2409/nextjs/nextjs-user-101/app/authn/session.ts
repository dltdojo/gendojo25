import 'server-only';

import type { SessionPayload } from '@/app/authn/dao';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

function checkEnvVariable(variableName: string) {
  if (!process.env[variableName]) {
    throw new Error(`Environment variable ${variableName} is not defined.`);
  }
  return process.env[variableName];
}

//
// export XX_JWT_SECRET=$(openssl rand -hex 32)
// pnpm dev
function getJwtKey() {
  if (!process.env["XX_JWT_SECRET"]) {
    throw new Error('Environment variable XX_JWT_SECRET is not defined. Try export XX_JWT_SECRET=$(openssl rand -hex 32) in shell');
  } else {
    const secretKey = process.env["XX_JWT_SECRET"];
    const key = new TextEncoder().encode(secretKey);
    return key;
  }
}

export async function encrypt(payload: SessionPayload) {
  const key = getJwtKey()
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1hr')
    .sign(key);
}

export async function decrypt(session: string | undefined = '') {
  const key = getJwtKey()
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  const session = await encrypt({ userId, expiresAt });

  cookies().set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });

  redirect('/');
}

export async function verifySession() {
  const cookie = cookies().get('session')?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    redirect('/error/401?msg=Authentication cookie required');
  }

  return { isAuth: true, userId: session.userId as string};
}

export async function updateSession() {
  const session = cookies().get('session')?.value;
  const payload = await decrypt(session);

  if (!session || !payload) {
    return null;
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  cookies().set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: 'lax',
    path: '/',
  });
}

export function deleteSession() {
  cookies().delete('session');
  redirect('/');
}