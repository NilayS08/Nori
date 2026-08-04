import { AuthShell } from "@/components/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthShell title="Welcome back" subtitle="Enter your credentials to continue">
      <LoginForm />
    </AuthShell>
  );
}
