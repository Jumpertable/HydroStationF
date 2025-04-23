'use client';

import { logout } from '@/utils/clientLogout';

export default function LogoutButton() {
  return (
    <button onClick={logout} className="p-2 bg-red-500 text-white rounded shadow">
      Logout
    </button>
  );
}
