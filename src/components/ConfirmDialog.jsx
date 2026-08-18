import { FiAlertTriangle } from "react-icons/fi";
import Spinner from "./Spinner";

const TONES = {
  danger: {
    accent: "bg-red-50 text-red-600",
    button: "bg-gradient-to-l from-red-600 to-red-500 shadow-[0_8px_30px_-8px_rgba(220,38,38,0.6)]",
  },
  warning: {
    accent: "bg-amber-50 text-amber-600",
    button:
      "bg-gradient-to-l from-amber-500 to-orange-500 shadow-[0_8px_30px_-8px_rgba(245,158,11,0.6)]",
  },
  primary: {
    accent: "bg-pink-50 text-pink-600",
    button: "bg-gradient-to-l from-blue-600 to-purple-600 shadow-glow",
  },
};

/**
 * Replaces `window.confirm` for destructive dashboard actions so the wording,
 * the tone and the pending state stay in the app's own language.
 */
export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "تأكيد",
  cancelLabel = "إلغاء",
  tone = "danger",
  isLoading = false,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) {
    return null;
  }

  const { accent, button } = TONES[tone] || TONES.danger;

  return (
    <div
      className="fixed inset-0 z-[55] bg-ink/30 backdrop-blur-sm flex items-center justify-center px-4"
      onClick={isLoading ? undefined : onCancel}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white shadow-glow-lg border border-black/[0.04] p-6 animate-fade-up"
        onClick={(event) => event.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
      >
        <div className="flex items-start gap-4 mb-5">
          <span
            className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center ${accent}`}
          >
            <FiAlertTriangle size={22} />
          </span>
          <div className="min-w-0">
            <h3 className="text-lg font-display font-black text-gray-900 mb-1">
              {title}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 ${button}`}
          >
            {isLoading && (
              <Spinner className="w-4 h-4 border-2 border-white/40 border-t-white" />
            )}
            {confirmLabel}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-5 py-3 rounded-2xl font-bold text-gray-700 border-2 border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-60"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
