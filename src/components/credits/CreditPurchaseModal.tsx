
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCredits } from '@/hooks/useCredits';
import { Loader2 } from 'lucide-react';

const creditPackages = [
  { id: 'small', amount: 100, price: '4.99€', description: 'Pack débutant' },
  { id: 'medium', amount: 500, price: '19.99€', description: 'Pack standard', popular: true },
  { id: 'large', amount: 1000, price: '34.99€', description: 'Pack premium' },
  { id: 'xlarge', amount: 5000, price: '149.99€', description: 'Pack ultime' },
];

interface CreditPurchaseModalProps {
  triggerComponent?: React.ReactNode;
}

export function CreditPurchaseModal({ triggerComponent }: CreditPurchaseModalProps) {
  const [selectedPackage, setSelectedPackage] = useState('medium');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addCredits } = useCredits();

  const handlePurchase = async () => {
    setIsLoading(true);
    const packageInfo = creditPackages.find(pkg => pkg.id === selectedPackage);
    
    if (packageInfo) {
      // Dans une application réelle, vous intégreriez ici un système de paiement comme Stripe
      // Pour cette démo, nous ajoutons simplement les crédits
      await addCredits(
        packageInfo.amount, 
        `Achat de ${packageInfo.amount} crédits - ${packageInfo.description}`
      );
    }
    
    setIsLoading(false);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerComponent || <Button>Acheter des crédits</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Acheter des crédits</DialogTitle>
          <DialogDescription>
            Choisissez un pack de crédits qui correspond à vos besoins
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup value={selectedPackage} onValueChange={setSelectedPackage} className="space-y-3">
            {creditPackages.map((pkg) => (
              <div key={pkg.id} className={`flex items-center justify-between rounded-lg border p-4 ${pkg.popular ? 'border-primary' : 'border-border'}`}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={pkg.id} id={pkg.id} />
                  <div className="grid gap-1">
                    <Label htmlFor={pkg.id} className="font-medium">
                      {pkg.amount} crédits - {pkg.price}
                    </Label>
                    <span className="text-sm text-muted-foreground">{pkg.description}</span>
                    {pkg.popular && (
                      <span className="inline-block text-xs font-medium bg-primary/10 text-primary rounded-full px-2 py-0.5 mt-1">
                        Populaire
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
            Annuler
          </Button>
          <Button onClick={handlePurchase} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Traitement...
              </>
            ) : (
              'Acheter maintenant'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
