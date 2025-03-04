
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export function useCredits() {
  const { user } = useAuth();
  const [credits, setCredits] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCredits = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setCredits(data.credits);
    } catch (err: any) {
      console.error('Error fetching credits:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  const addCredits = async (amount: number, description: string) => {
    if (!user) return { error: new Error('Utilisateur non authentifié') };

    try {
      // Ajouter les crédits au profil directement avec une mise à jour
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ credits: (credits || 0) + amount })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Enregistrer la transaction
      const { error: transactionError } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: user.id,
          amount: amount,
          type: 'purchase',
          description: description
        });

      if (transactionError) throw transactionError;
      
      await fetchCredits();
      toast.success(`${amount} crédits ajoutés avec succès!`);
      
      return { error: null };
    } catch (error: any) {
      toast.error(`Erreur lors de l'ajout de crédits: ${error.message}`);
      return { error };
    }
  };

  return {
    credits,
    isLoading,
    error,
    fetchCredits,
    addCredits
  };
}
