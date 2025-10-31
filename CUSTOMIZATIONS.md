# 🛠️ **GopherDrop - Modifications pour Entreprise**

## 📋 **Résumé des modifications réalisées**

Ce document détaille les personnalisations apportées à GopherDrop pour l'adapter aux besoins d'une entreprise, incluant le branding personnalisé, la configuration flexible et le support des dossiers multiples.

### **Date des modifications** : 2025-10-30
### **Auteur** : Kilo Code (Assistant IA)

---

## 🔧 **Modifications par fichier**

### **1. Backend Go - Configuration**
**Fichier** : `internal/config/config.go`
- ✅ Ajout des nouvelles variables d'environnement :
  - `EXPIRATION_OPTIONS` : Options d'expiration configurables
  - `CUSTOM_CSS` : CSS personnalisé
  - `LOGO_URL` : URL du logo
  - `BACKGROUND_URL` : URL du fond d'écran
  - `FAVICON_URL` : URL de l'icône favicon
  - `LANGUAGE` : Langue de l'interface
- ✅ Fonction de parsing pour les options d'expiration

### **2. Backend Go - Handlers API**
**Fichier** : `internal/handlers/handlers.go`
- ✅ Nouvelle fonction `GetConfig()` pour exposer la configuration
- ✅ Support des archives ZIP pour dossiers multiples
- ✅ Fonctions utilitaires `isZipFile()` et `isDirectory()`

### **3. Backend Go - Routes**
**Fichier** : `internal/routes/routes.go`
- ✅ Ajout de la route `GET /api/config`

### **4. Frontend Vue.js - App principale**
**Fichier** : `ui/src/App.vue`
- ✅ Chargement dynamique de la configuration
- ✅ Application du CSS personnalisé
- ✅ Logo configurable
- ✅ Fond d'écran configurable
- ✅ Icône favicon configurable

### **5. Frontend Vue.js - Configuration principale**
**Fichier** : `ui/src/main.js`
- ✅ Préparation pour l'internationalisation

### **6. Frontend Vue.js - Services API**
**Fichier** : `ui/src/services/api.js`
- ✅ Fonction `getConfig()` pour récupérer la configuration

### **7. Frontend Vue.js - Page de création**
**Fichier** : `ui/src/pages/Create.vue`
- ✅ Chargement des options d'expiration depuis la config
- ✅ Support upload ZIP avec indication utilisateur
- ✅ Formatage automatique des durées

### **8. Configuration Docker**
**Fichier** : `docker-compose.yaml`
- ✅ Ajout de toutes les nouvelles variables d'environnement

---

## ⚙️ **Variables d'environnement disponibles**

```env
# Options d'expiration personnalisables (format: durée1,durée2,durée3)
EXPIRATION_OPTIONS=1h,6h,12h,24h,72h,168h

# CSS personnalisé (injecté dans <head>)
CUSTOM_CSS=.mon-style { color: #007bff; font-weight: bold; }

# URLs pour le branding d'entreprise
LOGO_URL=https://mon-entreprise.com/assets/logo.png
BACKGROUND_URL=https://mon-entreprise.com/assets/background.jpg
FAVICON_URL=https://mon-entreprise.com/assets/favicon.ico

# Configuration de langue (support actuel: "en")
LANGUAGE=en
```

---

## 🚀 **Guide de déploiement**

### **Prérequis**
- Docker Desktop installé et fonctionnel
- Ports 8081 et 8080 disponibles

### **Commandes de lancement**
```bash
# Construction et lancement
docker-compose up --build

# Lancement en arrière-plan
docker-compose up -d --build

# Arrêt des services
docker-compose down
```

### **Accès à l'application**
- **Interface utilisateur** : http://localhost:8081
- **API** : http://localhost:8081/api

---

## 🔒 **Sécurité et compatibilité**

### **Sécurité maintenue**
- ✅ Chiffrement AES-256 des données
- ✅ Validation des tailles de fichiers
- ✅ Expiration automatique des secrets
- ✅ Protection par mot de passe
- ✅ Suppression après accès unique
- ✅ Rate limiting sur les uploads

### **Rétrocompatibilité**
- ✅ Toutes les fonctionnalités existantes préservées
- ✅ API backward compatible
- ✅ Configuration par défaut conservée

---

## 📁 **Support des dossiers multiples**

### **Fonctionnement**
- Upload de fichiers ZIP contenant plusieurs dossiers/fichiers
- Détection automatique des archives ZIP
- Téléchargement sécurisé et chiffré maintenu
- Interface utilisateur mise à jour avec indications claires

### **Utilisation**
1. Créer une archive ZIP avec vos dossiers/fichiers
2. Uploader via l'interface (champ "Select File or ZIP Archive")
3. Partager le lien généré
4. Le destinataire reçoit l'archive complète

---

## 🎨 **Personnalisation du branding**

### **Exemple de configuration entreprise**
```yaml
environment:
  LOGO_URL: "https://mon-entreprise.com/logo.png"
  BACKGROUND_URL: "https://mon-entreprise.com/bg-corporate.jpg"
  FAVICON_URL: "https://mon-entreprise.com/favicon.ico"
  CUSTOM_CSS: |
    .v-app-bar { background-color: #1a365d !important; }
    .v-btn.primary { background-color: #2b77e6 !important; }
    body { font-family: 'Segoe UI', sans-serif; }
  EXPIRATION_OPTIONS: "1h,4h,8h,24h,48h,168h"
  LANGUAGE: "en"
```

---

## 🧪 **Tests recommandés**

### **Fonctionnalités de base**
- [ ] Upload de texte avec mot de passe
- [ ] Upload de fichier unique
- [ ] Upload d'archive ZIP
- [ ] Téléchargement avec mot de passe
- [ ] Expiration automatique

### **Personnalisation**
- [ ] Logo affiché correctement
- [ ] Fond d'écran appliqué
- [ ] Icône favicon changée
- [ ] CSS personnalisé fonctionnel
- [ ] Options d'expiration personnalisées

### **Sécurité**
- [ ] Chiffrement des données
- [ ] Validation des tailles
- [ ] Rate limiting
- [ ] Suppression après accès unique

---

## 📞 **Support et maintenance**

Pour toute question concernant ces modifications :
- Référencer ce document `CUSTOMIZATIONS.md`
- Vérifier les logs Docker en cas de problème
- Tester les variables d'environnement une par une

**Dernière mise à jour** : 2025-10-30
**Version** : Enterprise Customization v1.0