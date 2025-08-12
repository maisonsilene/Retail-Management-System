from flask import Flask, render_template_string, request, redirect
from stock import STOCK, VENTES

app = Flask(__name__)

@app.route("/")
def index():
    return render_template_string("""
        <h2>Stock actuel</h2>
        <ul>
        {% for ref, article in stock.items() %}
            <li>{{ article.nom }} ({{ ref }}): {{ article.quantite }}</li>
        {% endfor %}
        </ul>
        <h2>Nouvelle vente</h2>
        <form method="POST" action="/vente">
            <select name="reference">
                {% for ref, article in stock.items() %}
                    <option value="{{ ref }}">{{ article.nom }}</option>
                {% endfor %}
            </select>
            <input type="number" name="quantite" min="1" required>
            <button type="submit">Vendre</button>
        </form>
        <h2>Historique des ventes</h2>
        <ul>
        {% for vente in ventes %}
            <li>{{ vente['article'] }}: -{{ vente['quantite'] }}</li>
        {% endfor %}
        </ul>
    """, stock=STOCK, ventes=VENTES)

@app.route("/vente", methods=["POST"])
def vente():
    ref = request.form["reference"]
    quantite = int(request.form["quantite"])
    if STOCK[ref]["quantite"] >= quantite:
        STOCK[ref]["quantite"] -= quantite
        VENTES.append({"article": STOCK[ref]["nom"], "quantite": quantite})
    return redirect("/")

if __name__ == "__main__":
    app.run(debug=True)
