"use client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function PengaturanPage() {
  const router = useRouter();
  async function handleLogout() {
    logoutMutation.mutate();
  }

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await axios.post(
        "http://localhost:8000/api/v1/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
    },
    onSuccess: (res) => {
      console.log("✅ Logout Success:", res);
      router.push("/");
    },
    onError: (error) => {
      console.log("❌ Logout failed:", error);
    },
  });
  return (
    <div>
      <div className="flex flex-row justify-center items-center py-4 bg-[#4B49AC]">
        <h1 className="text-xl text-white font-bold">Pengaturan</h1>
      </div>

      <button
        onClick={handleLogout}
        className="flex flex-row justify-center items-center mb-4 mx-4 my-8 bg-[#4B49AC] rounded-xl"
      >
        <div className="flex justify-center items-center px-2 py-2">
          <p className="text-white">Logout</p>
        </div>
      </button>
    </div>
  );
}
