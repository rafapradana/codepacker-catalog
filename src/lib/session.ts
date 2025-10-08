// Session management utilities for student login
export interface StudentSession {
  id: string;
  email: string;
  name: string;
  studentId: string;
  className: string;
  loginTime: string;
}

const STUDENT_SESSION_KEY = 'codepacker_student_session';

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