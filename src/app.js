/**
 * FICHIER: src/app.js
 * OBJET: Vérifier la connexion + lire les 5 premiers produits existants.
 * NOTE: Pas d'insert ici. On affiche "Connexion OK" si la requête répond sans erreur,
 *       même si la table est vide.
 */
import { sb } from "./supabaseClient.js";

const els = {
  conn: document.getElementById("connState"),
  status: document.getElementById("status"),
  list: document.getElementById("productsList"),
  raw: document.getElementById("rawJson"),
  refresh: document.getElementById("refreshBtn"),
};

function setStatus(msg) { els.status.textContent = msg || ""; }
function setConn(ok, extra = "") {
  els.conn.className = ok ? "ok" : "ko";
  els.conn.textContent = ok ? `Connexion OK ${extra}` : `Connexion KO ${extra}`;
}

function renderList(data) {
  if (!Array.isArray(data) || data.length === 0) {
    els.list.innerHTML = `<li class="muted">Aucun produit trouvé (connexion OK).</li>`;
    els.raw.textContent = JSON.stringify(data || [], null, 2);
    return;
  }
  els.list.innerHTML = data.map(p => {
    // On montre ce qu'on est sûr d'avoir: name si présent, sinon id
    const label = p.name ? p.name : `(id: ${p.id ?? "?"})`;
    const price = p.price_ttc != null ? ` — ${Number(p.price_ttc).toFixed(2)} €` : "";
    return `<li>• ${label}${price}</li>`;
  }).join("");
  els.raw.textContent = JSON.stringify(data, null, 2);
}

async function testConnectionAndLoad() {
  setStatus("Test connexion + chargement…");
  els.list.innerHTML = "";
  els.raw.textContent = "[]";

  // Requête minimaliste: on récupère * et on limite à 5 pour éviter les soucis de colonnes
  const { data, error } = await sb
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Supabase error:", error);
    setConn(false);
    setStatus(error.message || "Erreur (voir console).");
    // On montre l'erreur brute en JSON pour debug rapide
    els.raw.textContent = JSON.stringify({ error }, null, 2);
    return;
  }

  setConn(true, `— ${data.length} élément(s) reçus`);
  renderList(data);
  setStatus("");
}

els.refresh.addEventListener("click", testConnectionAndLoad);
testConnectionAndLoad();
