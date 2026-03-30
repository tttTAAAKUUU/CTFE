type Props = {
  text: string;
  disabled?: boolean;

  // 👇 optional click handler for debugging
  onClick?: () => void;
};

export default function AuthButton({ text, disabled }: { text: string; disabled?: boolean }) {
  return (
    <button
      disabled={disabled}
      className="w-full py-4 rounded-2xl bg-white text-black font-bold text-sm tracking-wide hover:bg-zinc-200 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
    >
      {text}
    </button>
  );
}

function LoadingDots() {
  return (
    <span className="flex items-center gap-1">
      <span className="animate-bounce [animation-delay:-0.3s]">•</span>
      <span className="animate-bounce [animation-delay:-0.15s]">•</span>
      <span className="animate-bounce">•</span>
    </span>
  );
}
