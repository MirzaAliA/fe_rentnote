"use client";
import { useState } from "react";
import Image from "next/image";
import {
  userLogin,
  UserLoginType,
  userRegister,
  UserRegisterType,
} from "@/lib/zod/userSchema";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { verifySession } from "@/lib/session/session";

export default function AuthPage() {
  const [authType, setAuthType] = useState<boolean>(true);
  const [errorsLogin, setErrorsLogin] = useState<Record<string, string>>({});
  const [errorsRegister, setErrorsRegister] = useState<Record<string, string>>(
    {}
  );
  const router = useRouter();

  //Login Form Validation
  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const loginForm = new FormData(e.currentTarget);

    const loginData = {
      email: loginForm.get("emailLogin") as string,
      password: loginForm.get("passwordLogin") as string,
    };

    const validatedLoginData = userLogin.safeParse(loginData);
    if (!validatedLoginData.success) {
      validatedLoginData.error;

      const newErrors: Record<string, string> = {};

      validatedLoginData.error?.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        newErrors[field] = issue.message;
      });

      setErrorsLogin(newErrors);
    } else {
      validatedLoginData.success;
      setErrorsLogin({});
      loginMutation.mutate(validatedLoginData.data);
    }
  }

  //Register Form Validation
  function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const registerForm = new FormData(e.currentTarget);

    const registerData = {
      email: registerForm.get("emailRegister"),
      name: registerForm.get("name"),
      password: registerForm.get("passwordRegister"),
    };

    const validatedRegisterData = userRegister.safeParse(registerData);
    if (!validatedRegisterData.success) {
      validatedRegisterData.error;

      const newErrors: Record<string, string> = {};

      validatedRegisterData.error?.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        newErrors[field] = issue.message;
      });

      setErrorsRegister(newErrors);
    } else {
      validatedRegisterData.success;
      setErrorsRegister({});
      registerMutation.mutate(validatedRegisterData.data);
    }
  }

  //Login API
  const loginMutation = useMutation({
    mutationFn: async (data: UserLoginType) => {
      return await axios.post("http://localhost:8000/api/v1/auth/login", data, {
        withCredentials: true,
      });
    },
    onSuccess: (res) => {
      console.log("✅ Login success:", res.data);
      router.push("/dashboard");
    },
    onError: (error) => {
      console.log("❌ Login failed:", error);
      const newError: Record<string, string> = {};
      if (axios.isAxiosError(error)) {
        const field = error.response?.data.errorType as string;
        newError[field] = error.response?.data.message as string;
        setErrorsLogin(newError);
      } else {
        console.error("Error tidak diketahui");
      }
    },
  });

  // Register API
  const registerMutation = useMutation({
    mutationFn: async (data: UserRegisterType) => {
      return await axios.post(
        "http://localhost:8000/api/v1/auth/register",
        data,
        {
          withCredentials: true,
        }
      );
    },
    onSuccess: (res) => {
      console.log("✅ Register success:", res.data);
      window.location.reload();
    },
    onError: (error) => {
      console.log("❌ Login failed:", error);
      const newError: Record<string, string> = {};
      if (axios.isAxiosError(error)) {
        const field = error.response?.data.errorType as string;
        newError[field] = error.response?.data.message as string;
        setErrorsRegister(newError);
      } else {
        console.log("Error tidak diketahui");
      }
    },
  });

  return (
    <div
      className={
        "relative flex flex-col justify-center min-h-[calc(var(--vh,1vh)*100)] bg-gray-50 overflow-hidden"
      }
    >
      <div className="flex justify-center items-center w-full overflow-auto">
        {/* CARD LOGIN */}
        <div
          className={`flex flex-col-reverse lg:flex-row-reverse bg-white shadow-2xl rounded-2xl transition-all duration-700 ease-in-out transform
                     ${
                       authType
                         ? "opacity-100"
                         : "opacity-0 pointer-events-none"
                     }
                     w-[90vw] md:w-[60vw] lg:w-[50vw] max-w-[900px] lg:h-[65vh] max-h-[700px] absolute`}
        >
          {/* Bagian kiri (form login) */}
          <div
            className={`flex flex-col items-center transition-transform duration-700 justify-center ${
              authType ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <h3 className="mt-4 text-xl font-semibold">Masuk</h3>
            <form
              action="POST"
              className="flex flex-col justify-center mt-4 space-y-4 px-6 md:px-10 overflow-y-auto"
              onSubmit={handleLogin}
            >
              <label className="font-bold text-sm mb-2" htmlFor="emailLogin">
                Email
              </label>
              <input
                placeholder="Masukkan email..."
                type="email"
                name="emailLogin"
                id="emailLogin"
                className={`rounded-2xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-300 ${
                  errorsLogin.email ? "mb-1" : "mb-5"
                }`}
              />
              <div className="text-red-500 mt-0 mb-1 text-xs">
                {errorsLogin.email ?? <p>{errorsLogin.email}</p>}
              </div>

              <label className="font-bold text-sm mb-2" htmlFor="passwordLogin">
                Password
              </label>
              <input
                placeholder="Masukkan password..."
                type="password"
                name="passwordLogin"
                id="passwordLogin"
                className={`rounded-2xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-300 ${
                  errorsLogin.password ? "mb-1" : "mb-5"
                }`}
              />
              <div className="text-red-500 mt-0 mb-1 text-xs">
                {errorsLogin.password ?? <p>{errorsLogin.password}</p>}
              </div>

              <button
                className="rounded-full bg-red-400 text-white py-2 mt-4 hover:bg-red-500 transition"
                type="submit"
              >
                Masuk
              </button>
            </form>

            <p className="text-sm my-4">
              Belum punya akun?{" "}
              <button
                className="text-red-500 font-semibold"
                onClick={() => setAuthType(!authType)}
              >
                Daftar
              </button>
            </p>
          </div>

          {/* Bagian kanan (gambar/logo) */}
          <div className="bg-[#F7A5A5] max-lg:rounded-t-2xl lg:rounded-l-2xl flex items-center justify-center lg:w-[40vw]">
            <div className="py-4 relative w-[30vw] md:w-[30vw] max-md:h-[15vh] lg:w-[25vw] xl:w-[22vw] h-[20vh] md:h-[25vh] lg:h-[35vh]">
              <Image
                alt="logo"
                src="/images/RentNoteLogoNoBg.png"
                fill
                loading="eager"
                sizes="(max-width: 768px) 30vw, (max-width: 1200px) 20vw, 30vw"
              />
            </div>
          </div>
        </div>

        {/* CARD REGISTER */}
        <div
          className={`flex flex-col-reverse lg:flex-row bg-white shadow-2xl rounded-2xl transition-all duration-700 ease-in-out transform
                      ${
                        !authType
                          ? "opacity-100"
                          : "opacity-0 pointer-events-none"
                      }
                      w-[90vw] md:w-[60vw] lg:w-[50vw] max-w-[900px] lg:h-[65vh] max-h-[700px] absolute`}
        >
          <div
            className={`flex flex-col items-center transition-transform duration-700 justify-center ${
              !authType ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <h3 className="mt-4 text-xl font-semibold">Daftar</h3>
            <form
              action="POST"
              className="flex flex-col justify-center mt-4 space-y-4 px-6 md:px-10 overflow-y-auto"
              onSubmit={handleRegister}
            >
              <label className="font-bold text-sm mb-2" htmlFor="name">
                Nama
              </label>
              <input
                placeholder="Masukkan nama..."
                type="text"
                name="name"
                id="name"
                className={`rounded-2xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-300 ${
                  errorsRegister.name ? "mb-1" : "mb-5"
                }`}
              />
              <div className="text-red-500 mt-0 mb-1 text-xs">
                {errorsRegister.name ?? <p>{errorsRegister.name}</p>}
              </div>

              <label className="font-bold text-sm mb-2" htmlFor="emailRegister">
                Email
              </label>
              <input
                placeholder="Masukkan email..."
                type="email"
                name="emailRegister"
                id="emailRegister"
                className={`rounded-2xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-300 ${
                  errorsRegister.email ? "mb-1" : "mb-5"
                }`}
              />
              <div className="text-red-500 mt-0 mb-1 text-xs">
                {errorsRegister.email ?? <p>{errorsRegister.email}</p>}
              </div>

              <label
                className="font-bold text-sm mb-2"
                htmlFor="passwordRegister"
              >
                Password
              </label>
              <input
                placeholder="Masukkan password..."
                type="password"
                name="passwordRegister"
                id="passwordRegister"
                className={`rounded-2xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-300 ${
                  errorsRegister.password ? "mb-1" : "mb-5"
                }`}
              />
              <div className="text-red-500 mt-0 mb-1 text-xs">
                {errorsRegister.password ?? <p>{errorsRegister.password}</p>}
              </div>

              <button
                className="rounded-full bg-red-400 text-white py-2 mt-4 hover:bg-red-500 transition"
                type="submit"
              >
                Daftar
              </button>
            </form>

            <p className="text-sm my-4">
              Sudah punya akun?{" "}
              <button
                className="text-red-500 font-semibold"
                onClick={() => setAuthType(!authType)}
              >
                Login
              </button>
            </p>
          </div>

          {/* Bagian logo bawah */}
          <div className="bg-[#F7A5A5] max-lg:rounded-t-2xl lg:rounded-r-2xl flex items-center justify-center lg:w-[40vw]">
            <div className="py-4 relative w-[30vw] md:w-[20vw] max-md:h-[15vh] lg:w-[20vw] h-[20vh] md:h-[25vh] lg:h-[35vh]">
              <Image
                alt="logo"
                src="/images/RentNoteLogoNoBg.png"
                fill
                loading="eager"
                sizes="(max-width: 768px) 30vw, (max-width: 1200px) 20vw, 30vw"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
