import { FormField } from "@/components/FormField";
import { Input } from "@/components/ui/input";

interface StepGoalProps {
  data: {
    goal_title: string;
    goal_target_amount: string;
    goal_deadline: string;
  };
  onChange: (field: string, value: string) => void;
}

export function StepGoal({ data, onChange }: StepGoalProps) {
  return (
    <div className="flex flex-col gap-4">
      <FormField
        label="Goal name"
        htmlFor="goal_title"
        hint="What are you saving for?"
      >
        <Input
          id="goal_title"
          placeholder="Emergency Fund"
          value={data.goal_title}
          onChange={(e) => onChange("goal_title", e.target.value)}
        />
      </FormField>

      <FormField label="Target amount" htmlFor="goal_target_amount">
        <Input
          id="goal_target_amount"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={data.goal_target_amount}
          onChange={(e) => onChange("goal_target_amount", e.target.value)}
        />
      </FormField>

      <FormField label="Target deadline" htmlFor="goal_deadline">
        <Input
          id="goal_deadline"
          type="date"
          value={data.goal_deadline}
          onChange={(e) => onChange("goal_deadline", e.target.value)}
          className="[color-scheme:dark]"
        />
      </FormField>
    </div>
  );
}
