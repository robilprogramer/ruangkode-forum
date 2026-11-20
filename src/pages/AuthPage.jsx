import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../components/ui/Icon';
import { Spinner } from '../components/ui/StatusViews';
import { loginUser, registerUser } from '../features/auth/authSlice';
import { showToast } from '../features/ui/uiSlice';

export default function AuthPage({ mode }) {
  const isRegister = mode === 'register';
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, status, error } = useSelector((state) => state.auth);
  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const desired = new URLSearchParams(location.search).get('next') || '/';
  const next = desired.startsWith('/') && !desired.startsWith('//') ? desired : '/';
  if (user) return <Navigate to={next} replace />;

  const onSubmit = async (event) => {
    event.preventDefault();
    if (values.password.length < 6) {
      dispatch(showToast({ type: 'error', message: 'Kata sandi minimal 6 karakter.' }));
      return;
    }
    const formValues = isRegister ? values : { email: values.email, password: values.password };
    const action = await dispatch(isRegister ? registerUser(formValues) : loginUser(formValues));
    if (action.meta.requestStatus === 'fulfilled') {
      dispatch(showToast({ type: 'success', message: isRegister ? 'Selamat datang di RuangKode!' : 'Berhasil masuk. Selamat berdiskusi!' }));
      navigate(next, { replace: true });
    }
  };

  return <section className="auth-page container"><div className="auth-intro"><div className="auth-intro__content"><span className="eyebrow eyebrow--dark"><span className="eyebrow-pulse"/> TEMPAT IDE BERTEMU</span><h1>{isRegister ? 'Mulai sesuatu yang' : 'Senang melihatmu'} <em>{isRegister ? 'luar biasa.' : 'kembali.'}</em></h1><p>{isRegister ? 'Gabung bersama para developer yang percaya bahwa berkembang tidak harus sendirian.' : 'Percakapan hebat menantimu. Yuk lanjut belajar dan berbagi bersama komunitas.'}</p><div className="auth-testimonial"><span className="quote-symbol">“</span><p>Every great developer was once a beginner who kept asking questions.</p><div className="quote-author"><span className="quote-line"/> KEEP LEARNING, KEEP BUILDING</div></div></div><div className="auth-doodle">{'{ }'} <span>✳</span></div></div>
    <div className="auth-form-wrap"><Link className="back-link" to="/"><Icon name="arrowLeft" size={17}/> Kembali ke beranda</Link><div className="auth-form-head"><span className="form-kicker">{isRegister ? 'CREATE ACCOUNT' : 'WELCOME BACK'}</span><h2>{isRegister ? 'Buat akun baru' : 'Masuk ke akunmu'}</h2><p>{isRegister ? 'Isi data berikut untuk bergabung.' : 'Masukkan detail akun untuk melanjutkan.'}</p></div>
      <form onSubmit={onSubmit} className="app-form">
        {isRegister && <label className="form-field"><span>Nama lengkap</span><input type="text" placeholder="Nama lengkap kamu" autoComplete="name" minLength={2} required value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })}/></label>}
        <label className="form-field"><span>Alamat email</span><input type="email" placeholder="nama@email.com" autoComplete="email" required value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })}/></label>
        <label className="form-field"><span>Kata sandi</span><input type="password" placeholder="Minimal 6 karakter" minLength={6} autoComplete={isRegister ? 'new-password' : 'current-password'} required value={values.password} onChange={(event) => setValues({ ...values, password: event.target.value })}/></label>
        {error && <div role="alert" className="form-error"><Icon name="info" size={17}/>{error}</div>}
        <button className="btn btn--primary btn--block btn--large" disabled={status === 'loading'} type="submit">{status === 'loading' ? <Spinner label="Memproses akun" /> : <>{isRegister ? 'Buat akun saya' : 'Masuk sekarang'} <Icon name="arrowRight" size={19}/></>}</button>
        <p className="form-switch">{isRegister ? 'Sudah punya akun?' : 'Belum punya akun?'} <Link to={`${isRegister ? '/login' : '/register'}?next=${encodeURIComponent(next)}`}>{isRegister ? 'Masuk di sini' : 'Daftar gratis'}</Link></p>
      </form>
      <p className="auth-footnote"><Icon name="shield" size={16}/> Diskusi lebih baik dengan komunitas yang saling menghargai.</p>
    </div>
  </section>;
}
