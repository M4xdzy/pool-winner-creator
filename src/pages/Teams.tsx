
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigation } from '@/components/layout/Navigation';
import { Header } from '@/components/layout/Header';

const Teams = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      
      <div className="ml-[74px] lg:ml-64 pt-16 p-6">
        <h1 className="text-3xl font-bold mb-6">Équipes</h1>
        
        {user ? (
          <div className="grid gap-6">
            <div className="bg-card rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Mes équipes</h2>
              <p className="text-muted-foreground">
                Vous n'avez pas encore créé d'équipe. Rejoignez une ligue pour créer votre équipe.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Connectez-vous</h2>
            <p className="text-muted-foreground">
              Connectez-vous pour voir vos équipes et en créer de nouvelles.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Teams;
