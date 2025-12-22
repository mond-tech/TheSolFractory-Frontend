const BASE_URL = "https://solfrance-etcuddebbvawcdeh.canadacentral-01.azurewebsites.net";

// Get auth token from localStorage or window
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  
  // Check window first (for immediate use after login)
  if ((window as any).__authToken) {
    return (window as any).__authToken;
  }
  
  // Fallback to localStorage
  return localStorage.getItem("auth_token");
}

export async function http<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // Add authorization header if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorMessage = "Something went wrong";
    try {
      const errorText = await res.text();
      // Try to parse as JSON first
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || errorText;
      } catch {
        // If not JSON, use the text as is
        errorMessage = errorText || `HTTP ${res.status}: ${res.statusText}`;
      }
    } catch (e) {
      errorMessage = `HTTP ${res.status}: ${res.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return res.json();
}
