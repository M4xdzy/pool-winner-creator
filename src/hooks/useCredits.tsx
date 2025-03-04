
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'purchase' | 'reward' | 'expense';
  description: string;
  created_at: string;
}

export const useCredits = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, profile, refreshProfile } = useAuth();

  // Récupère les transactions de crédits de l'utilisateur
  const getTransactions = async (): Promise<{ data: Transaction[] | null; error: any }> => {
    if (!user) {
      return { data: null, error: new Error('Utilisateur non connecté') };
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('credit_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erreur lors de la récupération des transactions:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de récupérer vos transactions',
        variant: 'destructive',
      });
      return { data: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Ajoute des crédits à l'utilisateur
  const addCredits = async (amount: number): Promise<{ success: boolean; newCredits?: number; error: any }> => {
    if (!user) {
      toast({
        title: 'Erreur',
        description: 'Vous devez être connecté pour acheter des crédits',
        variant: 'destructive',
      });
      return { success: false, error: new Error('Utilisateur non connecté') };
    }

    setIsLoading(true);
    try {
      // Appel à l'edge function pour ajouter des crédits
      const { data, error } = await supabase.functions.invoke('add_credits', {
        body: { user_id: user.id, amount, description: 'Achat de crédits' }
      });

      if (error) throw error;

      // Rafraîchir le profil pour mettre à jour le nombre de crédits affiché
      await refreshProfile();

      toast({
        title: 'Succès',
        description: `Vous avez acheté ${amount} crédits avec succès`,
      });

      return { success: true, newCredits: data.credits, error: null };
    } catch (error) {
      console.error('Erreur lors de l\'ajout de crédits:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'ajouter des crédits',
        variant: 'destructive',
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    credits: profile?.credits || 0,
    isLoading,
    getTransactions,
    addCredits,
  };
};
