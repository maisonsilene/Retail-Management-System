/**
 * FICHIER: src/app.js
 * OBJET: Connexion + lecture + ajout sur la table 'produits' (colonnes FR).
 * TABLE: produits(id, created_at, nom, prix_ttc, tva, actif, stock)
 */
import { sb } from "./supabaseClient.js";

const els = {
  conn: document.getElementById("connState"),
  status: document.getElementById("status"),
  refreshBtn: document.getElementById("refreshBtn"),
  count: document.getElementById("count"),
  list: document.getElementById("productsList"),
  form: document.getElementById("addForm"),
  nom: document.getElementById("nom"),
  prix_ttc: document.getElementById("prix_ttc"),
  stock: document.getElementById("stock"),
  actif: document.getElementById("actif"),
  addBtn: document.getElementById("addBtn"),
};

function setStatus(msg) { els.status.textContent = msg || ""; }
function setConn(ok, extra = "") {
  els.conn.className = ok ? "ok" : "ko";
  els.conn.textContent = ok ? `Connexion OK ${extra}` : `Connexion KO ${extra}`;
}

function renderList(rows) {
  if (!rows?.length) {
    els.count.textContent = "0";
    els.list.innerHTML = `<li class="muted">Aucun produit pour l’instant.</li>`;
    return;
  }
  els.count.textContent = rows.length.toString();
  els.list.innerHTML = rows.map(p => {
    const prix = p.prix_ttc != null ? `${Number(p.prix_ttc).toFixed(2)} €` : "—";
    const stock = p.stock != null ? p.stock : "—";
    const actif = p.actif === true ? "oui" : p.actif === false ? "non" : "—";
    const tva = p.tva != null ? `${Number(p.tva) * 100}%` : "—";
    return `<li>• ${p.nom ?? "(sans nom)"} — ${prix} — Stock ${stock} — Actif ${actif} — TVA ${tva}</li>`;
  }).join("");
}

async function loadProduits() {
  setStatus("Chargement…");
  els.list.innerHTML = "";

  // 👉 correspond exactement à tes colonnes FR
  const { data, error } = await sb
    .from("produits")
    .select("id,nom,prix_ttc,actif,stock,tva,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase select error:", error);
    setConn(false, `— ${error.message}`);
    setStatus(error.message || "Erreur lecture produits (voir console).");
    return;
  }

  setConn(true, `— ${data.length} élément(s)`);
  renderList(data);
  setStatus("");
}

async function addProduit(e) {
  e.preventDefault();
  setStatus("");
  els.addBtn.setAttribute("disabled", "disabled");

  const nom = els.nom.value.trim();
  const prix_ttc = Number(els.prix_ttc.value || 0);
  const stock = parseInt(els.stock.value || "0", 10);
  const actif = els.actif.value === "true";

  if (!nom || isNaN(prix_ttc)) {
    setStatus("Nom et prix sont requis.");
    els.addBtn.removeAttribute("disabled");
    return;
  }

  // 👉 Insert strictement sur tes colonnes FR
  const toInsert = { nom, prix_ttc, actif, stock };

  const { data, error } = await sb
    .from("produits")
    .insert([toInsert])
    .select("id")
    .single();

  if (error) {
    console.error("Supabase insert error:", error);
    setStatus(error.message || "Erreur ajout produit (voir console).");
    els.addBtn.removeAttribute("disabled");
    return;
  }

  els.form.reset();
  els.actif.value = "true";
  setStatus("Produit ajouté ✔");
  await loadProduits();
  els.addBtn.removeAttribute("disabled");
}

// Événements
els.refreshBtn.addEventListener("click", loadProduits);
els.form.addEventListener("submit", addProduit);

// Démarrage
loadProduits();
