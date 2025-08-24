/**
 * FICHIER: src/supabaseClient.js
 * OBJET: Créer un client Supabase réutilisable (le "concierge").
 */
import { CFG } from "./config.js";
export const sb = window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY);
