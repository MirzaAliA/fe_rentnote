"use client";
import {
  unitAccessoriesArrayType,
  unitVehicle,
  unitVehicleArrayType,
  unitVehicleType,
} from "@/lib/zod/unitSchema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { tenantVehicle, userTenantType } from "@/lib/zod/tenantSchema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formStepsConfig } from "@/lib/config/config";

export default function AddTenantAccessoriesPage() {
  const [errorAddTenantAccessories, setErrorAddTenantAccessories] = useState<
    Record<string, string>
  >({});
  const [pageCounter, setPageCounter] = useState<number>(1);
  const totalPage = formStepsConfig.tenantVehicle.length;
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

  console.log(errorAddTenantAccessories);

  // Get Vehicle API
  const queryUnitAccessoriesData = useQuery({
    queryKey: ["unit"],
    queryFn: async () => {
      return await axios.get(`http://localhost:8000/api/v1/accessories`, {
        withCredentials: true,
      });
    },
  });

  const queryAccessories = queryUnitAccessoriesData.data?.data.data ?? [];

  // Add Tenant API
  const AddTenantAccessoriesMutation = useMutation({
    mutationFn: async (data: userTenantType) => {
      return await axios.post("http://localhost:8000/api/v1/tenant", data, {
        withCredentials: true,
      });
    },
    onSuccess: (res) => {
      console.log("✅ Add Tenant success:", res.data);
      alert("Berhasil menambahkan Penyewa baru");
      router.push("/dashboard");
    },
    onError: (error) => {
      console.log("❌ Add Tenant Failed:", error);
      const newError: Record<string, string> = {};
      if (axios.isAxiosError(error)) {
        const field = error.response?.data.errorType.join(".");
        newError[field] = error.response?.data.message as string;
        setErrorAddTenantAccessories(newError);
      } else {
        console.log("Error tidak diketahui");
      }
    },
  });

  // Add Tenant Form Validation
  function handleAddTenantAccessories(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const AddTenantAccessoriesForm = new FormData(e.currentTarget);

    const AddTenantAccessoriesData = {
      name: AddTenantAccessoriesForm.get("TenantName"),
      age: AddTenantAccessoriesForm.get("TenantAge"),
      email: AddTenantAccessoriesForm.get("TenantEmail"),
      phoneNumber: AddTenantAccessoriesForm.get("TenantPhoneNumber"),
      address: {
        residentialAddress: AddTenantAccessoriesForm.get(
          "TenantResidentialAddress"
        ),
        originAddress: AddTenantAccessoriesForm.get("TenantOriginAddress"),
      },
      background: {
        job: AddTenantAccessoriesForm.get("TenantBackgroundJob"),
        institution: AddTenantAccessoriesForm.get(
          "TenantBackgroundInstitution"
        ),
        position: AddTenantAccessoriesForm.get("TenantBackgroundPosition"),
      },
      parentInformation: {
        parentName: AddTenantAccessoriesForm.get("TenantParentName"),
        parentPhoneNumber: AddTenantAccessoriesForm.get(
          "TenantParentPhoneNumber"
        ),
      },
      collateral: {
        amount: AddTenantAccessoriesForm.get("TenantCollateralAmount"),
        collateralType: AddTenantAccessoriesForm.get("TenantCollateralType"),
      },
      vehicleInformation: {
        vehicle: AddTenantAccessoriesForm.get("TenantVehicleID"),
        helmetAmount: Number(
          AddTenantAccessoriesForm.get("TenantHelmetAmount")
        ),
        raincoatAmount: Number(
          AddTenantAccessoriesForm.get("TenantRaincoatAmount")
        ),
        rentalStartDate: AddTenantAccessoriesForm.get("TenantRentalStartDate"),
        rentalEndDate: AddTenantAccessoriesForm.get("TenantRentalEndDate"),
      },
      payment: {
        paymentMethod: AddTenantAccessoriesForm.get("TenantPaymentMethod"),
        paidOff: AddTenantAccessoriesForm.get("TenantPaidOff"),
        unpaidFees: Number(AddTenantAccessoriesForm.get("TenantUnpaidFees")),
        totalPriceAmount: 0,
      },
      isActive: true,
    };

    console.log(AddTenantAccessoriesData);

    const validatedAddTenantAccessoriesData = tenantVehicle.safeParse(
      AddTenantAccessoriesData
    );
    if (!validatedAddTenantAccessoriesData.success) {
      validatedAddTenantAccessoriesData.error;

      const newErrors: Record<string, string> = {};

      validatedAddTenantAccessoriesData.error?.issues.forEach((issue) => {
        const field = issue.path.join(".");
        newErrors[field] = issue.message;
      });

      setErrorAddTenantAccessories(newErrors);
    } else {
      validatedAddTenantAccessoriesData.success;
      setErrorAddTenantAccessories({});
      AddTenantAccessoriesMutation.mutate(
        validatedAddTenantAccessoriesData.data
      );
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
            Form Tambah Penyewa Aksesoris
          </div>
        </div>
        <div className="w-full">
          <form action="" method="post" onSubmit={handleAddTenantAccessories}>
            <div className={pageCounter === 1 ? "block" : "hidden"}>
              <VehicleTenantData
                errorAddTenantAccessories={errorAddTenantAccessories}
                queryAccessories={queryAccessories}
              />
            </div>
            <div className={pageCounter === 2 ? "block" : "hidden"}>
              <UserTenantData
                errorAddTenantAccessories={errorAddTenantAccessories}
              />
            </div>
            <div className={pageCounter === 3 ? "block" : "hidden"}>
              <PaymentTenantData
                errorAddTenantAccessories={errorAddTenantAccessories}
              />
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
  errorAddTenantAccessories: Record<string, string>;
};

function VehicleTenantData({
  errorAddTenantAccessories,
  queryAccessories,
}: {
  errorAddTenantAccessories: Record<string, string>;
  queryAccessories: unitAccessoriesArrayType;
}) {
  return (
    <div className="flex flex-col justify-center">
      <div className="px-4 mt-3 mb-1">
        <h2 className="font-bold">Data Aksesoris</h2>
      </div>
      <div className="flex flex-col justify-center px-8">
        <label className="mt-2 mb-1" htmlFor="VehicleBrand">
          Aksesoris
        </label>
        <Select name="TenantVehicleID">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pilih Unit" />
          </SelectTrigger>
          <SelectContent>
            {queryAccessories?.map((accessory, i) => (
              <SelectItem
                key={i}
                className="flex flex-col"
                value={`${accessory._id}`}
              >
                <div className="">
                  <span>
                    {accessory.name} {accessory.brand}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="text-red-500 mt-0 mb-1 text-xs">
          {errorAddTenantAccessories["vehicleInformation.vehicle"] ?? (
            <p>{errorAddTenantAccessories["vehicleInformation.vehicle"]}</p>
          )}
        </div>
        <label className="mt-2 mb-1" htmlFor="VehicleBrand">
          Jumlah Helm
        </label>
        <Select name="TenantHelmetAmount">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Jumlah Helm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">
              <span>0</span>
            </SelectItem>
            <SelectItem value="1">
              <span>1</span>
            </SelectItem>
            <SelectItem value="2">
              <span>2</span>
            </SelectItem>
          </SelectContent>
        </Select>
        <div className="text-red-500 mt-0 mb-1 text-xs">
          {errorAddTenantAccessories["vehicleInformation.helmetAmount"] ?? (
            <p>
              {errorAddTenantAccessories["vehicleInformation.helmetAmount"]}
            </p>
          )}
        </div>
        <label className="mt-2 mb-1" htmlFor="VehicleBrand">
          Jumlah Jas Hujan
        </label>
        <Select name="TenantRaincoatAmount">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Jumlah Jas Hujan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">
              <span>0</span>
            </SelectItem>
            <SelectItem value="1">
              <span>1</span>
            </SelectItem>
            <SelectItem value="2">
              <span>2</span>
            </SelectItem>
          </SelectContent>
        </Select>
        <div className="text-red-500 mt-0 mb-1 text-xs">
          {errorAddTenantAccessories["vehicleInformation.raincoatAmount"] ?? (
            <p>
              {errorAddTenantAccessories["vehicleInformation.raincoatAmount"]}
            </p>
          )}
        </div>
        <label className="mt-2 mb-1" htmlFor="PlateNumber">
          Tanggal Mulai Sewa
        </label>
        <input
          type="datetime-local"
          name="TenantRentalStartDate"
          id="TenantRentalStartDate"
        />
        <div className="text-red-500 mt-0 mb-1 text-xs">
          {errorAddTenantAccessories["vehicleInformation.rentalStartDate"] ?? (
            <p>
              {errorAddTenantAccessories["vehicleInformation.rentalStartDate"]}
            </p>
          )}
        </div>
        <label className="mt-2 mb-1" htmlFor="PlateNumber">
          Tanggal Berakhir Sewa
        </label>
        <input
          type="datetime-local"
          name="TenantRentalEndDate"
          id="TenantRentalEndDate"
        />
        <div className="text-red-500 mt-0 mb-1 text-xs">
          {errorAddTenantAccessories["vehicleInformation.rentalEndDate"] ?? (
            <p>
              {errorAddTenantAccessories["vehicleInformation.rentalEndDate"]}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function UserTenantData({ errorAddTenantAccessories }: VehicleDataProps) {
  return (
    <div className="flex flex-col justify-center">
      <div className="px-4 mt-3 mb-1">
        <h2 className="font-bold">Data Penyewa</h2>
      </div>
      <div className="flex flex-col justify-center px-8">
        <label className="mt-2 mb-1" htmlFor="TenantName">
          Nama
        </label>
        <input
          className="rounded-2xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B49AC]"
          type="text"
          name="TenantName"
          id="TenantName"
          placeholder="Masukkan nama lengkap anda..."
        />
        <div className="text-red-500 mt-0 mb-1 text-xs">
          {errorAddTenantAccessories["name"] ?? (
            <p>{errorAddTenantAccessories["name"]}</p>
          )}
        </div>
        <label className="mt-2 mb-1" htmlFor="TenantAge">
          Usia
        </label>
        <input
          className="rounded-2xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B49AC]"
          type="text"
          name="TenantAge"
          id="TenantAge"
          placeholder="Masukkan usia anda..."
        />
        <div className="text-red-500 mt-0 mb-1 text-xs">
          {errorAddTenantAccessories["age"] ?? (
            <p>{errorAddTenantAccessories["age"]}</p>
          )}
        </div>
        <label className="mt-2 mb-1" htmlFor="TenantEmail">
          Email
        </label>
        <input
          className="rounded-2xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B49AC]"
          type="text"
          name="TenantEmail"
          id="TenantEmail"
          placeholder="Masukkan alamat email anda..."
        />
        <div className="text-red-500 mt-0 mb-1 text-xs">
          {errorAddTenantAccessories["email"] ?? (
            <p>{errorAddTenantAccessories["email"]}</p>
          )}
        </div>
        <label className="mt-2 mb-1" htmlFor="TenantPhoneNumber">
          Nomor Telepon Whatsapp
        </label>
        <input
          className="rounded-2xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B49AC]"
          type="number"
          name="TenantPhoneNumber"
          id="TenantPhoneNumber"
          placeholder="Masukkan nomor telepon anda..."
        />
        <div className="text-red-500 mt-0 mb-1 text-xs">
          {errorAddTenantAccessories["phoneNumber"] ?? (
            <p>{errorAddTenantAccessories["phoneNumber"]}</p>
          )}
        </div>
      </div>
      <div className="px-4 mt-3 mb-1">
        <h2 className="font-bold">Alamat</h2>
      </div>
      <div className="flex flex-col justify-center px-8">
        <label className="mt-2 mb-1" htmlFor="TenantOriginAddress">
          Alamat Asal
        </label>
        <input
          className="rounded-2xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B49AC]"
          type="text"
          name="TenantOriginAddress"
          id="TenantOriginAddress"
          placeholder="Masukkan alamat asal anda..."
        />
        <div className="text-red-500 mt-0 mb-1 text-xs">
          {errorAddTenantAccessories["address.originAddress"] ?? (
            <p>{errorAddTenantAccessories["address.originAddress"]}</p>
          )}
        </div>
        <label className="mt-2 mb-1" htmlFor="TenantResidentialAddress">
          Alamat Di Semarang
        </label>
        <input
          className="rounded-2xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B49AC]"
          type="text"
          name="TenantResidentialAddress"
          id="TenantResidentialAddress"
          placeholder="Masukkan alamat domisili anda..."
        />
        <div className="text-red-500 mt-0 mb-1 text-xs">
          {errorAddTenantAccessories["address.residentialAddress"] ?? (
            <p>{errorAddTenantAccessories["address.residentialAddress"]}</p>
          )}
        </div>
      </div>
      <div className="px-4 mt-3 mb-1">
        <h2 className="font-bold">Latar Belakang</h2>
      </div>
      <div className="flex flex-col justify-center px-8">
        <label className="mt-2 mb-1" htmlFor="TenantBackgroundJob">
          Pekerjaan/Status
        </label>
        <Select name="TenantBackgroundJob">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pilih Pekerjaan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Mahasiswa">
              <span>Mahasiswa</span>
            </SelectItem>
            <SelectItem value="ASN">
              <span>ASN</span>
            </SelectItem>
            <SelectItem value="Swasta">
              <span>Swasta</span>
            </SelectItem>
          </SelectContent>
        </Select>
        <div className="text-red-500 mt-0 mb-1 text-xs">
          {errorAddTenantAccessories["background.job"] ?? (
            <p>{errorAddTenantAccessories["background.job"]}</p>
          )}
        </div>
        <label className="mt-2 mb-1" htmlFor="TenantBackgroundInstitution">
          Nama Institusi
        </label>
        <input
          className="rounded-2xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B49AC]"
          type="text"
          name="TenantBackgroundInstitution"
          id="TenantBackgroundInstitution"
          placeholder="Masukkan universitas/kantor anda..."
        />
        <div className="text-red-500 mt-0 mb-1 text-xs">
          {errorAddTenantAccessories["background.institution"] ?? (
            <p>{errorAddTenantAccessories["background.institution"]}</p>
          )}
        </div>
        <label className="mt-2 mb-1" htmlFor="TenantBackgroundPosition">
          Posisi
        </label>
        <input
          className="rounded-2xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B49AC]"
          type="text"
          name="TenantBackgroundPosition"
          id="TenantBackgroundPosition"
          placeholder="Masukkan posisi/pangkat anda..."
        />
        <div className="text-red-500 mt-0 mb-1 text-xs">
          {errorAddTenantAccessories["background.position"] ?? (
            <p>{errorAddTenantAccessories["background.position"]}</p>
          )}
        </div>
      </div>
      <div className="px-4 mt-3 mb-1">
        <h2 className="font-bold">Data Keluarga/Kolega</h2>
      </div>
      <div className="flex flex-col justify-center px-8">
        <label className="mt-2 mb-1" htmlFor="TenantParentName">
          Nama Orang Tua/Kolega
        </label>
        <input
          className="rounded-2xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B49AC]"
          type="text"
          name="TenantParentName"
          id="TenantParentName"
          placeholder="Masukkan nama orang tua/kolega anda..."
        />
        <div className="text-red-500 mt-0 mb-1 text-xs">
          {errorAddTenantAccessories["parentInformation.parentName"] ?? (
            <p>{errorAddTenantAccessories["parentInformation.parentName"]}</p>
          )}
        </div>
        <label className="mt-2 mb-1" htmlFor="TenantParentPhoneNumber">
          Nomor Telepon Orang Tua/Kolega
        </label>
        <input
          className="rounded-2xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B49AC]"
          type="text"
          name="TenantParentPhoneNumber"
          id="TenantParentPhoneNumber"
          placeholder="Masukkan nomor telepon..."
        />
        <div className="text-red-500 mt-0 mb-1 text-xs">
          {errorAddTenantAccessories["parentInformation.parentPhoneNumber"] ?? (
            <p>
              {errorAddTenantAccessories["parentInformation.parentPhoneNumber"]}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function PaymentTenantData({ errorAddTenantAccessories }: VehicleDataProps) {
  return (
    <div className="flex flex-col justify-center">
      <div className="px-4 mt-3 mb-1">
        <h2 className="font-bold">Jaminan</h2>
      </div>
      <div className="flex flex-col justify-center px-8">
        <label className="mt-2 mb-1" htmlFor="TenantCollateralAmount">
          Jumlah Jaminan
        </label>
        <Select name="TenantCollateralAmount">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Jumlah Jaminan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">
              <span>1</span>
            </SelectItem>
            <SelectItem value="2">
              <span>2</span>
            </SelectItem>
            <SelectItem value="3">
              <span>3</span>
            </SelectItem>
            <SelectItem value="4">
              <span>4</span>
            </SelectItem>
            <SelectItem value="5">
              <span>5</span>
            </SelectItem>
          </SelectContent>
        </Select>
        <div className="text-red-500 mt-0 mb-1 text-xs">
          {errorAddTenantAccessories["collateral.amount"] ?? (
            <p>{errorAddTenantAccessories["collateral.amount"]}</p>
          )}
        </div>
        <label className="mt-2 mb-1" htmlFor="TenantCollateralType">
          Jenis Jaminan
        </label>
        <input
          className="rounded-2xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B49AC]"
          type="text"
          name="TenantCollateralType"
          id="TenantCollateralType"
          placeholder="Masukkan jaminan anda... (KTP, SIM A, ...)"
        />
        <div className="text-red-500 mt-0 mb-1 text-xs">
          {errorAddTenantAccessories["collateral.collateralType"] ?? (
            <p>{errorAddTenantAccessories["collateral.collateralType"]}</p>
          )}
        </div>
      </div>
      <div className="px-4 mt-3 mb-1">
        <h2 className="font-bold">Pembayaran</h2>
      </div>
      <div className="flex flex-col justify-center px-8">
        <label className="mt-2 mb-1" htmlFor="TenantPaymentMethod">
          Metode Pembayaran
        </label>
        <Select name="TenantPaymentMethod">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pilih metode pembayaran" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Cash">
              <span>Cash</span>
            </SelectItem>
            <SelectItem value="Transfer">
              <span>Transfer</span>
            </SelectItem>
            <SelectItem value="QRIS">
              <span>QRIS</span>
            </SelectItem>
          </SelectContent>
        </Select>
        <div className="text-red-500 mt-0 mb-1 text-xs">
          {errorAddTenantAccessories["payment.paymentMethod"] ?? (
            <p>{errorAddTenantAccessories["payment.paymentMethod"]}</p>
          )}
        </div>
        <label className="mt-2 mb-1" htmlFor="TenantPaidOff">
          Pembayaran Lunas?
        </label>
        <Select name="TenantPaidOff">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pilih" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Yes">
              <span>Ya</span>
            </SelectItem>
            <SelectItem value="No">
              <span>Belum</span>
            </SelectItem>
            <SelectItem value="Unknown">
              <span>Tidak Yakin</span>
            </SelectItem>
          </SelectContent>
        </Select>
        <div className="text-red-500 mt-0 mb-1 text-xs">
          {errorAddTenantAccessories["payment.paidOff"] ?? (
            <p>{errorAddTenantAccessories["payment.paidOff"]}</p>
          )}
        </div>
        <label className="mt-2 mb-1" htmlFor="TenantUnpaidFees">
          Jumlah Belum Dibayar
        </label>
        <input
          className="rounded-2xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B49AC]"
          type="text"
          name="TenantUnpaidFees"
          id="TenantUnpaidFees"
          placeholder="Masukkan jumlah yang belum dibayar..."
        />
        <div className="text-red-500 mt-0 mb-1 text-xs">
          {errorAddTenantAccessories["payment.unpaidFees"] ?? (
            <p>{errorAddTenantAccessories["payment.unpaidFees"]}</p>
          )}
        </div>
      </div>
    </div>
  );
}
