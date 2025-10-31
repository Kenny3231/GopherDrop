<template>
  <v-app :style="{ backgroundImage: config.backgroundURL ? `url(${config.backgroundURL})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }">
    <v-main class="d-flex flex-column">
      <v-container fluid class="pa-0 flex-grow-1">
        <v-app-bar color="transparent" flat class="px-4">
          <v-toolbar-title>
            <router-link to="/" class="logo-link animate__animated animate__pulse" @click="requestFormReset">
               <img :src="config.logoURL && config.logoURL.trim() !== '' ? config.logoURL : logoImage" alt="Logo" height="40" />
            </router-link>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn to="/" text class="animate__animated animate__fadeIn" @click="requestFormReset" rounded>
            <v-icon left>mdi-plus</v-icon> {{ getTranslation('createNew') }}
          </v-btn>
          <v-tooltip :text="getTranslation(isDarkMode ? 'switchToLight' : 'switchToDark')">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" icon @click="toggleTheme" class="ml-2">
                <v-icon>{{ isDarkMode ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" icon class="ml-2">
                <span class="text-h6">{{ availableLanguages.find(lang => lang.code === currentLanguage)?.flag }}</span>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="lang in availableLanguages"
                :key="lang.code"
                @click="setLanguage(lang.code)"
              >
                <v-list-item-title>
                  <span class="mr-2">{{ lang.flag }}</span>
                  {{ lang.name }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-app-bar>

        <v-container class="mt-4">
          <router-view />
        </v-container>
      </v-container>

      <v-footer color="transparent" class="justify-center mt-8 pa-4">
        <span>
          © {{ new Date().getFullYear() }} GopherDrop |
          <a
            href="https://github.com/kek-Sec/gopherdrop"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ getTranslation('githubRepo') }}
          </a>
        </span>
      </v-footer>
    </v-main>
  </v-app>
</template>

<script setup>
/**
 * The root component of the application.
 * Provides a header, navigation, and footer.
 */
import { ref, onMounted, computed } from 'vue';
import { formStore } from './stores/formStore.js';
import { useTheme } from 'vuetify';
import { getConfig } from './services/api.js';
import logoImage from './assets/Images/logo.png';

const themeInstance = useTheme();
const isDarkMode = computed(() => themeInstance.global.current.value.dark);
const config = ref({});
const currentLanguage = ref('fr');
const availableLanguages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' }
];

const translations = {
  fr: {
    createNew: 'Créer nouveau',
    switchToLight: 'Passer en mode clair',
    switchToDark: 'Passer en mode sombre',
    githubRepo: 'Dépôt GitHub'
  },
  en: {
    createNew: 'Create New',
    switchToLight: 'Switch to Light Mode',
    switchToDark: 'Switch to Dark Mode',
    githubRepo: 'GitHub Repository'
  },
  es: {
    createNew: 'Crear nuevo',
    switchToLight: 'Cambiar a modo claro',
    switchToDark: 'Cambiar a modo oscuro',
    githubRepo: 'Repositorio GitHub'
  }
};

const getTranslation = (key) => {
  return translations[currentLanguage.value]?.[key] || translations.fr[key];
};

// On component mount, check localStorage for a saved theme and load config
onMounted(async () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    themeInstance.global.name.value = savedTheme;
  }

  // Detect browser language
  const browserLang = navigator.language.split('-')[0];
  const savedLang = localStorage.getItem('language');
  if (savedLang && availableLanguages.some(lang => lang.code === savedLang)) {
    currentLanguage.value = savedLang;
  } else if (availableLanguages.some(lang => lang.code === browserLang)) {
    currentLanguage.value = browserLang;
  } else {
    currentLanguage.value = 'fr'; // Default to French
  }

  try {
    config.value = await getConfig();
    // Apply custom CSS if provided
    if (config.value.customCSS) {
      const style = document.createElement('style');
      style.textContent = config.value.customCSS;
      document.head.appendChild(style);
    }
    // Update favicon if provided
    if (config.value.faviconURL) {
      const favicon = document.querySelector('link[rel="icon"]');
      if (favicon) {
        favicon.href = config.value.faviconURL;
      }
    }
  } catch (error) {
    console.error('Failed to load configuration:', error);
  }
});

function toggleTheme() {
  const newTheme = isDarkMode.value ? 'customLightTheme' : 'customDarkTheme';
  themeInstance.global.name.value = newTheme;
  // Save the new theme preference to localStorage
  localStorage.setItem('theme', newTheme);
}

function setLanguage(langCode) {
  currentLanguage.value = langCode;
  localStorage.setItem('language', langCode);
  // Force page reload to apply new language
  window.location.reload();
}

/**
 * Triggers the form reset via the store.
 * This will be picked up by a watcher in Create.vue.
 */
function requestFormReset() {
  formStore.triggerReset();
}
</script>

<style scoped>
.v-footer a {
  font-weight: 500;
}

.logo-link {
  display: inline-block;
  text-decoration: none;
  vertical-align: middle;
}

.v-main {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>