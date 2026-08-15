import type { Meta, StoryObj } from "@storybook/react";
import { StatWidget } from "./StatWidget";

const meta: Meta<typeof StatWidget> = { title: "Composite/StatWidget", component: StatWidget };
export default meta;
type Story = StoryObj<typeof StatWidget>;

export const PipelineVolume: Story = {
  args: { label: "Active Pipeline Volume", value: "$4.2M", trend: { direction: "up", label: "+12% vs last month" } },
};

export const ClosingRate: Story = {
  args: { label: "Closing Rate", value: "68%", trend: { direction: "down", label: "-3% vs last month" } },
};
