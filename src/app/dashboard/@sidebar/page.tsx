"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Sidebar() {
  const [isActive, setIsActive] = useState("home");

  return (
    <nav className="flex flex-col bg-[#F7A5A5] h-screen w-[15vw] overflow-y-auto fixed top-0 left-0">
      <div>
        <Image
          src={"/images/RentNoteLogoNoBg.png"}
          alt="logo"
          width={80}
          height={80}
        />
      </div>
      <div className="flex flex-col gap-1">
        <Link
          className={`px-2 py-4 w-full ${
            isActive === "home"
              ? "bg-[#F7A5A5] inset-shadow-[2px_2px_25px_rgba(0,0,0,0.25)]"
              : ""
          }`}
          onClick={() => setIsActive("home")}
          href={"/dashboard"}
        >
          Home
        </Link>
        <Link
          className={`px-2 py-4 w-full ${
            isActive === "penyewa"
              ? "bg-[#F7A5A5] inset-shadow-[2px_2px_25px_rgba(0,0,0,0.25)]"
              : ""
          }`}
          onClick={() => setIsActive("penyewa")}
          href={"/dashboard/penyewa"}
        >
          Penyewa Aktif
        </Link>
        <Link
          className={`px-2 py-4 w-full ${
            isActive === "tambah"
              ? "bg-[#F7A5A5] inset-shadow-[2px_2px_25px_rgba(0,0,0,0.25)]"
              : ""
          }`}
          onClick={() => setIsActive("tambah")}
          href={"/dashboard/tambah"}
        >
          Tambah
        </Link>
        <Link
          className={`px-2 py-4 w-full ${
            isActive === "riwayat"
              ? "bg-[#F7A5A5] inset-shadow-[2px_2px_25px_rgba(0,0,0,0.25)]"
              : ""
          }`}
          onClick={() => setIsActive("riwayat")}
          href={"/dashboard/riwayat"}
        >
          Riwayat Penyewa
        </Link>
        <Link
          className={`px-2 py-4 w-full ${
            isActive === "pengaturan"
              ? "bg-[#F7A5A5] inset-shadow-[2px_2px_25px_rgba(0,0,0,0.25)]"
              : ""
          }`}
          onClick={() => setIsActive("pengaturan")}
          href={"/dashboard/pengaturan"}
        >
          Pengaturan
        </Link>
      </div>
    </nav>
  );
}
