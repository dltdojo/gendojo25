import { RegisterForm, LoginForm}  from "@/app/authn/form-auth";
import LogoutBtn from "@/app/authn/btn-logout";
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center min-h-screen gap-y-5 text-center">
    <h1 className="text-3xl font-semibold">Register</h1>
    <RegisterForm />
    <h1 className="text-3xl font-semibold">Login</h1>
    <LoginForm />
    <h1 className="text-3xl font-semibold">Logout</h1>
    <LogoutBtn/>
    <h1 className="text-3xl font-semibold">Admin</h1>
    <Link className="bg-blue-500 text-white py-2 px-3 rounded-sm" href="/admin">Admin</Link>
    <Link className="bg-blue-500 text-white py-2 px-3 rounded-sm" href="/admin2">Admin2</Link>
  </main>
  );
}