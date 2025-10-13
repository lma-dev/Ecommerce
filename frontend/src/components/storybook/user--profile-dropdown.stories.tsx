import type { Meta, StoryObj } from "@storybook/nextjs";
import { UserProfileDropdown } from "@/app/[locale]/_components/ui/user-profile-dropdown";

const meta: Meta<typeof UserProfileDropdown> = {
  title: "UI/UserProfileDropdown",
  component: UserProfileDropdown,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof UserProfileDropdown>;

export const Default: Story = {
  render: () => <UserProfileDropdown />,
};
