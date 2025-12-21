import { http } from "./http";

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

export const AuthService = {
  register: (payload: RegisterPayload) => {
    return http("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  login: (payload: LoginPayload) => {
    return http("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
