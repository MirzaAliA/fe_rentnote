"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
  const [isActive, setIsActive] = useState("home");

  const pathName = usePathname();

  return (
    <nav className="flex flex-row justify-evenly bg-[#ffffff] rounded-4xl mb-4 mx-2">
      <Link
        className={`px-2 py-2 w-full flex flex-col items-center justify-center ${
          pathName === "/dashboard"
            ? "text-[#4B49AC] inset-shadow-[0px_0px_20px_rgba(0,0,0,0.25)] rounded-l-4xl"
            : ""
        }`}
        onClick={() => setIsActive("home")}
        href={"/dashboard"}
      >
        <i className="bi bi-house-door"></i>
        <p className={`text-sm ${pathName === "/dashboard" ? "" : "hidden"}`}>
          Home
        </p>
      </Link>
      <Link
        className={`px-2 py-2 w-full flex flex-col items-center justify-center ${
          pathName === "/dashboard/penyewa"
            ? "text-[#4B49AC] inset-shadow-[0px_0px_20px_rgba(0,0,0,0.25)]"
            : ""
        }`}
        onClick={() => setIsActive("penyewa")}
        href={"/dashboard/penyewa"}
      >
        <i className="bi bi-person"></i>
        <p
          className={`text-sm ${
            pathName === "/dashboard/penyewa" ? "" : "hidden"
          }`}
        >
          Penyewa
        </p>
      </Link>
      <Link
        className={`px-2 py-2 w-full flex flex-col items-center justify-center ${
          pathName === "/dashboard/unit"
            ? "text-[#4B49AC] inset-shadow-[0px_0px_20px_rgba(0,0,0,0.25)]"
            : ""
        }`}
        onClick={() => setIsActive("unit")}
        href={"/dashboard/unit"}
      >
        <i className="bi bi-car-front"></i>
        <p
          className={`text-sm ${
            pathName === "/dashboard/unit" ? "" : "hidden"
          }`}
        >
          Unit
        </p>
      </Link>
      <Link
        className={`px-2 py-2 w-full flex flex-col items-center justify-center ${
          pathName === "/dashboard/pengaturan"
            ? "text-[#4B49AC] inset-shadow-[0px_0px_20px_rgba(0,0,0,0.25)] rounded-r-4xl"
            : ""
        }`}
        onClick={() => setIsActive("kontrol")}
        href={"/dashboard/pengaturan"}
      >
        <i className="bi bi-gear"></i>
        <p
          className={`text-sm ${
            pathName === "/dashboard/pengaturan" ? "" : "hidden"
          }`}
        >
          Kontrol
        </p>
      </Link>
    </nav>
  );
}
