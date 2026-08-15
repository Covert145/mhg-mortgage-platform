import type { Meta, StoryObj } from "@storybook/react";
import { Modal, ModalTrigger, ModalContent, ModalTitle, ModalDescription, ModalClose } from "./Modal";
import { Button } from "./Button";

const meta: Meta<typeof Modal> = { title: "Primitives/Modal", component: Modal };
export default meta;
type Story = StoryObj<typeof Modal>;

export const ConfirmAction: Story = {
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button variant="destructive">Delete loan file</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalTitle>Delete this loan file?</ModalTitle>
        <ModalDescription>This cannot be undone. All associated documents and activity remain in the audit log.</ModalDescription>
        <div className="mt-4 flex justify-end gap-2">
          <ModalClose asChild>
            <Button variant="secondary">Cancel</Button>
          </ModalClose>
          <Button variant="destructive">Delete</Button>
        </div>
      </ModalContent>
    </Modal>
  ),
};
