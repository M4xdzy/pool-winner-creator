
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Navigation } from '@/components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Trophy, Shield, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

interface TeamCardProps {
  name: string;
  leagueName: string;
  players: number;
  rank?: number;
  points: number;
}

const TeamCard = ({ name, leagueName, players, rank, points }: TeamCardProps) => (
  <Card className="overflow-hidden transition-all hover:shadow-md">
    <CardHeader className="pb-2">
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={`https://api.dicebear.com/7.x/shapes/svg?seed=${name}`} alt={name} />
            <AvatarFallback><Shield className="h-5 w-5" /></AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl mb-1">{name}</CardTitle>
            <div className="flex items-center text-xs text-muted-foreground">
              <Trophy className="h-3 w-3 mr-1" />
              <span>{leagueName}</span>
            </div>
          </div>
        </div>
        {rank && (
          <div className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
            #{rank}
          </div>
        )}
      </div>
    </CardHeader>
    <Separator />
    <CardContent className="pt-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <div className="flex items-center text-sm">
            <Users className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{players} joueurs</span>
          </div>
          <div className="flex items-center text-sm">
            <Trophy className="h-4 w-4 mr-1 text-amber-500" />
            <span>{points} pts</span>
          </div>
        </div>
        <Button size="sm">Gérer</Button>
      </div>
    </CardContent>
  </Card>
);

const Teams = () => {
  // Données de test (à remplacer par des données réelles)
  const myTeams = [
    {
      name: "Kings du Québec",
      leagueName: "Super Ligue 2023",
      players: 8,
      rank: 2,
      points: 145,
    },
    {
      name: "Les Aigles",
      leagueName: "Ligue des Champions",
      players: 10,
      rank: 5,
      points: 120,
    },
  ];
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Navigation />
      
      <main className="pt-24 pb-16 lg:pl-64 pl-[74px] pr-4 lg:pr-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 animate-fade-in">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Mes Équipes</h1>
              <p className="text-muted-foreground mt-1">
                Gérez vos équipes de hockey et leurs joueurs
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Button className="button-effect">
                <UserCheck className="h-4 w-4 mr-2" />
                Créer une Équipe
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="my-teams" className="animate-fade-in">
            <TabsList className="mb-6">
              <TabsTrigger value="my-teams">Mes Équipes</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="my-teams" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {myTeams.map((team, i) => (
                  <TeamCard
                    key={i}
                    name={team.name}
                    leagueName={team.leagueName}
                    players={team.players}
                    rank={team.rank}
                    points={team.points}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="draft">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">Aucun draft en cours</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Vous n'avez aucun draft actif pour le moment. Rejoignez une ligue ou créez-en une pour commencer.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Teams;
