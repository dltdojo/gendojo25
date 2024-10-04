"use client";

import { logout } from "@/app/authn/actions";
import { useFormState } from 'react-dom';


export default function LogoutBtn() {
    const [error, action, isPending] = useFormState(logout, null);
    return (
        <button className="bg-blue-500 text-white py-2 px-3 rounded-sm" onClick={() => {
            action();
        }}>Logout</button>
    );
}