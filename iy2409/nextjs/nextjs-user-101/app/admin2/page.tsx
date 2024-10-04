import { verifySession } from '@/app/authn/session';

export default async function Page() {
    const verifyResult = await verifySession();
    return <h1>Admin2: { verifyResult.userId }</h1>;
}