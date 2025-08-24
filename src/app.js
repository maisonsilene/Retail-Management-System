/**
 * FICHIER: src/app.js
 * OBJET: Logique UI — lister et ajouter des produits.
 * ROLE: C’est toi 👩‍💻 qui utilise le client (sb) pour lire/écrire dans la base.
 * EXPOSE: rien
 * DÉPENDANCES: sb depuis ./supabaseClient.js
 */
import { sb } from "./supabaseClient.js";

const els = {
  count: document.getElementById("count"),
  list: document.getElementById("productsList"),
  refreshBtn: document.getElementById("refreshBtn"),
  form: document.getElementById("addForm"),
  name: document.getElementById("name"),
  price: document.getElementById("price"),
  initialStock: document.getElementById("initialStock"),
  active: document.getElementById("active"),
  addBtn: document.getElementById("addBtn"),
  status: document.getElementById("status"),
};

function setStatus(msg) {
  els.status.textContent = msg || "";
}

async function loadProducts() {
  setStatus("Chargement…");
  els.list.innerHTML = "";

  const { data, error } = await sb
    .from("products")
    .select("id,name,price_ttc,stock,active")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    setStatus("Erreur lecture produits (voir console).");
    return;
  }

  els.count.textContent = data.length;
  if (!data.length) {
    els.list.innerHTML = `<li class="muted">Aucun produit pour l’instant.</li>`;
  } else {
    els.list.innerHTML = data
      .map(
        (p) =>
          `<li>• ${p.name} — ${Number(p.price_ttc).toFixed(2)} € — Stock ${p.stock ?? 0} — Actif ${p.active ? "oui" : "non"}</li>`
      )
      .join("");
  }
  setStatus("");
}

async function addProduct(e) {
  e.preventDefault();
  setStatus("");
  els.addBtn.setAttribute("disabled", "disabled");

  const name = els.name.value.trim();
  const price_ttc = Number(els.price.value || 0);
  const stock = parseInt(els.initialStock.value || "0", 10);
  const active = els.active.value === "true";

  if (!name || isNaN(price_ttc)) {
    setStatus("Nom et prix sont requis.");
    els.addBtn.removeAttribute("disabled");
    return;
  }

  // Insert produit
  const { data: prod, error: insErr } = await sb
    .from("products")
    .insert([{ name, price_ttc, stock, active }])
    .select()
    .single();

  if (insErr) {
    console.error(insErr);
    setStatus("Erreur ajout produit (voir console).");
    els.addBtn.removeAttribute("disabled");
    return;
  }

  // Stock initial si >0
  if (stock > 0) {
    const { error: smErr } = await sb.from("stock_moves").insert([
      {
        product_id: prod.id,
        qty: stock,
        type: "IN",
        note: "Stock initial",
      },
    ]);
    if (smErr) {
      console.warn("Stock move non enregistré:", smErr);
    }
  }

  els.form.reset();
  els.active.value = "true";
  setStatus("Produit ajouté ✔");
  await loadProducts();
  els.addBtn.removeAttribute("disabled");
}

// Événements
els.refreshBtn.addEventListener("click", loadProducts);
els.form.addEventListener("submit", addProduct);

// Démarrage
loadProducts();
