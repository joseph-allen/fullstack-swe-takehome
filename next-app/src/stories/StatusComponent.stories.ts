import type { Meta, StoryObj } from '@storybook/react';
import StatusComponent from '@/components/StatusComponent';

const meta = {
  title: 'Components/StatusComponent',
  component: StatusComponent,
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
  argTypes: {
    state: {
      control: { type: 'select' },
      options: ['idle', 'inQueue', 'readyToCheckIn'],
      defaultValue: 'idle',
      description:
        'The current state of the reservation or queue. Can be "idle", "in queue", or "ready to check in".',
    },
    estimateInMinutes: {
      control: { type: 'number' },
      defaultValue: 0,
      description:
        'The estimated wait time in minutes. If negative, it will be displayed as "0 minute wait".',
    },
    name: {
      control: { type: 'text' },
      defaultValue: '',
      description:
        'The name of the party. If set, it will be displayed in the status message.',
    },
    partyID: {
      control: { type: 'number' },
      defaultValue: undefined,
      description:
        'The unique identifier for the party. If set, it will be displayed in the status message.',
    },
  },
} satisfies Meta<typeof StatusComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  args: {
    state: 'idle',
    estimateInMinutes: 25,
    name: 'The Smiths',
    partyID: '123',
  },
};
