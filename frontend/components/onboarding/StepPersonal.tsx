import { FormField } from "@/components/FormField";
import { Input } from "@/components/ui/input";

interface StepPersonalProps {
  data: {
    user_type: string;
    monthly_income: string;
    monthly_expenses: string;
    current_savings: string;
  };
  onChange: (field: string, value: string) => void;
}

const userTypes = [
  { value: "personal", label: "Personal" },
  { value: "professional", label: "Professional" },
  { value: "freelancer", label: "Freelancer" },
  { value: "student", label: "Student" },
];

export function StepPersonal({ data, onChange }: StepPersonalProps) {
  return (
    <div className="flex flex-col gap-4">
      <FormField label="I am a" htmlFor="user_type">
        <select
          id="user_type"
          value={data.user_type}
          onChange={(e) => onChange("user_type", e.target.value)}
          className="h-9 w-full rounded-[14px] border border-input bg-white/[0.03] px-3 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {userTypes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </FormField>

      <FormField
        label="Monthly income"
        htmlFor="monthly_income"
        hint="After taxes, if it varies use an average"
      >
        <Input
          id="monthly_income"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={data.monthly_income}
          onChange={(e) => onChange("monthly_income", e.target.value)}
        />
      </FormField>

      <FormField
        label="Monthly expenses"
        htmlFor="monthly_expenses"
        hint="Rent, bills, groceries — everything you spend"
      >
        <Input
          id="monthly_expenses"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={data.monthly_expenses}
          onChange={(e) => onChange("monthly_expenses", e.target.value)}
        />
      </FormField>

      <FormField label="Current savings" htmlFor="current_savings">
        <Input
          id="current_savings"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={data.current_savings}
          onChange={(e) => onChange("current_savings", e.target.value)}
        />
      </FormField>
    </div>
  );
}
