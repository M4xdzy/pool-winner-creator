
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Gérer les requêtes OPTIONS pour CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Créer un client Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Analyser les données de la requête
    const { user_id, amount, description } = await req.json();

    if (!user_id || !amount) {
      return new Response(
        JSON.stringify({ error: 'user_id et amount sont requis' }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 400 }
      );
    }

    // Mettre à jour les crédits de l'utilisateur
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', user_id)
      .single();

    if (profileError) {
      return new Response(
        JSON.stringify({ error: `Erreur lors de la récupération du profil: ${profileError.message}` }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 500 }
      );
    }

    const newCredits = (profileData.credits || 0) + amount;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ credits: newCredits })
      .eq('id', user_id);

    if (updateError) {
      return new Response(
        JSON.stringify({ error: `Erreur lors de la mise à jour des crédits: ${updateError.message}` }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 500 }
      );
    }

    // Enregistrer la transaction
    const { error: transactionError } = await supabase
      .from('credit_transactions')
      .insert({
        user_id: user_id,
        amount: amount,
        type: 'purchase',
        description: description || 'Achat de crédits'
      });

    if (transactionError) {
      return new Response(
        JSON.stringify({ error: `Erreur lors de l'enregistrement de la transaction: ${transactionError.message}` }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, credits: newCredits }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 200 }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: `Erreur interne: ${error.message}` }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 500 }
    );
  }
});
