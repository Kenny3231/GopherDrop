# 🔧 **Gopher Drop Enhanced - Custom Modifications**

## 📌 **Project Information**

- **Original Project**: [kek-Sec/GopherDrop](https://github.com/kek-Sec/GopherDrop)
- **Fork Maintainer**: Kenny31
- **Last Updated**: 2025-11-02
- **Version**: Enhanced v2.0

---

## 🎯 **Purpose**

This fork extends the original GopherDrop project with enterprise-ready customization features, focusing on branding flexibility and runtime configuration without requiring container rebuilds.

---

## ⭐ **Key Enhancements by Kenny31**

### **1. Personal Assets Directory System**

**Problem Solved**: Original project required rebuilding Docker images to change logos, favicons, or backgrounds.

**Solution Implemented**:
- Created `/personal` directory mounting system
- Modified Nginx configuration to serve local assets
- Updated Dockerfile to create `/app/personal` directory
- Added volume binding in docker-compose.yaml

**Files Modified**:
- `Dockerfile` (line 65): Added `RUN mkdir -p /app/personal`
- `nginx.conf` (lines 18-22): Added `/personal/` location block
- `docker-compose.yaml` (line 44): Added volume mount `./personal:/app/personal:ro`

**Benefits**:
- ✅ No rebuild required to change branding
- ✅ Simply drop files in `./personal/` directory
- ✅ Hot-reload with `docker-compose restart app`
- ✅ Read-only mount for security

---

### **2. Fixed Expiration Options Configuration**

**Problem Solved**: Original implementation didn't properly load custom expiration options from environment variables.

**Solution Implemented**:
- Fixed `formatExpirationTitle()` function to use translations
- Added `configExpirationValues` to preserve server-provided options
- Removed conflicting `immediate: true` in language watch
- Added proper translation mapping for all durations

**Files Modified**:
- `ui/src/pages/Create.vue` (lines 235-350): Complete refactor of expiration options handling

**Benefits**:
- ✅ Custom expiration durations work correctly
- ✅ Proper translations in all languages (FR, EN, ES)
- ✅ Dynamic loading from `/api/config`
- ✅ Language switching preserves custom options

---

### **3. Environment Variables Runtime Loading**

**Problem Solved**: Configuration was hardcoded or required build-time arguments.

**Solution Implemented**:
- All branding now loads from runtime environment variables
- Backend exposes `/api/config` endpoint
- Frontend dynamically fetches and applies configuration
- Custom CSS injection without rebuild

**Files Modified**:
- `internal/config/config.go`: Extended to support all customization variables
- `internal/handlers/handlers.go`: Added `GetConfig()` handler
- `ui/src/App.vue`: Dynamic config loading and application

**Benefits**:
- ✅ Change configuration without rebuilding
- ✅ Easy deployment across multiple environments
- ✅ Centralized configuration management

---

### **4. Enhanced Multi-Language Support**

**Improvement**: While original had English support, enhanced version provides:
- Proper French translations
- Spanish translations
- Dynamic language switching
- Browser language auto-detection
- Persistent language preference

**Files Modified**:
- `ui/src/App.vue`: Language detection and persistence
- `ui/src/pages/Create.vue`: Complete translation system with proper duration formatting

---

## 📋 **Complete List of Modifications**

### **Backend (Go)**

| File | Modification | Purpose |
|------|--------------|---------|
| `internal/config/config.go` | Added `EXPIRATION_OPTIONS`, `CUSTOM_CSS`, `LOGO_URL`, `BACKGROUND_URL`, `FAVICON_URL` | Runtime customization |
| `internal/handlers/handlers.go` | Added `/api/config` endpoint | Expose configuration to frontend |
| `nginx.conf` | Added `/personal/` location | Serve local assets |

### **Frontend (Vue.js)**

| File | Modification | Purpose |
|------|--------------|---------|
| `ui/src/App.vue` | Dynamic config loading, CSS injection, asset URLs | Apply customization |
| `ui/src/pages/Create.vue` | Fixed expiration options, improved translations | Proper duration selection |
| `ui/src/services/api.js` | Added `getConfig()` function | Fetch backend configuration |

### **Infrastructure**

| File | Modification | Purpose |
|------|--------------|---------|
| `Dockerfile` | Added `/app/personal` directory creation | Support personal assets |
| `docker-compose.yaml` | Added volume mount, environment variables | Enable customization |

---

## 🔒 **Security Considerations**

All modifications maintain the original security standards:

- ✅ Assets served with proper caching headers
- ✅ Personal directory mounted read-only (`:ro`)
- ✅ No additional attack surface exposed
- ✅ All original encryption/hashing preserved
- ✅ Input validation maintained

---

## 📚 **Usage Guide**

### **Quick Customization Steps**

1. **Create personal directory:**
```bash
mkdir -p personal
```

2. **Add your files:**
```bash
cp my-logo.png personal/logo.png
cp my-background.jpg personal/background.jpg
cp my-favicon.ico personal/favicon.ico
```

3. **Update docker-compose.yaml:**
```yaml
environment:
  LOGO_URL: "/personal/logo.png"
  BACKGROUND_URL: "/personal/background.jpg"
  FAVICON_URL: "/personal/favicon.ico"
  EXPIRATION_OPTIONS: "1h,6h,24h,72h,168h"
```

4. **Apply changes:**
```bash
docker-compose down
docker-compose up -d
```

---

## 🧪 **Testing Checklist**

- [x] Personal assets accessible via `/personal/` path
- [x] Logo changes without rebuild
- [x] Favicon updates correctly
- [x] Background image applies
- [x] Custom expiration options load from API
- [x] Translations work in FR, EN, ES
- [x] Language switching preserves custom options
- [x] Custom CSS injection functional
- [x] All original features preserved
- [x] No security regressions

---

## 🚀 **Future Enhancements**

Potential improvements for future versions:

- [ ] Support for custom.css file in `/personal/` directory
- [ ] Theme color customization via environment variables
- [ ] Custom footer text/links
- [ ] Webhook notifications on secret access
- [ ] LDAP/SSO authentication
- [ ] Advanced file type restrictions

---

## 📞 **Maintenance Notes**

### **Updating from Upstream**

To merge updates from the original kek-Sec/GopherDrop:

```bash
# Add original repo as upstream
git remote add upstream https://github.com/kek-Sec/GopherDrop.git

# Fetch upstream changes
git fetch upstream

# Merge while preserving enhancements
git merge upstream/main

# Resolve conflicts (focus on preserving new features)
# Test thoroughly before deploying
```

### **Version Tracking**

- **Original GopherDrop**: Based on latest main branch
- **Enhanced Fork**: v2.0 (2025-11-02)
- **Key Additions**: Personal assets directory, dynamic configuration, fixed expiration options

---

## 📖 **Documentation**

- **Original Project**: https://github.com/kek-Sec/GopherDrop
- **This Fork**: See [README.md](README.md) for usage guide
- **CSS Guide**: See [CSS_CUSTOMIZATION.md](CSS_CUSTOMIZATION.md)
- **API Documentation**: See [README.md#api-endpoints](README.md#api-endpoints)

---

## 🏆 **Credits**

- **Original Development**: kek-Sec team
- **Enhanced Fork**: Kenny31
- **Contributions**: Community feedback and testing

---

**Thank you for using GopherDrop Enhanced!** 🚀