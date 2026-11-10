import RegisterForm from "@/app/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center p-6">
      <div className="panel w-full max-w-sm p-5">
        <RegisterForm />
      </div>
    </main>
  );
}
