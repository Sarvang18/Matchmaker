import { Users, UserCheck, Send, Trophy, TrendingUp, Heart } from 'lucide-react';

interface StatsCardsProps {
  totalClients: number;
  activeClients: number;
  matchesSent: number;
  closedWon: number;
}

export function StatsCards({
  totalClients,
  activeClients,
  matchesSent,
  closedWon,
}: StatsCardsProps) {
  const stats = [
    {
      label: 'Total Clients',
      value: totalClients,
      icon: Users,
      gradient: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50',
      change: '+12.5%',
    },
    {
      label: 'Active Clients',
      value: activeClients,
      icon: UserCheck,
      gradient: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50',
      change: '+8.2%',
    },
    {
      label: 'Matches Sent',
      value: matchesSent,
      icon: Send,
      gradient: 'from-rose-500 to-red-600',
      bgColor: 'bg-rose-50',
      change: '+18.7%',
    },
    {
      label: 'Closed Won',
      value: closedWon,
      icon: Trophy,
      gradient: 'from-red-600 to-pink-600',
      bgColor: 'bg-red-50',
      change: '+5.1%',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        
        return (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            {/* Icon & Change */}
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-md`}>
                <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-red-600">
                <TrendingUp className="w-4 h-4" />
                <span>{stat.change}</span>
              </div>
            </div>

            {/* Label */}
            <p className="text-sm font-medium text-gray-600 mb-2">{stat.label}</p>

            {/* Metric */}
            <p className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              {stat.value.toLocaleString()}
            </p>

            {/* Decorative Progress */}
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${stat.gradient} transition-all duration-500`}
                style={{ width: `${Math.min((stat.value / Math.max(totalClients, 1)) * 100, 100)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
