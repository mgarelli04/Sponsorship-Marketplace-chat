import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { ensureCreatorForUser } from "@/src/creator/defaults";
import { db } from "@/src/db/db";
import { profiles } from "@/src/db/schema";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
  );
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, userType } = await request.json();

    // Validaciones
    if (!email || !password || !fullName || !userType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (userType !== "creator" && userType !== "sponsor") {
      return NextResponse.json(
        { error: "Invalid userType" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin
      .createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
        },
        app_metadata: {
          role: userType,
        },
      });

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: authError?.message || "Error creating user" },
        { status: 400 }
      );
    }

    // Crear perfil en la base de datos y los datos base de creator si aplica.
    try {
      await db.insert(profiles).values({
        id: authData.user.id,
        email,
        fullName,
        avatarUrl: "",
        phone: "",
        role: userType,
        status: "active",
      });

      if (userType === "creator") {
        await ensureCreatorForUser({
          userId: authData.user.id,
          email,
          fullName,
        });
      }
    } catch (dbError) {
      console.error("Profile bootstrap error:", dbError);
      // Si falla la creación del perfil, eliminar el usuario de auth
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: "Error creating user profile" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
