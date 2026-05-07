"use client";

export default function LogoutButton() {
  return (
    <form action="/api/auth/logout" method="POST">
      <button
        type="submit"
        className="text-gray-400 hover:text-gray-300 text-xs transition"
      >
        Log out
      </button>
    </form>
  );
}
