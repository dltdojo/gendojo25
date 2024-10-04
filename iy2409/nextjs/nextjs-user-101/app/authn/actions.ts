"use server";

import dao from "@/app/authn/dao";
import type { User } from '@/app/authn/dao';
import { revalidatePath } from "next/cache";
import { hashSync, compareSync } from 'bcrypt';
import { createSession, deleteSession } from '@/app/authn/session';

export async function registerUser(previousState, formData: FormData) {

  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const passwordHash = hashSync(password, 10); // Hash the password using bcrypt
  const result = dao.addUser(username, passwordHash);
  if (result.success) {
    console.log('Registration successful! You can now login.');
  } 

   // 4. Create a session for the user
   await createSession(username);

  return result;
}

export async function loginUser(previousState, formData: FormData) {

  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const user = dao.findUserByUsername(username);
  if (user) {
    const passwordMatch = compareSync(password, user.passwordHash);
    // Check if the entered password matches the stored hash using bcrypt.compare
    if (passwordMatch) {
      // authenticatedUser = user;
      console.log('Login successful!');
      await createSession(username);
      return {success:true, message: 'Login successful!'};
    } else {
      console.log('Incorrect password.');
      return {success:false, message: 'Incorrect password.'}
    }
  } else {
    console.log('User not found.');
    return {success:false, message: 'User not found.'}
  }
}

export async function logout() {
  deleteSession();
}