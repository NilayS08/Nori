import { Card } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center p-4">
      <Card size="sm" className="w-full max-w-sm">
        <LoginForm />
      </Card>
    </main>
  );
}
