import { sb } from "./supabaseClient.js";
import { countActive } from "./utils.js";

let initialized = false;

export function initStocksTab() {
  const root = document.getElementById("tab-stocks");
  if (!root) return;

  const els = {
    nb: root.querySelector("#nbProduits"),
    total: root.querySelector("#stockTotal"),
    list: root.querySelector("#listeProduits"),
    status: root.querySelector("#status"),
    btnRefresh: root.querySelector("#btnRefresh"),
    btnAdd: root.querySelector("#btnAdd"),
    nom: root.querySelector("#nom"),
    prix: root.querySelector("#prix"),
    stock: root.querySelector("#stock"),
    actif: root.querySelector("#actif"),
  };

  function setStatus(msg = "") { els.status.textContent = msg; }

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
    els.nb.textContent = countActive(data);
    els.total.textContent = data.reduce((acc, p) => acc + (p.stock || 0), 0);

    els.list.innerHTML = data
      .map(
        (p) =>
          `<li>${p.nom} — ${p.prix_ttc} € — Stock: ${p.stock} — Actif: ${p.actif ? "Oui" : "Non"}</li>`
      )
      .join("");
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
      { nom, prix_ttc: prix, stock, actif },
    ]);

    if (error) {
      alert("Erreur : " + error.message);
      return;
    }

    els.nom.value = "";
    els.prix.value = "";
    els.stock.value = "";
    els.actif.value = "true";

    await loadProduits();
  }

  if (!initialized) {
    els.btnRefresh.addEventListener("click", loadProduits);
    els.btnAdd.addEventListener("click", ajouterProduit);
    initialized = true;
  }

  loadProduits();
}

