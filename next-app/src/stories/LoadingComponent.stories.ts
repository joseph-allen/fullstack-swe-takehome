import type { Meta, StoryObj } from '@storybook/react';
import LoadingComponent from '@/components/LoadingComponent';

const meta = {
  title: 'Components/LoadingComponent',
  component: LoadingComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A loading indicator with optional animated ellipsis. Useful for showing progress during async operations or page loads.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: { type: 'text' },
      defaultValue: 'Loading...',
      description:
        'The text displayed below the spinner or next to the loading animation.',
    },
    withDots: {
      control: { type: 'boolean' },
      defaultValue: false,
      description:
        'If true, appends a pulsing animated ellipsis to the loading text.',
    },
  },
} satisfies Meta<typeof LoadingComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  args: {
    text: 'Loading...',
    withDots: false,
  },
};
