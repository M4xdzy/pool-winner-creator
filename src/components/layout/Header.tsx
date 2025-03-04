
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CreditsDisplay } from '@/components/ui/CreditsDisplay';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      scrolled ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
            
            <Link to="/" className="flex items-center space-x-2">
              <img src="/images/logo.svg" alt="Logo" className="h-8 w-8" />
              <span className="hidden md:block font-semibold text-lg animate-fade-in">Hockey Pool Pro</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <CreditsDisplay credits={1250} className="animate-slide-up-1" />
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative animate-slide-up-2">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1.5 w-2 h-2 bg-accent rounded-full"></span>
                  <span className="sr-only">Notifications</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0">
                <div className="p-4 border-b">
                  <h3 className="font-medium">Notifications</h3>
                </div>
                <div className="py-2">
                  <div className="px-4 py-2 hover:bg-muted transition-colors">
                    <p className="text-sm font-medium">Nouvelle saison commencée</p>
                    <p className="text-xs text-muted-foreground">Il y a 2 heures</p>
                  </div>
                  <div className="px-4 py-2 hover:bg-muted transition-colors">
                    <p className="text-sm font-medium">Mise à jour des statistiques</p>
                    <p className="text-xs text-muted-foreground">Hier</p>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="animate-slide-up-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-accent text-accent-foreground">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-0">
                <div className="p-4 border-b">
                  <p className="font-medium">Mon profil</p>
                  <p className="text-sm text-muted-foreground">user@example.com</p>
                </div>
                <div className="py-2">
                  <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    Gérer le profil
                  </Link>
                  <Link to="/settings" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    Paramètres
                  </Link>
                  <div className="border-t my-1"></div>
                  <button className="block w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors">
                    Déconnexion
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </header>
  );
}
