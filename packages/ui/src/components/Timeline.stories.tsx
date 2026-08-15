import type { Meta, StoryObj } from "@storybook/react";
import { Timeline } from "./Timeline";

const meta: Meta<typeof Timeline> = { title: "Composite/Timeline", component: Timeline };
export default meta;
type Story = StoryObj<typeof Timeline>;

export const ContactActivity: Story = {
  args: {
    items: [
      { id: "1", title: "Application started", timestamp: "2 hours ago", description: "Jane Doe began the online application." },
      { id: "2", title: "SMS sent", timestamp: "Yesterday", description: "\"Thanks for your interest — when's a good time to talk?\"" },
      { id: "3", title: "Lead created", timestamp: "3 days ago", description: "Source: Get Approved form" },
    ],
  },
};
