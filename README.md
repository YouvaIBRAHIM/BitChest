# BitChest
##Présentation 
BitChest est une plateforme permettant aux particuliers d'acheter et de vendre des crypto-monnaies, telles que le Bitcoin et l'Ethereum.

L'objectif est la création de l'interface d'administration pour les profils d'administrateurs et de clients, gestion des données personnelles, des portefeuilles, consultation des cours des crypto-monnaies, et plus encore.

## Description

Ce projet est composé de deux parties distinctes : un backend basé sur Laravel contenu dans le dossier `api`, et un frontend utilisant React.js contenu dans le dossier `client`.

## Installation

1. Cloner le dépôt GitHub :
   ```
   git clone https://github.com/YouvaIBRAHIM/BitChest.git
   ```
   
Installation des dépendances Laravel :
   - Accéder au dossier `api` :
     ```
     cd BitChest/api
     ```

## Étapes pour le dossier api :

1. Copier le fichier `.env` :
   ```
   cp .env.example .env
   ```

2. Configurer les variables d'environnement :
   Ouvrez le fichier `.env` nouvellement copié et configurez les paramètres de connexion à la base de données, l'URL de l'application, etc., selon votre configuration.

3. Installer les dépendances Laravel :
   ```
   composer install
   ```

4. Générer une clé d'application :
   ```
   php artisan key:generate
   ```

5. Effectuer une migration avec le remplissage de la base de données :
    
    Assurez vous d'avoir lancé le service MySQL avant d'exécuter cette commande :
   ```
   php artisan migrate --seed
   ```
   
   Si vous avez déjà effectué la commande précédente et que vous souhaitez refaire une migration, exécutez cette commande à la place :
   ```
   php artisan migrate:fresh --seed
   ```

   Cette commande va créer toutes les tables de la base de données et les remplir avec des données de démonstration grâce aux seeders.

6. Mettre le raccourci du répertoire `storage/app/public/img` dans le dossier `public` :
   ```
   php artisan storage:link
   ```

   Le serveur backend Laravel sera accessible à l'adresse http://localhost:8000.

7. Lancer le serveur Laravel :
   ```
   php artisan serve
   ```

   Le serveur backend Laravel sera accessible à l'adresse http://localhost:8000.

Assurez-vous d'avoir correctement configuré les informations de la base de données dans le fichier `.env` avant d'exécuter la commande de migration et le serveur.

Une fois ces étapes terminées, vous pouvez passer au dossier `client` pour configurer et lancer le frontend React.js en suivant les étapes que vous avez mentionnées :

## Étapes pour le dossier client :

1. Installer les dépendances React.js :
   ```
   cd BitChest/client
   npm install
   ```

2. Lancer le serveur de développement pour le frontend :
   ```
   npm run dev
   ```

   Le serveur frontend React.js sera accessible à l'adresse http://localhost:3000.

Si vous faites un build du site, assurez-vous de mettre les fichiers du dossier `dist` dans le tableau appShell du fichier sw.js pour profiter pleinement du Service Worker.


Pour accéder à la page d'administration de votre application, suivez les étapes suivantes :

1. Assurez-vous que les serveurs du backend (Laravel) et du frontend (React.js) sont en cours d'exécution.

2. Accédez à la page de login en ouvrant votre navigateur Web et en entrant l'URL suivante : http://localhost:3000/login

3. Sur la page de login, entrez les informations d'identification suivantes :
   - Email : jerome@admin.com
   - Mot de passe : password

