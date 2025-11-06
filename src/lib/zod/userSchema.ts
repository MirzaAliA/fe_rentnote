import { z } from "zod";

export const userRegister = z.object({
  email: z.email({ message: "Email tidak valid" }),
  name: z.string().min(1, { message: "Nama harus diisi" }),
  password: z.string().min(1, { message: "Password harus diisi" }),
});

export const userLogin = z.object({
  email: z.email("Email tidak valid"),
  password: z.string().min(1, "Password harus diisi"),
});

export type UserRegisterType = z.infer<typeof userRegister>;
export type UserLoginType = z.infer<typeof userLogin>;
