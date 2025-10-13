import type { Meta, StoryObj } from "@storybook/nextjs";
import { AppIcon } from "@/app/[locale]/_components/ui/app-icon";
import { Bell } from "lucide-react";

const meta: Meta<typeof AppIcon> = {
  title: "UI/AppIcon",
  component: AppIcon,
  tags: ["autodocs"],
  argTypes: {
    icon: { table: { disable: true } },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    strokeWidth: {
      control: { type: "range", min: 0.5, max: 4, step: 0.5 },
    },
    variant: {
      control: "select",
      options: ["primary", "muted", "destructive"],
    },
    className: { control: "text" },
  },
};

export default meta;

type Story = StoryObj<typeof AppIcon>;

export const Default: Story = {
  args: {
    icon: Bell,
    size: "md",
    strokeWidth: 1.5,
    variant: "muted",
    className: "",
  },
};
