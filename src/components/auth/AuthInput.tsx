'use client';

type Props = {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function AuthInput({ label, type = 'text', value, onChange }: Props) {
  return (
    <div className="group space-y-1.5">
      <label className="block text-[10px] uppercase tracking-[0.2em] text-white/20 font-black ml-1 transition-colors group-focus-within:text-white/50">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={`Enter ${label.toLowerCase()}`}
        className="w-full bg-white/[0.03] border border-white/[0.06] focus:border-white/20 focus:bg-white/[0.07] py-4 px-5 rounded-2xl outline-none text-white transition-all duration-300 placeholder:text-white/5 text-sm"
      />
    </div>
  );
}