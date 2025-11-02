# 🛠️ **GopherDrop Enhanced** – Secure One-Time Secret Sharing

> 🔱 **Fork of** [kek-Sec/GopherDrop](https://github.com/kek-Sec/GopherDrop) with enhanced customization features

![GitHub go.mod Go version](https://img.shields.io/github/go-mod/go-version/kek-Sec/GopherDrop)

GopherDrop Enhanced is a fork of the original GopherDrop project with additional enterprise-ready customization features. This self-hostable REST API and UI allows you to share encrypted one-time secrets and files securely, with full branding control through a local assets directory.

![GopherDrop Banner](ui/src/assets/Images/banner.png)

---

## 📋 **Table of Contents**

1. [Enhanced Features](#-enhanced-features)
2. [Installation](#-installation)
3. [Configuration](#-configuration)
4. [Personal Assets Directory](#-personal-assets-directory)
5. [Docker Deployment](#-docker-deployment)
6. [API Endpoints](#-api-endpoints)
7. [Contributing](#-contributing)
8. [License](#-license)

---

## ⭐ **Enhanced Features**

All original GopherDrop features, plus:

### **🎨 Full Branding Customization**
- **Local Assets Directory**: Store your logo, favicon, and background in `./personal/` directory
- **Custom CSS**: Inject custom styling without rebuilding the container
- **Dynamic Configuration**: All branding updates without image rebuild

### **⚙️ Flexible Configuration**
- **Custom Expiration Options**: Define your own expiration durations
- **Runtime Configuration**: Change settings via environment variables
- **No Rebuild Required**: Update assets and config on-the-fly

### **🌍 Multi-Language Support**
- Available in **French 🇫🇷**, **English 🇺🇸**, and **Spanish 🇪🇸**
- Users can switch language from the interface
- Auto-detection of browser language

### **Core Features (from original)**
- Send text or files securely
- Password protection
- One-time retrieval
- Automatic expiration
- Multi-file ZIP support
- Dark/Light theme toggle
- Dockerized deployment

---

## 📥 **Installation**

### **Prerequisites**
- **Docker**: [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose**: [Install Docker Compose](https://docs.docker.com/compose/install/)

### **Quick Start**

```bash
# Clone this repository
git clone https://github.com/YOUR-USERNAME/gopherdrop-enhanced.git
cd gopherdrop-enhanced

# Create personal assets directory (optional)
mkdir -p personal

# Start the application
docker-compose up -d
```

Access the application at: **http://localhost:8081**

---

## ⚙️ **Configuration**

### **Environment Variables**

| Variable | Description | Default Value | Required |
|----------|-------------|---------------|----------|
| `DB_HOST` | Database host | `db` | ✅ |
| `DB_USER` | Database username | `user` | ✅ |
| `DB_PASSWORD` | Database password | `pass` | ✅ |
| `DB_NAME` | Database name | `gopherdropdb` | ✅ |
| `DB_SSLMODE` | Database SSL mode | `disable` | ✅ |
| `SECRET_KEY` | Encryption key (min 32 chars) | `supersecretkeysupersecretkey32` | ✅ |
| `LISTEN_ADDR` | API listen address | `:8080` | ❌ |
| `STORAGE_PATH` | File storage path | `/app/storage` | ❌ |
| `MAX_FILE_SIZE` | Max file size in bytes | `10485760` (10 MB) | ❌ |
| `EXPIRATION_OPTIONS` | Comma-separated durations (Go format) | `1h,6h,12h,24h,72h,168h` | ❌ |
| `CUSTOM_CSS` | Custom CSS to inject | `""` | ❌ |
| `LOGO_URL` | Logo path (use `/personal/logo.png` for local) | `""` | ❌ |
| `BACKGROUND_URL` | Background image path | `""` | ❌ |
| `FAVICON_URL` | Favicon path | `""` | ❌ |

### **Expiration Options Format**

Go `time.ParseDuration` format is required:
- `h` = hours
- `m` = minutes
- `s` = seconds

**Examples:**
```yaml
EXPIRATION_OPTIONS: "1h,3h,6h,12h,24h,72h,168h"
# 1h = 1 hour
# 24h = 1 day
# 72h = 3 days
# 168h = 1 week
```

⚠️ **Note**: `d` (days) and `w` (weeks) are **NOT supported** by Go. Use hours instead.

### **File Size Examples**

The `MAX_FILE_SIZE` variable accepts values in bytes. Here are common examples:

| Size | Bytes | Environment Variable |
|------|-------|---------------------|
| 10 MB | `10485760` | `MAX_FILE_SIZE: 10485760` |
| 100 MB | `104857600` | `MAX_FILE_SIZE: 104857600` |
| 500 MB | `524288000` | `MAX_FILE_SIZE: 524288000` |
| 1 GB | `1073741824` | `MAX_FILE_SIZE: 1073741824` |
| 2 GB | `2147483648` | `MAX_FILE_SIZE: 2147483648` |
| 5 GB | `5368709120` | `MAX_FILE_SIZE: 5368709120` |
| 10 GB | `10737418240` | `MAX_FILE_SIZE: 10737418240` |

**Formula**: `Size in MB × 1024 × 1024 = Bytes`

**Note**: Large file sizes may impact server performance and storage requirements.

---

## 📁 **Personal Assets Directory**

### **Setup**

1. **Create the directory:**
```bash
mkdir -p personal
```

2. **Add your assets:**
```
personal/
├── logo.png          # Your company logo (recommended: PNG, 200x50px)
├── favicon.ico       # Your favicon (ICO, 32x32px or 16x16px)
├── background.jpg    # Background image (JPG/PNG, 1920x1080px)
└── custom.css        # Custom CSS (optional, for future use)
```

3. **Configure docker-compose.yaml:**
```yaml
environment:
  LOGO_URL: "/personal/logo.png"
  BACKGROUND_URL: "/personal/background.jpg"
  FAVICON_URL: "/personal/favicon.ico"
```

4. **Restart the application:**
```bash
docker-compose down
docker-compose up -d
```

### **How It Works**

- The `./personal` directory is mounted as a Docker volume
- Nginx serves files from `/personal/` path
- No image rebuild required to update assets
- Files are served with proper caching headers

### **Verification**

Check if assets are accessible:
```bash
curl -I http://localhost:8081/personal/logo.png
# Should return 200 OK (if file exists) or 404 (if not)

curl http://localhost:8081/api/config
# Should show: "logoURL": "/personal/logo.png"
```

---

## 🐳 **Docker Deployment**

### **Using docker-compose.yaml**

```yaml
services:
  app:
    environment:
      # Database configuration
      DB_HOST: db
      DB_USER: user
      DB_PASSWORD: pass
      DB_NAME: gopherdropdb
      SECRET_KEY: your-secret-key-min-32-chars
      
      # File configuration
      MAX_FILE_SIZE: 10485760  # 10 MB
      EXPIRATION_OPTIONS: "1h,6h,24h,72h,168h"
      
      # Branding (use /personal/ for local files)
      LOGO_URL: "/personal/logo.png"
      BACKGROUND_URL: "/personal/background.jpg"
      FAVICON_URL: "/personal/favicon.ico"
      CUSTOM_CSS: ""
      
    volumes:
      - ./personal:/app/personal:ro  # Mount personal assets
    ports:
      - "8081:80"
```

### **Commands**

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f app

# Rebuild after code changes
docker-compose build --no-cache
docker-compose up -d
```

---

## 🖥️ **API Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/send` | Create a new secret (text or file) |
| `GET` | `/api/send/:id` | Retrieve a secret (file download) |
| `GET` | `/api/text/:id` | Retrieve text secret |
| `GET` | `/api/send/:id/check` | Check if password required |
| `GET` | `/api/config` | Get frontend configuration |

### **Frontend Routes**

| Route | Description |
|-------|-------------|
| `/` | Home page - Create new secret |
| `/view/:hash` | View/download a file secret |
| `/text/:hash` | Display a text secret |
| `/error` | Error page |

---

## 🎨 **Customization Examples**

### **Example 1: Complete Branding**

```yaml
environment:
  LOGO_URL: "/personal/company-logo.png"
  BACKGROUND_URL: "/personal/corporate-bg.jpg"
  FAVICON_URL: "/personal/company-favicon.ico"
  CUSTOM_CSS: |
    .v-app-bar { background: linear-gradient(45deg, #1a365d 0%, #2b77e6 100%) !important; }
    .v-btn.primary { background-color: #2b77e6 !important; }
  EXPIRATION_OPTIONS: "1h,4h,8h,24h,48h,168h"
```

### **Example 2: URL-based Assets** (no personal folder)

```yaml
environment:
  LOGO_URL: "https://cdn.example.com/logo.png"
  BACKGROUND_URL: "https://cdn.example.com/background.jpg"
  FAVICON_URL: "https://cdn.example.com/favicon.ico"
```

### **Example 3: Minimal Configuration**

```yaml
environment:
  LOGO_URL: "/personal/logo.png"  # Only custom logo
  BACKGROUND_URL: ""              # No background
  FAVICON_URL: ""                 # Default favicon
  CUSTOM_CSS: ""                  # No custom CSS
```

For more CSS customization options, see [CSS_CUSTOMIZATION.md](CSS_CUSTOMIZATION.md).

---

## 🤝 **Contributing**

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📝 **License**

This project is licensed under the [MIT License](LICENSE).

---

## 🙏 **Credits**

- **Original Project**: [kek-Sec/GopherDrop](https://github.com/kek-Sec/GopherDrop)
- **Enhanced Fork Maintainer**: Kenny31
- **See**: [CUSTOMIZATIONS.md](CUSTOMIZATIONS.md) for detailed modifications

---

## 💬 **Support**

- **Issues**: [GitHub Issues](https://github.com/YOUR-USERNAME/gopherdrop-enhanced/issues)
- **Original Project**: [kek-Sec/GopherDrop](https://github.com/kek-Sec/GopherDrop)
- **Documentation**: [CSS_CUSTOMIZATION.md](CSS_CUSTOMIZATION.md)