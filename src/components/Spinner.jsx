export default function Spinner({ className = "w-4 h-4 border-2" }) {
  return (
    <span
      className={`inline-block rounded-full border-white/40 border-t-white animate-spin ${className}`}
    />
  );
}
