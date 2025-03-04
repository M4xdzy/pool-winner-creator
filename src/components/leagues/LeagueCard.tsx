
import React from 'react';
import { Trophy, Users, Calendar, Settings, Lock, Globe, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface League {
  id: string;
  name: string;
  description: string | null;
  max_participants: number;
  draft_type: string;
  season_type: string;
  is_private: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  member_count?: number;
  is_member?: boolean;
  is_creator?: boolean;
}

interface LeagueCardProps {
  league: League;
  onJoin?: (leagueId: string) => void;
  onManage?: (leagueId: string) => void;
}

export function LeagueCard({ league, onJoin, onManage }: LeagueCardProps) {
  const navigate = useNavigate();
  
  const handleManage = () => {
    if (onManage) {
      onManage(league.id);
    } else {
      navigate(`/leagues/${league.id}`);
    }
  };
  
  const handleJoin = () => {
    if (onJoin) {
      onJoin(league.id);
    }
  };

  const getSeasonTypeLabel = (type: string) => {
    switch(type) {
      case 'weekly': return 'Hebdomadaire';
      case 'monthly': return 'Mensuelle';
      case 'full': return 'Saison complète';
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

  const creationDate = new Date(league.created_at);
  const timeAgo = formatDistanceToNow(creationDate, { addSuffix: true, locale: fr });

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md animate-scale-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="mr-3 h-10 w-10 rounded-full bg-muted flex items-center justify-center">
              <Trophy className="h-5 w-5 text-accent" />
            </div>
            <div>
              <CardTitle className="text-xl mb-1">{league.name}</CardTitle>
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Users className="h-3 w-3 mr-1" />
                  <span>{league.member_count || 0} / {league.max_participants} membres</span>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
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
                </div>
              </div>
            </div>
          </div>
          {league.is_creator && (
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs font-medium">Type: {getSeasonTypeLabel(league.season_type)}</p>
            <div className="flex items-center mt-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              <span>Créée {timeAgo}</span>
            </div>
            <div className="mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                league.status === 'active' ? 'bg-green-100 text-green-800' : 
                league.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                'bg-amber-100 text-amber-800'
              }`}>
                {getStatusLabel(league.status)}
              </span>
            </div>
          </div>
          {league.is_member ? (
            <Button className="button-effect" size="sm" onClick={handleManage}>
              Gérer
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          ) : (
            <Button className="button-effect" size="sm" onClick={handleJoin} disabled={league.is_private}>
              Rejoindre
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
