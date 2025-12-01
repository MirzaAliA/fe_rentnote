"use client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";
import {
  unitAccessoriesArray,
  unitAccessoriesArrayType,
  unitVehicleArray,
  unitVehicleArrayType,
  unitVehicleType,
} from "@/lib/zod/unitSchema";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DaftarUnitPage() {
  const [unitState, setUnitState] = useState<string>("Bike");
  const [carStatusType, setCarStatusType] = useState<string>("");
  const [bikeStatusType, setBikeStatusType] = useState<string>("");
  const [unitName, setUnitName] = useState<string>("");

  function listUnitHandler(unit: string) {
    setUnitState(unit);
  }

  function searchUnitHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setUnitName(e.target.value);
  }

  // Hook for Get Vehicle Data
  const queryUnitVehicleData = useQuery({
    queryKey: ["units"],
    queryFn: async () => {
      return await axios.get("http://localhost:8000/api/v1/unit", {
        withCredentials: true,
      });
    },
  });

  //Hook for Get Accessories Data
  const queryUnitAccessoriesData = useQuery({
    queryKey: ["accessories"],
    queryFn: async () => {
      return await axios.get("http://localhost:8000/api/v1/accessories", {
        withCredentials: true,
      });
    },
  });

  // Logic Get Vehicle
  const bikeRawData = (queryUnitVehicleData.data?.data.data ?? []).filter(
    (unit: unitVehicleType) => unit.vehicleType == "Bike"
  );

  const carRawData = (queryUnitVehicleData.data?.data.data ?? []).filter(
    (unit: unitVehicleType) => unit.vehicleType == "Car"
  );

  const bikeRawDataFiltered = bikeRawData.filter((unit: unitVehicleType) => {
    const matchStatus =
      bikeStatusType === "" || unit.vehicleStatus === bikeStatusType;
    const matchName =
      unitName === "" ||
      unit.name.toLowerCase().includes(unitName.toLowerCase());

    return matchStatus && (unitName !== "" ? matchName : true);
  });

  const carRawDataFiltered = carRawData.filter((unit: unitVehicleType) => {
    const matchStatus =
      carStatusType === "" || unit.vehicleStatus === carStatusType;
    const matchName =
      unitName === "" ||
      unit.name.toLowerCase().includes(unitName.toLowerCase());

    return matchStatus && (unitName !== "" ? matchName : true);
  });

  const bikeData = unitVehicleArray.safeParse(bikeRawDataFiltered);
  if (!bikeData.success) {
    console.log(bikeData.error);
  }
  if (!bikeData || !bikeData.data) return null;
  const validBikeData: unitVehicleArrayType = bikeData?.data;

  const carData = unitVehicleArray.safeParse(carRawDataFiltered);
  if (!carData.success) {
    console.log(carData.error);
  }
  if (!carData || !carData.data) return null;
  const validCarData: unitVehicleArrayType = carData?.data;

  // Logic Get Accessories

  const rawAccessoriesData = queryUnitAccessoriesData.data?.data.data;
  const accessoriesData = unitAccessoriesArray.safeParse(
    rawAccessoriesData ?? []
  );
  if (!accessoriesData.success) {
    console.log(accessoriesData.error);
  }
  if (!accessoriesData || !accessoriesData.data) return null;
  const validAccessoriesData: unitAccessoriesArrayType = accessoriesData?.data;

  return (
    <div>
      <div className="fixed w-full h-auto top-0">
        <div className="flex flex-row justify-center items-center py-4 bg-[#4B49AC]">
          <h1 className="text-xl text-white font-bold">Daftar Unit</h1>
        </div>
        <div className="bg-[#F5F5F5]">
          <div className="flex flex-row justify-evenly w-full">
            <div
              onClick={() => {
                listUnitHandler("Bike");
              }}
              className={`flex justify-center items-center h-12 w-full ${
                unitState === "Bike" ? "bg-[#ededed]" : "bg-white"
              }`}
            >
              Motor
            </div>
            <div
              onClick={() => {
                listUnitHandler("Car");
              }}
              className={`flex justify-center items-center h-12 w-full ${
                unitState === "Car" ? "bg-[#ededed]" : "bg-white"
              }`}
            >
              Mobil
            </div>
            <div
              onClick={() => {
                listUnitHandler("Accessories");
              }}
              className={`flex justify-center items-center h-12 w-full ${
                unitState === "Accessories" ? "bg-[#ededed]" : "bg-white"
              }`}
            >
              Aksesoris
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mx-4">
          <div className="">
            <input
              placeholder="Cari nama unit.."
              type="text"
              name="name"
              id="name"
              className={`rounded-xl h-8 w-42 py-1 px-2  bg-white focus:outline-none focus:ring-2 focus:ring-[#4B49AC] mt-2`}
              onChange={searchUnitHandler}
            />
          </div>
          <div
            className={`flex justify-center items-center flex-row ${
              unitState === "Accessories" ? "hidden" : "block"
            }`}
          >
            <label htmlFor="unitStatus">Status:</label>
            <select
              name="unitStatus"
              id="unitStatus"
              onChange={(e) => {
                if (unitState === "Bike") {
                  setBikeStatusType(e.target.value);
                } else {
                  setCarStatusType(e.target.value);
                }
              }}
            >
              <option value="">Semua</option>
              <option value="Ready">Ready</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Rented">Rented</option>
            </select>
          </div>
        </div>
      </div>
      <div className="my-40">
        <div className={`${unitState === "Bike" ? "block" : "hidden"}`}>
          {queryUnitVehicleData.isPending ? (
            <div className="flex justify-center items-center">
              <span>Loading...</span>
            </div>
          ) : queryUnitVehicleData.isError ? (
            <div className="flex justify-center items-center">
              <span>Error mengambil data</span>
            </div>
          ) : queryUnitVehicleData.data?.data.data.length === 0 ? (
            <div className="flex flex-col justify-center items-center my-[50vh]">
              <span className="my-2">Data unit kosong</span>
              <div className="flex flex-row mb-4 mx-4 gap-6 bg-[#4B49AC] rounded-xl">
                <Link
                  className="flex flex-col gap-2 justify-center items-center"
                  href={"tambah/unit/motor"}
                >
                  <div className="flex flex-row justify-center items-center py-2 px-2 rounded-lg shadow-[0px_8px_16px_-8px_rgba(0,0,0,0.30)]">
                    <i className="bi bi-plus text-white"></i>
                    <p className="text-sm text-white">Tambah Unit Motor Baru</p>
                  </div>
                </Link>
              </div>
            </div>
          ) : (
            <ListBikePage validBikeData={validBikeData} />
          )}
        </div>
        <div className={`${unitState === "Car" ? "block" : "hidden"}`}>
          {queryUnitVehicleData.isPending ? (
            <div className="flex justify-center items-center">
              <span>Loading...</span>
            </div>
          ) : queryUnitVehicleData.isError ? (
            <div className="flex justify-center items-center">
              <span>Error mengambil data</span>
            </div>
          ) : queryUnitVehicleData.data?.data.data.length === 0 ? (
            <div className="flex flex-col justify-center items-center my-[50vh]">
              <span className="my-2">Data unit kosong</span>
              <div className="flex flex-row mb-4 mx-4 gap-6 bg-[#4B49AC] rounded-xl">
                <Link
                  className="flex flex-col gap-2 justify-center items-center"
                  href={"tambah/unit/mobil"}
                >
                  <div className="flex flex-row justify-center items-center py-2 px-2 rounded-lg shadow-[0px_8px_16px_-8px_rgba(0,0,0,0.30)]">
                    <i className="bi bi-plus text-white"></i>
                    <p className="text-sm text-white">Tambah Unit Mobil Baru</p>
                  </div>
                </Link>
              </div>
            </div>
          ) : (
            <ListCarPage validCarData={validCarData} />
          )}
        </div>
        <div className={`${unitState === "Accessories" ? "block" : "hidden"}`}>
          {queryUnitAccessoriesData.isPending ? (
            <div className="flex justify-center items-center">
              <span>Loading...</span>
            </div>
          ) : queryUnitAccessoriesData.isError ? (
            <div className="flex justify-center items-center">
              <span>Error mengambil data</span>
            </div>
          ) : queryUnitAccessoriesData.data?.data.data.length === 0 ? (
            <div className="flex flex-col justify-center items-center my-[50vh]">
              <span className="my-2">Data aksesoris kosong</span>
              <div className="flex flex-row mb-4 mx-4 gap-6 bg-[#4B49AC] rounded-xl">
                <Link
                  className="flex flex-col gap-2 justify-center items-center"
                  href={"tambah/unit/aksesoris"}
                >
                  <div className="flex flex-row justify-center items-center py-2 px-2 rounded-lg shadow-[0px_8px_16px_-8px_rgba(0,0,0,0.30)]">
                    <i className="bi bi-plus text-white"></i>
                    <p className="text-sm text-white">Tambah Aksesoris Baru</p>
                  </div>
                </Link>
              </div>
            </div>
          ) : (
            <ListAccessoriesPage validAccessoriesData={validAccessoriesData} />
          )}
        </div>
      </div>
    </div>
  );
}

