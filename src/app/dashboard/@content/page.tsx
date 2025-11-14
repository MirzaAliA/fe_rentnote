"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [user, setUser] = useState<{ name?: string }>({});
  useEffect(() => {
    const newUser = localStorage.getItem("user");
    if (newUser) {
      setUser(JSON.parse(newUser));
    }
  }, []);
  return (
    <div className="h-auto w-full">
      <div className="flex flex-row-reverse items-center justify-between mx-6 my-6">
        <div className="h-20 w-20 rounded-full">
          <Image
            src={"/images/RentNoteLogoNoBg.png"}
            alt="logo"
            width={80}
            height={80}
          />
        </div>
        <div>
          <p className="text-sm opacity-60">Selamat Datang</p>
          <h1 className="text-xl font-bold">{user.name}</h1>
        </div>
      </div>
      <div className="flex flex-row h-25 items-center text-white px-6 py-6 mx-4 justify-evenly gap-2 bg-[#4B49AC] rounded-xl shadow-[4px_8px_16px_rgba(0,0,0,0.30)]">
        <div>
          <p className="text-sm">Pemasukan</p>
          <p className="text-l">Rp. 500.000</p>
        </div>
        <div>|</div>
        <div>
          <p className="text-sm">Unit Keluar</p>
          <p className="text-l ">3 Unit</p>
        </div>
        <div>|</div>
        <div>
          <p className="text-sm">Unit Ready</p>
          <p className="text-l ">3 Unit</p>
        </div>
      </div>
      <div className="bg-[#F5F5F5] flex flex-col gap-4 my-6 py-4 px-6 pb-30">
        <h1 className="font-bold text-xl">Aktivitas Anda</h1>
        <div className="flex flex-col rounded-xl shadow-[4px_8px_16px_rgba(0,0,0,0.30)]">
          <div className="flex flex-row items-center justify-between mx-4 my-2">
            <p>Tambah Penyewa</p>
            <div className="flex justify-center items-center bg-[#e9e9e9] px-2 py-1 rounded-full">
              <i className="bi bi-arrow-right"></i>
            </div>
          </div>
          <div className="flex flex-row mb-4 mx-4 gap-6">
            <Link
              className="flex flex-col gap-2 justify-center items-center"
              href={""}
            >
              <div className="py-4 px-4 rounded-lg shadow-[0px_8px_16px_-8px_rgba(0,0,0,0.30)]">
                <i className="bi bi-bicycle text-2xl "></i>
              </div>
              <p className="text-xs">Motor</p>
            </Link>
            <Link
              className="flex flex-col gap-2 justify-center items-center"
              href={""}
            >
              <div className="py-4 px-4 rounded-lg shadow-[0px_8px_16px_-8px_rgba(0,0,0,0.30)]">
                <i className="bi bi-car-front-fill text-2xl"></i>
              </div>
              <p className="text-xs">Mobil</p>
            </Link>
            <Link
              className="flex flex-col gap-2 justify-center items-center"
              href={""}
            >
              <div className="py-4 px-4 rounded-lg shadow-[0px_8px_16px_-8px_rgba(0,0,0,0.30)]">
                <i className="bi bi-backpack text-2xl"></i>
              </div>
              <p className="text-xs">Aksesoris</p>
            </Link>
          </div>
        </div>
        <div className="flex flex-col rounded-xl shadow-[4px_8px_16px_rgba(0,0,0,0.30)]">
          <div className="flex flex-row items-center justify-between mx-4 my-2">
            <p>Tambah Unit</p>
            <div className="flex justify-center items-center bg-[#e9e9e9] px-2 py-1 rounded-full">
              <i className="bi bi-arrow-right"></i>
            </div>
          </div>
          <div className="flex flex-row mb-4 mx-4 gap-6">
            <Link
              className="flex flex-col gap-2 justify-center items-center"
              href={"dashboard/tambah/unit/motor"}
            >
              <div className="py-4 px-4 rounded-lg shadow-[0px_8px_16px_-8px_rgba(0,0,0,0.30)]">
                <i className="bi bi-bicycle text-2xl "></i>
              </div>
              <p className="text-xs">Motor</p>
            </Link>
            <Link
              className="flex flex-col gap-2 justify-center items-center"
              href={"dashboard/tambah/unit/mobil"}
            >
              <div className="py-4 px-4 rounded-lg shadow-[0px_8px_16px_-8px_rgba(0,0,0,0.30)]">
                <i className="bi bi-car-front-fill text-2xl"></i>
              </div>
              <p className="text-xs">Mobil</p>
            </Link>
            <Link
              className="flex flex-col gap-2 justify-center items-center"
              href={"dashboard/tambah/unit/aksesoris"}
            >
              <div className="py-4 px-4 rounded-lg shadow-[0px_8px_16px_-8px_rgba(0,0,0,0.30)]">
                <i className="bi bi-backpack text-2xl"></i>
              </div>
              <p className="text-xs">Aksesoris</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
