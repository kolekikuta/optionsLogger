import { createClient } from '@/lib/client'
import { redirect } from 'react-router';

export async function logoutAction() {
  const supabase= createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error(error)
    return { success: false, error: error.message }
  }

  // Redirect to dashboard or home page after successful sign-in
  return redirect('/');
}
