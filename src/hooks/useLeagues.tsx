
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

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
  // Champs virtuels (non stockés en DB)
  member_count?: number;
  is_member?: boolean;
  is_creator?: boolean;
}

interface CreateLeagueData {
  name: string;
  description?: string;
  max_participants?: number;
  draft_type?: string;
  season_type?: string;
  is_private?: boolean;
}

export function useLeagues() {
  const { user } = useAuth();
  const [myLeagues, setMyLeagues] = useState<League[]>([]);
  const [publicLeagues, setPublicLeagues] = useState<League[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMyLeagues = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Récupérer les ligues dont je suis membre ou créateur
      const { data, error } = await supabase
        .from('leagues')
        .select(`
          *,
          league_members!league_id(count)
        `)
        .or(`creator_id.eq.${user.id},league_members.user_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transformer les données pour ajouter le nombre de membres
      const leaguesWithMemberCount = data.map(league => ({
        ...league,
        member_count: league.league_members[0]?.count || 0,
        is_creator: league.creator_id === user.id,
        is_member: true
      }));
      
      setMyLeagues(leaguesWithMemberCount);
    } catch (err: any) {
      console.error('Error fetching my leagues:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const fetchPublicLeagues = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Récupérer les ligues publiques dont je ne suis pas membre
      const { data, error } = await supabase
        .from('leagues')
        .select(`
          *,
          league_members!league_id(count)
        `)
        .eq('is_private', false)
        .not('creator_id', 'eq', user.id)
        .not('league_members.user_id', 'eq', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transformer les données pour ajouter le nombre de membres
      const leaguesWithMemberCount = data.map(league => ({
        ...league,
        member_count: league.league_members[0]?.count || 0,
        is_creator: false,
        is_member: false
      }));
      
      setPublicLeagues(leaguesWithMemberCount);
    } catch (err: any) {
      console.error('Error fetching public leagues:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMyLeagues();
    fetchPublicLeagues();
  }, [fetchMyLeagues, fetchPublicLeagues]);

  const createLeague = async (leagueData: CreateLeagueData) => {
    if (!user) return { error: new Error('Utilisateur non authentifié') };

    try {
      // Générer un code d'invitation si la ligue est privée
      const invitationCode = leagueData.is_private 
        ? Math.random().toString(36).substring(2, 10).toUpperCase()
        : null;
      
      // Créer la ligue
      const { data: leagueData, error: leagueError } = await supabase
        .from('leagues')
        .insert({
          name: leagueData.name,
          description: leagueData.description || null,
          creator_id: user.id,
          max_participants: leagueData.max_participants || 12,
          draft_type: leagueData.draft_type || 'manual',
          season_type: leagueData.season_type || 'weekly',
          is_private: leagueData.is_private || false,
          invitation_code: invitationCode,
          status: 'draft'
        })
        .select()
        .single();

      if (leagueError) throw leagueError;
      
      // Ajouter le créateur comme membre de la ligue
      const { error: memberError } = await supabase
        .from('league_members')
        .insert({
          league_id: leagueData.id,
          user_id: user.id
        });

      if (memberError) throw memberError;
      
      // Rafraîchir les ligues
      await fetchMyLeagues();
      
      toast.success('Ligue créée avec succès!');
      return { data: leagueData, error: null };
    } catch (error: any) {
      toast.error(`Erreur lors de la création de la ligue: ${error.message}`);
      return { data: null, error };
    }
  };

  const joinLeague = async (leagueId: string, invitationCode?: string) => {
    if (!user) return { error: new Error('Utilisateur non authentifié') };

    try {
      // Vérifier si la ligue existe et si le code d'invitation est valide
      const { data: leagueData, error: leagueError } = await supabase
        .from('leagues')
        .select('*')
        .eq('id', leagueId)
        .single();

      if (leagueError) throw leagueError;
      
      if (leagueData.is_private && leagueData.invitation_code !== invitationCode) {
        throw new Error('Code d\'invitation invalide');
      }
      
      // Ajouter l'utilisateur comme membre de la ligue
      const { error: memberError } = await supabase
        .from('league_members')
        .insert({
          league_id: leagueId,
          user_id: user.id
        });

      if (memberError) throw memberError;
      
      // Rafraîchir les ligues
      await fetchMyLeagues();
      await fetchPublicLeagues();
      
      toast.success('Vous avez rejoint la ligue avec succès!');
      return { error: null };
    } catch (error: any) {
      toast.error(`Erreur lors de l'adhésion à la ligue: ${error.message}`);
      return { error };
    }
  };

  return {
    myLeagues,
    publicLeagues,
    isLoading,
    error,
    fetchMyLeagues,
    fetchPublicLeagues,
    createLeague,
    joinLeague
  };
}
