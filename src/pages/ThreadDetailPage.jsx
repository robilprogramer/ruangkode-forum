import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Icon from '../components/ui/Icon';
import Avatar from '../components/ui/Avatar';
import VoteActions from '../components/thread/VoteActions';
import CommentCard from '../components/thread/CommentCard';
import { LoadingState, ErrorState, EmptyState, Spinner } from '../components/ui/StatusViews';
import { fetchThread, publishComment, clearCommentError, resetDetail } from '../features/detail/detailSlice';
import { fetchOverview } from '../features/threads/threadsSlice';
import { showToast } from '../features/ui/uiSlice';
import { formatDate, plainText, readableDate } from '../utils/format';

export default function ThreadDetailPage() {
  const { threadId } = useParams();
  const dispatch = useDispatch();
  const [content, setContent] = useState('');
  const { thread, status, error, commentStatus, commentError } = useSelector((state) => state.detail);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchThread(threadId));
    return () => { dispatch(resetDetail()); };
  }, [threadId, dispatch]);

  const onComment = async (event) => {
    event.preventDefault();
    if (!content.trim()) return;
    const result = await dispatch(publishComment({ threadId, content: content.trim() }));
    if (result.meta.requestStatus === 'fulfilled') {
      setContent('');
      dispatch(showToast({ type: 'success', message: 'Komentar berhasil ditambahkan.' }));
      dispatch(fetchOverview());
    }
  };

  return <div className="container page-container detail-layout"><div className="detail-main"><Link to="/" className="back-link"><Icon name="arrowLeft" size={17}/> Kembali ke semua diskusi</Link>
    {(status === 'loading' && (!thread || thread.id !== threadId)) || status === 'idle'
      ? <LoadingState label="Mengambil detail diskusi..." />
      : status === 'failed' ? <ErrorState message={error} onRetry={() => dispatch(fetchThread(threadId))} />
        : thread && thread.id === threadId ? <>
          <article className="detail-article"><div className="detail-article__top"><span className="category-tag">{thread.category || 'Umum'}</span><span className="thread-date" title={readableDate(thread.createdAt)}><Icon name="clock" size={15}/>{formatDate(thread.createdAt)}</span></div>
            <h1>{thread.title}</h1>
            <div className="detail-author"><Avatar name={thread.owner?.name} url={thread.owner?.avatar}/><div><strong>{thread.owner?.name || 'Anggota komunitas'}</strong><span>Penulis diskusi</span></div></div>
            <div className="detail-article__body formatted-text">{plainText(thread.body)}</div>
            <div className="detail-article__footer"><VoteActions item={thread} type="thread" threadId={thread.id}/><span><Icon name="message" size={19}/> {thread.comments?.length || 0} komentar</span></div>
          </article>
          <section className="comments-section"><div className="comments-title"><div><p className="section-kicker">THE DISCUSSION CONTINUES</p><h2>Komentar <span>({thread.comments?.length || 0})</span></h2></div></div>
            {thread.comments?.length ? <div className="comment-list">{thread.comments.map((comment) => <CommentCard key={comment.id} comment={comment} threadId={thread.id}/>)}</div> : <EmptyState title="Belum ada komentar" description="Jadilah orang pertama yang berbagi perspektif." />}
          </section>
          <section className="reply-section"><div className="reply-section__head"><Icon name="pencil" size={20}/><h3>Tulis komentar</h3></div>
            {user ? <form onSubmit={onComment} className="reply-form"><div className="reply-form__author"><Avatar name={user.name} url={user.avatar} size="sm"/><strong>{user.name}</strong></div><textarea aria-label="Isi komentar" rows={5} minLength={2} maxLength={5000} required placeholder="Apa pendapatmu tentang diskusi ini?" value={content} onChange={(event) => { dispatch(clearCommentError()); setContent(event.target.value); }} /><div className="reply-form__bottom"><small>{content.length}/5000 karakter</small><button type="submit" className="btn btn--primary" disabled={commentStatus === 'loading'}>{commentStatus === 'loading' ? <Spinner /> : <>Kirim komentar <Icon name="send" size={16}/></>}</button></div>{commentError && <div className="form-error" role="alert">{commentError}</div>}</form>
              : <div className="reply-guest"><p>Ingin ikut dalam diskusi ini? Masuk atau daftar untuk membagikan pendapatmu.</p><Link to={`/login?next=${encodeURIComponent(`/threads/${threadId}`)}`} className="btn btn--primary">Masuk untuk berkomentar <Icon name="arrowRight" size={17}/></Link></div>}
          </section>
        </> : <ErrorState message="Diskusi tidak ditemukan." />}
  </div><aside className="sidebar detail-aside"><div className="side-card side-card--dark"><span className="side-icon"><Icon name="message" size={24}/></span><h3>Satu komentar,<br/>banyak insight.</h3><p>Sudut pandangmu bisa membantu developer lain menemukan jawaban.</p></div><div className="side-card side-card--soft"><div className="side-card__header"><span className="side-icon side-icon--small"><Icon name="shield" size={19}/></span><h3>Jaga ruang positif</h3></div><p>Berikan tanggapan yang membangun dan hargai setiap anggota komunitas.</p></div></aside>
  </div>;
}
