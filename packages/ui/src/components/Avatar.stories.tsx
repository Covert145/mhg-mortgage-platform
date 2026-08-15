import type { Meta, StoryObj } from "@storybook/react";
import { Avatar, AvatarImage, AvatarFallback } from "./Avatar";

const meta: Meta<typeof Avatar> = { title: "Primitives/Avatar", component: Avatar };
export default meta;
type Story = StoryObj<typeof Avatar>;

export const Fallback: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="" alt="Kris Covert" />
      <AvatarFallback>KC</AvatarFallback>
    </Avatar>
  ),
};
