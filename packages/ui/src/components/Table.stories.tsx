import type { Meta, StoryObj } from "@storybook/react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "./Table";
import { Badge } from "./Badge";

const meta: Meta<typeof Table> = { title: "Primitives/Table", component: Table };
export default meta;
type Story = StoryObj<typeof Table>;

export const LoanFiles: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Borrower</TableHead>
          <TableHead>Property Type</TableHead>
          <TableHead>Stage</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Jane Doe</TableCell>
          <TableCell>Manufactured Home In Park</TableCell>
          <TableCell><Badge variant="brand">Pre-Approved</Badge></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>John Smith</TableCell>
          <TableCell>Manufactured Home + Land</TableCell>
          <TableCell><Badge variant="success">Funded</Badge></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};
