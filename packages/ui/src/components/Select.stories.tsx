import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "./Select";

const meta: Meta<typeof Select> = { title: "Primitives/Select", component: Select };
export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: (args) => (
    <Select {...args}>
      <option value="mobile_home_in_park">Mobile Home In Park</option>
      <option value="manufactured_home_in_park">Manufactured Home In Park</option>
      <option value="manufactured_home_with_land">Manufactured Home + Land</option>
      <option value="sfr">SFR</option>
    </Select>
  ),
};
