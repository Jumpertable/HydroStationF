export async function logout() {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
      });
      if (res.ok) {
        window.location.href = "/login"; // OR router.push("/login")
      } else {
        console.error("Logout failed:", await res.json());
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  }
  