
import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, Calendar, Activity, PlusCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export function DashboardOverview() {
  const mockLeagues = [
    { id: 1, name: "Super Ligue 2023", members: 8, nextMatchDate: "2023-11-15" },
    { id: 2, name: "Ligue des Champions", members: 12, nextMatchDate: "2023-11-18" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Ligues Actives"
          value="2"
          icon={<Trophy className="h-4 w-4 text-accent" />}
          className="animate-slide-up"
        />
        <StatsCard
          title="Mes Équipes"
          value="4"
          icon={<Users className="h-4 w-4 text-accent" />}
          className="animate-slide-up-1"
        />
        <StatsCard
          title="Prochain Match"
          value="15 Nov"
          description="Super Ligue 2023"
          icon={<Calendar className="h-4 w-4 text-accent" />}
          className="animate-slide-up-2"
        />
        <StatsCard
          title="Performance"
          value="+28"
          trend="up"
          trendValue="12%"
          icon={<Activity className="h-4 w-4 text-accent" />}
          className="animate-slide-up-3"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1 animate-slide-up">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl">Mes Ligues</CardTitle>
              <CardDescription>Gérez vos ligues actives</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="button-effect">
              <PlusCircle className="h-4 w-4 mr-2" />
              Créer
            </Button>
          </CardHeader>
          <CardContent className="pb-0">
            <div className="space-y-4">
              {mockLeagues.map((league) => (
                <div key={league.id} className="group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <Trophy className="h-5 w-5 text-accent" />
                      </div>
                      <div className="ml-3">
                        <h3 className="font-medium group-hover:text-accent transition-colors">
                          {league.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {league.members} membres
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                  {mockLeagues.indexOf(league) < mockLeagues.length - 1 && (
                    <Separator className="my-4" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="pt-4">
            <Link to="/leagues" className="text-sm text-accent hover:text-accent/80 transition-colors">
              Voir toutes les ligues
            </Link>
          </CardFooter>
        </Card>

        <Card className="col-span-1 animate-slide-up-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Activité Récente</CardTitle>
            <CardDescription>
              Dernières mises à jour et événements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative space-y-4 before:absolute before:top-0 before:bottom-0 before:left-[19px] before:w-[1px] before:bg-border">
              {[1, 2, 3].map((i) => (
                <div key={i} className="relative pl-10">
                  <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {i === 1 ? "Nouveau joueur ajouté" : i === 2 ? "Match terminé" : "Points mis à jour"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {i === 1 ? "Il y a 2 heures" : i === 2 ? "Hier, 20:45" : "Il y a 2 jours"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
