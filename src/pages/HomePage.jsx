import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchOverview } from '../features/threads/threadsSlice';
import { setCategory, setSearch, setSort } from '../features/ui/uiSlice';
import { selectCategories, selectFilteredThreads } from '../utils/selectors';
import Icon from '../components/ui/Icon';
import ThreadCard from '../components/thread/ThreadCard';
import { EmptyState, ErrorState, LoadingState } from '../components/ui/StatusViews';

export default function HomePage() {
  const dispatch = useDispatch();
  const { items: threads, users, status, error } = useSelector((state) => state.threads);
  const { category, search, sort } = useSelector((state) => state.ui);
  const filtered = useSelector(selectFilteredThreads);
  const categories = useSelector(selectCategories);
  const isLoggedIn = useSelector((state) => !!state.auth.user);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchOverview());
  }, [status, dispatch]);

  return <>
    <section className="hero"><div className="container hero__layout">
      <div className="hero__copy">
        <div className="eyebrow"><span className="eyebrow-pulse" /> KOMUNITAS DEVELOPER INDONESIA</div>
        <h1>Ide besar dimulai dari <span>percakapan kecil.</span></h1>
        <p>Temukan perspektif baru, pecahkan masalah bersama, dan tumbuh jadi developer yang lebih baik. Semua dimulai di sini.</p>
        <div className="hero__actions"><Link to={isLoggedIn ? '/new' : '/register'} className="btn btn--lime btn--large">Mulai berdiskusi <Icon name="arrowRight" size={20} /></Link><a href="#diskusi" className="hero__text-link">Jelajahi topik <span aria-hidden="true">↘</span></a></div>
        <div className="hero__stats"><div><strong>{threads.length}</strong><span>Diskusi aktif</span></div><span className="stat-separator"/><div><strong>{users.length}</strong><span>Anggota</span></div><span className="stat-separator"/><div><strong>{threads.reduce((sum, thread) => sum + (thread.totalComments || 0), 0)}</strong><span>Percakapan</span></div></div>
      </div>
      <div className="hero__visual" aria-hidden="true">
        <div className="hero-orbit hero-orbit--one" /><div className="hero-orbit hero-orbit--two" />
        <div className="floating-chip floating-chip--one"><span className="floating-icon floating-icon--yellow"><Icon name="sparkles" size={18}/></span><span>Belajar bareng,<strong>lebih seru!</strong></span></div>
        <div className="code-panel"><div className="code-panel__top"><span className="window-dots"><i/><i/><i/></span><span>community.js</span><span>⌘</span></div><div className="code-lines"><div><span className="code-purple">const</span> <span className="code-lime">community</span> = {'{'}</div><div className="code-indent">passion: <span className="code-gold">&apos;coding&apos;</span>,</div><div className="code-indent">members: <span className="code-blue">&apos;everyone&apos;</span>,</div><div className="code-indent">mindset: <span className="code-gold">&apos;keep learning&apos;</span>,</div><div className="code-indent">support: <span className="code-purple">true</span>,</div><div>{'};'}</div><div className="code-spacer"/><div><span className="code-gray">{'// let’s build together'}</span></div><div><span className="code-lime">community</span>.grow(<span className="code-gold">&apos;together&apos;</span>);</div></div></div>
        <div className="floating-chip floating-chip--two"><span className="floating-icon floating-icon--mint"><Icon name="check" size={18}/></span><span>You&apos;re in the<strong>right place.</strong></span></div>
        <div className="hero-star hero-star--one">✳</div><div className="hero-star hero-star--two">✦</div>
      </div>
    </div></section>

    <section className="discussions-section" id="diskusi"><div className="container content-layout">
      <div className="main-column">
        <div className="section-heading"><div><p className="section-kicker">THE CONVERSATION STARTS HERE</p><h2>Jelajahi diskusi <span className="heading-doodle">✳</span></h2><p className="section-subtitle">Pertanyaan menarik, jawaban bermakna, dan ide-ide segar.</p></div><Link className="btn btn--outline section-create" to={isLoggedIn ? '/new' : '/login?next=%2Fnew'}><Icon name="plus" size={18}/> Diskusi baru</Link></div>
        <div className="filters-panel">
          <label className="search-box"><Icon name="search" size={20}/><input aria-label="Cari diskusi" value={search} onChange={(event) => dispatch(setSearch(event.target.value))} placeholder="Cari topik atau diskusi..." /></label>
          <label className="sort-box"><span>Urutkan:</span><select aria-label="Urutkan diskusi" value={sort} onChange={(event) => dispatch(setSort(event.target.value))}><option value="recent">Terbaru</option><option value="popular">Terpopuler</option><option value="discussed">Paling ramai</option></select><Icon name="chevronDown" size={16}/></label>
        </div>
        <div className="category-scroller" aria-label="Filter kategori">
          {['Semua', ...categories].map((item) => <button type="button" key={item} className={`category-filter ${category === item ? 'category-filter--active' : ''}`} aria-pressed={category === item} onClick={() => dispatch(setCategory(item))}>{item === 'Semua' && <Icon name="grid" size={15}/>} {item}</button>)}
        </div>
        <div className="result-header"><strong>{filtered.length} diskusi ditemukan</strong><span>Berbagi adalah langkah awal bertumbuh.</span></div>
        {status === 'loading' || status === 'idle' ? <LoadingState label="Mengambil diskusi terbaru..." />
          : status === 'failed' ? <ErrorState message={error} onRetry={() => dispatch(fetchOverview())} />
            : filtered.length ? <div className="thread-list">{filtered.map((thread) => <ThreadCard key={thread.id} thread={thread} user={users.find((user) => user.id === thread.ownerId)} />)}</div>
              : <EmptyState title="Belum ada diskusi yang cocok" description="Coba kata kunci atau kategori lainnya." action={<button className="btn btn--outline" onClick={() => { dispatch(setSearch('')); dispatch(setCategory('Semua')); }}>Reset filter</button>} />}
      </div>
      <aside className="sidebar">
        <div className="side-card side-card--dark"><div className="side-decoration">✳</div><div className="side-icon"><Icon name="sparkles" size={22}/></div><h3>Ruang untuk<br/>setiap ide.</h3><p>Pertanyaan sederhana bisa jadi awal solusi luar biasa. Jangan ragu berbagi.</p><Link to={isLoggedIn ? '/new' : '/register'}>Mulai percakapan <Icon name="arrowRight" size={18}/></Link></div>
        <div className="side-card"><div className="side-card__header"><span className="side-icon side-icon--small"><Icon name="fire" size={18}/></span><h3>Topik populer</h3></div><div className="topic-list">{categories.slice(0, 6).map((item, index) => <button key={item} className="topic-item" onClick={() => { dispatch(setCategory(item)); document.getElementById('diskusi')?.scrollIntoView({ behavior: 'smooth' }); }}><span className="topic-index">0{index + 1}</span><span>{item}</span><span className="topic-count">{threads.filter((thread) => thread.category === item).length}</span></button>)}{categories.length === 0 && <p className="muted">Topik akan muncul setelah data dimuat.</p>}</div></div>
        <div className="side-card side-card--soft"><div className="side-card__header"><span className="side-icon side-icon--small"><Icon name="shield" size={20}/></span><h3>Budaya diskusi</h3></div><p>Tetap ramah, hargai pendapat berbeda, dan bantu sesama berkembang.</p><Link to="/leaderboard" className="soft-link">Kenali komunitas <Icon name="arrowRight" size={17}/></Link></div>
      </aside>
    </div></section>
  </>;
}
