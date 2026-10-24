import LoginForm from "@/app/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded border bg-card p-6 text-card-foreground">
        <LoginForm />
      </div>
    </main>
  );
}
