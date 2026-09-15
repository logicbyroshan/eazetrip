import { useBooking } from '../../context/BookingContext';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast() {
  const { toastMessage } = useBooking();

  if (!toastMessage) return null;

  const isError = toastMessage.type === 'error';

  return (
    <div className={`toast-container ${isError ? 'error' : 'success'}`}>
      <div className="toast-icon">
        {isError ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
      </div>
      <div className="toast-content">
        <p>{toastMessage.message}</p>
      </div>
    </div>
  );
}
