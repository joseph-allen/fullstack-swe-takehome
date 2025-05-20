import type { Meta, StoryObj } from '@storybook/react';
import TableForm from '@/components/TableForm';

const meta = {
  title: 'Components/TableForm',
  component: TableForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A component that displays the status of a queue or reservation system. It shows the current state, estimated wait time, and optional party ID and name.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof TableForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  args: {},
};
