"use client";
import { useState } from "react";
import Image from "next/image";

export default function AuthPage() {
  const [authType, setAuthType] = useState<boolean>(false);

  return (
    <div
      className={
        "relative flex flex-col justify-center min-h-[calc(var(--vh,1vh)*100)] bg-gray-50 overflow-hidden"
      }
    >
      <div className="flex justify-center items-center w-full overflow-auto py-8">
        {/* CARD LOGIN */}
        <div
          className={`flex flex-col-reverse bg-white shadow-2xl rounded-2xl transition-all duration-700 ease-in-out transform 
                     ${
                       authType
                         ? "opacity-100"
                         : "opacity-0 pointer-events-none"
                     }
                     w-[90vw] md:w-[60vw] max-w-[900px]`}
        >
          {/* Bagian kiri (form login) */}
          <div
            className={`flex flex-col items-center p-6 md:p-10 w-full md:w-[50%] transition-transform duration-700 ${
              authType ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <h3 className="mt-4 text-xl font-semibold">Masuk</h3>
            <form
              action="POST"
              className="flex flex-col justify-center mt-4 space-y-4 px-6 md:px-10 overflow-y-auto"
            >
              <label className="font-bold text-sm" htmlFor="username">
                Username
              </label>
              <input
                placeholder="Masukkan username..."
                type="text"
                name="username"
                id="username"
                className="rounded-2xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-300"
              />

              <label className="font-bold text-sm" htmlFor="password">
                Password
              </label>
              <input
                placeholder="Masukkan password..."
                type="password"
                name="password"
                id="password"
                className="rounded-2xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-300"
              />

              <button
                className="rounded-full bg-red-400 text-white py-2 mt-4 hover:bg-red-500 transition"
                type="submit"
              >
                Masuk
              </button>
            </form>

            <p className="text-sm mt-4">
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
          <div className="bg-[#F7A5A5] rounded-t-2xl flex items-center justify-center py-4">
            <Image
              alt="logo"
              src="/images/RentNoteLogoNoBg.png"
              width={100}
              height={100}
            />
          </div>
        </div>

        {/* CARD REGISTER */}
        <div
          className={`flex flex-col-reverse bg-white shadow-2xl rounded-2xl transition-all duration-700 ease-in-out transform
                      ${
                        !authType
                          ? "opacity-100"
                          : "opacity-0 pointer-events-none"
                      }
                      w-[90vw] md:w-[60vw] max-w-[900px] absolute`}
        >
          <div
            className={`flex flex-col items-center transition-transform duration-700 ${
              !authType ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <h3 className="mt-4 text-xl font-semibold">Daftar</h3>
            <form
              action="POST"
              className="flex flex-col justify-center mt-4 space-y-4 px-6 md:px-10 overflow-y-auto"
            >
              <label className="font-bold text-sm" htmlFor="name">
                Nama
              </label>
              <input
                placeholder="Masukkan nama..."
                type="text"
                name="name"
                id="name"
                className="rounded-2xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-300"
              />

              <label className="font-bold text-sm" htmlFor="username">
                Username
              </label>
              <input
                placeholder="Masukkan username..."
                type="text"
                name="username"
                id="username"
                className="rounded-2xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-300"
              />

              <label className="font-bold text-sm" htmlFor="password">
                Password
              </label>
              <input
                placeholder="Masukkan password..."
                type="password"
                name="password"
                id="password"
                className="rounded-2xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-300"
              />

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
          <div className="bg-[#F7A5A5] rounded-t-2xl flex items-center justify-center py-4">
            <Image
              alt="logo"
              src="/images/RentNoteLogoNoBg.png"
              width={100}
              height={100}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
