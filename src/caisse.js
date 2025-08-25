/**
 * Logique de vente simple pour la caisse.
 * @param {object} sb - client Supabase
 * @param {string} produitId - identifiant du produit
 * @param {number} quantite - quantité vendue
 * @returns {Promise<string>} id de la vente créée
 */
export async function sell(sb, produitId, quantite) {
  const { data: produit, error } = await sb
    .from('produits')
    .select('id, stock, prix_ttc')
    .eq('id', produitId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (produit.stock < quantite) {
    throw new Error('Stock insuffisant');
  }

  const total_ttc = produit.prix_ttc * quantite;
  const { data: vente, error: errVente } = await sb
    .from('ventes')
    .insert([{ total_ttc }])
    .select()
    .single();

  if (errVente) {
    throw new Error(errVente.message);
  }

  const { error: errLignes } = await sb
    .from('ventes_lignes')
    .insert([{ quantite, total_ttc, vente_id: vente.id, produit_id: produitId }]);

  if (errLignes) {
    throw new Error(errLignes.message);
  }

  const { error: errStock } = await sb
    .from('produits')
    .update({ stock: produit.stock - quantite })
    .eq('id', produitId);

  if (errStock) {
    throw new Error(errStock.message);
  }

  return vente.id;
}
