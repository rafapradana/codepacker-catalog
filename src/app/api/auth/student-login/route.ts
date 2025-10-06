import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users, students } from "@/lib/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password harus diisi" },
        { status: 400 }
      )
    }

    // Find user by email and join with student data
    const result = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        lastLogin: users.lastLogin,
        name: students.fullName,
        bio: students.bio,
        profilePhotoUrl: students.profilePhotoUrl,
        githubUrl: students.githubUrl,
        linkedinUrl: students.linkedinUrl,
        classId: students.classId,
        passwordHash: users.passwordHash
      })
      .from(users)
      .leftJoin(students, eq(users.id, students.userId))
      .where(eq(users.email, email))
      .limit(1)

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Email atau password salah" },
        { status: 401 }
      )
    }

    const foundUser = result[0]

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, foundUser.passwordHash)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Email atau password salah" },
        { status: 401 }
      )
    }

    // Return user data (excluding password)
    const { passwordHash: _, ...userWithoutPassword } = foundUser

    return NextResponse.json({
      message: "Login berhasil",
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Student login error:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    )
  }
}