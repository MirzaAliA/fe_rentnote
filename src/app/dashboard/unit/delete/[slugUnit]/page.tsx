"use client";
import {
  unitVehicle,
  unitVehicleEditType,
  unitVehicleType,
} from "@/lib/zod/unitSchema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

export default function EditBikePage() {
  const router = useRouter();
  const params = useParams();
  const [errorEditBike, setErrorEditBike] = useState<Record<string, string>>(
    {}
  );
  const [pageCounter, setPageCounter] = useState<number>(1);

  const [form, setForm] = useState<unitVehicleEditType>({
    _id: "",
    name: "",
    brand: "",
    plateNumber: "",
    plateCity: "",
    plateArea: "",
    year: 0,
    price: {
      perHour: 0,
      perDay: 0,
      perWeek: 0,
      perMonth: 0,
    },
    vehicleStatus: "Ready" as "Ready" | "Rented" | "Maintenance",
    vehicleType: "Bike" as "Car" | "Bike",
  });

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

  // Get Bike API
  const queryUnitVehicleDataByID = useQuery({
    queryKey: ["unit"],
    queryFn: async () => {
      return await axios.get(
        `http://localhost:8000/api/v1/unit/${params.slugUnit}`,
        {
          withCredentials: true,
        }
      );
    },
  });

  const queryVehicle = queryUnitVehicleDataByID.data?.data.data ?? {};

  useEffect(() => {
    if (!queryVehicle) return;

    setForm({
      _id: queryVehicle._id ?? "",
      name: queryVehicle.name ?? "",
      brand: queryVehicle.brand ?? "",
      plateNumber: queryVehicle.plateNumber?.split(" ")[1] ?? "",
      plateCity: queryVehicle.plateNumber?.split(" ")[0] ?? "",
      plateArea: queryVehicle.plateNumber?.split(" ")[2] ?? "",
      year: queryVehicle.year ?? 0,
      price: {
        perHour: queryVehicle.price?.perHour ?? 0,
        perDay: queryVehicle.price?.perDay ?? 0,
        perWeek: queryVehicle.price?.perWeek ?? 0,
        perMonth: queryVehicle.price?.perMonth ?? 0,
      },
      vehicleStatus: queryVehicle.vehicleStatus ?? "Ready",
      vehicleType: queryVehicle.vehicleType ?? "Bike",
    });
  }, [queryVehicle]);

  // Add Bike API
  const editVehicleMutation = useMutation({
    mutationFn: async (data: unitVehicleType) => {
      return await axios.put(
        `http://localhost:8000/api/v1/unit/${params.slugUnit}`,
        data,
        {
          withCredentials: true,
        }
      );
    },
    onSuccess: (res) => {
      console.log("✅ Edit Bike success:", res.data);
      if (res.data.data.vehicleType === "Bike") {
        alert("Berhasil mengedit unit Motor");
      } else if (res.data.data.vehicleType === "Car") {
        alert("Berhasil mengedit unit Mobil");
      }
      router.push("/dashboard/unit");
    },
    onError: (error) => {
      console.log("❌ Edit Bike Failed:", error);
      const newError: Record<string, string> = {};
      if (axios.isAxiosError(error)) {
        const field = error.response?.data.errorType as string;
        newError[field] = error.response?.data.message as string;
        setErrorEditBike(newError);
      } else {
        console.log("Error tidak diketahui");
      }
    },
  });

  // Add Bike Form Validation
  function handleEditVehicle(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const plateNumber =
      form.plateCity + " " + form.plateNumber + " " + form.plateArea;

    const editBikeData = {
      _id: form._id,
      name: form.name,
      brand: form.brand,
      plateNumber: plateNumber,
      year: Number(form.year),
      price: {
        perHour: Number(form.price.perHour),
        perDay: Number(form.price.perDay),
        perWeek: Number(form.price.perWeek),
        perMonth: Number(form.price.perMonth),
      },
      vehicleStatus: form.vehicleStatus,
      vehicleType: "Bike",
    };

    const validatedEditVehicleData = unitVehicle.safeParse(editBikeData);
    if (!validatedEditVehicleData.success) {
      validatedEditVehicleData.error;

      const newErrors: Record<string, string> = {};

      validatedEditVehicleData.error?.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        newErrors[field] = issue.message;
      });

      setErrorEditBike(newErrors);
    } else {
      validatedEditVehicleData.success;
      setErrorEditBike({});
      editVehicleMutation.mutate(validatedEditVehicleData.data);
    }
  }

  // Delete Bike API
  const deleteVehicleMutation = useMutation({
    mutationFn: async () => {
      return await axios.delete(
        `http://localhost:8000/api/v1/unit/${params.slugUnit}`,
        {
          withCredentials: true,
        }
      );
    },
    onSuccess: (res) => {
      console.log("✅ Delete Bike success:", res.data);
      if (res.data.data.vehicleType === "Bike") {
        alert("Berhasil menghapus unit Motor");
      } else if (res.data.data.vehicleType === "Car") {
        alert("Berhasil menghapus unit Mobil");
      }
      router.push("/dashboard/unit");
    },
    onError: (error) => {
      console.log("❌ Delete Bike Failed:", error);
      const newError: Record<string, string> = {};
      if (axios.isAxiosError(error)) {
        const field = error.response?.data.errorType as string;
        newError[field] = error.response?.data.message as string;
        setErrorEditBike(newError);
      } else {
        console.log("Error tidak diketahui");
      }
    },
  });

  function handleDeleteVehicle() {
    if (confirm("Yakin hapus data ini?")) {
      deleteVehicleMutation.mutate();
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
          {queryVehicle.vehicleType === "Bike" ? (
            <div className="text-xl font-bold my-4">Form Edit Unit Motor</div>
          ) : (
            <div className="text-xl font-bold my-4">Form Edit Unit Mobil</div>
          )}
        </div>
        <div className="w-full">
          <form action="" method="post" onSubmit={handleEditVehicle}>
            <div className={pageCounter === 1 ? "block" : "hidden"}>
              <VehicleData
                errorEditBike={errorEditBike}
                form={form}
                setForm={setForm}
              />
            </div>
            <div className={pageCounter === 2 ? "block" : "hidden"}>
              <VehiclePrice
                errorEditBike={errorEditBike}
                form={form}
                setForm={setForm}
              />
            </div>
            {pageCounter === 1 ? (
              <div className="flex justify-evenly items-center">
                <button
                  type="button"
                  className="flex justify-center items-center mx-6 rounded-2xl h-10 w-25 border bg-yellow-400 text-white"
                  onClick={() => {
                    router.push("/dashboard/unit");
                  }}
                >
                  Cancel
                </button>
                <div
                  onClick={increasePageCounter}
                  className="flex justify-center items-center my-6 mx-6 rounded-2xl h-10 w-25 border bg-[#4B49AC] text-white"
                >
                  <p>Next</p>
                  <i className="bi bi-chevron-right"></i>
                </div>
              </div>
            ) : pageCounter === totalPage ? (
              <div className="flex justify-center flex-col">
                <div className="flex flex-row justify-evenly mt-6 mb-4">
                  <div
                    onClick={decreasePageCounter}
                    className="flex justify-center items-center mx-6 rounded-2xl h-10 w-25 border bg-white text-[#4B49AC]"
                  >
                    <i className="bi bi-chevron-left"></i>
                    <p>Prev</p>
                  </div>
                  <button
                    type="button"
                    className="flex justify-center items-center mx-6 rounded-2xl h-10 w-25 border bg-yellow-400 text-white"
                    onClick={() => {
                      router.push("/dashboard/unit");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex justify-center items-center mx-6 rounded-2xl h-10 w-25 border bg-[#4B49AC] text-white"
                  >
                    Submit
                  </button>
                </div>
                <div className="flex justify-center">
                  <button
                    type="button"
                    className="flex justify-center items-center mx-6 rounded-2xl h-10 w-25 border bg-red-500 text-white"
                    onClick={handleDeleteVehicle}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-evenly items-center">
                <div
                  onClick={decreasePageCounter}
                  className="flex justify-center items-center my-6 mx-6 rounded-2xl h-10 w-25 border bg-white text-[#4B49AC]"
                >
                  <i className="bi bi-chevron-left"></i>
                  <p>Prev</p>
                </div>
                <button
                  type="button"
                  className="flex justify-center items-center mx-6 rounded-2xl h-10 w-25 border bg-yellow-400 text-white"
                  onClick={() => {
                    router.push("/dashboard/unit");
                  }}
                >
                  Cancel
                </button>
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

function VehicleData({
  errorEditBike,
  form,
  setForm,
}: {
  errorEditBike: Record<string, string>;
  form: unitVehicleEditType;
  setForm: React.Dispatch<React.SetStateAction<unitVehicleEditType>>;
}) {
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
          placeholder={form.name}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <div className="text-red-500 mt-0 mb-1 text-xs">
          {errorEditBike.name ?? <p>{errorEditBike.name}</p>}
        </div>
        <label className="mt-2 mb-1" htmlFor="VehicleBrand">
          Merk Kendaraan
        </label>
        <input
          className="rounded-2xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B49AC]"
          type="text"
          name="VehicleBrand"
          id="VehicleBrand"
          placeholder={form.brand}
          value={form.brand}
          onChange={(e) => setForm({ ...form, brand: e.target.value })}
        />
        <div className="text-red-500 mt-0 mb-1 text-xs">
          {errorEditBike.brand ?? <p>{errorEditBike.brand}</p>}
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
            placeholder={form.plateNumber?.split(" ")[0]}
            value={form.plateNumber?.split(" ")[0]}
            onChange={(e) => setForm({ ...form, plateCity: e.target.value })}
          />
          <input
            className="rounded-2xl px-3 py-2 w-[40vw] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B49AC]"
            type="text"
            name="PlateNumber"
            id="PlateNumber"
            placeholder={form.plateNumber?.split(" ")[1]}
            value={form.plateNumber?.split(" ")[1]}
            onChange={(e) => setForm({ ...form, plateNumber: e.target.value })}
          />
          <input
            className="rounded-2xl px-3 py-2 w-[20vw] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B49AC]"
            type="text"
            name="PlateArea"
            id="PlateArea"
            placeholder={form.plateNumber?.split(" ")[2]}
            value={form.plateNumber?.split(" ")[2]}
            onChange={(e) => setForm({ ...form, plateArea: e.target.value })}
          />
        </div>
        <div className="text-red-500 mt-0 mb-1 text-xs">
          {errorEditBike.plateNumber ?? <p>{errorEditBike.plateNumber}</p>}
        </div>
        <label className="mt-2 mb-1" htmlFor="VehicleYear">
          Tahun Kendaraan
        </label>
        <input
          className="rounded-2xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B49AC]"
          type="number"
          name="VehicleYear"
          id="VehicleYear"
          placeholder={form.year?.toString()}
          value={form.year}
          onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
        />
        <div className="text-red-500 mt-0 mb-1 text-xs">
          {errorEditBike.year ?? <p>{errorEditBike.year}</p>}
        </div>
        <label className="mt-2 mb-1" htmlFor="VehicleYear">
          Status Kendaraan
        </label>
        <select
          className="rounded-2xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B49AC]"
          name="VehicleStatus"
          id="VehicleStatus"
          onChange={(e) =>
            setForm({
              ...form,
              vehicleStatus: e.target.value as typeof form.vehicleStatus,
            })
          }
        >
          <option value={form.vehicleStatus}>{form.vehicleStatus}</option>
          <option value="Ready">Ready</option>
          <option value="Maintenance">Servis</option>
          <option value="Rented">Disewa</option>
        </select>
        <div className="text-red-500 mt-0 mb-1 text-xs">
          {errorEditBike.vehicleStatus ?? <p>{errorEditBike.vehicleStatus}</p>}
        </div>
      </div>
    </div>
  );
}

function VehiclePrice({
  errorEditBike,
  form,
  setForm,
}: {
  errorEditBike: Record<string, string>;
  form: unitVehicleEditType;
  setForm: React.Dispatch<React.SetStateAction<unitVehicleEditType>>;
}) {
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
          placeholder={form.price.perHour?.toString() ?? ""}
          value={form.price.perHour ?? 0}
          onChange={(e) =>
            setForm((form) => ({
              ...form,
              price: { ...form.price, perHour: Number(e.target.value) },
            }))
          }
        />
        <label className="mt-2 mb-1" htmlFor="PriceOneDay">
          Harga per Hari
        </label>
        <input
          className="rounded-2xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B49AC]"
          type="number"
          name="PriceOneDay"
          id="PriceOneDay"
          placeholder={form.price.perDay?.toString() ?? ""}
          value={form.price.perDay ?? 0}
          onChange={(e) =>
            setForm((form) => ({
              ...form,
              price: { ...form.price, perDay: Number(e.target.value) },
            }))
          }
        />
        <label className="mt-2 mb-1" htmlFor="PriceOneWeek">
          Harga per Minggu
        </label>
        <input
          className="rounded-2xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B49AC]"
          type="number"
          name="PriceOneWeek"
          id="PriceOneWeek"
          placeholder={form.price.perWeek?.toString() ?? ""}
          value={form.price.perWeek ?? 0}
          onChange={(e) =>
            setForm((form) => ({
              ...form,
              price: { ...form.price, perWeek: Number(e.target.value) },
            }))
          }
        />
        <label className="mt-2 mb-1" htmlFor="PriceOneMonth">
          Harga per Bulan
        </label>
        <input
          className="rounded-2xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B49AC]"
          type="number"
          name="PriceOneMonth"
          id="PriceOneMonth"
          placeholder={form.price.perMonth?.toString() ?? ""}
          value={form.price.perMonth ?? 0}
          onChange={(e) =>
            setForm((form) => ({
              ...form,
              price: { ...form.price, perMonth: Number(e.target.value) },
            }))
          }
        />
        <div className="text-red-500 mt-0 mb-1 text-xs">
          {errorEditBike.price ?? <p>{errorEditBike.price}</p>}
        </div>
      </div>
    </div>
  );
}
