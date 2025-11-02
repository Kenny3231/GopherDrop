# 🎨 **GopherDrop Enhanced - CSS Customization Guide**

## 📋 **Overview**

GopherDrop Enhanced uses Vuetify 3 (Material Design) as its UI framework. You can customize the appearance using the `CUSTOM_CSS` environment variable, which injects CSS directly into the `<head>` of the page.

## 🔧 **How to Apply Custom CSS**

### **Via docker-compose.yaml**
```yaml
environment:
  CUSTOM_CSS: |
    .v-app-bar { background-color: #1a365d !important; }
    .v-btn.primary { background-color: #2b77e6 !important; }
```

### **Via Environment Variable**
```bash
export CUSTOM_CSS=".v-app-bar { background: linear-gradient(45deg, #1a365d 0%, #2b77e6 100%) !important; }"
```

---

## 🎯 **Main CSS Selectors**

### **1. Application Container**
```css
/* Main app container */
.v-app {
  /* Background image is applied here via config.backgroundURL */
}

/* Main content area */
.v-main {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
```

### **2. Header/Navigation**
```css
/* App bar (header) */
.v-app-bar {
  background-color: transparent; /* Default: transparent */
}

/* Logo link */
.logo-link {
  display: inline-block;
  text-decoration: none;
  vertical-align: middle;
}

/* Logo image */
.logo-link img {
  height: 40px; /* Fixed height */
}

/* Navigation buttons */
.v-btn {
  /* General button styling */
}

/* Primary buttons */
.v-btn.primary {
  /* Primary action buttons */
}

/* Create new button */
.v-btn[to="/"] {
  /* "Create New" button */
}

/* Theme toggle button */
.v-btn[aria-label*="theme"] {
  /* Dark/light mode toggle */
}

/* Language selector button */
.v-btn .text-h6 {
  /* Language flag display */
}
```

### **3. Main Content Area**
```css
/* Main container */
.v-container {
  min-height: 85vh;
}

/* Content wrapper */
.v-container .d-flex {
  /* Centered content layout */
}
```

### **4. Cards and Forms**
```css
/* Main card */
.v-card {
  max-width: 600px;
  width: 100%;
  elevation: 6;
}

/* Card title */
.v-card-title {
  text-align: center;
  font-weight: bold;
}

/* Form elements */
.v-form {
  /* Form container */
}

/* Button toggle (Text/File selector) */
.v-btn-toggle {
  display: flex;
  justify-content: center;
}

/* Individual toggle buttons */
.v-btn-toggle .v-btn {
  /* Text/File buttons */
}

/* Text area */
.v-textarea {
  /* Text input field */
}

/* File input */
.v-file-input {
  /* File upload field */
}

/* File chips */
.v-chip-group {
  /* Selected files display */
}

.v-chip {
  /* Individual file chips */
}

/* Select dropdown */
.v-select {
  /* Expiration dropdown */
}

/* Checkbox */
.v-checkbox {
  /* One-time retrieval checkbox */
}

/* Submit button */
.v-btn[type="submit"] {
  height: 50px;
  border-radius: 28px; /* x-large rounded */
}

/* Loading button */
.v-btn .mdi-loading {
  /* Spinner animation */
}
```

### **5. Alerts and Messages**
```css
/* Success alert */
.v-alert[type="success"] {
  /* Secret created message */
}

/* Error alert */
.v-alert[type="error"] {
  /* Error messages */
}

/* Alert content */
.v-alert .v-alert__content {
  /* Alert text */
}
```

### **6. Footer**
```css
/* Footer */
.v-footer {
  background-color: transparent;
  justify-content: center;
}

/* Footer link */
.v-footer a {
  font-weight: 500;
  text-decoration: none;
}
```

### **7. Overlays and Loading**
```css
/* Loading overlay */
.v-overlay {
  /* Full screen loading */
}

/* Progress circular */
.v-progress-circular {
  /* Loading spinner */
}
```

### **8. Snackbar (Notifications)**
```css
/* Success notification */
.v-snackbar {
  /* Copy link notification */
}

.v-snackbar[color="success"] {
  /* Green success snackbar */
}
```

