import { z } from "zod";

export const tenantVehicle = z.object({
  name: z.string().min(1, { message: "Nama harus diisi" }),
  age: z.string().min(1, { message: "Umur tidak valid" }),
  email: z.email({ message: "Email tidak valid" }),
  phoneNumber: z
    .string()
    .regex(/^(?:\+62|62|0)8[1-9][0-9]{7,11}$/, "Nomor telepon tidak valid"),
  address: z.object({
    residentialAddress: z
      .string()
      .min(1, { message: "Alamat domisili harus diisi" }),
    originAddress: z.string().min(1, { message: "Alamat asal harus diisi" }),
  }),
  background: z.object({
    job: z.enum(["Mahasiswa", "ASN", "Swasta"]),
    institution: z.string().min(1, { message: "Nama institusi harus diisi" }),
    position: z.string().min(1, { message: "Posisi harus diisi" }),
  }),
  parentInformation: z.object({
    parentName: z.string().min(1, { message: "Nama orang tua harus diisi" }),
    parentPhoneNumber: z
      .string()
      .min(1, { message: "Nama orang tua harus diisi" }),
  }),
  collateral: z.object({
    amount: z.enum(["1", "2", "3", "4", "5"]),
    collateralType: z.string().min(1, { message: "Nama jaminan harus diisi" }),
  }),
  vehicleInformation: z.object({
    vehicle: z.string().min(1, { message: "Unit harus diisi" }),
    helmetAmount: z.number().min(0, { message: "Jumlah helm harus diisi" }),
    raincoatAmount: z.number().min(0, { message: "Jumlah helm harus diisi" }),
    rentalStartDate: z
      .string()
      .min(1, { message: "Tanggal mulai sewa harus diisi" }),
    rentalEndDate: z
      .string()
      .min(1, { message: "Tanggal berakhir sewa harus diisi" }),
  }),
  payment: z.object({
    paymentMethod: z.enum(["Cash", "Transfer", "QRIS"]),
    paidOff: z.enum(["Yes", "No", "Unknown"]),
    unpaidFees: z.number(),
    totalPriceAmount: z.number(),
  }),
  isActive: z.boolean(),
});

export type userTenantType = z.infer<typeof tenantVehicle>;
