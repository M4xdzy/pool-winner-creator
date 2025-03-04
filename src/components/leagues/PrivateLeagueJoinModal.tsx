
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useLeagues } from '@/hooks/useLeagues';
import { Loader2 } from 'lucide-react';

const joinPrivateLeagueSchema = z.object({
  invitationCode: z.string().min(1, { message: "Le code d'invitation est requis" }),
});

type JoinPrivateLeagueFormValues = z.infer<typeof joinPrivateLeagueSchema>;

interface PrivateLeagueJoinModalProps {
  triggerComponent?: React.ReactNode;
  onSuccess?: () => void;
}

export function PrivateLeagueJoinModal({ triggerComponent, onSuccess }: PrivateLeagueJoinModalProps) {
  const { joinLeague } = useLeagues();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<JoinPrivateLeagueFormValues>({
    resolver: zodResolver(joinPrivateLeagueSchema),
    defaultValues: {
      invitationCode: '',
    },
  });

  const onSubmit = async (data: JoinPrivateLeagueFormValues) => {
    setIsLoading(true);
    try {
      // Ici, on utiliserait normalement un API call pour vérifier le code et obtenir l'ID de la ligue
      // Pour cette démo, on simule que le code équivaut à l'ID de la ligue
      const leagueId = "à-implémenter"; // À remplacer par une vraie recherche avec le code
      const { error } = await joinLeague(leagueId, data.invitationCode);
      if (!error) {
        setIsOpen(false);
        if (onSuccess) onSuccess();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerComponent || (
          <Button variant="outline">
            Rejoindre une ligue privée
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Rejoindre une ligue privée</DialogTitle>
          <DialogDescription>
            Entrez le code d'invitation que vous avez reçu pour rejoindre une ligue privée
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="invitationCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code d'invitation</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: ABC123XYZ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Vérification...
                  </>
                ) : (
                  'Rejoindre la ligue'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
