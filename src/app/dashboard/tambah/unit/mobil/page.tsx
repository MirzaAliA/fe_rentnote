"use client";
import { unitVehicle, unitVehicleType } from "@/lib/zod/unitSchema";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AddCarPage() {
  const [errorAddCar, setErrorAddCar] = useState<Record<string, string>>({});
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

  // Add Car API
  const addCarMutation = useMutation({
    mutationFn: async (data: unitVehicleType) => {
      return await axios.post("http://localhost:8000/api/v1/unit", data, {
        withCredentials: true,
      });
    },
    onSuccess: (res) => {
      console.log("✅ Add Car success:", res.data);
      alert("Berhasil menambahkan unit Car baru");
      router.push("/dashboard");
    },
    onError: (error) => {
      console.log("❌ Add Car Failed:", error);
      const newError: Record<string, string> = {};
      if (axios.isAxiosError(error)) {
        const field = error.response?.data.errorType as string;
        newError[field] = error.response?.data.message as string;
        setErrorAddCar(newError);
      } else {
        console.log("Error tidak diketahui");
      }
    },
  });

  // Add Car Form Validation
  function handleAddCar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const addCarForm = new FormData(e.currentTarget);
    const plateNumber =
      addCarForm.get("PlateCity") +
      " " +
      addCarForm.get("PlateNumber") +
      " " +
      addCarForm.get("PlateArea");

    const addCarData = {
      name: addCarForm.get("VehicleName"),
      brand: addCarForm.get("VehicleBrand"),
      plateNumber: plateNumber,
      year: Number(addCarForm.get("VehicleYear")),
      price: {
        perHour: Number(addCarForm.get("PriceOneHour")),
        perDay: Number(addCarForm.get("PriceOneDay")),
        perWeek: Number(addCarForm.get("PriceOneWeek")),
        perMonth: Number(addCarForm.get("PriceOneMonth")),
      },
      vehicleStatus: addCarForm.get("VehicleStatus"),
      vehicleType: "Car",
    };

    // console.log(addCarData);

    const validatedAddCarData = unitVehicle.safeParse(addCarData);
    if (!validatedAddCarData.success) {
      validatedAddCarData.error;

      const newErrors: Record<string, string> = {};

      validatedAddCarData.error?.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        newErrors[field] = issue.message;
      });

      setErrorAddCar(newErrors);
    } else {
      validatedAddCarData.success;
      setErrorAddCar({});
      addCarMutation.mutate(validatedAddCarData.data);
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
          <div className="text-xl font-bold my-4">Form Tambah Unit Mobil</div>
        </div>
        <div className="w-full">
          <form action="" method="post" onSubmit={handleAddCar}>
            <div className={pageCounter === 1 ? "block" : "hidden"}>
              <VehicleData errorAddCar={errorAddCar} />
            </div>
            <div className={pageCounter === 2 ? "block" : "hidden"}>
              <VehiclePrice errorAddCar={errorAddCar} />
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

type VehicleDataProps = {
  errorAddCar: Record<string, string>;
};

function VehicleData({ errorAddCar }: VehicleDataProps) {
  return (
    <div className="flex flex-col justify-center">
      <div className="px-4 mt-3 mb-1">
        <h2 className="font-bold">Data Kendaraan</h2>
      </div>
      <div className="flex flex-col justify-center px-8">
        <label className="mt-2 mb-1" htmlFor="VehicleName">
          Nama Kendaraan
        </label>
        <input
          className="rounded-2xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B49AC]"
          type="text"
          name="VehicleName"
          id="VehicleName"
          placeholder="Avanza"
        />
        <div className="text-red-500 mt-0 mb-1 text-xs">
          {errorAddCar.name ?? <p>{errorAddCar.name}</p>}
        </div>
        <label className="mt-2 mb-1" htmlFor="VehicleBrand">
          Merk Kendaraan
        </label>
        <input
          className="rounded-2xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B49AC]"
          type="text"
          name="VehicleBrand"
          id="VehicleBrand"
          placeholder="Toyota"
        />
        <div className="text-red-500 mt-0 mb-1 text-xs">
          {errorAddCar.brand ?? <p>{errorAddCar.brand}</p>}
        </div>
        <label className="mt-2 mb-1" htmlFor="PlateNumber">
          Plat Nomor Kendaraan
        </label>
        <div className="flex flex-row justify-between">
          <input
            className="rounded-2xl px-3 py-2 w-[20vw] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B49AC]"
            type="text"
            name="PlateCity"
            id="PlateCity"
            placeholder="H"
          />
          <input
            className="rounded-2xl px-3 py-2 w-[40vw] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B49AC]"
            type="text"
            name="PlateNumber"
            id="PlateNumber"
            placeholder="1234"
          />
          <input
            className="rounded-2xl px-3 py-2 w-[20vw] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B49AC]"
            type="text"
            name="PlateArea"
            id="PlateArea"
            placeholder="N"
          />
        </div>
        <div className="text-red-500 mt-0 mb-1 text-xs">
          {errorAddCar.plateNumber ?? <p>{errorAddCar.plateNumber}</p>}
        </div>
        <label className="mt-2 mb-1" htmlFor="VehicleYear">
          Tahun Kendaraan
        </label>
        <input
          className="rounded-2xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B49AC]"
          type="number"
          name="VehicleYear"
          id="VehicleYear"
          placeholder="2020"
        />
        <div className="text-red-500 mt-0 mb-1 text-xs">
          {errorAddCar.year ?? <p>{errorAddCar.year}</p>}
        </div>
        <label className="mt-2 mb-1" htmlFor="VehicleYear">
          Status Kendaraan
        </label>
        <select
          className="rounded-2xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B49AC]"
          name="VehicleStatus"
          id="VehicleStatus"
        >
          <option value="Ready">Ready</option>
          <option value="Maintenance">Servis</option>
          <option value="Rented">Disewa</option>
        </select>
        <div className="text-red-500 mt-0 mb-1 text-xs">
          {errorAddCar.vehicleStatus ?? <p>{errorAddCar.vehicleStatus}</p>}
        </div>
      </div>
    </div>
  );
}

function VehiclePrice({ errorAddCar }: VehicleDataProps) {
  return (
    <div className="flex flex-col justify-center">
      <div className="px-4 mt-3 mb-1">
        <h2 className="font-bold">Harga Kendaraan dalam Rupiah</h2>
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
          placeholder="35000"
        />
        <label className="mt-2 mb-1" htmlFor="PriceOneDay">
          Harga per Hari
        </label>
        <input
          className="rounded-2xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B49AC]"
          type="number"
          name="PriceOneDay"
          id="PriceOneDay"
          placeholder="350000"
        />
        <label className="mt-2 mb-1" htmlFor="PriceOneWeek">
          Harga per Minggu
        </label>
        <input
          className="rounded-2xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B49AC]"
          type="number"
          name="PriceOneWeek"
          id="PriceOneWeek"
          placeholder="2100000"
        />
        <label className="mt-2 mb-1" htmlFor="PriceOneMonth">
          Harga per Bulan
        </label>
        <input
          className="rounded-2xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B49AC]"
          type="number"
          name="PriceOneMonth"
          id="PriceOneMonth"
          placeholder="7000000"
        />
        <div className="text-red-500 mt-0 mb-1 text-xs">
          {errorAddCar.price ?? <p>{errorAddCar.price}</p>}
        </div>
      </div>
    </div>
  );
}
