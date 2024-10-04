"use client";

import { registerUser, loginUser } from "@/app/authn/actions";
import { useFormState } from 'react-dom';


export function RegisterForm() {
  const [state, registerAction, isPending] = useFormState(registerUser, null);
  return (
    <form action={registerAction} className="flex flex-col gap-y-2">
      <label htmlFor="username">Username</label>
      <input
        type="text"
        name="username"
        className="py-2 px-3"
      />
      <label htmlFor="password">Password</label>
      <input
        type="password"
        name="password"
        className="py-2 px-3"
      />
      <button
        className="bg-blue-500 text-white py-2 px-3 rounded-sm"
      >
        SignUp
      </button>
      { state && <p className="bg-red-500">{state.message}</p>}
    </form>
  );
}

export function LoginForm() {
  const [state, signInAction, isPending] = useFormState(loginUser, null);
  return (
    <form action={signInAction} className="flex flex-col gap-y-2">
      username
      <input
        type="text"
        name="username"
        className="py-2 px-3 rounded-sm"
      />
      password
      <input
        type="password"
        name="password"
        className="py-2 px-3 rounded-sm"
      />
      <button
        className="bg-blue-500 text-white py-2 px-3 rounded-sm"
      >
        Login
      </button>
      { state && <p className="bg-red-500">{state.message}</p>}
    </form>
  );
}