import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = { title: "Primitives/Badge (StatusPill)", component: Badge, args: { children: "Pre-Approved" } };
export default meta;
type Story = StoryObj<typeof Badge>;

export const Neutral: Story = { args: { variant: "neutral" } };
export const Brand: Story = { args: { variant: "brand" } };
export const Success: Story = { args: { variant: "success", children: "Funded" } };
export const Warning: Story = { args: { variant: "warning", children: "Documents Requested" } };
export const Danger: Story = { args: { variant: "danger", children: "Denied" } };
export const Info: Story = { args: { variant: "info", children: "Nurture" } };
