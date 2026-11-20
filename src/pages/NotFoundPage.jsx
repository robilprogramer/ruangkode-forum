import { Link } from 'react-router-dom';
import Icon from '../components/ui/Icon';

export default function NotFoundPage() {
  return <div className="container not-found"><span className="not-found__number">404</span><h1>Halaman tidak ditemukan.</h1><p>Sepertinya kamu mengambil belokan yang salah. Yuk kembali ke ruang diskusi.</p><Link to="/" className="btn btn--primary">Kembali ke beranda <Icon name="arrowRight" size={18}/></Link></div>;
}
