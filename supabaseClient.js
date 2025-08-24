/**
 * FICHIER: src/supabaseClient.js
 * OBJET: Créer et exporter un client Supabase réutilisable.
 * ROLE: C’est le “concierge” → il prend la clé de config et ouvre la porte vers la base.
 * EXPOSE: export const sb
 * DÉPENDANCES: window.supabase (CDN), CFG (src/config.js)
 */
import { CFG } from "./config.js";

export const sb = window.supabase.createClient(
  CFG.SUPABASE_URL,
  CFG.SUPABASE_ANON_KEY
);
