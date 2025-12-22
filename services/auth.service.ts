// auth.service.ts
import { http } from "./http";
import { User } from "@/src/contexts/UserContext";

type RegisterPayload = {
  email: string;
  name: string;
  phoneNumber: string;
  password: string;
  role: string;
};

type LoginPayload = {
  userName: string;
  password: string;
};

type AuthResponse = {
  result?: {
    token?: string;
    user?: User; // User object with id, email, name, phoneNumber
    userId?: string; // Alternative field name for userId
    id?: string; // Alternative field name for userId
    accessToken?: string; // Alternative field name for token
  };
  isSuccess?: boolean;
  success?: boolean;
  message?: string;
  token?: string; // Token might be at root level
  userId?: string; // UserId might be at root level
  id?: string; // ID might be at root level
  data?: {
    token?: string;
    userId?: string;
    id?: string;
    user?: User;
  };
};

type UserResponse = {
  result: User;
  isSuccess: boolean;
  message: string;
};

export const AuthService = {
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    return http<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    return http<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  googleAuth: async (idToken: string): Promise<AuthResponse> => {
    return http<AuthResponse>("/api/auth/google-login", {
      method: "POST",
      body: JSON.stringify({
        idToken, // MUST MATCH backend key
      }),
    });
  },

  getUser: async (userId: string): Promise<UserResponse> => {
    return http<UserResponse>(`/api/auth/users/${userId}`, {
      method: "GET",
    });
  },
};
