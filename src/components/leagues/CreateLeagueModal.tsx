
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLeagues, CreateLeagueData } from '@/hooks/useLeagues';
import { PlusCircle, Loader2 } from 'lucide-react';

const createLeagueSchema = z.object({
  name: z.string().min(3, { message: "Le nom doit contenir au moins 3 caractères" }),
  description: z.string().optional(),
  max_participants: z.coerce.number().min(2).max(32),
  season_type: z.enum(['weekly', 'monthly', 'full']),
  draft_type: z.enum(['manual', 'auto']),
  is_private: z.boolean().default(false),
});

type CreateLeagueFormValues = z.infer<typeof createLeagueSchema>;

interface CreateLeagueModalProps {
  triggerComponent?: React.ReactNode;
  onSuccess?: () => void;
}

export function CreateLeagueModal({ triggerComponent, onSuccess }: CreateLeagueModalProps) {
  const { createLeague } = useLeagues();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<CreateLeagueFormValues>({
    resolver: zodResolver(createLeagueSchema),
    defaultValues: {
      name: '',
      description: '',
      max_participants: 12,
      season_type: 'weekly',
      draft_type: 'manual',
      is_private: false,
    },
  });

  const onSubmit = async (data: CreateLeagueFormValues) => {
    setIsLoading(true);
    try {
      if (!data.name) {
        form.setError('name', { message: 'Le nom de la ligue est requis' });
        setIsLoading(false);
        return;
      }
      
      // S'assurer que name est bien défini dans leagueData
      const leagueData: CreateLeagueData = {
        name: data.name, // Toujours inclure le nom
        description: data.description,
        max_participants: data.max_participants,
        season_type: data.season_type,
        draft_type: data.draft_type,
        is_private: data.is_private,
      };
      
      const result = await createLeague(leagueData);
      if (!result.error) {
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
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Nouvelle Ligue
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle ligue</DialogTitle>
          <DialogDescription>
            Configurez votre ligue de hockey et invitez des amis à participer
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de la ligue</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Ligue des Champions 2023" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optionnelle)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Décrivez votre ligue..." 
                      className="resize-none" 
                      {...field} 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="max_participants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre max. de participants</FormLabel>
                    <FormControl>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value.toString()}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez" />
                        </SelectTrigger>
                        <SelectContent>
                          {[2, 4, 6, 8, 10, 12, 16, 20, 24, 32].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} participants
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="season_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de saison</FormLabel>
                    <FormControl>
                      <RadioGroup 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="weekly" id="weekly" />
                          <FormLabel htmlFor="weekly" className="font-normal">
                            Hebdomadaire
                          </FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="monthly" id="monthly" />
                          <FormLabel htmlFor="monthly" className="font-normal">
                            Mensuelle
                          </FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="full" id="full" />
                          <FormLabel htmlFor="full" className="font-normal">
                            Saison complète
                          </FormLabel>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="draft_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de draft</FormLabel>
                  <FormControl>
                    <RadioGroup 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="manual" id="manual" />
                        <FormLabel htmlFor="manual" className="font-normal">
                          Manuel
                        </FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="auto" id="auto" />
                        <FormLabel htmlFor="auto" className="font-normal">
                          Automatique
                        </FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>
                    Manuel: les joueurs choisissent à tour de rôle. Auto: sélection aléatoire.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="is_private"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Ligue privée</FormLabel>
                    <FormDescription>
                      Seuls les membres invités peuvent rejoindre cette ligue.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
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
                    Création...
                  </>
                ) : (
                  'Créer la ligue'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
