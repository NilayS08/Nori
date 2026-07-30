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
      <div className="flex flex-col gap-1.5">
        <label htmlFor="goal_title" className="text-sm font-medium">
          Goal name
        </label>
        <Input
          id="goal_title"
          placeholder="Emergency Fund"
          value={data.goal_title}
          onChange={(e) => onChange("goal_title", e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="goal_target_amount" className="text-sm font-medium">
          Target amount
        </label>
        <Input
          id="goal_target_amount"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={data.goal_target_amount}
          onChange={(e) => onChange("goal_target_amount", e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="goal_deadline" className="text-sm font-medium">
          Target deadline
        </label>
        <Input
          id="goal_deadline"
          type="date"
          value={data.goal_deadline}
          onChange={(e) => onChange("goal_deadline", e.target.value)}
        />
      </div>
    </div>
  );
}
