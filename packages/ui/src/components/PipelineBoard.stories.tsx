import type { Meta, StoryObj } from "@storybook/react";
import { PipelineBoard } from "./PipelineBoard";

const meta: Meta<typeof PipelineBoard> = { title: "Composite/PipelineBoard", component: PipelineBoard };
export default meta;
type Story = StoryObj<typeof PipelineBoard>;

export const Default: Story = {
  args: {
    columns: [
      { id: "new-lead", name: "New Lead", cards: [{ id: "1", title: "Jane Doe", subtitle: "Manufactured Home In Park" }] },
      {
        id: "app-sent",
        name: "Application Sent",
        cards: [
          { id: "2", title: "John Smith", subtitle: "Manufactured Home + Land", badge: "Chattel" },
          { id: "3", title: "Maria Garcia", subtitle: "Mobile Home In Park" },
        ],
      },
      { id: "pre-approved", name: "Pre-Approved", cards: [{ id: "4", title: "Alex Kim", subtitle: "SFR", badge: "Conventional" }] },
    ],
  },
};
