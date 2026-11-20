import { fn } from '@storybook/test';
import { EmptyState, ErrorState, LoadingState } from './StatusViews';

const meta = {
  title: 'UI/StatusViews',
  component: ErrorState,
};

export default meta;

export const ErrorMessage = {
  args: { message: 'Diskusi tidak ditemukan.' },
};

export const ErrorWithRetry = {
  args: { message: 'Tidak dapat terhubung ke server.', onRetry: fn() },
};

export const Empty = {
  render: () => <EmptyState />,
};

export const Loading = {
  render: () => <LoadingState label="Sedang memuat diskusi..." />,
};
