import AuthModal from "@/app/components/auth/AuthModal";
import LoginForm from "@/app/components/auth/LoginForm";

export default function LoginModalPage() {
  return (
    <AuthModal>
      <LoginForm isModal />
    </AuthModal>
  );
}
