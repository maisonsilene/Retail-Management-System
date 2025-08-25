const tabStocks = document.getElementById('tab-stocks');
const tabCaisse = document.getElementById('tab-caisse');
const tabJournal = document.getElementById('tab-journal');

const btnStocks = document.getElementById('btn-stocks');
const btnCaisse = document.getElementById('btn-caisse');
const btnJournal = document.getElementById('btn-journal');

function showTab(tab) {
  [tabStocks, tabCaisse, tabJournal].forEach(t => {
    t.style.display = t === tab ? 'block' : 'none';
  });
}

btnStocks.addEventListener('click', () => showTab(tabStocks));
btnCaisse.addEventListener('click', () => showTab(tabCaisse));
btnJournal.addEventListener('click', () => showTab(tabJournal));

// Afficher par défaut l'onglet Stocks
showTab(tabStocks);
