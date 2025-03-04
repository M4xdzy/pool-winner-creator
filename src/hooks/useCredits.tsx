
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

export const useCredits = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Get user's current credits
  const getUserCredits = async (): Promise<number> => {
    if (!user) return 0;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      return data?.credits || 0;
    } catch (error) {
      console.error('Error fetching user credits:', error);
      return 0;
    }
  };

  // Purchase credits (add credits to user's account)
  const purchaseCredits = async (amount: number): Promise<boolean> => {
    if (!user) {
      toast({
        title: 'Erreur',
        description: 'Vous devez être connecté pour acheter des crédits',
        variant: 'destructive',
      });
      return false;
    }
    
    setIsLoading(true);
    
    try {
      // Call the Edge Function to add credits
      const { data, error } = await supabase.functions.invoke('add_credits', {
        body: { 
          user_id: user.id, 
          amount: amount,
          description: `Achat de ${amount} crédits` 
        }
      });
      
      if (error) throw error;
      
      toast({
        title: 'Succès',
        description: `${amount} crédits ont été ajoutés à votre compte`,
      });
      
      return true;
    } catch (error) {
      console.error('Error purchasing credits:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'acheter des crédits',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Use credits (subtract credits from user's account)
  const useCredits = async (amount: number, description: string): Promise<boolean> => {
    if (!user) {
      toast({
        title: 'Erreur',
        description: 'Vous devez être connecté pour utiliser des crédits',
        variant: 'destructive',
      });
      return false;
    }
    
    setIsLoading(true);
    
    try {
      // Check if user has enough credits
      const { data, error } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      if ((data?.credits || 0) < amount) {
        toast({
          title: 'Crédits insuffisants',
          description: 'Vous n\'avez pas assez de crédits pour cette action',
          variant: 'destructive',
        });
        return false;
      }
      
      // Update credits in database
      const newCredits = data.credits - amount;
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ credits: newCredits })
        .eq('id', user.id);
      
      if (updateError) throw updateError;
      
      // Record the transaction
      const { error: transactionError } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: user.id,
          amount: -amount,
          type: 'use',
          description: description
        });
      
      if (transactionError) throw transactionError;
      
      toast({
        title: 'Succès',
        description: `${amount} crédits ont été utilisés`,
      });
      
      return true;
    } catch (error) {
      console.error('Error using credits:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'utiliser des crédits',
        variant: 'destructive',
      });
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
