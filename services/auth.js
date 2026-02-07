//
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function loginUser({ email, password }) {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Backend expects exactly this structure
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      // Throw the specific message from backend (e.g., "User is inactive")
      throw new Error(data.message || "Login failed");
    }

    return data;
  } catch (error) {
    throw error;
  }
}