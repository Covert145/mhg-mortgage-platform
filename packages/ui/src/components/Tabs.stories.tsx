import type { Meta, StoryObj } from "@storybook/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./Tabs";

const meta: Meta<typeof Tabs> = { title: "Primitives/Tabs", component: Tabs };
export default meta;
type Story = StoryObj<typeof Tabs>;

export const ContactTimeline: Story = {
  render: () => (
    <Tabs defaultValue="activity" className="w-96">
      <TabsList>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="loans">Loans</TabsTrigger>
      </TabsList>
      <TabsContent value="activity">Recent calls, texts, and notes appear here.</TabsContent>
      <TabsContent value="documents">Requested and received documents appear here.</TabsContent>
      <TabsContent value="loans">This contact's loan files appear here.</TabsContent>
    </Tabs>
  ),
};
