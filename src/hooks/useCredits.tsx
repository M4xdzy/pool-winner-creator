
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export function useCredits() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  
  // Fetch user credits
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
  
  // Purchase credits
  const purchaseCredits = async (amount: number): Promise<boolean> => {
    if (!user) {
      toast.error('Vous devez être connecté pour acheter des crédits');
      return false;
    }
    
    setIsLoading(true);
    try {
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('add_credits', {
        body: { 
          user_id: user.id, 
          amount: amount,
          description: `Achat de ${amount} crédits`
        }
      });
      
      if (error) throw error;
      
      toast.success(`Vous avez acheté ${amount} crédits !`);
      return true;
    } catch (error) {
      console.error('Error purchasing credits:', error);
      toast.error("Erreur lors de l'achat de crédits");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Use credits for an action
  const useCredits = async (amount: number, description: string): Promise<boolean> => {
    if (!user) {
      toast.error('Vous devez être connecté pour utiliser des crédits');
      return false;
    }
    
    setIsLoading(true);
    try {
      // Call the Supabase Edge Function with negative amount to deduct credits
      const { data, error } = await supabase.functions.invoke('add_credits', {
        body: { 
          user_id: user.id, 
          amount: -amount,
          description: description
        }
      });
      
      if (error) throw error;
      
      toast.success(`Vous avez utilisé ${amount} crédits.`);
      return true;
    } catch (error) {
      console.error('Error using credits:', error);
      toast.error("Erreur lors de l'utilisation des crédits");
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
}
