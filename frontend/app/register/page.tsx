import { Card } from "@/components/ui/card";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center p-4">
      <Card size="sm" className="w-full max-w-sm">
        <RegisterForm />
      </Card>
    </main>
  );
}
