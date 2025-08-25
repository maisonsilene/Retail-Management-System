import { sb } from "./supabaseClient.js";

export async function initCaisseTab() {
  const els = {
    select: document.getElementById("caisseProduit"),
    qty: document.getElementById("caisseQuantite"),
    btn: document.getElementById("btnEncaisser"),
    status: document.getElementById("caisseStatus"),
  };

  async function loadProduits() {
    els.select.innerHTML = "";
    const { data, error } = await sb
      .from("produits")
      .select("id, nom")
      .eq("actif", true)
      .order("nom");

    if (error) {
      console.error("Erreur chargement produits", error);
      els.status.textContent = "Erreur: " + error.message;
      return;
    }

    els.select.innerHTML = data
      .map(p => `<option value="${p.id}">${p.nom}</option>`)
      .join("");
  }

  async function encaisser() {
    const produitId = els.select.value;
    const quantite = parseInt(els.qty.value, 10);

    if (!produitId || isNaN(quantite) || quantite <= 0) {
      alert("Produit et quantité requis");
      return;
    }

    const { data: prod, error: prodErr } = await sb
      .from("produits")
      .select("stock, prix_ttc")
      .eq("id", produitId)
      .single();

    if (prodErr) {
      alert("Erreur : " + prodErr.message);
      return;
    }

    if ((prod.stock || 0) < quantite) {
      alert("Stock insuffisant");
      return;
    }

    const total = (prod.prix_ttc || 0) * quantite;

    const { data: vente, error: venteErr } = await sb
      .from("ventes")
      .insert([{ total_ttc: total }])
      .select()
      .single();

    if (venteErr) {
      alert("Erreur : " + venteErr.message);
      return;
    }

    const { error: ligneErr } = await sb
      .from("ventes_lignes")
      .insert([
        {
          vente_id: vente.id,
          produit_id: produitId,
          quantite,
          prix_ttc: prod.prix_ttc,
        },
      ]);

    if (ligneErr) {
      alert("Erreur : " + ligneErr.message);
      return;
    }

    const { error: updErr } = await sb
      .from("produits")
      .update({ stock: prod.stock - quantite })
      .eq("id", produitId);

    if (updErr) {
      alert("Erreur : " + updErr.message);
      return;
    }

    els.qty.value = "1";
    els.status.textContent = "Vente enregistrée";
    setTimeout(() => (els.status.textContent = ""), 2000);
    await loadProduits();
  }

  els.btn.addEventListener("click", encaisser);
  loadProduits();
}

initCaisseTab();

