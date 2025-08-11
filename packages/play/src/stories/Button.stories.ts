import type { Meta, StoryObj,ArgTypes } from '@storybook/vue3-vite';

import { expect, fn, userEvent, within } from 'storybook/test';

// 引入组件
import { VeButton } from "visual-element";

// 定义以下 Story 类型
type Story = StoryObj<typeof VeButton> & { argTypes: ArgTypes };

const meta: Meta<typeof VeButton> = {
  title: "Example/Button",
  component: VeButton,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: { type: "select" },
      options: ["primary", "success", "warning", "danger", "info", ""],
    },
    size: {
      control: { type: "select" },
      options: ["large", "default", "small", ""],
    },
    disabled: {
      control: "boolean",
    },
    loading: {
      control: "boolean",
    },
    useThrottle: {
      control: "boolean",
    },
    throttleDuration: {
      control: "number",
    },
    autofocus: {
      control: "boolean",
    },
    tag: {
      control: { type: "select" },
      options: ["button", "a", "div"],
    },
    nativeType: {
      control: { type: "select" },
      options: ["button", "submit", "reset", ""],
    },
    icon: {
      control: { type: "text" },
    },
    loadingIcon: {
      control: { type: "text" },
    },
  },
  args: { onClick: fn() },
};

const container = (val: string) => `
<div style="margin:5px">
  ${val}
</div>
`;

export const Default: Story & { args: { content: string } } = {
  argTypes: {
    content: {
      control: { type: "text" },
    },
  },
  args: {
    type: "primary",
    content: "Button",
  },
  render: (args:any) => ({
    components: { VeButton },
    setup() {
      return { args };
    },
    template: container(
      `<ve-button v-bind="args">{{args.content}}</ve-button>`
    ),
  }),
  play: async ({ canvasElement, args, step }: any) => {
    const canvas = within(canvasElement);
    await step("click button", async () => {
      await userEvent.tripleClick(canvas.getByRole("button"));
    });

    expect(args.onClick).toHaveBeenCalled();
  },
};

export default meta;
