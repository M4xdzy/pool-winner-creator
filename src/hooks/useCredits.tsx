
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export const useCredits = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const getUserCredits = async (): Promise<number> => {
    if (!user) return 0;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .single();

      if (error) {
        throw error;
      }

      return data?.credits || 0;
    } catch (error) {
      console.error('Error fetching user credits:', error);
      return 0;
    } finally {
      setIsLoading(false);
    }
  };

  const purchaseCredits = async (amount: number): Promise<boolean> => {
    if (!user) {
      toast.error('Vous devez être connecté pour acheter des crédits');
      return false;
    }

    try {
      setIsLoading(true);

      // Utiliser la fonction Edge Function pour ajouter des crédits
      const response = await fetch(`${supabase.supabaseUrl}/functions/v1/add_credits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.supabaseKey}`
        },
        body: JSON.stringify({
          user_id: user.id,
          amount: amount,
          description: 'Achat de crédits'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Échec de l\'achat');
      }

      toast.success(`Vous avez acheté ${amount} crédits avec succès!`);
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'achat de crédits:', error);
      toast.error(`Échec de l'achat: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const useCredits = async (amount: number, description: string): Promise<boolean> => {
    if (!user) {
      toast.error('Vous devez être connecté pour utiliser des crédits');
      return false;
    }

    try {
      setIsLoading(true);

      // Vérifier si l'utilisateur a suffisamment de crédits
      const { data, error } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .single();

      if (error) {
        throw error;
      }

      const currentCredits = data?.credits || 0;

      if (currentCredits < amount) {
        toast.error('Vous n\'avez pas assez de crédits');
        return false;
      }

      // Mettre à jour les crédits
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ credits: currentCredits - amount })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      // Enregistrer la transaction
      const { error: transactionError } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: user.id,
          amount: -amount,
          type: 'use',
          description
        });

      if (transactionError) {
        throw transactionError;
      }

      toast.success(`Vous avez utilisé ${amount} crédits`);
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'utilisation des crédits:', error);
      toast.error(`Échec: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getUserCredits,
    purchaseCredits,
    useCredits,
    isLoading
  };
};

export default useCredits;
