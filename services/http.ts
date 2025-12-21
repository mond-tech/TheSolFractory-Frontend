const BASE_URL = "https://solfrance-etcuddebbvawcdeh.canadacentral-01.azurewebsites.net";

export async function http<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Something went wrong");
  }

  return res.json();
}
