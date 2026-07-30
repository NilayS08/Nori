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
      <div className="flex flex-col gap-1.5">
        <label htmlFor="user_type" className="text-sm font-medium">
          User type
        </label>
        <select
          id="user_type"
          value={data.user_type}
          onChange={(e) => onChange("user_type", e.target.value)}
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {userTypes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="monthly_income" className="text-sm font-medium">
          Monthly income
        </label>
        <Input
          id="monthly_income"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={data.monthly_income}
          onChange={(e) => onChange("monthly_income", e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="monthly_expenses" className="text-sm font-medium">
          Monthly expenses
        </label>
        <Input
          id="monthly_expenses"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={data.monthly_expenses}
          onChange={(e) => onChange("monthly_expenses", e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="current_savings" className="text-sm font-medium">
          Current savings
        </label>
        <Input
          id="current_savings"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={data.current_savings}
          onChange={(e) => onChange("current_savings", e.target.value)}
        />
      </div>
    </div>
  );
}
