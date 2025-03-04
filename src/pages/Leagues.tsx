
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Search, Trophy, Users, Calendar, Settings, Lock, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useLeagues, League } from '@/hooks/useLeagues';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface LeagueCardProps {
  name: string;
  members: number;
  type: string;
  private: boolean;
  draftDate?: string;
  id: string;
}

const LeagueCard = ({ name, members, type, private: isPrivate, draftDate, id }: LeagueCardProps) => (
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
        <Button className="button-effect" size="sm" asChild>
          <Link to={`/leagues/${id}`}>Gérer</Link>
        </Button>
      </div>
    </CardContent>
  </Card>
);

const Leagues = () => {
  const { getLeagues, createLeague, isLoading } = useLeagues();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [myLeagues, setMyLeagues] = useState<League[]>([]);
  const [publicLeagues, setPublicLeagues] = useState<League[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    max_participants: 12,
    season_type: 'weekly',
    draft_type: 'manual',
    is_private: false
  });
  
  useEffect(() => {
    fetchLeagues();
  }, [user]);
  
  const fetchLeagues = async () => {
    try {
      const { data } = await getLeagues();
      
      if (data && user) {
        const userLeagues = data.filter(league => {
          // Check if user is creator or member (simplified, we should actually query league_members)
          return league.creator_id === user.id;
        });
        
        const otherLeagues = data.filter(league => {
          // Public leagues that user is not creator of
          return !league.is_private && league.creator_id !== user.id;
        });
        
        setMyLeagues(userLeagues);
        setPublicLeagues(otherLeagues);
      } else if (data) {
        // If no user, just show public leagues
        const allPublicLeagues = data.filter(league => !league.is_private);
        setPublicLeagues(allPublicLeagues);
      }
    } catch (error) {
      console.error('Error fetching leagues:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de récupérer les ligues',
        variant: 'destructive',
      });
    }
  };
  
  const handleCreateLeague = async () => {
    if (!user) {
      toast({
        title: 'Connexion requise',
        description: 'Vous devez être connecté pour créer une ligue',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }
    
    try {
      const { data, error } = await createLeague(formData);
      
      if (error) throw error;
      
      if (data) {
        setIsCreateModalOpen(false);
        setFormData({
          name: '',
          description: '',
          max_participants: 12,
          season_type: 'weekly',
          draft_type: 'manual',
          is_private: false
        });
        
        // Refresh leagues
        fetchLeagues();
        
        // Navigate to the new league
        navigate(`/leagues/${data.id}`);
      }
    } catch (error) {
      console.error('Error creating league:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de créer la ligue',
        variant: 'destructive',
      });
    }
  };
  
  const filteredMyLeagues = myLeagues.filter(league => 
    league.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredPublicLeagues = publicLeagues.filter(league => 
    league.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
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
              <Button className="button-effect" onClick={() => setIsCreateModalOpen(true)}>
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Tabs defaultValue="my-leagues" className="animate-fade-in">
            <TabsList className="mb-6">
              <TabsTrigger value="my-leagues">Mes Ligues</TabsTrigger>
              <TabsTrigger value="discover">Découvrir</TabsTrigger>
              <TabsTrigger value="archived">Archivées</TabsTrigger>
            </TabsList>
            
            <TabsContent value="my-leagues" className="space-y-6">
              {isLoading ? (
                <div className="text-center py-8">Chargement des ligues...</div>
              ) : filteredMyLeagues.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {filteredMyLeagues.map((league) => (
                    <LeagueCard
                      key={league.id}
                      id={league.id}
                      name={league.name}
                      members={12} // Should be calculated from members count
                      type={league.season_type === 'weekly' ? 'Hebdomadaire' : 
                            league.season_type === 'monthly' ? 'Mensuelle' : 'Saison complète'}
                      private={league.is_private}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">Aucune ligue trouvée</h3>
                  <p className="text-sm text-muted-foreground max-w-md mb-4">
                    Vous n'avez pas encore créé ou rejoint de ligues. Créez votre première ligue ou découvrez des ligues existantes.
                  </p>
                  <Button onClick={() => setIsCreateModalOpen(true)}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Créer une ligue
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="discover" className="space-y-6">
              {isLoading ? (
                <div className="text-center py-8">Chargement des ligues...</div>
              ) : filteredPublicLeagues.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {filteredPublicLeagues.map((league) => (
                    <LeagueCard
                      key={league.id}
                      id={league.id}
                      name={league.name}
                      members={12} // Should be calculated from members count
                      type={league.season_type === 'weekly' ? 'Hebdomadaire' : 
                            league.season_type === 'monthly' ? 'Mensuelle' : 'Saison complète'}
                      private={league.is_private}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">Aucune ligue publique trouvée</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Il n'y a pas de ligues publiques disponibles pour le moment. Pourquoi ne pas créer la vôtre?
                  </p>
                </div>
              )}
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
      
      {/* Create League Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Créer une nouvelle ligue</DialogTitle>
            <DialogDescription>
              Configurez votre ligue de hockey fantasy. Vous pourrez inviter des joueurs après la création.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de la ligue</Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. Ligue des Champions 2024"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (optionnel)</Label>
              <Textarea 
                id="description" 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Décrivez votre ligue..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="max_participants">Participants Max</Label>
                <Select 
                  value={String(formData.max_participants)}
                  onValueChange={(value) => setFormData({...formData, max_participants: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4">4 joueurs</SelectItem>
                    <SelectItem value="8">8 joueurs</SelectItem>
                    <SelectItem value="12">12 joueurs</SelectItem>
                    <SelectItem value="16">16 joueurs</SelectItem>
                    <SelectItem value="24">24 joueurs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="season_type">Type de saison</Label>
                <Select 
                  value={formData.season_type}
                  onValueChange={(value) => setFormData({...formData, season_type: value as 'weekly' | 'monthly' | 'full'})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Hebdomadaire</SelectItem>
                    <SelectItem value="monthly">Mensuelle</SelectItem>
                    <SelectItem value="full">Saison complète</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="draft_type">Type de draft</Label>
              <Select 
                value={formData.draft_type}
                onValueChange={(value) => setFormData({...formData, draft_type: value as 'manual' | 'auto'})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manuel (à tour de rôle)</SelectItem>
                  <SelectItem value="auto">Automatique (aléatoire)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Switch 
                id="is_private"
                checked={formData.is_private}
                onCheckedChange={(checked) => setFormData({...formData, is_private: checked})}
              />
              <Label htmlFor="is_private">Ligue privée (requiert une invitation)</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              onClick={handleCreateLeague}
              disabled={!formData.name || isLoading}
            >
              {isLoading ? 'Création...' : 'Créer la ligue'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Leagues;
