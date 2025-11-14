import z from "zod";

export const unitVehicle = z.object({
  name: z.string().min(1, { message: "Format nama kendaraan tidak valid" }),
  brand: z.string().min(1, { message: "Format brand kendaraan tidak valid" }),
  plateNumber: z.string().min(1, { message: "Format plat nomor tidak valid" }),
  year: z.number().min(1, { message: "Format tahun kendaraan tidak valid" }),
  price: z.object({
    perHour: z
      .number()
      .min(1, { message: "Format harga kendaraan perjam tidak valid" }),
    perDay: z
      .number()
      .min(1, { message: "Format harga kendaraan perhari tidak valid" }),
    perWeek: z
      .number()
      .min(1, { message: "Format harga kendaraan perminggu tidak valid" }),
    perMonth: z
      .number()
      .min(1, { message: "Format harga kendaraan perbulan tidak valid" }),
  }),
  vehicleStatus: z.enum(["Ready", "Rented", "Maintenance"]),
  vehicleType: z.enum(["Car", "Bike"]),
});

export const unitAccessories = z.object({
  name: z.string().min(1, { message: "Format nama aksesoris tidak valid" }),
  brand: z.string().min(1, { message: "Format brand aksesoris tidak valid" }),
  amount: z.number().min(1, { message: "Format jumlah aksesoris tidak valid" }),
  accessoriesPrice: z
    .number()
    .min(1, { message: "Format harga aksesoris tidak valid" }),
  price: z.object({
    perHour: z
      .number()
      .min(1, { message: "Format harga aksesoris perjam tidak valid" }),
    perDay: z
      .number()
      .min(1, { message: "Format harga aksesoris perhari tidak valid" }),
    perWeek: z
      .number()
      .min(1, { message: "Format harga aksesoris perminggu tidak valid" }),
    perMonth: z
      .number()
      .min(1, { message: "Format harga aksesoris perbulan tidak valid" }),
  }),
});

export type unitVehicleType = z.infer<typeof unitVehicle>;
export type unitAccessoriesType = z.infer<typeof unitAccessories>;
