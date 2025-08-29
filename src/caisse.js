import { sb } from "./supabaseClient.js";

const els = {
  list: document.getElementById("listeCaisse"),
  status: document.getElementById("caisseStatus"),
  refresh: document.getElementById("btnCaisseRefresh"),
};

function setStatus(msg = "") {
  els.status.textContent = msg;
}

async function loadProduits() {
  els.list.innerHTML = "<li class='muted'>Chargement...</li>";
  setStatus("");

  const { data, error } = await sb
    .from("produits")
    .select("*")
    .order("nom", { ascending: true });

  if (error) {
    console.error("Supabase select error:", error);
    els.list.innerHTML = `<li>Erreur : ${error.message}</li>`;
    setStatus("Connexion KO");
    return;
  }

  setStatus("Connexion OK");
  els.list.innerHTML = data
    .map(
      (p) =>
        `<li>${p.nom} — ${p.prix_ttc} € <button data-id="${p.id}" data-prix="${p.prix_ttc}">Vendre</button></li>`
    )
    .join("");
}

async function vendreProduit(event) {
  if (event.target.tagName !== "BUTTON") return;
  const id = event.target.dataset.id;
  const prix = parseFloat(event.target.dataset.prix);

  const { error } = await sb
    .from("journal")
    .insert([{ produit_id: id, montant: prix }]);

  if (error) {
    alert("Erreur : " + error.message);
    return;
  }

  alert("Vente enregistrée !");
}

els.refresh.addEventListener("click", loadProduits);
els.list.addEventListener("click", vendreProduit);

loadProduits();
