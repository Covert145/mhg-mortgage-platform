import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./Card";
import { Button } from "./Button";

const meta: Meta<typeof Card> = { title: "Primitives/Card", component: Card };
export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Kris Covert</CardTitle>
        <CardDescription>Loan Officer · NMLS #123456</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-ink-600">3 active loan files, 2 documents pending review.</p>
      </CardContent>
      <CardFooter>
        <Button size="sm">View pipeline</Button>
      </CardFooter>
    </Card>
  ),
};
