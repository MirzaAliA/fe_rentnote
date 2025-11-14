import axios from "axios";
import { userSessionType } from "../zod/userSession";

export async function verifySession() {
  const res = await axios.get("http://localhost:8000/api/v1/auth/session", {
    withCredentials: true,
  });

  if (!res.status) return null;
  return res;
}
