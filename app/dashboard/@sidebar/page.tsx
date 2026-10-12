import Link from "next/link";

export default function SidebarSlot() {
  return (
    <nav className="flex flex-col space-y-3">
      <Link href="/dashboard">Dashboard</Link>

      <Link href="/dashboard">Users</Link>

      <Link href="/dashboard">Jobs</Link>

      <Link href="/dashboard">Product</Link>

      <Link href="/dashboard">Admin</Link>

      <Link href="/login">Login</Link>

      <Link href="/register">Register</Link>
    </nav>
  );
}
