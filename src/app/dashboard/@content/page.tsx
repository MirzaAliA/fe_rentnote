import Link from "next/link";

export default function HomePage() {
  return (
    <div className="h-[200vh] overflow-y-auto w-auto py-12 px-12">
      <div className="flex flex-col justify-between gap-2">
        <h1 className="text-4xl">Selamat Datang, Mirza</h1>
        <p>Total transaksi hari ini sebanyak Rp. 500.000 dari 3 penyewa.</p>
      </div>
      <div className="flex flex-col rounded-3xl mt-8 shadow-[4px_8px_16px_rgba(0,0,0,0.30)]">
        <p className="my-4 mx-4">Tambah Transaksi</p>
        <div className="flex flex-row my-4 mx-4 gap-4">
          <Link
            className="py-4 px-4 rounded-xl shadow-[0px_8px_16px_-8px_rgba(0,0,0,0.30)]"
            href={""}
          >
            Motor
          </Link>
          <Link
            className="py-4 px-4 rounded-xl shadow-[0px_8px_16px_-8px_rgba(0,0,0,0.30)]"
            href={""}
          >
            Mobil
          </Link>
          <Link
            className="py-4 px-4 rounded-xl shadow-[0px_8px_16px_-8px_rgba(0,0,0,0.30)]"
            href={""}
          >
            Aksesoris
          </Link>
        </div>
      </div>
      <div className="flex flex-col rounded-3xl mt-4 shadow-[4px_8px_16px_rgba(0,0,0,0.30)]">
        <p className="my-4 mx-4">Tambah Unit</p>
        <div className="flex flex-row my-4 mx-4 gap-4">
          <Link
            className="py-4 px-4 rounded-xl shadow-[0px_8px_16px_-8px_rgba(0,0,0,0.30)]"
            href={""}
          >
            Motor
          </Link>
          <Link
            className="py-4 px-4 rounded-xl shadow-[0px_8px_16px_-8px_rgba(0,0,0,0.30)]"
            href={""}
          >
            Mobil
          </Link>
          <Link
            className="py-4 px-4 rounded-xl shadow-[0px_8px_16px_-8px_rgba(0,0,0,0.30)]"
            href={""}
          >
            Aksesoris
          </Link>
        </div>
      </div>
    </div>
  );
}
