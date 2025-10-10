// Session management utilities for student and admin login
export interface StudentSession {
  id: string;
  email: string;
  name: string;
  studentId: string;
  className: string;
  profilePhotoUrl: string;
  loginTime: string;
}

export interface AdminSession {
  id: string;
  userId: string;
  email: string;
  username: string;
  fullName: string;
  loginTime: string;
}

const STUDENT_SESSION_KEY = 'codepacker_student_session';
const ADMIN_SESSION_KEY = 'codepacker_admin_session';

// Save student session to localStorage
export function saveStudentSession(sessionData: StudentSession): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STUDENT_SESSION_KEY, JSON.stringify(sessionData));
  }
}

// Get student session from localStorage
export function getStudentSession(): StudentSession | null {
  if (typeof window !== 'undefined') {
    const sessionData = localStorage.getItem(STUDENT_SESSION_KEY);
    if (sessionData) {
      try {
        return JSON.parse(sessionData);
      } catch (error) {
        console.error('Error parsing student session data:', error);
        clearStudentSession();
        return null;
      }
    }
  }
  return null;
}

// Check if student is logged in
export function isStudentLoggedIn(): boolean {
  const session = getStudentSession();
  return session !== null;
}

// Clear student session
export function clearStudentSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STUDENT_SESSION_KEY);
  }
}

// Get student info for display
export function getStudentInfo(): { name: string; email: string } | null {
  const session = getStudentSession();
  if (session) {
    return {
      name: session.name,
      email: session.email
    };
  }
  return null;
}

// Admin session management functions
// Save admin session to localStorage
export function saveAdminSession(sessionData: AdminSession): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionData));
  }
}

// Get admin session from localStorage
export function getAdminSession(): AdminSession | null {
  if (typeof window !== 'undefined') {
    const sessionData = localStorage.getItem(ADMIN_SESSION_KEY);
    if (sessionData) {
      try {
        return JSON.parse(sessionData);
      } catch (error) {
        console.error('Error parsing admin session data:', error);
        clearAdminSession();
        return null;
      }
    }
  }
  return null;
}

// Check if admin is logged in
export function isAdminLoggedIn(): boolean {
  const session = getAdminSession();
  return session !== null;
}

// Clear admin session
export function clearAdminSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  }
}

// Get admin info for display
export function getAdminInfo(): { name: string; email: string; username: string } | null {
  const session = getAdminSession();
  if (session) {
    return {
      name: session.fullName,
      email: session.email,
      username: session.username
    };
  }
  return null;
}