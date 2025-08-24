/**
 * FICHIER: src/supabaseClient.js
 * OBJET: Créer et exporter un client Supabase réutilisable.
 * ROLE: C’est le concierge 🧑‍✈️ — il prend la clé dans config.js et ouvre la base.
 * EXPOSE: export const sb (client supabase)
 * DÉPENDANCES: window.supabase (CDN), CFG depuis ./config.js
 */
import { CFG } from "./config.js";

export const sb = window.supabase.createClient(
  CFG.SUPABASE_URL,
  CFG.SUPABASE_ANON_KEY
);
