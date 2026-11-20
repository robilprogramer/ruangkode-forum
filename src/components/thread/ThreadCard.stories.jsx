import ThreadCard from './ThreadCard';

const owner = {
  id: 'user-1',
  name: 'Dimas Saputra',
  avatar: 'https://ui-avatars.com/api/?name=Dimas+Saputra&background=random',
};

const thread = {
  id: 'thread-1',
  title: 'Bagaimana pengalamanmu belajar Redux?',
  body: 'Coba ceritakan dong, gimana pengalaman kalian belajar Redux di Dicoding?',
  category: 'redux',
  createdAt: '2026-05-29T07:55:52.266Z',
  ownerId: 'user-1',
  totalComments: 3,
  upVotesBy: ['user-2', 'user-3'],
  downVotesBy: [],
};

const meta = {
  title: 'Thread/ThreadCard',
  component: ThreadCard,
  args: { thread, user: owner },
};

export default meta;

export const Default = {};

export const WithoutAvatar = {
  args: { user: { id: 'user-2', name: 'Anggota Baru' } },
};

export const LongTitle = {
  args: {
    thread: {
      ...thread,
      id: 'thread-2',
      category: 'javascript',
      title: 'Kapan sebaiknya memakai useMemo dan useCallback, dan kapan justru membuat kode lebih lambat?',
      totalComments: 12,
    },
  },
};
