# 🛠️ **GopherDrop** – Secure One-Time Secret Sharing 🏁

![GitHub branch check runs](https://img.shields.io/github/check-runs/kek-Sec/GopherDrop/main)
![Coveralls](https://img.shields.io/coverallsCoverage/github/kek-Sec/GopherDrop)
![GitHub go.mod Go version](https://img.shields.io/github/go-mod/go-version/kek-Sec/GopherDrop)



### Demo: [https://gopherdrop.yup.gr](http://gopherdrop.yup.gr)

GopherDrop is a secure, self-hostable REST API and UI for sharing encrypted one-time secrets and files, inspired by Bitwarden's Send feature. Built with **Go**, **Vue.js**, and **Vuetify**, GopherDrop is designed for simplicity, security, and ease of deployment.

![GopherDrop Banner](ui/src/assets/Images/banner.png)

---

## 📋 **Table of Contents**

1. [Features](#-features)
2. [Installation](#-installation)
3. [Build and Run](#-build-and-run)
4. [Configuration](#-configuration)
5. [Endpoints](#-endpoints)
6. [Docker Deployment](#-docker-deployment)
7. [Contributing](#-contributing)
8. [License](#-license)
9. [Community and Support](#-community-and-support)

---

## 🌟 **Features**

- **Send Text or Files**: Share sensitive information securely.
- **Text Display in Page**: View text secrets directly in the browser with syntax highlighting support.
- **Multi-File Support**: Automatically packages multiple files/folders into a ZIP archive.
- **Password Protection**: Encrypt your secrets with a password.
- **Interactive Password Form**: User-friendly password input with validation.
- **One-Time Retrieval**: Automatically delete secrets after a single access.
- **Expiration Settings**: Define how long a secret remains available with customizable options.
- **Multi-Language Support**: Available in French 🇫🇷, English 🇺🇸, and Spanish 🇪🇸.
- **Dark/Light Theme**: Toggle between dark and light modes with preference persistence.
- **Customizable Branding**: Configure custom logo, background, favicon, and CSS.
- **Responsive UI**: Built with Vue.js and Vuetify for a modern user experience.
- **Dockerized Deployment**: Simple setup with Docker and Docker Compose.
- **Production and Debug Modes**: Easily switch between production and debug builds.


---

## 🐳 **Docker Deployment**

Use the provided `docker-compose.yaml` to deploy:

```bash
docker-compose up -d
```

For production deployment, see `docker-compose.prod.sample.yaml`.

---

## 📥 **Installation**

### **Prerequisites**

- **Docker**: [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose**: [Install Docker Compose](https://docs.docker.com/compose/install/)

### **Clone the Repository**

```bash
git clone https://github.com/kek-Sec/gopherdrop.git
cd gopherdrop
```
---

## 🛠️ **Build and Run**

### **Local Setup**

To build and run GopherDrop in production mode:

```bash
make build      # Build the Docker images
make up         # Start the backend, frontend, and database services
```

### **Debug Setup**

To build and run GopherDrop in debug mode:

```bash
make build-debug   # Build the Docker images with debug mode enabled
make up            # Start the backend, frontend, and database services in debug mode
```

### **Stopping Services**

```bash
make down
```

### **Running Tests**

```bash
make test
```

## ⚙️ **Configuration**

### **Using `.env` File**

Create a `.env` file in the project root to securely store your secrets:

```env
DB_HOST=db
DB_USER=user
DB_PASSWORD=pass
DB_NAME=gopherdropdb
DB_SSLMODE=disable
SECRET_KEY=supersecretkeysupersecretkey32
LISTEN_ADDR=:8080
STORAGE_PATH=/app/storage
MAX_FILE_SIZE=10485760
```

### **Environment Variables**

| Variable              | Description                                | Default Value                        |
|-----------------------|--------------------------------------------|--------------------------------------|
| `DB_HOST`             | Database host                              | `db`                                |
| `DB_USER`             | Database username                          | `user`                              |
| `DB_PASSWORD`         | Database password                          | `pass`                              |
| `DB_NAME`             | Database name                              | `gopherdropdb`                      |
| `DB_SSLMODE`          | Database SSL mode                          | `disable`                           |
| `SECRET_KEY`          | Secret key for encryption (32 chars min)   | `supersecretkeysupersecretkey32`    |
| `LISTEN_ADDR`         | API listen address                         | `:8080`                             |
| `STORAGE_PATH`        | Path for storing uploaded files            | `/app/storage`                      |
| `MAX_FILE_SIZE`       | Maximum file size in bytes                 | `10485760` (10 MB)                  |
| `EXPIRATION_OPTIONS`  | Comma-separated expiration durations       | `1h,6h,12h,24h,72h,168h`            |
| `CUSTOM_CSS`          | Custom CSS to inject into the frontend     | `""`                                |
| `LOGO_URL`            | URL for custom logo (empty = default)      | `""` (uses `/assets/Images/logo.png`) |
| `BACKGROUND_URL`      | URL for custom background image            | `""`                                |
| `FAVICON_URL`         | URL for custom favicon                     | `""`                                |
| `LANGUAGE`            | Default language (fr, en, es)              | `en`                                |

### **Build Arguments**

| Argument             | Description                          | Default Value                                |
|----------------------|--------------------------------------|----------------------------------------------|
| `VITE_API_URL`       | API endpoint URL                     | `/api`                                       |
| `VITE_APP_TITLE`     | Custom application title             | `GopherDrop`                                 |
| `VITE_APP_DESCRIPTION` | Custom application description     | `Secure one-time secret and file sharing`    |
| `DEBUG`              | Enable debug mode                    | `false`                                      |
| `GIN_MODE`           | Gin framework mode                   | `release`                                    |
| `VERSION`            | Application version                  | `-`                                          |

---

## 🖥️ **Endpoints**

### **API Endpoints**

| Method | Endpoint           | Description                                      |
|--------|--------------------|--------------------------------------------------|
| `POST` | `/send`            | Create a new send (text or file)                 |
| `GET`  | `/send/:id`        | Retrieve a send by its hash (file download)      |
| `GET`  | `/text/:id`        | Retrieve text content by its hash                |
| `GET`  | `/view/:id`        | Retrieve a send (redirects for text)             |
| `GET`  | `/send/:id/check`  | Check if a send requires a password              |
| `GET`  | `/config`          | Get frontend configuration                       |

### **Frontend Routes**

| Route          | Description                                           |
|----------------|-------------------------------------------------------|
| `/`            | Home page - Create new secret                         |
| `/view/:hash`  | View/download a file secret (with password form)      |
| `/text/:hash`  | Display a text secret (with password form)            |
| `/error`       | Generic error page                                    |


---

## 🤝 **Contributing**

1. Fork the repository.
2. Create a new branch: `git checkout -b my-feature-branch`
3. Make your changes and add tests.
4. Submit a pull request.

---

## 📝 **License**

GopherDrop is licensed under the [MIT License](LICENSE).

---

## 🎨 **Customization Examples**

### **Custom Branding**

```yaml
environment:
  LOGO_URL: "https://example.com/my-logo.png"
  BACKGROUND_URL: "https://example.com/background.jpg"
  FAVICON_URL: "https://example.com/favicon.ico"
  CUSTOM_CSS: |
    .v-app-bar { background: linear-gradient(45deg, #667eea 0%, #764ba2 100%) !important; }
    .v-btn { border-radius: 20px !important; }
```

### **Custom Expiration Options**

```yaml
environment:
  EXPIRATION_OPTIONS: "30m,2h,8h,1d,3d,7d,30d"
```

### **Language Settings**

Set the default language (users can still switch):

```yaml
environment:
  LANGUAGE: "fr"  # Options: fr, en, es
```

---

## 💬 **Community and Support**

- **Issues**: [GitHub Issues](https://github.com/kek-Sec/gopherdrop/issues)
- **Discussions**: [GitHub Discussions](https://github.com/kek-Sec/gopherdrop/discussions)
