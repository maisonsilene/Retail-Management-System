import assert from 'node:assert';

// Mock DOM elements
const mockList = { innerHTML: '', addEventListener: () => {} };
const mockStatus = { textContent: '' };
const mockRefresh = { addEventListener: () => {} };
const domElements = {
  listeCaisse: mockList,
  caisseStatus: mockStatus,
  btnCaisseRefresh: mockRefresh,
};

global.document = {
  getElementById: (id) => domElements[id],
};

let produitsResponse = { data: [], error: null };
let rpcResponse = { error: null };
let rpcCall = null;

const mockSb = {
  from() {
    return {
      select() {
        return {
          order() {
            return Promise.resolve(produitsResponse);
          },
        };
      },
    };
  },
  rpc(name, params) {
    rpcCall = { name, params };
    return Promise.resolve(rpcResponse);
  },
};

global.window = {
  supabase: { createClient: () => mockSb },
};

let alertMessages = [];
global.alert = (msg) => {
  alertMessages.push(msg);
};

const { loadProduits, vendreProduit } = await import('../src/caisse.js');

// reset after initial load
mockList.innerHTML = '';
mockStatus.textContent = '';

// Test loadProduits charges et affiche correctement les produits
produitsResponse = {
  data: [
    { id: 1, nom: 'P1', prix_ttc: 10 },
    { id: 2, nom: 'P2', prix_ttc: 20 },
  ],
  error: null,
};
await loadProduits();
assert.strictEqual(
  mockList.innerHTML,
  '<li>P1 — 10 € <button data-id="1" data-prix="10">Vendre</button></li><li>P2 — 20 € <button data-id="2" data-prix="20">Vendre</button></li>'
);
assert.strictEqual(mockStatus.textContent, 'Connexion OK');
console.log('loadProduits OK');

// Test vendreProduit déclenche l\'RPC vente_simple et gère les erreurs
rpcResponse = { error: null };
alertMessages = [];
rpcCall = null;
await vendreProduit({ target: { tagName: 'BUTTON', dataset: { id: '1' } } });
assert.deepStrictEqual(rpcCall, {
  name: 'vente_simple',
  params: { p_produit: '1', p_qty: 1 },
});
assert.strictEqual(alertMessages[0], 'Vente enregistrée !');
console.log('vendreProduit success OK');

rpcResponse = { error: { message: 'boom' } };
alertMessages = [];
rpcCall = null;
await vendreProduit({ target: { tagName: 'BUTTON', dataset: { id: '2' } } });
assert.deepStrictEqual(rpcCall, {
  name: 'vente_simple',
  params: { p_produit: '2', p_qty: 1 },
});
assert.strictEqual(alertMessages[0], 'Erreur : boom');
console.log('vendreProduit error OK');

console.log('Caisse tests passed.');
