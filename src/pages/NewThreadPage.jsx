import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../components/ui/Icon';
import { Spinner } from '../components/ui/StatusViews';
import { publishThread, clearCreateError } from '../features/threads/threadsSlice';
import { showToast } from '../features/ui/uiSlice';
import { selectCategories } from '../utils/selectors';

export default function NewThreadPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categories = useSelector(selectCategories);
  const { createStatus, createError } = useSelector((state) => state.threads);
  const [form, setForm] = useState({ title: '', category: '', body: '' });

  const onSubmit = async (event) => {
    event.preventDefault();
    const payload = { title: form.title.trim(), category: form.category.trim() || 'Umum', body: form.body.trim() };
    if (!payload.title || !payload.body) return;
    const action = await dispatch(publishThread(payload));
    if (action.meta.requestStatus === 'fulfilled') {
      dispatch(showToast({ type: 'success', message: 'Diskusimu berhasil dipublikasikan!' }));
      navigate(action.payload?.id ? `/threads/${action.payload.id}` : '/');
    }
  };

  return <div className="container page-container create-layout"><div className="create-main">
    <Link to="/" className="back-link"><Icon name="arrowLeft" size={17}/> Kembali ke diskusi</Link>
    <div className="page-title-block"><span className="form-kicker">START A CONVERSATION</span><h1>Mulai diskusi <span>baru.</span></h1><p>Punya pertanyaan, opini, atau pengalaman untuk dibagikan? Komunitas siap mendengarkan.</p></div>
    <div className="form-card"><form className="app-form" onSubmit={onSubmit}>
      <label className="form-field"><span>Judul diskusi <b>*</b></span><input placeholder="Tulis judul yang menarik dan jelas..." required minLength={5} maxLength={150} value={form.title} onChange={(event) => { dispatch(clearCreateError()); setForm({ ...form, title: event.target.value }); }}/><small>{form.title.length}/150 karakter</small></label>
      <label className="form-field"><span>Kategori <b>*</b></span><input required list="available-categories" maxLength={40} placeholder="Contoh: React, JavaScript, Karier" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}/><datalist id="available-categories">{categories.map((category) => <option key={category} value={category}/>)}</datalist><small>Gunakan kategori yang sudah ada atau buat kategori baru.</small></label>
      <label className="form-field"><span>Isi diskusi <b>*</b></span><textarea rows={11} required minLength={10} maxLength={10000} placeholder="Ceritakan masalah, gagasan, atau pertanyaanmu dengan detail..." value={form.body} onChange={(event) => setForm({ ...form, body: event.target.value })}/><small>{form.body.length}/10000 karakter</small></label>
      {createError && <div className="form-error" role="alert"><Icon name="info" size={17}/>{createError}</div>}
      <div className="form-actions"><Link to="/" className="btn btn--outline">Batal</Link><button className="btn btn--primary" type="submit" disabled={createStatus === 'loading'}>{createStatus === 'loading' ? <Spinner /> : <><Icon name="send" size={17}/> Publikasikan diskusi</>}</button></div>
    </form></div>
  </div><aside className="create-aside"><div className="side-card side-card--soft sticky-side"><span className="side-icon"><Icon name="sparkles" size={24}/></span><h3>Tips diskusi berkualitas</h3><div className="tip-row"><span>01</span><p>Gunakan judul yang spesifik agar mudah ditemukan.</p></div><div className="tip-row"><span>02</span><p>Bagikan konteks, apa yang telah dicoba, dan apa yang ingin dicapai.</p></div><div className="tip-row"><span>03</span><p>Tetap sopan dan terbuka terhadap perspektif baru.</p></div></div></aside>
  </div>;
}
