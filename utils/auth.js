//
export function saveAuth(token, user, remember) {
  const storage = remember ? localStorage : sessionStorage;

  // 1. Client-side storage (for easy access in components)
  storage.setItem("token", token);
  storage.setItem("user", JSON.stringify(user));

  // 2. Cookie for Middleware (CRITICAL)
  // Added SameSite=Lax for better security
  const maxAge = remember ? "max-age=604800;" : ""; // 7 days
  document.cookie = `token=${token}; path=/; ${maxAge} SameSite=Lax`;
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token") || sessionStorage.getItem("token");
}

export function getUser() {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("user") || sessionStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function logout() {
  localStorage.clear();
  sessionStorage.clear();
  // Clear cookie by setting expiry to past
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  // Force reload to clear any memory states
  window.location.href = "/login";
}