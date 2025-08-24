/**
 * Concierge : crée un client Supabase réutilisable à partir des clés.
 */
import { CFG } from "./config.js";

// window.supabase est injecté par le CDN dans index.html
export const sb = window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY);
