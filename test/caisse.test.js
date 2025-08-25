import assert from 'node:assert';
import { sell } from '../src/caisse.js';

function createSupabaseMock(initial) {
  const tables = {
    produits: initial.produits.map(p => ({ ...p })),
    ventes: [],
    ventes_lignes: []
  };
  let idCounter = 1;
  return {
    tables,
    from(table) {
      return {
        select() {
          return {
            eq(column, value) {
              return {
                async single() {
                  const row = tables[table].find(r => r[column] === value);
                  if (!row) {
                    return { data: null, error: { message: 'Not found' } };
                  }
                  return { data: { ...row }, error: null };
                }
              };
            }
          };
        },
        insert(rows) {
          const withIds = rows.map(row => ({ id: `${table}_${idCounter++}`, ...row }));
          tables[table].push(...withIds);
          return {
            select() {
              return {
                async single() {
                  return { data: withIds[0], error: null };
                }
              };
            }
          };
        },
        update(values) {
          return {
            async eq(column, value) {
              const row = tables[table].find(r => r[column] === value);
              if (!row) {
                return { data: null, error: { message: 'Not found' } };
              }
              Object.assign(row, values);
              return { data: row, error: null };
            }
          };
        }
      };
    }
  };
}

(async () => {
  const sbReject = createSupabaseMock({ produits: [{ id: 'p1', stock: 5, prix_ttc: 10 }] });
  await assert.rejects(() => sell(sbReject, 'p1', 6), /Stock insuffisant/);

  const sbOk = createSupabaseMock({ produits: [{ id: 'p1', stock: 5, prix_ttc: 10 }] });
  const venteId = await sell(sbOk, 'p1', 2);
  assert.strictEqual(sbOk.tables.produits[0].stock, 3);
  assert.strictEqual(sbOk.tables.ventes.length, 1);
  assert.strictEqual(sbOk.tables.ventes[0].id, venteId);
  assert.strictEqual(sbOk.tables.ventes_lignes.length, 1);
  assert.strictEqual(sbOk.tables.ventes_lignes[0].quantite, 2);
  assert.strictEqual(sbOk.tables.ventes_lignes[0].vente_id, venteId);
  assert.strictEqual(sbOk.tables.ventes_lignes[0].produit_id, 'p1');

  console.log('All caisse tests passed.');
})();
