import Avatar from '../ui/Avatar';
import VoteActions from './VoteActions';
import { formatDate, plainText, readableDate } from '../../utils/format';

export default function CommentCard({ comment, threadId }) {
  return <article className="comment-card">
    <Avatar name={comment.owner?.name} url={comment.owner?.avatar} />
    <div className="comment-card__content">
      <div className="comment-card__header"><strong>{comment.owner?.name || 'Pengguna'}</strong><time title={readableDate(comment.createdAt)}>{formatDate(comment.createdAt)}</time></div>
      <p className="formatted-text">{plainText(comment.content)}</p>
      <VoteActions item={comment} threadId={threadId} type="comment" />
    </div>
  </article>;
}
