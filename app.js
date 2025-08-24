// app.js
// ------------------------------------------------------
// Rôle : logique de l'app.
// - testLecture() : ping la base pour voir si la connexion marche
// - loadProduits() : récupère et affiche les produits
// ------------------------------------------------------

async function testLecture() {
  const status = document.getElementById("statusStock");
  status.textContent = "Test connexion…";

  // Petit ping (SELECT 1 id) pour détecter une erreur de clés/policies
  const ping = await sb.from("produits").select("id").limit(1);
  if (ping.error) {
    status.textContent = "Erreur connexion: " + ping.error.message;
    console.error("PING ERROR", ping.error);
    return false;
  }
  return true;
}

async function loadProduits() {
  const ok = await testLecture();
  if (!ok) return;

  const status = document.getElementById("statusStock");
  const ul = document.getElementById("listProduits");
  status.textContent = "Chargement…";
  ul.innerHTML = "";

  const { data, error } = await sb
    .from("produits")
    .select("id, nom, prix_ttc, stock, actif")
    .order("created_at", { ascending: false });

  if (error) {
    status.textContent = "Erreur SELECT: " + error.message;
    console.error(error);
    return;
  }

  if (!data || !data.length) {
    status.textContent = "Aucun produit visible (vérifie actif = true).";
    return;
  }

  status.textContent = `${data.length} produit(s)`;
  data.forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.nom} — ${p.prix_ttc} € — Stock: ${p.stock ?? 0} — Actif: ${p.actif ? "oui" : "non"}`;
    ul.appendChild(li);
  });
}

// Bouton "Rafraîchir"
document.getElementById("btnRefresh").addEventListener("click", loadProduits);

// Lancer au chargement
loadProduits();
