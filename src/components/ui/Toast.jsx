import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dismissToast } from '../../features/ui/uiSlice';
import Icon from './Icon';

export default function Toast() {
  const toast = useSelector((state) => state.ui.toast);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => dispatch(dismissToast()), 4500);
    return () => clearTimeout(timer);
  }, [toast, dispatch]);
  if (!toast) return null;
  return <div role="alert" className={`toast toast--${toast.type || 'success'}`}>
    <Icon name={toast.type === 'error' ? 'info' : 'check'} size={20} />
    <span>{toast.message}</span>
    <button aria-label="Tutup notifikasi" onClick={() => dispatch(dismissToast())}><Icon name="x" size={18} /></button>
  </div>;
}
