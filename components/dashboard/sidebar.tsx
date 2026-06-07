'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, LayoutDashboard, Users, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials, getInitialsColor } from '@/lib/client-utils';

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/clients', label: 'Clients', icon: Users },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    signOut({ callbackUrl: '/login' });
  };

  return (
    <div className="w-64 h-screen fixed left-0 top-0 bg-white border-r border-gray-100 flex flex-col shadow-sm">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
            <Heart className="w-5 h-5 text-white" fill="white" strokeWidth={0} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>BYvowed</h1>
            <p className="text-xs text-gray-500">Matchmaker Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all
                ${isActive
                  ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
                }
              `}
            >
              <Icon className="w-5 h-5" strokeWidth={2.5} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="bg-gradient-to-br from-red-500 to-pink-600 text-white w-10 h-10 shadow-md">
            <AvatarFallback className="bg-transparent text-xs font-bold">
              {session?.user?.name ? getInitials(session.user.name.split(' ')[0], session.user.name.split(' ')[1] || '') : 'MM'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate text-gray-900">{session?.user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
          </div>
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full text-sm font-semibold text-gray-700 border-gray-200 hover:bg-white hover:border-red-300 hover:text-red-600 transition-all rounded-lg"
          size="sm"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
