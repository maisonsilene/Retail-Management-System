/**
 * Logique de l'écran Produits (table: public.produits)
 * Colonnes: id, created_at, nom, prix_ttc, tva, actif, stock
 */
import { sb } from "./supabaseClient.js";

// Elements UI
const els = {
  nb: document.getElementById("nbProduits"),
  total: document.getElementById("stockTotal"),
  list: document.getElementById("listeProduits"),
  status: document.getElementById("status"),
  btnRefresh: document.getElementById("btnRefresh"),
  btnAdd: document.getElementById("btnAdd"),
  nom: document.getElementById("nom"),
  prix: document.getElementById("prix"),
  stock: document.getElementById("stock"),
  actif: document.getElementById("actif"),
};

function setStatus(msg="") { els.status.textContent = msg; }

async function loadProduits() {
  els.list.innerHTML = "<li class='muted'>Chargement...</li>";
  setStatus("");

  const { data, error } = await sb
    .from("produits")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase select error:", error);
    els.list.innerHTML = `<li>Erreur : ${error.message}</li>`;
    setStatus("Connexion KO");
    return;
  }

  setStatus("Connexion OK");
  els.nb.textContent = data.length;
  els.total.textContent = data.reduce((acc, p) => acc + (p.stock || 0), 0);

  els.list.innerHTML = data.map(p =>
    `<li>${p.nom} — ${p.prix_ttc} € — Stock: ${p.stock} — Actif: ${p.actif ? "Oui" : "Non"}</li>`
  ).join("");
}

async function ajouterProduit() {
  const nom = els.nom.value.trim();
  const prix = parseFloat(els.prix.value);
  const stock = parseInt(els.stock.value);
  const actif = els.actif.value === "true";

  if (!nom || isNaN(prix)) {
    alert("Nom et prix requis !");
    return;
  }

  const { error } = await sb.from("produits").insert([
    { nom, prix_ttc: prix, stock, actif }
  ]);

  if (error) {
    alert("Erreur : " + error.message);
    return;
  }

  // reset simple
  els.nom.value = "";
  els.prix.value = "";
  els.stock.value = "";
  els.actif.value = "true";

  await loadProduits();
}

// Événements
els.btnRefresh.addEventListener("click", loadProduits);
els.btnAdd.addEventListener("click", ajouterProduit);

// Démarrage
loadProduits();
