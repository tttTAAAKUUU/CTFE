'use client';

import SideNav from '@/components/dashboard/SideNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* SideNav stays fixed on the left */}
      <SideNav /> 
      
      {/* Content area scrolls independently */}
      <main className="flex-1 h-screen overflow-y-auto p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}