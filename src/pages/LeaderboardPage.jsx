import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Avatar from '../components/ui/Avatar';
import Icon from '../components/ui/Icon';
import { LoadingState, ErrorState, EmptyState } from '../components/ui/StatusViews';
import { fetchLeaderboard } from '../features/leaderboard/leaderboardSlice';

export default function LeaderboardPage() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.leaderboard);
  useEffect(() => {
    if (status === 'idle') dispatch(fetchLeaderboard());
  }, [status, dispatch]);
  const ranked = [...items].sort((a, b) => b.score - a.score);
  const topThree = [ranked[1], ranked[0], ranked[2]];
  const medals = ['silver', 'gold', 'bronze'];

  return <div className="leaderboard-page"><div className="leaderboard-hero"><div className="container leaderboard-hero__inner"><span className="eyebrow"><span className="eyebrow-pulse"/> THE COMMUNITY HALL OF FAME</span><div className="leaderboard-hero__title"><div><h1>Mereka yang terus <span>berkontribusi.</span></h1><p>Apresiasi untuk setiap ide yang dibagikan dan setiap diskusi yang menginspirasi.</p></div><span className="leaderboard-hero__symbol"><Icon name="trophy" size={55}/></span></div></div></div>
    <div className="container leaderboard-content">
      {status === 'loading' || status === 'idle' ? <LoadingState label="Memuat leaderboard..." />
        : status === 'failed' ? <ErrorState message={error} onRetry={() => dispatch(fetchLeaderboard())}/>
          : ranked.length === 0 ? <EmptyState title="Leaderboard belum tersedia" description="Peringkat akan muncul ketika komunitas mulai berkontribusi." />
            : <><div className="leaderboard-summary"><div><p className="section-kicker">TOP CONTRIBUTORS</p><h2>Developer paling aktif <span>✳</span></h2></div><span>{ranked.length} anggota dalam daftar</span></div>
              <div className="podium">{topThree.map((entry, index) => entry ? <div className={`podium-card podium-card--${medals[index]}`} key={entry.user.id}><span className="podium-medal">{index === 1 ? '✦' : index === 0 ? '✳' : '✧'}</span><Avatar name={entry.user.name} url={entry.user.avatar} size="xl"/><div className="podium-rank">#{index === 1 ? 1 : index === 0 ? 2 : 3}</div><h3>{entry.user.name}</h3><p>{entry.score} <span>poin</span></p></div> : <div className="podium-card podium-card--placeholder" key={medals[index]} />)}</div>
              <div className="rankings-card"><div className="rankings-head"><h3>Daftar peringkat</h3><span>Score</span></div>{ranked.map((entry, index) => <div className="ranking-row" key={entry.user.id}><span className={`ranking-number ${index < 3 ? 'ranking-number--top' : ''}`}>#{String(index + 1).padStart(2, '0')}</span><Avatar name={entry.user.name} url={entry.user.avatar}/><div className="ranking-info"><strong>{entry.user.name}</strong><span>{index < 3 ? 'Top contributor' : 'Community member'}</span></div><strong className="ranking-score">{entry.score} <span>pts</span></strong></div>)}</div>
              <div className="leaderboard-cta"><div><span className="leaderboard-cta__icon"><Icon name="sparkles" size={23}/></span><h3>Kontribusi kecil, dampak besar.</h3><p>Ikut berdiskusi dan jadilah bagian dari komunitas yang saling mendukung.</p></div><Link to="/" className="btn btn--lime">Jelajahi diskusi <Icon name="arrowRight" size={19}/></Link></div>
            </>}
    </div>
  </div>;
}
