
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trophy, Star, Edit, User, Mail, Calendar } from 'lucide-react';

const Profile = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Navigation />
      
      <main className="pt-24 pb-16 lg:pl-64 pl-[74px] pr-4 lg:pr-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24 rounded-xl border-4 border-background">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-accent text-accent-foreground text-xl">
                    <User className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" size="icon" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full hover:bg-accent hover:text-accent-foreground">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              
              <div>
                <h1 className="text-3xl font-bold tracking-tight">John Doe</h1>
                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-1 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Trophy className="h-4 w-4 mr-2" />
                    <span>8 pools rejoints</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-2" />
                    <span>2 victoires</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Membre depuis Nov 2023</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="infos" className="animate-fade-in">
            <TabsList className="mb-6">
              <TabsTrigger value="infos">Informations</TabsTrigger>
              <TabsTrigger value="stats">Statistiques</TabsTrigger>
              <TabsTrigger value="security">Sécurité</TabsTrigger>
            </TabsList>
            
            <TabsContent value="infos" className="space-y-6 animate-slide-up">
              <Card>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                  <CardDescription>
                    Mettez à jour vos informations personnelles
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom complet</Label>
                      <Input id="name" defaultValue="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Adresse email</Label>
                      <Input id="email" type="email" defaultValue="john@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="team-name">Nom d'équipe</Label>
                      <Input id="team-name" defaultValue="Les Étoiles de Montréal" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Localisation</Label>
                      <Input id="location" defaultValue="Montréal, Canada" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" rows={4} defaultValue="Passionné de hockey depuis toujours. Fan des Canadiens et joueur amateur de hockey sur glace." />
                  </div>
                  <div className="flex justify-end">
                    <Button className="button-effect">
                      Enregistrer
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Préférences de notification</CardTitle>
                  <CardDescription>
                    Gérez vos préférences de notification
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Préférences de notification */}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="stats" className="space-y-6 animate-slide-up">
              <Card>
                <CardHeader>
                  <CardTitle>Statistiques de performance</CardTitle>
                  <CardDescription>
                    Visualisez vos performances à travers toutes les ligues
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Statistiques de performance */}
                  <div className="py-12 text-center">
                    <p className="text-muted-foreground">Les statistiques seront disponibles après votre participation à des ligues</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-6 animate-slide-up">
              <Card>
                <CardHeader>
                  <CardTitle>Sécurité du compte</CardTitle>
                  <CardDescription>
                    Changez votre mot de passe et gérez la sécurité du compte
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Mot de passe actuel</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nouveau mot de passe</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmez le mot de passe</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <div className="flex justify-end">
                    <Button className="button-effect">
                      Mettre à jour le mot de passe
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Profile;
