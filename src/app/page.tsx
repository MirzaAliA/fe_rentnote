"use client";

import Image from "next/image";
import { useState } from "react";

export default function AuthPage() {
  const [authType, setAuthType] = useState<boolean>(false);

  return (
    <>
      <div className="relative flex justify-center items-center h-screen">
        <div
          className={`absolute flex h-[60%] bg-white shadow-2xl rounded-2xl transition-all duration-700 ease transform ${
            authType
              ? "flex-row opacity-100"
              : "flex-row-reverse opacity-0 pointer-events-none"
          }`}
        >
          <div
            className={`flex flex-col items-center w-[30vw] ${
              authType ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <h3 className="mt-[5vh] text-xl">Masuk</h3>
            <form
              action="POST"
              className="flex flex-col justify-center mb-[3vh] mt-[2vh] mx-[3vw]"
            >
              <label
                className="mt-[3vh] mb-[1vh] font-bold text-[14px]"
                htmlFor="name"
              >
                Username
              </label>
              <input
                placeholder="   masukkan username.."
                type="text"
                name="username"
                id="username"
                className="inset-shadow-[3px_3px_50px_rgba(0,0,0,0.10)] rounded-2xl w-[20vw] h-[5vh]"
              />
              <label
                className="mt-[2vh] font-bold mb-[1vh] text-[14px]"
                htmlFor="name"
              >
                Password
              </label>
              <input
                placeholder="   masukkan password.."
                type="password"
                name="password"
                id="password"
                className="inset-shadow-[3px_3px_50px_rgba(0,0,0,0.10)] rounded-2xl w-[20vw] h-[5vh]"
              />
              <button
                className="rounded-full bg-red-300 w-auto h-[5vh] mt-[5vh] text-white"
                type="submit"
              >
                Masuk
              </button>
            </form>
            <p className="text-[14px] flex justify-center">
              Belum punya akun?,
              <button onClick={() => setAuthType(!authType)}>Daftar</button>
            </p>
          </div>
          <div
            className={`bg-[#F7A5A5] flex items-center justify-center ${
              authType ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex justify-center items-center my-[2vh] w-[30vw]">
              <Image
                alt="logo"
                src="/images/RentNoteLogoNoBg.png"
                width={300}
                height={300}
              />
            </div>
          </div>
        </div>

        <div
          className={`absolute flex h-[60%] bg-white shadow-2xl rounded-2xl transition-all duration-700 ease-out transform ${
            !authType
              ? "flex-row-reverse opacity-100"
              : "flex-row opacity-0 pointer-events-none"
          }`}
        >
          <div
            className={`flex flex-col items-center w-[30vw] ${
              !authType ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <h3 className="mt-[5vh] text-xl">Daftar</h3>
            <form
              action="POST"
              className="flex flex-col justify-center mb-[3vh] mt-[2vh] mx-[3vw]"
            >
              <label className="font-bold mb-[1vh] text-[14px]" htmlFor="name">
                Nama
              </label>
              <input
                placeholder="   masukkan nama.."
                type="text"
                name="name"
                id="name"
                className="inset-shadow-[3px_3px_50px_rgba(0,0,0,0.10)] rounded-2xl w-[20vw] h-[5vh]"
              />
              <label
                className="mt-[2vh] mb-[1vh] font-bold text-[14px]"
                htmlFor="name"
              >
                Username
              </label>
              <input
                placeholder="   masukkan username.."
                type="text"
                name="username"
                id="username"
                className="inset-shadow-[3px_3px_50px_rgba(0,0,0,0.10)] rounded-2xl w-[20vw] h-[5vh]"
              />
              <label
                className="mt-[2vh] font-bold mb-[1vh] text-[14px]"
                htmlFor="name"
              >
                Password
              </label>
              <input
                placeholder="   masukkan password.."
                type="password"
                name="password"
                id="password"
                className="inset-shadow-[3px_3px_50px_rgba(0,0,0,0.10)] rounded-2xl w-[20vw] h-[5vh]"
              />
              <button
                className="rounded-full bg-red-300 w-auto h-[5vh] mt-[5vh] text-white"
                type="submit"
              >
                Daftar
              </button>
            </form>
            <p className="text-[14px] flex justify-center">
              Sudah punya akun?,
              <button onClick={() => setAuthType(!authType)}>Login</button>
            </p>
          </div>
          <div
            className={`bg-[#F7A5A5] flex items-center justify-center ${
              !authType ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex justify-center items-center my-[2vh] w-[30vw]">
              <Image
                alt="logo"
                src="/images/RentNoteLogoNoBg.png"
                width={300}
                height={300}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
