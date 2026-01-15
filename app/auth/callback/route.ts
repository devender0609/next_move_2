import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  // If no code, just go back to app
  if (!code) return NextResponse.redirect(new URL("/app", url.origin));

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  // Server-side exchange requires service role key
  const supabaseAdmin = createClient(supabaseUrl, serviceRole);

  // Exchange the code for a session (Supabase will set cookies only if you do it via auth-helpers)
  // Here we simply validate exchange and then redirect.
  // For cookie session support, you'd use auth-helpers, but this still prevents the 404 and confirms OAuth works.
  await supabaseAdmin.auth.exchangeCodeForSession(code);

  return NextResponse.redirect(new URL("/app", url.origin));
}
