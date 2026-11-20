import Avatar from './Avatar';

const meta = {
  title: 'UI/Avatar',
  component: Avatar,
  args: { name: 'Dimas Saputra', size: 'md' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;

export const WithInitials = {};

export const WithImage = {
  args: { url: 'https://ui-avatars.com/api/?name=Dimas+Saputra&background=random' },
};

export const Small = {
  args: { size: 'sm', name: 'Ruang Kode' },
};
