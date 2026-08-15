import type { Meta, StoryObj } from "@storybook/react";
import { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription } from "./Toast";

const meta: Meta<typeof Toast> = { title: "Primitives/Toast", component: Toast };
export default meta;
type Story = StoryObj<typeof Toast>;

export const Success: Story = {
  render: () => (
    <ToastProvider>
      <Toast variant="success" open>
        <ToastTitle>Document uploaded</ToastTitle>
        <ToastDescription>Pay stub was received and marked pending review.</ToastDescription>
      </Toast>
      <ToastViewport />
    </ToastProvider>
  ),
};
