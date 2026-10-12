import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <h1>Admin Frontend</h1>

      <nav>
        <div>
          <Link href="/dashboard">Dashboard</Link>
        </div>

        <div>
          <Link href="/login">Login</Link>
        </div>
      </nav>
    </main>
  );
}
