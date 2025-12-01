"use client";
import { unitAccessories, unitAccessoriesType } from "@/lib/zod/unitSchema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { formStepsConfig } from "@/lib/config/config";

export default function EditAccessoriesPage() {
  const router = useRouter();
  const params = useParams();
  const [errorEditAccessories, setErrorEditAccessories] = useState<
    Record<string, string>
  >({});
  const [pageCounter, setPageCounter] = useState<number>(1);

  const [form, setForm] = useState<unitAccessoriesType>({
    _id: "",
    name: "",
    brand: "",
    amount: 0,
    accessoriesPrice: 0,
    price: {
      perHour: 0,
      perDay: 0,
      perWeek: 0,
      perMonth: 0,
    },
  });

  const totalPage = formStepsConfig.accessories.length;

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

  // Get Accessories API
  const queryAccessoriesDataByID = useQuery({
    queryKey: ["unit"],
    queryFn: async () => {
      return await axios.get(
        `http://localhost:8000/api/v1/accessories/${params.slugAccessories}`,
        {
          withCredentials: true,
        }
      );
    },
  });

  const queryAccessories = queryAccessoriesDataByID.data?.data.data ?? {};

  useEffect(() => {
    if (!queryAccessories) return;

    setForm({
      _id: queryAccessories._id ?? "",
      name: queryAccessories.name ?? "",
      brand: queryAccessories.brand ?? "",
      amount: queryAccessories.amount ?? 0,
      accessoriesPrice: queryAccessories.accessoriesPrice ?? 0,
      price: {
        perHour: queryAccessories.price?.perHour ?? 0,
        perDay: queryAccessories.price?.perDay ?? 0,
        perWeek: queryAccessories.price?.perWeek ?? 0,
        perMonth: queryAccessories.price?.perMonth ?? 0,
      },
    });
  }, [queryAccessories]);

  // Add Accessories API
  const editAccessoriesMutation = useMutation({
    mutationFn: async (data: unitAccessoriesType) => {
      return await axios.put(
        `http://localhost:8000/api/v1/accessories/${params.slugAccessories}`,
        data,
        {
          withCredentials: true,
        }
      );
    },
    onSuccess: (res) => {
      console.log("✅ Edit Accessories success:", res.data);
      alert("Berhasil mengedit unit Aksesoris");
      router.push("/dashboard/unit");
    },
    onError: (error) => {
      console.log("❌ Edit Accessories Failed:", error);
      const newError: Record<string, string> = {};
      if (axios.isAxiosError(error)) {
        const field = error.response?.data.errorType as string;
        newError[field] = error.response?.data.message as string;
        setErrorEditAccessories(newError);
      } else {
        console.log("Error tidak diketahui");
      }
    },
  });

  // Add Accessories Form Validation
  function handleEditAccessories(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const editAccessoriesData = {
      _id: form._id,
      name: form.name,
      brand: form.brand,
      amount: Number(form.amount),
      accessoriesPrice: Number(form.accessoriesPrice),
      price: {
        perHour: Number(form.price.perHour),
        perDay: Number(form.price.perDay),
        perWeek: Number(form.price.perWeek),
        perMonth: Number(form.price.perMonth),
      },
    };

    const validatedEditAccessoriesData =
      unitAccessories.safeParse(editAccessoriesData);
    if (!validatedEditAccessoriesData.success) {
      validatedEditAccessoriesData.error;

      const newErrors: Record<string, string> = {};

      validatedEditAccessoriesData.error?.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        newErrors[field] = issue.message;
      });

      setErrorEditAccessories(newErrors);
    } else {
      validatedEditAccessoriesData.success;
      setErrorEditAccessories({});
      editAccessoriesMutation.mutate(validatedEditAccessoriesData.data);
    }
  }

  // Delete Accessories API
  const deleteAccessoriesMutation = useMutation({
    mutationFn: async () => {
      return await axios.delete(
        `http://localhost:8000/api/v1/accessories/${params.slugAccessories}`,
        {
          withCredentials: true,
        }
      );
    },
    onSuccess: (res) => {
      console.log("✅ Delete Accessories success:", res.data);
      alert("Berhasil menghapus unit Aksesoris");
      router.push("/dashboard/unit");
    },
    onError: (error) => {
      console.log("❌ Delete Accessories Failed:", error);
      const newError: Record<string, string> = {};
      if (axios.isAxiosError(error)) {
        const field = error.response?.data.errorType as string;
        newError[field] = error.response?.data.message as string;
        setErrorEditAccessories(newError);
      } else {
        console.log("Error tidak diketahui");
      }
    },
  });

  function handleDeleteAccessories() {
    if (confirm("Yakin hapus data ini?")) {
      deleteAccessoriesMutation.mutate();
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
          Form Edit Aksesoris
        </div>
        <div className="w-full">
          <form action="" method="post" onSubmit={handleEditAccessories}>
            <div className={pageCounter === 1 ? "block" : "hidden"}>
              <AccessoriesData
                errorEditAccessories={errorEditAccessories}
                form={form}
                setForm={setForm}
              />
            </div>
            <div className={pageCounter === 2 ? "block" : "hidden"}>
              <AccessoriesPrice
                errorEditAccessories={errorEditAccessories}
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
                    onClick={handleDeleteAccessories}
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

function AccessoriesData({
  errorEditAccessories,
  form,
  setForm,
}: {
  errorEditAccessories: Record<string, string>;
  form: unitAccessoriesType;
  setForm: React.Dispatch<React.SetStateAction<unitAccessoriesType>>;
}) {
  return (
    <div className="flex flex-col justify-center">
      <div className="px-4 mt-3 mb-1">
        <h2 className="font-bold">Data Kendaraan</h2>
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
          placeholder={form.name}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <div className="text-red-500 mt-0 mb-1 text-xs">
          {errorEditAccessories.name ?? <p>{errorEditAccessories.name}</p>}
        </div>
        <label className="mt-2 mb-1" htmlFor="AccessoriesBrand">
          Merk Aksesoris
        </label>
        <input
          className="rounded-2xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B49AC]"
          type="text"
          name="AccessoriesBrand"
          id="AccessoriesBrand"
          placeholder={form.brand}
          value={form.brand}
          onChange={(e) => setForm({ ...form, brand: e.target.value })}
        />
        <div className="text-red-500 mt-0 mb-1 text-xs">
          {errorEditAccessories.brand ?? <p>{errorEditAccessories.brand}</p>}
        </div>
        <label className="mt-2 mb-1" htmlFor="AccessoriesAmount">
          Jumlah Aksesoris
        </label>
        <input
          className="rounded-2xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B49AC]"
          type="number"
          name="AccessoriesAmount"
          id="AccessoriesAmount"
          placeholder={form.amount?.toString()}
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
        />
        <div className="text-red-500 mt-0 mb-1 text-xs">
          {errorEditAccessories.amount ?? <p>{errorEditAccessories.amount}</p>}
        </div>
        <label className="mt-2 mb-1" htmlFor="AccessoriesPrice">
          Harga Aksesoris
        </label>
        <input
          className="rounded-2xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B49AC]"
          type="number"
          name="AccessoriesPrice"
          id="AccessoriesPrice"
          placeholder={form.accessoriesPrice?.toString()}
          value={form.accessoriesPrice}
          onChange={(e) =>
            setForm({ ...form, accessoriesPrice: Number(e.target.value) })
          }
        />
        <div className="text-red-500 mt-0 mb-1 text-xs">
          {errorEditAccessories.accessoriesPrice ?? (
            <p>{errorEditAccessories.accessoriesPrice}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function AccessoriesPrice({
  errorEditAccessories,
  form,
  setForm,
}: {
  errorEditAccessories: Record<string, string>;
  form: unitAccessoriesType;
  setForm: React.Dispatch<React.SetStateAction<unitAccessoriesType>>;
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
          {errorEditAccessories.price ?? <p>{errorEditAccessories.price}</p>}
        </div>
      </div>
    </div>
  );
}
