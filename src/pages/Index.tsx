
import React, { useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Navigation } from '@/components/layout/Navigation';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const Index = () => {
  useEffect(() => {
    // Animation pour l'arrivée de la page
    document.body.style.opacity = '0';
    
    setTimeout(() => {
      document.body.style.transition = 'opacity 400ms ease-in-out';
      document.body.style.opacity = '1';
    }, 100);
    
    return () => {
      document.body.style.transition = '';
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Navigation />
      
      <main className="pt-24 pb-16 lg:pl-64 pl-[74px] pr-4 lg:pr-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 animate-fade-in">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
              <p className="text-muted-foreground mt-1">
                Bienvenue sur votre espace de gestion de hockey
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Button className="button-effect">
                <PlusCircle className="h-4 w-4 mr-2" />
                Nouvelle Ligue
              </Button>
            </div>
          </div>
          
          <DashboardOverview />
        </div>
      </main>
    </div>
  );
};

export default Index;
