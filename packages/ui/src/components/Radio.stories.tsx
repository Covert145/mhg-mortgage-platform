import type { Meta, StoryObj } from "@storybook/react";
import { RadioGroup, RadioItem } from "./Radio";

const meta: Meta<typeof RadioGroup> = { title: "Primitives/Radio", component: RadioGroup };
export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const OccupancyType: Story = {
  render: () => (
    <RadioGroup defaultValue="primary" className="flex flex-col gap-2">
      {[
        { value: "primary", label: "Primary" },
        { value: "secondary", label: "Secondary" },
        { value: "investment", label: "Investment" },
        { value: "buy_for_someone", label: "Buy For Someone" },
      ].map((opt) => (
        <label key={opt.value} className="flex items-center gap-2 text-sm text-ink-800">
          <RadioItem value={opt.value} />
          {opt.label}
        </label>
      ))}
    </RadioGroup>
  ),
};
