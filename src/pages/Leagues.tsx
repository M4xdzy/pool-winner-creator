
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Search, Trophy, Users, Calendar, Settings, Lock, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

interface LeagueCardProps {
  name: string;
  members: number;
  type: string;
  private: boolean;
  draftDate?: string;
}

const LeagueCard = ({ name, members, type, private: isPrivate, draftDate }: LeagueCardProps) => (
  <Card className="overflow-hidden transition-all hover:shadow-md animate-scale-in">
    <CardHeader className="pb-2">
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <div className="mr-3 h-10 w-10 rounded-full bg-muted flex items-center justify-center">
            <Trophy className="h-5 w-5 text-accent" />
          </div>
          <div>
            <CardTitle className="text-xl mb-1">{name}</CardTitle>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-xs text-muted-foreground">
                <Users className="h-3 w-3 mr-1" />
                <span>{members} membres</span>
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                {isPrivate ? (
                  <>
                    <Lock className="h-3 w-3 mr-1" />
                    <span>Privée</span>
                  </>
                ) : (
                  <>
                    <Globe className="h-3 w-3 mr-1" />
                    <span>Publique</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </CardHeader>
    <Separator />
    <CardContent className="pt-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs font-medium">Type: {type}</p>
          {draftDate && (
            <div className="flex items-center mt-1 text-xs">
              <Calendar className="h-3 w-3 mr-1 text-accent" />
              <span>Draft: {draftDate}</span>
            </div>
          )}
        </div>
        <Button className="button-effect" size="sm">
          Gérer
        </Button>
      </div>
    </CardContent>
  </Card>
);

const Leagues = () => {
  const myLeagues = [
    {
      name: "Super Ligue 2023",
      members: 8,
      type: "Hebdomadaire",
      private: true,
      draftDate: "15 Nov 2023"
    },
    {
      name: "Ligue des Champions",
      members: 12,
      type: "Saison complète",
      private: false
    },
  ];
  
  const publicLeagues = [
    {
      name: "Ligue Internationale",
      members: 24,
      type: "Mensuelle",
      private: false,
      draftDate: "20 Nov 2023"
    },
    {
      name: "Hockey Elite",
      members: 16,
      type: "Saison complète",
      private: false
    },
  ];
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Navigation />
      
      <main className="pt-24 pb-16 lg:pl-64 pl-[74px] pr-4 lg:pr-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 animate-fade-in">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Mes Ligues</h1>
              <p className="text-muted-foreground mt-1">
                Gérez vos ligues de hockey et découvrez-en de nouvelles
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Button className="button-effect">
                <PlusCircle className="h-4 w-4 mr-2" />
                Nouvelle Ligue
              </Button>
            </div>
          </div>
          
          <div className="mb-6 relative animate-slide-up">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Rechercher une ligue..." 
              className="pl-9 bg-muted/40 border-muted transition-all focus-visible:bg-background"
            />
          </div>
          
          <Tabs defaultValue="my-leagues" className="animate-fade-in">
            <TabsList className="mb-6">
              <TabsTrigger value="my-leagues">Mes Ligues</TabsTrigger>
              <TabsTrigger value="discover">Découvrir</TabsTrigger>
              <TabsTrigger value="archived">Archivées</TabsTrigger>
            </TabsList>
            
            <TabsContent value="my-leagues" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {myLeagues.map((league, i) => (
                  <LeagueCard
                    key={`my-${i}`}
                    name={league.name}
                    members={league.members}
                    type={league.type}
                    private={league.private}
                    draftDate={league.draftDate}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="discover" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {publicLeagues.map((league, i) => (
                  <LeagueCard
                    key={`public-${i}`}
                    name={league.name}
                    members={league.members}
                    type={league.type}
                    private={league.private}
                    draftDate={league.draftDate}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="archived">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">Aucune ligue archivée</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Les ligues que vous archivez apparaîtront ici. Vous pouvez archiver une ligue une fois la saison terminée.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Leagues;
