import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function useManagerAuth() {
  const router = useRouter();

  useEffect(() => {
    const isManager = localStorage.getItem("managerID");
    if (!isManager) {
      router.push("/login/manager");
    }
  }, []);
}
