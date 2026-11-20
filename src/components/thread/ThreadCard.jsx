import { Link } from 'react-router-dom';
import Avatar from '../ui/Avatar';
import Icon from '../ui/Icon';
import VoteActions from './VoteActions';
import { formatDate, plainText, readableDate } from '../../utils/format';

export default function ThreadCard({ thread, user }) {
  return (
    <article className="thread-card">
      <div className="thread-card__main">
        <div className="thread-card__top">
          <span className="category-tag">{thread.category || 'Umum'}</span>
          <span className="thread-date" title={readableDate(thread.createdAt)}><Icon name="clock" size={14}/>{formatDate(thread.createdAt)}</span>
        </div>
        <Link className="thread-card__title" to={`/threads/${thread.id}`}>{thread.title}</Link>
        <p className="thread-card__excerpt">{plainText(thread.body)}</p>
        <div className="thread-card__footer">
          <span className="author-label"><Avatar name={user?.name} url={user?.avatar} size="sm"/><span>{user?.name || 'Anggota komunitas'}</span></span>
          <div className="thread-card__meta"><Icon name="message" size={17}/><span>{thread.totalComments || 0} komentar</span></div>
        </div>
      </div>
      <div className="thread-card__votes"><VoteActions item={thread} type="thread" threadId={thread.id} vertical /></div>
    </article>
  );
}
