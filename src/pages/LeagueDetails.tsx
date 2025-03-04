
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Users, Calendar, Globe, Lock, ChevronLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { AuthGuard } from '@/components/auth/AuthGuard';

interface League {
  id: string;
  name: string;
  description: string | null;
  creator_id: string;
  max_participants: number;
  draft_type: string;
  season_type: string;
  is_private: boolean;
  invitation_code: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  creator?: {
    username: string;
    avatar_url: string | null;
  };
  members?: Member[];
  member_count?: number;
}

interface Member {
  id: string;
  user_id: string;
  joined_at: string;
  profile: {
    username: string;
    full_name: string | null;
    avatar_url: string | null;
  };
  team?: {
    id: string;
    name: string;
    points: number;
    rank: number | null;
  };
}

const LeagueDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [league, setLeague] = useState<League | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeagueDetails = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Récupérer les détails de la ligue
        const { data: leagueData, error: leagueError } = await supabase
          .from('leagues')
          .select(`
            *,
            creator:profiles!creator_id(username, avatar_url)
          `)
          .eq('id', id)
          .single();
        
        if (leagueError) throw leagueError;
        
        // Récupérer les membres de la ligue
        const { data: membersData, error: membersError } = await supabase
          .from('league_members')
          .select(`
            *,
            profile:profiles!user_id(username, full_name, avatar_url),
            team:user_teams!inner(id, name, points, rank)
          `)
          .eq('league_id', id)
          .order('joined_at', { ascending: true });
        
        if (membersError) throw membersError;
        
        setLeague({
          ...leagueData,
          members: membersData,
          member_count: membersData.length
        });
      } catch (err: any) {
        console.error('Error fetching league details:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLeagueDetails();
  }, [id]);

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background text-foreground">
          <Header />
          <Navigation />
          
          <main className="pt-24 pb-16 lg:pl-64 pl-[74px] pr-4 lg:pr-6">
            <div className="max-w-6xl mx-auto">
              <div className="animate-pulse">
                <Skeleton className="h-10 w-64 mb-2" />
                <Skeleton className="h-4 w-1/3 mb-8" />
                
                <div className="grid gap-6 md:grid-cols-3">
                  <Skeleton className="h-40 rounded-lg" />
                  <Skeleton className="h-40 rounded-lg" />
                  <Skeleton className="h-40 rounded-lg" />
                </div>
              </div>
            </div>
          </main>
        </div>
      </AuthGuard>
    );
  }

  if (error || !league) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background text-foreground">
          <Header />
          <Navigation />
          
          <main className="pt-24 pb-16 lg:pl-64 pl-[74px] pr-4 lg:pr-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-2">Erreur de chargement</h2>
                <p className="text-muted-foreground mb-6">{error || "La ligue n'a pas pu être trouvée"}</p>
                <Button onClick={() => navigate('/leagues')}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Retour aux ligues
                </Button>
              </div>
            </div>
          </main>
        </div>
      </AuthGuard>
    );
  }

  const getSeasonTypeLabel = (type: string) => {
    switch(type) {
      case 'weekly': return 'Hebdomadaire';
      case 'monthly': return 'Mensuelle';
      case 'full': return 'Saison complète';
      default: return type;
    }
  };
  
  const getDraftTypeLabel = (type: string) => {
    switch(type) {
      case 'manual': return 'Manuel';
      case 'auto': return 'Automatique';
      default: return type;
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'draft': return 'En préparation';
      case 'active': return 'Active';
      case 'completed': return 'Terminée';
      default: return status;
    }
  };

  const isCreator = league.creator_id === user?.id;
  const isMember = league.members?.some(member => member.user_id === user?.id) || false;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <Navigation />
        
        <main className="pt-24 pb-16 lg:pl-64 pl-[74px] pr-4 lg:pr-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6 flex items-center">
              <Button variant="ghost" onClick={() => navigate('/leagues')} className="mr-4">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              
              <div>
                <h1 className="text-3xl font-bold">{league.name}</h1>
                <div className="flex items-center mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    league.status === 'active' ? 'bg-green-100 text-green-800' : 
                    league.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {getStatusLabel(league.status)}
                  </span>
                  <span className="ml-3 text-sm text-muted-foreground flex items-center">
                    {league.is_private ? (
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
                  </span>
                </div>
              </div>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Informations</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Type de saison:</dt>
                      <dd>{getSeasonTypeLabel(league.season_type)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Type de draft:</dt>
                      <dd>{getDraftTypeLabel(league.draft_type)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Participants:</dt>
                      <dd>{league.member_count} / {league.max_participants}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Créateur:</dt>
                      <dd>{league.creator?.username}</dd>
                    </div>
                    {league.is_private && isCreator && (
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Code d'invitation:</dt>
                        <dd className="font-mono">{league.invitation_code}</dd>
                      </div>
                    )}
                  </dl>
                  
                  {league.description && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-sm">{league.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base">Membres</CardTitle>
                    <span className="text-sm text-muted-foreground">
                      {league.member_count} / {league.max_participants}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {league.members && league.members.map((member) => (
                      <li key={member.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-3">
                            <AvatarImage src={member.profile.avatar_url || ''} />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {member.profile.username.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">
                              {member.profile.username}
                              {member.user_id === league.creator_id && (
                                <span className="ml-2 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                                  Créateur
                                </span>
                              )}
                            </p>
                            {member.team && (
                              <p className="text-xs text-muted-foreground">
                                Équipe: {member.team.name}
                              </p>
                            )}
                          </div>
                        </div>
                        {member.team && (
                          <div className="text-right">
                            <p className="text-sm font-medium">{member.team.points} pts</p>
                            {member.team.rank && (
                              <p className="text-xs text-muted-foreground">
                                Rang: #{member.team.rank}
                              </p>
                            )}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <Tabs defaultValue="standings" className="animate-fade-in">
              <TabsList className="mb-6">
                <TabsTrigger value="standings">Classement</TabsTrigger>
                <TabsTrigger value="schedule">Calendrier</TabsTrigger>
                <TabsTrigger value="chat">Discussion</TabsTrigger>
                {isCreator && <TabsTrigger value="settings">Paramètres</TabsTrigger>}
              </TabsList>
              
              <TabsContent value="standings" className="space-y-6 animate-slide-up">
                <Card>
                  <CardHeader>
                    <CardTitle>Classement de la ligue</CardTitle>
                    <CardDescription>
                      Positions et performances des équipes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Contenu à implémenter */}
                    <div className="text-center py-8 text-muted-foreground">
                      {league.status === 'draft' ? (
                        "La ligue est en préparation. Le classement sera disponible une fois la saison commencée."
                      ) : (
                        "Aucune donnée de classement disponible pour le moment."
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="schedule" className="space-y-6 animate-slide-up">
                <Card>
                  <CardHeader>
                    <CardTitle>Calendrier des matchs</CardTitle>
                    <CardDescription>
                      Prochains matchs et résultats
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Contenu à implémenter */}
                    <div className="text-center py-8 text-muted-foreground">
                      Le calendrier sera disponible une fois la saison commencée.
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="chat" className="space-y-6 animate-slide-up">
                <Card>
                  <CardHeader>
                    <CardTitle>Discussion de ligue</CardTitle>
                    <CardDescription>
                      Discutez avec les autres membres de la ligue
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Contenu à implémenter */}
                    <div className="text-center py-8 text-muted-foreground">
                      La fonctionnalité de chat sera bientôt disponible.
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {isCreator && (
                <TabsContent value="settings" className="space-y-6 animate-slide-up">
                  <Card>
                    <CardHeader>
                      <CardTitle>Paramètres de la ligue</CardTitle>
                      <CardDescription>
                        Gérez les paramètres et options de votre ligue
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* Contenu à implémenter */}
                      <div className="text-center py-8 text-muted-foreground">
                        Les paramètres avancés de la ligue seront bientôt disponibles.
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
};

export default LeagueDetails;
