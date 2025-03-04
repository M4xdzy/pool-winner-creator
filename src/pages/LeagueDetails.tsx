
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Users, CalendarDays, MessageSquare, Trophy, Star, Settings, UserPlus, KeyRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useLeagues, League, Member } from '@/hooks/useLeagues';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const LeagueDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { getLeagueById, getLeagueMembers, joinLeague, isLoading: leagueLoading } = useLeagues();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [league, setLeague] = useState<League | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [isCurrentUserMember, setIsCurrentUserMember] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  
  useEffect(() => {
    const fetchLeagueData = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await getLeagueById(id);
        if (error) throw error;
        if (data) setLeague(data);
        
        const { data: membersData, error: membersError } = await getLeagueMembers(id);
        if (membersError) throw membersError;
        
        if (membersData) {
          setMembers(membersData);
          
          if (user) {
            setIsCurrentUserMember(
              membersData.some(member => member.user_id === user.id)
            );
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données de la ligue:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les détails de la ligue',
          variant: 'destructive',
        });
      }
    };
    
    fetchLeagueData();
  }, [id, user]);
  
  const handleJoinLeague = async () => {
    if (!user) {
      toast({
        title: 'Connexion requise',
        description: 'Vous devez être connecté pour rejoindre une ligue',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }
    
    if (!league || isJoining) return;
    
    if (league.is_private) {
      setShowInviteDialog(true);
      return;
    }
    
    setIsJoining(true);
    try {
      const { success, error } = await joinLeague(id!);
      if (error) throw error;
      
      if (success) {
        const { data } = await getLeagueMembers(id!);
        if (data) {
          setMembers(data);
          setIsCurrentUserMember(true);
          
          toast({
            title: 'Succès',
            description: 'Vous avez rejoint la ligue avec succès',
          });
        }
      }
    } catch (error) {
      console.error('Erreur lors de la tentative de rejoindre la ligue:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de rejoindre la ligue',
        variant: 'destructive',
      });
    } finally {
      setIsJoining(false);
    }
  };
  
  const handleJoinPrivateLeague = async () => {
    if (!league || isJoining) return;
    
    setIsJoining(true);
    try {
      const { success, error } = await joinLeague(id!, inviteCode);
      if (error) throw error;
      
      if (success) {
        setShowInviteDialog(false);
        const { data } = await getLeagueMembers(id!);
        if (data) {
          setMembers(data);
          setIsCurrentUserMember(true);
          
          toast({
            title: 'Succès',
            description: 'Vous avez rejoint la ligue privée avec succès',
          });
        }
      } else {
        toast({
          title: 'Erreur',
          description: 'Code d\'invitation invalide',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erreur lors de la tentative de rejoindre la ligue privée:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de rejoindre la ligue privée',
        variant: 'destructive',
      });
    } finally {
      setIsJoining(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP', { locale: fr });
    } catch (e) {
      return dateString;
    }
  };
  
  if (!league) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <Navigation />
        <main className="pt-24 pb-16 lg:pl-64 pl-[74px] pr-4 lg:pr-6">
          <div className="max-w-6xl mx-auto text-center py-12">
            {leagueLoading ? (
              <p>Chargement des détails de la ligue...</p>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-2">Ligue non trouvée</h2>
                <p className="text-muted-foreground mb-4">
                  La ligue que vous recherchez n'existe pas ou vous n'avez pas accès à celle-ci.
                </p>
                <Button asChild>
                  <Link to="/leagues">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour aux ligues
                  </Link>
                </Button>
              </>
            )}
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Navigation />
      
      <main className="pt-24 pb-16 lg:pl-64 pl-[74px] pr-4 lg:pr-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Button asChild variant="ghost" className="mb-4">
              <Link to="/leagues">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux ligues
              </Link>
            </Button>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <h1 className="text-3xl font-bold tracking-tight">{league.name}</h1>
                  {league.is_private && (
                    <Badge variant="outline" className="ml-2">Privée</Badge>
                  )}
                </div>
                <p className="text-muted-foreground">
                  {league.description || `Une ligue ${league.season_type === 'weekly' ? 'hebdomadaire' : league.season_type === 'monthly' ? 'mensuelle' : 'de saison complète'}`}
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{members.length}/{league.max_participants} membres</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4 mr-1" />
                    <span>Créée le {formatDate(league.created_at)}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
                {isCurrentUserMember ? (
                  <>
                    <Button variant="outline">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Chat de ligue
                    </Button>
                    {user && league.creator_id === user.id && (
                      <Button asChild>
                        <Link to={`/leagues/${id}/manage`}>
                          <Settings className="h-4 w-4 mr-2" />
                          Gérer la ligue
                        </Link>
                      </Button>
                    )}
                  </>
                ) : (
                  league.is_private ? (
                    <Button onClick={handleJoinLeague}>
                      <KeyRound className="h-4 w-4 mr-2" />
                      Rejoindre avec invitation
                    </Button>
                  ) : (
                    <Button onClick={handleJoinLeague} disabled={isJoining}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      {isJoining ? 'Rejoignez la ligue...' : 'Rejoindre la ligue'}
                    </Button>
                  )
                )}
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <Tabs defaultValue="members" className="animate-fade-in">
            <TabsList className="mb-6">
              <TabsTrigger value="members">Membres</TabsTrigger>
              <TabsTrigger value="standings">Classement</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
            </TabsList>
            
            <TabsContent value="members" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {members.map((member) => (
                  <Card key={member.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={member.profile.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${member.profile.username}`} />
                          <AvatarFallback>{member.profile.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.profile.username}</div>
                          <div className="text-sm text-muted-foreground">{member.profile.full_name || 'Membre'}</div>
                          {league.creator_id === member.user_id && (
                            <Badge variant="secondary" className="mt-1">
                              <Star className="h-3 w-3 mr-1" />
                              Créateur
                            </Badge>
                          )}
                        </div>
                      </div>
                      {member.team && (
                        <div className="mt-3 pt-3 border-t">
                          <div className="text-sm font-medium flex items-center">
                            <Trophy className="h-3 w-3 mr-1 text-amber-500" />
                            Équipe: {member.team.name}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {member.team.points} points {member.team.rank && `· Rang #${member.team.rank}`}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="standings">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">Classement à venir</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Le classement sera disponible une fois que la ligue sera active et que les équipes commenceront à accumuler des points.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="draft">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">Draft à venir</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Le draft sera disponible une fois que suffisamment de joueurs auront rejoint la ligue.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      {/* Private League Join Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejoindre une ligue privée</DialogTitle>
            <DialogDescription>
              Entrez le code d'invitation pour rejoindre "{league.name}"
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Input
              placeholder="Code d'invitation"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="w-full"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleJoinPrivateLeague} disabled={isJoining || !inviteCode}>
              {isJoining ? 'Vérification...' : 'Rejoindre'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeagueDetails;
