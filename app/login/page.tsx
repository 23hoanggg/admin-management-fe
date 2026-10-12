import LoginForm from "@/app/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded border bg-white p-6">
        <LoginForm />
      </div>
    </main>
  );
}
