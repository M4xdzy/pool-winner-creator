
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Trophy, 
  Users, 
  User, 
  Settings, 
  LogOut,
  Shield,
  BarChart3,
  Megaphone,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/AuthContext';
import { CreditsDisplay } from '@/components/ui/CreditsDisplay';

export function Navigation() {
  const { pathname } = useLocation();
  const { isMobile } = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Mobile toggle button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 z-50 lg:hidden shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
      
      {/* Navigation sidebar */}
      <div className={`
        fixed top-0 left-0 z-40 h-full transition-all duration-300 ease-in-out
        ${isOpen ? 'w-64 translate-x-0' : isMobile ? 'w-[74px] translate-x-0' : 'w-64 translate-x-0'}
        border-r border-border pt-[64px] bg-background
      `}>
        <div className="px-3 py-4 h-full flex flex-col">
          <div className="space-y-1">
            <NavItem href="/" icon={<Home className="h-5 w-5" />} label="Accueil" isCollapsed={!isOpen && isMobile} active={pathname === '/'} />
            <NavItem href="/leagues" icon={<Trophy className="h-5 w-5" />} label="Ligues" isCollapsed={!isOpen && isMobile} active={pathname.startsWith('/leagues')} />
            <NavItem href="/teams" icon={<Shield className="h-5 w-5" />} label="Équipes" isCollapsed={!isOpen && isMobile} active={pathname.startsWith('/teams')} />
            <NavItem href="/stats" icon={<BarChart3 className="h-5 w-5" />} label="Statistiques" isCollapsed={!isOpen && isMobile} active={pathname.startsWith('/stats')} />
            <NavItem href="/news" icon={<Megaphone className="h-5 w-5" />} label="Actualités" isCollapsed={!isOpen && isMobile} active={pathname.startsWith('/news')} />
          </div>
          
          <Separator className="my-4" />
          
          {user ? (
            <>
              <div className="space-y-1">
                <NavItem href="/profile" icon={<User className="h-5 w-5" />} label="Profil" isCollapsed={!isOpen && isMobile} active={pathname === '/profile'} />
                <NavItem href="/settings" icon={<Settings className="h-5 w-5" />} label="Paramètres" isCollapsed={!isOpen && isMobile} active={pathname === '/settings'} />
              </div>
              
              <div className="mt-2 px-2">
                {(!isMobile || isOpen) && (
                  <CreditsDisplay credits={1250} className="w-full justify-start mb-2" />
                )}
                
                <Button 
                  variant="destructive" 
                  className="w-full justify-start" 
                  size={(!isMobile || isOpen) ? "default" : "icon"}
                  onClick={() => signOut()}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {(!isMobile || isOpen) && "Déconnexion"}
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-2 px-2">
              <Button asChild className="w-full">
                <Link to="/login">Se connecter</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/register">S'inscrire</Link>
              </Button>
            </div>
          )}
          
          <div className="mt-auto text-xs text-center text-muted-foreground p-2">
            {(!isMobile || isOpen) && (
              <p>Hockey Fantasy League v2.0</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
  active?: boolean;
}

function NavItem({ href, icon, label, isCollapsed, active }: NavItemProps) {
  return (
    <Link
      to={href}
      className={`
        flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
        ${active 
          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
        }
      `}
    >
      <span className="mr-3 flex-shrink-0">{icon}</span>
      {!isCollapsed && <span>{label}</span>}
    </Link>
  );
}
