<template>
  <v-container class="d-flex justify-center align-center fill-height">
    <v-card class="pa-4 pa-md-8 animate__animated animate__fadeIn" max-width="800" elevation="6" rounded="lg">
      <v-card-title class="text-h5 text-md-h4 font-weight-bold text-center mb-4">{{ getTranslation('secretText') }} 🔒</v-card-title>
      <v-card-text>
        <v-alert v-if="errorMessage" type="error" class="mb-4" variant="tonal">
          {{ errorMessage }}
        </v-alert>

        <v-alert v-if="notFound" type="error" class="mb-4" variant="tonal">
          {{ getTranslation('secretNotFound') }}
        </v-alert>

        <v-form @submit.prevent="loadSecret" v-if="!secretLoaded">
          <v-text-field
            v-if="requiresPassword"
            :label="getTranslation('password')"
            v-model="password"
            type="password"
            prepend-inner-icon="mdi-lock"
            required
            variant="outlined"
            class="animate__animated animate__fadeIn"
          ></v-text-field>

          <v-btn type="submit" color="primary" class="animate__animated animate__fadeIn mt-4" block x-large height="50" rounded>{{ getTranslation('loadSecret') }}</v-btn>
        </v-form>

        <SecretDisplay
          v-if="secretLoaded"
          :text-content="secretContent"
          :file="null"
          :filename="''"
        />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { getTextSend, checkPasswordProtection } from '../services/api.js';
import SecretDisplay from '../components/SecretDisplay.vue';

const route = useRoute();
const hash = route.params.hash;

const password = ref('');
const errorMessage = ref('');
const notFound = ref(false);
const requiresPassword = ref(false);
const secretContent = ref('');
const secretLoaded = ref(false);

const currentLanguage = computed(() => {
  return localStorage.getItem('language') || 'fr';
});

const translations = {
  fr: {
    secretText: 'Texte du secret',
    password: 'Mot de passe',
    secretNotFound: 'Secret introuvable ou expiré.',
    loadSecret: 'Charger le secret',
    loadSecretError: 'Échec du chargement du secret. Mot de passe incorrect ou secret expiré.'
  },
  en: {
    secretText: 'Secret Text',
    password: 'Password',
    secretNotFound: 'Secret not found or has expired.',
    loadSecret: 'Load Secret',
    loadSecretError: 'Failed to load secret. Incorrect password or secret has expired.'
  },
  es: {
    secretText: 'Texto del secreto',
    password: 'Contraseña',
    secretNotFound: 'Secreto no encontrado o ha expirado.',
    loadSecret: 'Cargar secreto',
    loadSecretError: 'Error al cargar secreto. Contraseña incorrecta o secreto expirado.'
  }
};

const getTranslation = (key) => {
  return translations[currentLanguage.value]?.[key] || translations.fr[key];
};

async function loadSecret() {
  errorMessage.value = '';
  try {
    const result = await getTextSend(hash, password.value);
    if (result.notFound) {
      notFound.value = true;
      return;
    }

    if (result.text) {
      secretContent.value = result.text;
      secretLoaded.value = true;
    } else {
      // If it's not text, redirect to file view
      window.location.href = `/view/${hash}${password.value ? `?password=${encodeURIComponent(password.value)}` : ''}`;
      return;
    }
  } catch (err) {
    errorMessage.value = err.message || getTranslation('loadSecretError');
  }
}

onMounted(async () => {
  try {
    const result = await checkPasswordProtection(hash);
    if (result.notFound) {
      notFound.value = true;
    } else {
      requiresPassword.value = result.requiresPassword;
      if (!requiresPassword.value) {
        loadSecret();
      }
    }
  } catch (err) {
    notFound.value = true;
  }
});
</script>

<style scoped>
.v-container {
  min-height: 85vh;
}

.v-card {
  width: 100%;
}
</style>