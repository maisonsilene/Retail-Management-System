// app.js
// ------------------------------------------------------
// Rôle : logique de l'app (lecture + ajout produit).
// - testLecture() : vérifie la connexion Supabase
// - loadProduits(): charge et affiche les produits
// - addProduct()  : insère un produit depuis le formulaire
// ------------------------------------------------------

// Petites références aux éléments de la page
const statusEl = document.getElementById("statusStock");
const listEl   = document.getElementById("listProduits");
const btnRef   = document.getElementById("btnRefresh");
const btnAdd   = document.getElementById("btnAdd");
const addInfo  = document.getElementById("addStatus");

// Inputs du formulaire d'ajout
const inpNom   = document.getElementById("pNom");
const inpPrix  = document.getElementById("pPrix");
const inpStock = document.getElementById("pStock");
const selActif = document.getElementById("pActif");

// ------------- Vérifier la connexion (diagnostic utile)
async function testLecture(){
  statusEl.textContent = "Test connexion…";
  const ping = await sb.from("produits").select("id").limit(1);
  if (ping.error) {
    statusEl.textContent = "Erreur de connexion : " + ping.error.message;
    console.error("PING ERROR", ping.error);
    return false;
  }
  return true;
}

// ------------- Charger et afficher les produits
async function loadProduits(){
  const ok = await testLecture();
  if(!ok) return;

  statusEl.textContent = "Chargement…";
  listEl.innerHTML = "";

  const { data, error } = await sb
    .from("produits")
    .select("id, nom, prix_ttc, stock, actif")
    .order("created_at", { ascending:false });

  if(error){
    statusEl.textContent = "Erreur SELECT : " + error.message;
    console.error(error);
    return;
  }

  if(!data || !data.length){
    statusEl.textContent = "Aucun produit visible (pense à mettre actif=true).";
    return;
  }

  statusEl.textContent = `${data.length} produit(s)`;
  data.forEach(p=>{
    const li = document.createElement("li");
    li.textContent = `${p.nom} — ${Number(p.prix_ttc||0).toFixed(2)} € — Stock: ${p.stock??0} — Actif: ${p.actif?'oui':'non'}`;
    listEl.appendChild(li);
  });
}

// ------------- Ajouter un produit (INSERT)
async function addProduct(){
  // Lecture & validation simple des champs
  const nom   = (inpNom.value || "").trim();
  const prix  = Number(inpPrix.value);
  const stock = parseInt(inpStock.value || "0", 10);
  const actif = (selActif.value === "true");

  if(!nom){ addInfo.textContent = "Nom requis."; return; }
  if(Number.isNaN(prix) || prix < 0){ addInfo.textContent = "Prix invalide."; return; }
  if(Number.isNaN(stock) || stock < 0){ addInfo.textContent = "Stock invalide."; return; }

  // UI: on désactive le bouton pendant l'envoi
  btnAdd.disabled = true;
  addInfo.textContent = "Ajout en cours…";

  // INSERT via Supabase
  const { error } = await sb
    .from("produits")
    .insert([{ nom, prix_ttc: prix, stock, actif }]);

  // Réactive le bouton
  btnAdd.disabled = false;

  if(error){
    addInfo.textContent = "Erreur : " + error.message;
    console.error(error);
    return;
  }

  // Succès : on nettoie le formulaire et on recharge la liste
  addInfo.textContent = "Produit ajouté ✅";
  inpNom.value = ""; inpPrix.value = ""; inpStock.value = "";
  selActif.value = "true";
  loadProduits();
}

// ------------- Brancher les boutons
btnRef.addEventListener("click", loadProduits);
btnAdd.addEventListener("click", addProduct);

// ------------- Lancer au démarrage
loadProduits();
