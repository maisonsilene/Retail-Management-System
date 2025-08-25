import { sb } from "./supabaseClient.js";

export async function initJournalTab() {
  const list = document.getElementById("journalList");
  if (!list) return;

  list.innerHTML = "<li class='muted'>Chargement...</li>";

  const { data, error } = await sb
    .from("ventes_lignes")
    .select("quantite, prix_unitaire_ttc, ventes(created_at), produits(nom)")
    .order("ventes.created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Supabase select error:", error);
    list.innerHTML = `<li>Erreur : ${error.message}</li>`;
    return;
  }

  list.innerHTML = data.map(ligne => {
    const date = new Date(ligne.ventes.created_at).toLocaleString("fr-FR");
    const nom = ligne.produits.nom;
    const qte = ligne.quantite;
    const prix = ligne.prix_unitaire_ttc;
    const total = qte * prix;
    return `<li>${date} — ${nom} — Qté: ${qte} — PU: ${prix.toFixed(2)}€ — Total: ${total.toFixed(2)}€</li>`;
  }).join("");
}