function ListBikePage({
  validBikeData,
}: {
  validBikeData: unitVehicleArrayType;
}) {
  const router = useRouter();
  return (
    <section className="my-6">
      <ul className="flex flex-col gap-4">
        {validBikeData?.map((data, i) => (
          <li
            key={i}
            className="bg-white rounded-2xl mx-4 px-6 py-4 shadow-[4px_8px_16px_rgba(0,0,0,0.30)]"
          >
            <div className="flex flex-row justify-between">
              <h2 className="font-bold">
                {data.brand} {data.name}
              </h2>
              <div className="flex flex-row items-center gap-2">
                <div
                  className={`h-4 w-4 rounded-full ${
                    data.vehicleStatus === "Ready"
                      ? "bg-green-600"
                      : data.vehicleStatus === "Rented"
                      ? "bg-red-600"
                      : "bg-yellow-500"
                  }`}
                ></div>
                <h2
                  className={`text-green-600 ${
                    data.vehicleStatus === "Ready"
                      ? "text-green-600"
                      : data.vehicleStatus === "Rented"
                      ? "text-red-600"
                      : "text-yellow-500"
                  }`}
                >
                  {data.vehicleStatus}
                </h2>
              </div>
            </div>
            <h3 className="text-[#4B49AC]">{data.year}</h3>
            <div className="flex flex-row justify-between items-end">
              <h3 className="">{data.plateNumber}</h3>
              <div
                onClick={() => router.push(`unit/edit/kendaraan/${data._id}`)}
                className="flex flex-row"
              >
                <button className="bi bi-pencil-square flex justify-center items-center text-white bg-[#4B49AC] rounded-full w-8 h-8"></button>
              </div>
            </div>
            <h3 className="mt-4">Harga Sewa:</h3>
            <div className="flex flex-row justify-between flex-wrap">
              <div>
                <p>1 Jam Rp.{data.price.perHour / 1000}k</p>
                <p>1 Hari Rp.{data.price.perDay / 1000}k</p>
              </div>
              <div>
                <p>1 Minggu Rp.{data.price.perWeek / 1000}k</p>
                <p>1 Bulan Rp.{data.price.perMonth / 1000}k</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ListCarPage({ validCarData }: { validCarData: unitVehicleArrayType }) {
  const router = useRouter();
  return (
    <section className="my-6">
      <ul className="flex flex-col gap-4">
        {validCarData?.map((data, i) => (
          <li
            key={i}
            className="bg-white rounded-2xl mx-4 px-6 py-4 shadow-[4px_8px_16px_rgba(0,0,0,0.30)]"
          >
            <div className="flex flex-row justify-between">
              <h2 className="font-bold">
                {data.brand} {data.name}
              </h2>
              <div className="flex flex-row items-center gap-2">
                <div
                  className={`h-4 w-4 rounded-full ${
                    data.vehicleStatus === "Ready"
                      ? "bg-green-600"
                      : data.vehicleStatus === "Rented"
                      ? "bg-red-600"
                      : "bg-yellow-500"
                  }`}
                ></div>
                <h2
                  className={`text-green-600 ${
                    data.vehicleStatus === "Ready"
                      ? "text-green-600"
                      : data.vehicleStatus === "Rented"
                      ? "text-red-600"
                      : "text-yellow-500"
                  }`}
                >
                  {data.vehicleStatus}
                </h2>
              </div>
            </div>
            <h3 className="text-[#4B49AC]">{data.year}</h3>
            <div className="flex flex-row justify-between items-end">
              <h3 className="">{data.plateNumber}</h3>
              <div
                onClick={() => router.push(`unit/edit/kendaraan/${data._id}`)}
                className="flex flex-row"
              >
                <button className="bi bi-pencil-square flex justify-center items-center text-white bg-[#4B49AC] rounded-full w-8 h-8"></button>
              </div>
            </div>
            <h3 className="mt-4">Harga Sewa:</h3>
            <div className="flex flex-row justify-between flex-wrap">
              <div>
                <p>1 Jam Rp.{data.price.perHour / 1000}k</p>
                <p>1 Hari Rp.{data.price.perDay / 1000}k</p>
              </div>
              <div>
                <p>1 Minggu Rp.{data.price.perWeek / 1000}k</p>
                <p>1 Bulan Rp.{data.price.perMonth / 1000}k</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ListAccessoriesPage({
  validAccessoriesData,
}: {
  validAccessoriesData: unitAccessoriesArrayType;
}) {
  const router = useRouter();
  return (
    <section className="my-6">
      <ul className="flex flex-col gap-4">
        {validAccessoriesData.map((data, i) => (
          <li
            key={i}
            className="bg-white rounded-2xl mx-4 px-6 py-4 shadow-[4px_8px_16px_rgba(0,0,0,0.30)]"
          >
            <div className="flex flex-row justify-between">
              <h2 className="font-bold">{data.brand}</h2>
              <div className="flex flex-row items-center gap-2">
                <div className="h-4 w-4 bg-green-600 rounded-full"></div>
                <h2 className="text-green-600">Ready</h2>
              </div>
            </div>
            <h3 className="text-[#4B49AC]">{data.name}</h3>
            <div className="flex flex-row justify-between items-center">
              <h3 className="">Jumlah: {data.amount}</h3>
              <div
                onClick={() => router.push(`unit/edit/aksesoris/${data._id}`)}
                className="flex flex-row"
              >
                <button className="bi bi-pencil-square flex justify-center items-center text-white bg-[#4B49AC] rounded-full w-8 h-8"></button>
              </div>
            </div>
            <h3 className="mt-4">Harga Sewa:</h3>
            <div className="flex flex-row justify-between flex-wrap">
              <div>
                <p>1 Jam Rp.{data.price.perHour / 1000}k</p>
                <p>1 Hari Rp.{data.price.perDay / 1000}k</p>
              </div>
              <div>
                <p>1 Minggu Rp.{data.price.perWeek / 1000}k</p>
                <p>1 Bulan Rp.{data.price.perMonth / 1000}k</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
