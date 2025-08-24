# Mini POS – Schéma Supabase

## Table: produits
- id (uuid, PK, default gen_random_uuid())
- created_at (timestamp, default now())
- nom (text)
- prix_ttc (numeric)
- tva (numeric, nullable)
- actif (boolean)
- stock (int)

## Table: clients
- id (uuid, PK)
- created_at (timestamp)
- prenom (text)
- nom (text)
- email (text)
- ville (text)
- telephone (text)
- notes (text)

## Table: ventes
- id (uuid, PK)
- created_at (timestamp)
- date_heure (timestamp)
- total_ttc (numeric)
- total_ht (numeric)
- mode_paiement (text)
- client_id (uuid, FK → clients.id)

## Table: ventes_lignes
- id (uuid, PK)
- created_at (timestamp)
- quantite (int)
- prix_unitaire_ht (numeric)
- prix_unitaire_ttc (numeric)
- total_ht (numeric)
- total_ttc (numeric)
- vente_id (uuid, FK → ventes.id)
- produit_id (uuid, FK → produits.id)
