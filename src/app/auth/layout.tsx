export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#050505] text-white overflow-hidden flex items-center justify-center">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Central Glass Container */}
      <div className="relative z-10 w-full max-w-[420px] px-8 py-12 bg-white/[0.02] border border-white/[0.05] backdrop-blur-3xl rounded-[2.5rem] shadow-2xl">
        {children}
      </div>
    </div>
  );
}