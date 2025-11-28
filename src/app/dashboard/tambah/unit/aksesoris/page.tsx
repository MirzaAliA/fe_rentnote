"use client";
import { unitAccessories, unitAccessoriesType } from "@/lib/zod/unitSchema";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function TambahUnitAccessoriesPage() {
  const [errorAddAccessories, setErrorAddAccessories] = useState<
    Record<string, string>
  >({});
  const [pageCounter, setPageCounter] = useState<number>(1);
  const totalPage = 2;
  function increasePageCounter() {
    if (pageCounter <= totalPage) {
      setPageCounter(pageCounter + 1);
    } else {
      setPageCounter(totalPage);
    }
  }
  function decreasePageCounter() {
    if (pageCounter > 1) {
      setPageCounter(pageCounter - 1);
    } else {
      setPageCounter(1);
    }
  }

  const router = useRouter();

  // Add Aksesories API
  const addAccessoriesMutation = useMutation({
    mutationFn: async (data: unitAccessoriesType) => {
      return await axios.post(
        "http://localhost:8000/api/v1/accessories",
        data,
        {
          withCredentials: true,
        }
      );
    },
    onSuccess: (res) => {
      console.log("✅ Add Accessories success:", res.data);
      alert("Berhasil menambahkan unit Accessories baru");
      router.push("/dashboard");
    },
    onError: (error) => {
      console.log("❌ Add Accessories Failed:", error);
      const newError: Record<string, string> = {};
      if (axios.isAxiosError(error)) {
        const field = error.response?.data.errorType as string;
        newError[field] = error.response?.data.message as string;
        setErrorAddAccessories(newError);
      } else {
        console.log("Error tidak diketahui");
      }
    },
  });

  // Add Accessories Form Validation
  function handleAddAccessories(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const addAccessoriesForm = new FormData(e.currentTarget);

    const addAccessoriesData = {
      name: addAccessoriesForm.get("AccessoriesName"),
      brand: addAccessoriesForm.get("AccessoriesBrand"),
      amount: Number(addAccessoriesForm.get("AccessoriesAmount")),
      accessoriesPrice: Number(addAccessoriesForm.get("AccessoriesPrice")),
      price: {
        perHour: Number(addAccessoriesForm.get("PriceOneHour")),
        perDay: Number(addAccessoriesForm.get("PriceOneDay")),
        perWeek: Number(addAccessoriesForm.get("PriceOneWeek")),
        perMonth: Number(addAccessoriesForm.get("PriceOneMonth")),
      },
    };

    // console.log(addAccessoriesData);

    const validatedAddAccessoriesData =
      unitAccessories.safeParse(addAccessoriesData);
    if (!validatedAddAccessoriesData.success) {
      validatedAddAccessoriesData.error;

      const newErrors: Record<string, string> = {};

      validatedAddAccessoriesData.error?.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        newErrors[field] = issue.message;
      });

      setErrorAddAccessories(newErrors);
    } else {
      validatedAddAccessoriesData.success;
      setErrorAddAccessories({});
      addAccessoriesMutation.mutate(validatedAddAccessoriesData.data);
    }
  }

  return (
    <div className="w-full">
      <div className="fixed w-full h-auto bg-white">
        <div className="flex flex-row justify-evenly w-full py-3">
          {Array.from({ length: totalPage }).map((_, i) =>
            i + 1 < pageCounter ? (
              <div
                key={i}
                className="flex justify-center items-center rounded-full w-8 h-8 bg-[#4B49AC] text-white shadow-[2px_4px_20px_-4px_rgba(0,0,0,0.30)]"
              >
                <i className="bi bi-check"></i>
              </div>
            ) : i + 1 === pageCounter ? (
              <p
                key={i}
                className="flex justify-center items-center rounded-full w-8 h-8 bg-[#4B49AC] text-white shadow-[2px_4px_20px_-4px_rgba(0,0,0,0.30)]"
              >
                {i + 1}
              </p>
            ) : (
              <p
                key={i}
                className="flex justify-center items-center rounded-full w-8 h-8 bg-white text-[#4B49AC] shadow-[2px_4px_20px_-4px_rgba(0,0,0,0.30)]"
              >
                {i + 1}
              </p>
            )
          )}
        </div>
        <div className="relative h-2 bg-gray-200">
          <div
            className={`absolute top-0 left-0 h-2 bg-[#4B49AC]`}
            style={{
              width: `${(pageCounter / totalPage) * 100}%`,
            }}
          ></div>
        </div>
      </div>
      <div className="py-20">
        <div className="flex items-center justify-center">
          <div className="text-xl font-bold my-4">
            Form Tambah Unit Accessories
          </div>
        </div>
        <div className="w-full">
          <form action="" method="post" onSubmit={handleAddAccessories}>
            <div className={pageCounter === 1 ? "block" : "hidden"}>
              <AccessoriesData errorAddAccessories={errorAddAccessories} />
            </div>
            <div className={pageCounter === 2 ? "block" : "hidden"}>
              <AccessoriesPrice errorAddAccessories={errorAddAccessories} />
            </div>
            {pageCounter === 1 ? (
              <div className="flex justify-evenly items-center">
                <div
                  onClick={increasePageCounter}
                  className="flex justify-center items-center my-6 mx-6 rounded-2xl h-10 w-25 border bg-[#4B49AC] text-white"
                >
                  <p>Next</p>
                  <i className="bi bi-chevron-right"></i>
                </div>
              </div>
            ) : pageCounter === totalPage ? (
              <div className="flex justify-evenly flex-row">
                <div
                  onClick={decreasePageCounter}
                  className="flex justify-center items-center my-6 mx-6 rounded-2xl h-10 w-25 border bg-white text-[#4B49AC]"
                >
                  <i className="bi bi-chevron-left"></i>
                  <p>Prev</p>
                </div>
                <button
                  type="submit"
                  className="flex justify-center items-center my-6 mx-6 rounded-2xl h-10 w-25 border bg-[#4B49AC] text-white"
                >
                  Submit
                </button>
              </div>
            ) : (
              <div className="flex justify-evenly">
                <div
                  onClick={decreasePageCounter}
                  className="flex justify-center items-center my-6 mx-6 rounded-2xl h-10 w-25 border bg-white text-[#4B49AC]"
                >
                  <i className="bi bi-chevron-left"></i>
                  <p>Prev</p>
                </div>{" "}
                <div
                  onClick={increasePageCounter}
                  className="flex justify-center items-center my-6 mx-6 rounded-2xl h-10 w-25 border bg-[#4B49AC] text-white"
                >
                  <p>Next</p>
                  <i className="bi bi-chevron-right"></i>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

type DataKendaraanProps = {
  errorAddAccessories: Record<string, string>;
};

function AccessoriesData({ errorAddAccessories }: DataKendaraanProps) {
  return (
    <div className="flex flex-col justify-center">
      <div className="px-4 mt-3 mb-1">
        <h2 className="font-bold">Data Aksesoris</h2>
      </div>
      <div className="flex flex-col justify-center px-8">
        <label className="mt-2 mb-1" htmlFor="AccessoriesName">
          Nama Aksesoris
        </label>
        <input
          className="rounded-2xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B49AC]"
          type="text"
          name="AccessoriesName"
          id="AccessoriesName"
          placeholder="Helm"
        />
        <div className="text-red-500 mt-0 mb-1 text-xs">
          {errorAddAccessories.name ?? <p>{errorAddAccessories.name}</p>}
        </div>
        <label className="mt-2 mb-1" htmlFor="AccessoriesBrand">
          Merk Aksesoris
        </label>
        <input
          className="rounded-2xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B49AC]"
          type="text"
          name="AccessoriesBrand"
          id="AccessoriesBrand"
          placeholder="KYT"
        />
        <div className="text-red-500 mt-0 mb-1 text-xs">
          {errorAddAccessories.brand ?? <p>{errorAddAccessories.brand}</p>}
        </div>
        <label className="mt-2 mb-1" htmlFor="VehicleYear">
          Jumlah Aksesoris
        </label>
        <input
          className="rounded-2xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B49AC]"
          type="number"
          name="AccessoriesAmount"
          id="AccessoriesAmount"
          placeholder="5"
        />
        <div className="text-red-500 mt-0 mb-1 text-xs">
          {errorAddAccessories.amount ?? <p>{errorAddAccessories.amount}</p>}
        </div>
        <label className="mt-2 mb-1" htmlFor="AccessoriesPrice">
          Harga Baru Aksesoris
        </label>
        <input
          className="rounded-2xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B49AC]"
          type="number"
          name="AccessoriesPrice"
          id="AccessoriesPrice"
          placeholder="150000"
        />
        <div className="text-red-500 mt-0 mb-1 text-xs">
          {errorAddAccessories.accessoriesPrice ?? (
            <p>{errorAddAccessories.accessoriesPrice}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function AccessoriesPrice({ errorAddAccessories }: DataKendaraanProps) {
  return (
    <div className="flex flex-col justify-center">
      <div className="px-4 mt-3 mb-1">
        <h2 className="font-bold">Harga Aksesoris dalam Rupiah</h2>
      </div>
      <div className="flex flex-col justify-center px-8">
        <label className="mt-2 mb-1" htmlFor="PriceOneHour">
          Harga per Jam
        </label>
        <input
          className="rounded-2xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B49AC]"
          type="number"
          name="PriceOneHour"
          id="PriceOneHour"
          placeholder="6500"
        />
        <label className="mt-2 mb-1" htmlFor="PriceOneDay">
          Harga per Hari
        </label>
        <input
          className="rounded-2xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B49AC]"
          type="number"
          name="PriceOneDay"
          id="PriceOneDay"
          placeholder="65000"
        />
        <label className="mt-2 mb-1" htmlFor="PriceOneWeek">
          Harga per Minggu
        </label>
        <input
          className="rounded-2xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B49AC]"
          type="number"
          name="PriceOneWeek"
          id="PriceOneWeek"
          placeholder="350000"
        />
        <label className="mt-2 mb-1" htmlFor="PriceOneMonth">
          Harga per Bulan
        </label>
        <input
          className="rounded-2xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B49AC]"
          type="number"
          name="PriceOneMonth"
          id="PriceOneMonth"
          placeholder="1200000"
        />
        <div className="text-red-500 mt-0 mb-1 text-xs">
          {errorAddAccessories.price ?? <p>{errorAddAccessories.price}</p>}
        </div>
      </div>
    </div>
  );
}
