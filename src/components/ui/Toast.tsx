'use client';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { Toast, ToastType } from '@/hooks/useToast';

const icons: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
};

const styles: Record<ToastType, string> = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const iconStyles: Record<ToastType, string> = {
  success: 'text-green-500',
  error: 'text-red-500',
  info: 'text-blue-500',
};

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const Icon = icons[toast.type];
  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg text-sm animate-in slide-in-from-right ${styles[toast.type]}`}>
      <Icon size={18} className={`mt-0.5 shrink-0 ${iconStyles[toast.type]}`} />
      <span className="flex-1 font-medium">{toast.message}</span>
      <button onClick={() => onDismiss(toast.id)} className="p-0.5 rounded hover:opacity-70 transition-opacity">
        <X size={14} />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 w-80 max-w-[calc(100vw-3rem)]">
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
