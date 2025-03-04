
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

export interface League {
  id: string;
  name: string;
  description?: string;
  creator_id: string;
  max_participants: number;
  draft_type: 'manual' | 'auto';
  season_type: 'weekly' | 'monthly' | 'full';
  is_private: boolean;
  invitation_code?: string;
  status: 'draft' | 'active' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface Member {
  id: string;
  league_id: string;
  user_id: string;
  joined_at: string;
  profile: {
    username: string;
    full_name: string;
    avatar_url: string;
  };
  team?: {
    id: string;
    name: string;
    points: number;
    rank?: number;
  };
}

export interface CreateLeagueData {
  name: string;
  description?: string;
  max_participants?: number;
  season_type?: 'weekly' | 'monthly' | 'full';
  draft_type?: 'manual' | 'auto';
  is_private?: boolean;
}

export const useLeagues = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Récupère toutes les ligues
  const getLeagues = async (): Promise<{ data: League[] | null; error: any }> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('leagues')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Ensure the data conforms to the League type
      const typedData = data?.map(league => ({
        ...league,
        draft_type: league.draft_type as 'manual' | 'auto',
        season_type: league.season_type as 'weekly' | 'monthly' | 'full',
        status: league.status as 'draft' | 'active' | 'completed'
      }));
      
      return { data: typedData, error: null };
    } catch (error) {
      console.error('Erreur lors de la récupération des ligues:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de récupérer les ligues',
        variant: 'destructive',
      });
      return { data: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Récupère une ligue par son ID
  const getLeagueById = async (id: string): Promise<{ data: League | null; error: any }> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('leagues')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      // Ensure the data conforms to the League type
      const typedData: League = {
        ...data,
        draft_type: data.draft_type as 'manual' | 'auto',
        season_type: data.season_type as 'weekly' | 'monthly' | 'full',
        status: data.status as 'draft' | 'active' | 'completed'
      };
      
      return { data: typedData, error: null };
    } catch (error) {
      console.error(`Erreur lors de la récupération de la ligue ${id}:`, error);
      toast({
        title: 'Erreur',
        description: 'Impossible de récupérer les détails de la ligue',
        variant: 'destructive',
      });
      return { data: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Récupère les membres d'une ligue
  const getLeagueMembers = async (leagueId: string): Promise<{ data: Member[] | null; error: any }> => {
    setIsLoading(true);
    try {
      // First get all members of the league
      const { data: membersData, error: membersError } = await supabase
        .from('league_members')
        .select('*')
        .eq('league_id', leagueId);

      if (membersError) throw membersError;
      
      // Now manually get profiles for each member
      const members: Member[] = [];
      for (const member of membersData) {
        // Get profile data
        const { data: profileData } = await supabase
          .from('profiles')
          .select('username, full_name, avatar_url')
          .eq('id', member.user_id)
          .single();
          
        // Get team data if exists
        const { data: teamData } = await supabase
          .from('user_teams')
          .select('id, name, points, rank')
          .eq('user_id', member.user_id)
          .eq('league_id', leagueId);
          
        members.push({
          ...member,
          profile: profileData || { 
            username: 'Utilisateur inconnu', 
            full_name: '', 
            avatar_url: '' 
          },
          team: teamData && teamData.length > 0 ? teamData[0] : undefined
        });
      }
      
      return { data: members, error: null };
    } catch (error) {
      console.error(`Erreur lors de la récupération des membres de la ligue ${leagueId}:`, error);
      toast({
        title: 'Erreur',
        description: 'Impossible de récupérer les membres de la ligue',
        variant: 'destructive',
      });
      return { data: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Crée une nouvelle ligue
  const createLeague = async (leagueData: CreateLeagueData): Promise<{ data: League | null; error: any }> => {
    setIsLoading(true);
    try {
      if (!user) throw new Error('Vous devez être connecté pour créer une ligue');
      
      const newLeague = {
        creator_id: user.id,
        name: leagueData.name,
        description: leagueData.description || '',
        max_participants: leagueData.max_participants || 12,
        season_type: leagueData.season_type || 'weekly',
        draft_type: leagueData.draft_type || 'manual',
        is_private: leagueData.is_private || false,
        invitation_code: leagueData.is_private ? Math.random().toString(36).substring(2, 10).toUpperCase() : null,
        status: 'draft'
      };

      const { data, error } = await supabase
        .from('leagues')
        .insert(newLeague)
        .select()
        .single();

      if (error) throw error;

      // Add the creator as a member
      const { error: memberError } = await supabase
        .from('league_members')
        .insert({ league_id: data.id, user_id: user.id });

      if (memberError) throw memberError;

      toast({
        title: 'Succès',
        description: 'Votre ligue a été créée avec succès',
      });

      // Ensure the data conforms to the League type
      const typedData: League = {
        ...data,
        draft_type: data.draft_type as 'manual' | 'auto',
        season_type: data.season_type as 'weekly' | 'monthly' | 'full',
        status: data.status as 'draft' | 'active' | 'completed'
      };
      
      return { data: typedData, error: null };
    } catch (error) {
      console.error('Erreur lors de la création de la ligue:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de créer la ligue',
        variant: 'destructive',
      });
      return { data: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Rejoint une ligue
  const joinLeague = async (leagueId: string, invitationCode?: string): Promise<{ success: boolean; error: any }> => {
    setIsLoading(true);
    try {
      if (!user) throw new Error('Vous devez être connecté pour rejoindre une ligue');

      // Vérifier si la ligue est privée et si un code d'invitation est requis
      const { data: league, error: leagueError } = await supabase
        .from('leagues')
        .select('is_private, invitation_code')
        .eq('id', leagueId)
        .single();

      if (leagueError) throw leagueError;

      if (league.is_private && league.invitation_code !== invitationCode) {
        throw new Error('Code d\'invitation invalide');
      }

      // Vérifier si l'utilisateur est déjà membre de la ligue
      const { data: existingMember, error: memberCheckError } = await supabase
        .from('league_members')
        .select('id')
        .eq('league_id', leagueId)
        .eq('user_id', user.id);

      if (memberCheckError) throw memberCheckError;

      if (existingMember && existingMember.length > 0) {
        throw new Error('Vous êtes déjà membre de cette ligue');
      }

      // Ajouter l'utilisateur comme membre de la ligue
      const { error: joinError } = await supabase
        .from('league_members')
        .insert({ league_id: leagueId, user_id: user.id });

      if (joinError) throw joinError;

      toast({
        title: 'Succès',
        description: 'Vous avez rejoint la ligue avec succès',
      });

      return { success: true, error: null };
    } catch (error) {
      console.error('Erreur lors de la tentative de rejoindre la ligue:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de rejoindre la ligue',
        variant: 'destructive',
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    getLeagues,
    getLeagueById,
    getLeagueMembers,
    createLeague,
    joinLeague,
  };
};
