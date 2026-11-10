import LoginForm from "@/app/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center p-6">
      <div className="panel w-full max-w-sm p-5">
        <LoginForm />
      </div>
    </main>
  );
}
