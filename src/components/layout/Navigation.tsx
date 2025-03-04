
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Trophy, Users, BarChart3, CreditCard, Settings } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Accueil', icon: Home },
  { path: '/leagues', label: 'Mes Ligues', icon: Trophy },
  { path: '/teams', label: 'Mes Équipes', icon: Users },
  { path: '/standings', label: 'Classements', icon: BarChart3 },
  { path: '/credits', label: 'Crédits', icon: CreditCard },
  { path: '/settings', label: 'Paramètres', icon: Settings },
];

export function Navigation() {
  const location = useLocation();
  
  return (
    <nav className="fixed left-0 top-0 bottom-0 w-[70px] lg:w-60 pt-16 bg-sidebar text-sidebar-foreground z-30 border-r border-border transition-all duration-300 ease-in-out">
      <div className="h-full flex flex-col px-2 py-8">
        <ul className="space-y-2">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path} className={`animate-slide-right-${index % 3 + 1}`}>
                <Link
                  to={item.path}
                  className={`flex items-center px-3 py-3 rounded-lg transition-all group
                    ${isActive 
                      ? 'bg-accent text-accent-foreground' 
                      : 'hover:bg-muted text-sidebar-foreground'
                    }`}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="ml-3 hidden lg:block font-medium">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-foreground lg:hidden"></div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
        
        <div className="mt-auto hidden lg:block">
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="text-sm font-medium mb-1">Besoin de crédits?</div>
            <p className="text-xs text-muted-foreground mb-3">
              Achetez des crédits pour créer des ligues et inviter des amis
            </p>
            <Link 
              to="/credits" 
              className="text-xs font-medium text-accent hover:underline block text-center"
            >
              Acheter des crédits
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
