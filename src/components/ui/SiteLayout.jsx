import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import Avatar from './Avatar';
import Icon from './Icon';
import Toast from './Toast';
import LoadingBar from './LoadingBar';

const navClass = ({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`;

export default function SiteLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const closeMenu = () => setMenuOpen(false);

  return <div className="site-shell">
    <LoadingBar />
    <header className="site-header"><div className="header-inner container">
      <Link to="/" className="brand" onClick={closeMenu} aria-label="RuangKode beranda">
        <span className="brand-icon"><Icon name="code" size={24}/></span>
        <span>ruang<span className="brand-accent">kode</span><span className="brand-dot">.</span></span>
      </Link>
      <nav aria-label="Navigasi utama" className={`main-nav ${menuOpen ? 'main-nav--open' : ''}`}>
        <NavLink to="/" end className={navClass} onClick={closeMenu}><Icon name="message" size={17} /> Diskusi</NavLink>
        <NavLink to="/leaderboard" className={navClass} onClick={closeMenu}><Icon name="trophy" size={17} /> Leaderboard</NavLink>
      </nav>
      <div className="header-actions">
        {user ? <>
          <Link to="/new" className="btn btn--primary btn--header"><Icon name="plus" size={18}/> <span>Buat diskusi</span></Link>
          <div className="header-profile"><Avatar name={user.name} url={user.avatar} size="sm"/><span>{user.name.split(' ')[0]}</span></div>
          <button className="btn-icon logout-button" type="button" onClick={() => { dispatch(logout()); closeMenu(); }} title="Keluar akun" aria-label="Keluar akun"><Icon name="logout" size={20}/></button>
        </> : <>
          <Link to="/login" className="text-link">Masuk</Link>
          <Link to="/register" className="btn btn--primary btn--header">Gabung <Icon name="arrowRight" size={16}/></Link>
        </>}
        <button type="button" className="btn-icon mobile-menu-toggle" aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><Icon name={menuOpen ? 'x' : 'menu'} size={22}/></button>
      </div>
    </div></header>
    <main className="site-main"><Outlet /></main>
    <footer className="site-footer"><div className="container footer-inner"><div className="footer-brand"><span className="brand-icon"><Icon name="code" size={18}/></span><strong>ruangkode.</strong></div><span>Ruang untuk bertanya, berbagi, dan bertumbuh bersama.</span><span>Made for curious minds <span aria-hidden="true">✳</span></span></div></footer>
    <Toast />
  </div>;
}