---

## 🎨 **Common Customization Examples**

### **Corporate Branding**
```css
/* Corporate color scheme */
.v-app-bar {
  background: linear-gradient(45deg, #1a365d 0%, #2b77e6 100%) !important;
}

.v-btn.primary {
  background-color: #2b77e6 !important;
  border-color: #2b77e6 !important;
}

.v-btn.primary:hover {
  background-color: #1e40af !important;
}

/* Custom font */
body {
  font-family: 'Segoe UI', 'Roboto', sans-serif;
}
```

### **Dark Theme Adjustments**
```css
/* Dark mode specific */
.v-theme--dark .v-app-bar {
  background: linear-gradient(45deg, #0f172a 0%, #1e293b 100%) !important;
}

.v-theme--dark .v-card {
  background-color: #1e293b !important;
  border: 1px solid #334155;
}
```

### **Mobile Responsive**
```css
/* Mobile adjustments */
@media (max-width: 600px) {
  .v-card {
    margin: 16px;
    max-width: none;
  }
  
  .v-btn-toggle .v-btn {
    flex: 1;
  }
}
```

### **Accessibility Improvements**
```css
/* Better focus indicators */
.v-btn:focus-visible {
  outline: 2px solid #2b77e6;
  outline-offset: 2px;
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .v-btn {
    border: 2px solid currentColor;
  }
}
```

### **Animation Customizations**
```css
/* Custom animations */
.animate__animated {
  /* Base animation class */
}

.animate__fadeIn {
  animation-duration: 0.6s;
}

.animate__bounceIn {
  animation-duration: 0.8s;
}

.animate__pulse {
  animation-duration: 2s;
  animation-iteration-count: infinite;
}
```

---

## 🔍 **Vuetify Theme Variables**

GopherDrop uses Vuetify's theming system. You can override theme variables:

```css
/* Override Vuetify theme colors */
:root {
  --v-theme-primary: #2b77e6;
  --v-theme-secondary: #64748b;
  --v-theme-accent: #f59e0b;
  --v-theme-error: #ef4444;
  --v-theme-success: #10b981;
}

/* Surface colors */
--v-theme-surface: #ffffff;
--v-theme-on-surface: #0f172a;

/* Text colors */
--v-theme-on-primary: #ffffff;
--v-theme-on-secondary: #ffffff;
```

---

## 🧪 **Testing Your CSS**

### **Live Testing**
1. Apply CSS via `CUSTOM_CSS` environment variable
2. Restart container: `docker-compose restart app`
3. Check changes in browser (Ctrl+F5 to clear cache)

### **Debugging**
```css
/* Add this temporarily to debug */
* {
  border: 1px solid red !important;
}
```

### **Browser DevTools**
- Use browser inspector to identify selectors
- Test CSS changes in real-time
- Check computed styles for specificity issues

---

## ⚠️ **Important Notes**

### **CSS Specificity**
- Use `!important` for Vuetify overrides
- Vuetify uses high specificity, so `!important` is often required

### **Theme Compatibility**
- Changes apply to both light and dark themes
- Use `.v-theme--dark` for theme-specific overrides

### **Performance**
- Keep CSS minimal for best performance
- Avoid complex selectors
- Test on mobile devices

### **Browser Support**
- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox support required
- ES6+ JavaScript features used

---

## 📚 **Advanced Customization**

### **Custom Components**
If you need more advanced customization, you can modify the Vue components directly in `ui/src/`.

### **Vuetify Configuration**
The app uses Vuetify with custom theme configuration. See `ui/vite.config.js` for build configuration.

### **SCSS Variables**
For advanced theming, you can modify Vuetify's SCSS variables, but this requires rebuilding the frontend.

---

## 💡 **Tips & Tricks**

1. **Use browser dev tools** to inspect elements and test CSS
2. **Start with small changes** and test incrementally
3. **Use CSS variables** for consistent theming
4. **Test on multiple devices** and screen sizes
5. **Consider accessibility** when choosing colors and contrasts

---

**Last updated**: 2025-11-02
**Version**: GopherDrop Enhanced v2.0