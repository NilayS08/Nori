import { AuthShell } from "@/components/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthShell title="Create an account" subtitle="Start knowing your safe-to-spend in minutes">
      <RegisterForm />
    </AuthShell>
  );
}
