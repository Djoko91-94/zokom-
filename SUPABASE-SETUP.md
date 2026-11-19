# Configurer l’annuaire et les avis Yenly

L’annuaire Tokyo utilise Supabase pour les comptes, les adresses et les avis. Il accepte quatre catégories — restauration, shopping, services pratiques et lieux à visiter — avec des sous-catégories, des noms français/anglais et japonais, une fourchette de prix en yens et des informations pratiques. Les nouveaux avis restent en attente jusqu’à leur validation par un modérateur.

## 1. Créer le projet Supabase

Crée un projet sur [Supabase](https://supabase.com/), puis ouvre **SQL Editor** et exécute le fichier [`supabase/schema.sql`](./supabase/schema.sql). Si tu as déjà appliqué une version précédente du schéma, exécute-le à nouveau : il ajoute les champs de catégorie, de sous-catégorie, de prix et d’informations pratiques en conservant les adresses existantes. Les nouvelles fiches demandent le nom japonais ; les anciens lieux sans ce champ restent affichés sans lui.

## 2. Configurer l’application locale

Copie `.env.example` vers `.env.local`, puis remplace les valeurs par l’URL du projet et sa clé publique `anon`/`publishable` disponibles dans **Project Settings → API**.

```text
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<clé-publique>
```

Ne mets jamais la clé `service_role` dans le site, dans `.env.local` partagé ou dans Git. La clé publique est utilisable côté navigateur car les permissions sont contrôlées par les règles RLS du schéma.

Relance `npm run dev` après avoir créé `.env.local`.

## 3. Configurer l’hébergement Vercel

Dans **Project Settings → Environment Variables**, ajoute `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` pour les environnements Production et Preview, puis redéploie.

Dans **Authentication → URL Configuration**, définis :

- Site URL : `https://zokom.vercel.app`
- Redirect URL locale : `http://localhost:5180/guide/`
- Redirect URL de production : `https://zokom.vercel.app/guide/`

Active la confirmation par e-mail dans **Authentication → Providers → Email**. Pour une utilisation publique, configure un fournisseur SMTP adapté afin que les messages de confirmation soient délivrés correctement.

## 4. Aider les voyageurs à trouver Yenly

Partage directement `https://zokom.vercel.app/`. Pour Google, ajoute le site dans [Search Console](https://search.google.com/search-console/) et soumets `https://zokom.vercel.app/sitemap.xml`. Le sitemap et les pages avec leurs propres titres sont déjà en place, mais l’indexation et le classement prennent du temps et ne sont jamais garantis.

## 5. Ajouter le premier modérateur

Crée un compte Yenly avec ton adresse, puis exécute dans le SQL Editor en remplaçant l’adresse :

```sql
insert into public.review_moderators (user_id)
select id
from auth.users
where lower(email) = lower('ton-adresse@example.com')
on conflict (user_id) do nothing;
```

Le lien de modération apparaîtra après ta prochaine connexion. Depuis cet espace, tu pourras publier des adresses dans les quatre catégories avec leurs noms, fourchettes de prix, horaires, stations proches et liens Google Maps, puis approuver ou refuser les avis. Le bouton de conversion utilise le milieu de la fourchette et la dernière devise de destination choisie dans Yenly. Seul un modérateur ajouté directement dans la base peut prendre ces décisions. Chaque adresse doit inclure une source de vérification ; les prix et horaires restent indicatifs et doivent être vérifiés avant publication.
