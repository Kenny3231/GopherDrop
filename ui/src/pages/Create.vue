<template>
  <v-container class="d-flex justify-center align-center fill-height">
    <v-card class="pa-4 pa-md-8 animate__animated animate__fadeIn" max-width="600" elevation="6" rounded="lg">
      <v-card-title class="text-h5 text-md-h4 font-weight-bold text-center mb-4">{{ getTranslation('createNewSecret') }} 🔑</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="handleSubmit">
          <v-btn-toggle
            v-model="type"
            mandatory
            class="mb-4 d-flex justify-center"
            color="primary"
            rounded
            group
          >
            <v-btn value="text" class="px-6" rounded>
              <v-icon left>mdi-text</v-icon> {{ getTranslation('text') }}
            </v-btn>
            <v-btn value="file" class="px-6" rounded>
              <v-icon left>mdi-file</v-icon> {{ getTranslation('files') }}
            </v-btn>
          </v-btn-toggle>

          <v-textarea
            v-if="type === 'text'"
            :label="getTranslation('textSecret')"
            v-model="textSecret"
            required
            variant="outlined"
            rows="4"
          ></v-textarea>

          <div v-if="type === 'file'">
            <v-file-input
              :label="getTranslation('selectFiles')"
              prepend-icon="mdi-upload"
              v-model="selectedFiles"
              multiple
              show-size
              variant="outlined"
              accept="*/*"
              :hint="getTranslation('filesHint')"
              persistent-hint
              class="mb-2"
            ></v-file-input>

            <v-chip-group v-if="selectedFiles && selectedFiles.length > 0" column>
              <v-chip
                v-for="(file, index) in selectedFiles"
                :key="index"
                closable
                @click:close="removeFile(index)"
                class="ma-1"
              >
                <v-icon left>mdi-file</v-icon>
                {{ file.name }} ({{ formatFileSize(file.size) }})
              </v-chip>
            </v-chip-group>

            <div v-if="selectedFiles && selectedFiles.length > 0" class="text-caption text-medium-emphasis mt-2">
              {{ selectedFiles.length }} {{ getTranslation('filesSelected') }} - {{ getTranslation('total') }}: {{ formatTotalSize() }}
            </div>
          </div>

          <PasswordInput v-model="password" class="mt-2" />

          <v-select
            :label="getTranslation('expiration')"
            v-model="expires"
            :items="expirationOptions"
            required
            variant="outlined"
            class="mt-2"
          ></v-select>

          <v-checkbox
            v-model="oneTime"
            :label="getTranslation('oneTimeRetrieval')"
            color="primary"
            class="mt-2"
          ></v-checkbox>

          <v-btn type="submit" color="primary" class="mt-4" block large rounded x-large height="50" :disabled="isSubmitting">
            <v-icon left v-if="isSubmitting">mdi-loading mdi-spin</v-icon>
            {{ getTranslation('createSecret') }}
          </v-btn>

          <v-alert v-if="errorMessage" type="error" class="mt-4 animate__animated animate__bounceIn" variant="tonal">
            {{ errorMessage }}
          </v-alert>
        </v-form>

        <v-alert v-if="resultHash" type="success" class="mt-6 animate__animated animate__fadeIn" variant="tonal">
          <div class="text-h6 mb-2">{{ getTranslation('secretCreated') }}</div>
          <p>{{ getTranslation('shareLink') }}</p>
          <div class="d-flex align-center mt-2 pa-2" style="background-color: rgba(var(--v-theme-on-surface), 0.05); border-radius: 8px;">
            <span class="mr-2 text-truncate">{{ getSecretUrl() }}</span>
            <v-spacer></v-spacer>
            <v-tooltip :text="getTranslation('copyLinkTooltip')">
              <template v-slot:activator="{ props }">
                <v-btn icon v-bind="props" @click="copyLink">
                  <v-icon>mdi-content-copy</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
          </div>
          <v-snackbar v-model="snackbar" timeout="2000" color="success">
            {{ getTranslation('linkCopied') }}
          </v-snackbar>
        </v-alert>

        <v-overlay v-model="loading" class="align-center justify-center">
          <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        </v-overlay>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { createSend, getConfig } from '../services/api.js';
import PasswordInput from '../components/PasswordInput.vue';
import { formStore } from '../stores/formStore.js';

const type = ref('text');
const textSecret = ref('');
const selectedFiles = ref([]);
const password = ref('');
const oneTime = ref(false);
const expires = ref('24h');
const errorMessage = ref('');
const resultHash = ref('');
const resultType = ref(''); // Store the original type for URL generation
const baseUrl = window.location.origin;
const snackbar = ref(false);
const loading = ref(false);
const isSubmitting = ref(false);

const currentLanguage = computed(() => {
  return localStorage.getItem('language') || 'fr';
});

const translations = {
  fr: {
    createNewSecret: 'Créer un nouveau secret',
    text: 'Texte',
    files: 'Fichiers',
    textSecret: 'Texte secret',
    selectFiles: 'Sélectionner des fichiers',
    filesHint: 'Sélectionnez plusieurs fichiers qui seront automatiquement compressés en ZIP',
    filesSelected: 'fichier(s) sélectionné(s)',
    total: 'Total',
    expiration: 'Expiration',
    oneTimeRetrieval: 'Récupération unique',
    createSecret: 'Créer le secret',
    secretCreated: 'Secret créé !',
    shareLink: 'Partagez ce lien pour voir le secret :',
    copyLinkTooltip: 'Copier le lien dans le presse-papiers',
    linkCopied: 'Lien copié dans le presse-papiers !',
    enterTextError: 'Veuillez saisir du texte',
    selectFileError: 'Veuillez sélectionner au moins un fichier',
    zipCreationError: 'Erreur lors de la création du fichier ZIP',
    createSecretError: 'Échec de la création du secret',
    '1hour': '1 heure',
    '3hours': '3 heures',
    '6hours': '6 heures',
    '12hours': '12 heures',
    '24hours': '24 heures',
    '3days': '3 jours',
    '1week': '1 semaine'
  },
  en: {
    createNewSecret: 'Create a New Secret',
    text: 'Text',
    files: 'Files',
    textSecret: 'Text Secret',
    selectFiles: 'Select Files',
    filesHint: 'Select multiple files that will be automatically compressed into a ZIP',
    filesSelected: 'file(s) selected',
    total: 'Total',
    expiration: 'Expiration',
    oneTimeRetrieval: 'One-Time Retrieval',
    createSecret: 'Create Secret',
    secretCreated: 'Secret Created!',
    shareLink: 'Share this link to view the secret:',
    copyLinkTooltip: 'Copy link to clipboard',
    linkCopied: 'Link copied to clipboard!',
    enterTextError: 'Please enter some text',
    selectFileError: 'Please select at least one file',
    zipCreationError: 'Error creating ZIP file',
    createSecretError: 'Failed to create secret',
    '1hour': '1 hour',
    '3hours': '3 hours',
    '6hours': '6 hours',
    '12hours': '12 hours',
    '24hours': '24 hours',
    '3days': '3 days',
    '1week': '1 week'
  },
  es: {
    createNewSecret: 'Crear un nuevo secreto',
    text: 'Texto',
    files: 'Archivos',
    textSecret: 'Secreto de texto',
    selectFiles: 'Seleccionar archivos',
    filesHint: 'Selecciona varios archivos que se comprimirán automáticamente en un ZIP',
    filesSelected: 'archivo(s) seleccionado(s)',
    total: 'Total',
    expiration: 'Expiración',
    oneTimeRetrieval: 'Recuperación única',
    createSecret: 'Crear secreto',
    secretCreated: '¡Secreto creado!',
    shareLink: 'Comparte este enlace para ver el secreto:',
    copyLinkTooltip: 'Copiar enlace al portapapeles',
    linkCopied: '¡Enlace copiado al portapapeles!',
    enterTextError: 'Por favor ingresa algo de texto',
    selectFileError: 'Por favor selecciona al menos un archivo',
    zipCreationError: 'Error al crear archivo ZIP',
    createSecretError: 'Error al crear secreto',
    '1hour': '1 hora',
    '3hours': '3 horas',
    '6hours': '6 horas',
    '12hours': '12 horas',
    '24hours': '24 horas',
    '3days': '3 días',
    '1week': '1 semana'
  }
};

const getTranslation = (key) => {
  return translations[currentLanguage.value]?.[key] || translations.fr[key];
};

const expirationOptions = ref([]);
const configExpirationValues = ref(null);

// Update expiration options when language changes
const updateExpirationOptions = () => {
  // Si on a des valeurs de la config, on les utilise
  if (configExpirationValues.value && configExpirationValues.value.length > 0) {
    expirationOptions.value = configExpirationValues.value.map(opt => ({
      title: formatExpirationTitle(opt),
      value: opt
    }));
  } else {
    // Sinon, on utilise les valeurs par défaut
    expirationOptions.value = [
    { title: getTranslation('1hour'), value: '1h' },
    { title: getTranslation('3hours'), value: '3h' },
    { title: getTranslation('6hours'), value: '6h' },
    { title: getTranslation('12hours'), value: '12h' },
    { title: getTranslation('24hours'), value: '24h' },
    { title: getTranslation('3days'), value: '72h' },
    { title: getTranslation('1week'), value: '168h' }
    ];
  }
};

// Initialize expiration options
updateExpirationOptions();

function resetForm() {
  type.value = 'text';
  textSecret.value = '';
  selectedFiles.value = [];
  password.value = '';
  oneTime.value = false;
  expires.value = '24h';
  errorMessage.value = '';
  resultHash.value = '';
  resultType.value = '';
  loading.value = false;
  isSubmitting.value = false;
}

function removeFile(index) {
  selectedFiles.value.splice(index, 1);
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatTotalSize() {
  const totalBytes = selectedFiles.value.reduce((sum, file) => sum + file.size, 0);
  return formatFileSize(totalBytes);
}

watch(() => formStore.resetCounter, () => {
  resetForm();
});

// Load configuration on mount
onMounted(async () => {
  try {
    const config = await getConfig();
    if (config.expirationOptions && config.expirationOptions.length > 0) {
      // Stocker les valeurs de la config
      configExpirationValues.value = config.expirationOptions;
      // Appliquer avec les traductions
      expirationOptions.value = config.expirationOptions.map(opt => ({
        title: formatExpirationTitle(opt),
        value: opt
      }));
    } else {
      // Pas de config, utiliser les valeurs par défaut
      updateExpirationOptions();
    }
  } catch (error) {
    console.error('Failed to load configuration:', error);
    updateExpirationOptions();
  }

  // Update expiration options when language changes
  watch(() => currentLanguage.value, () => {
    updateExpirationOptions();
  });
});

function formatExpirationTitle(value) {
  // Mapping des valeurs vers les clés de traduction
  const translationKeys = {
    '1h': '1hour',
    '3h': '3hours',
    '6h': '6hours',
    '12h': '12hours',
    '24h': '24hours',
    '72h': '3days',
    '168h': '1week'
  };
  
  // Si on a une traduction, on l'utilise
  if (translationKeys[value]) {
    return getTranslation(translationKeys[value]);
  }
  
  // Sinon, formatage générique (fallback)
  const duration = parseDuration(value);
  if (duration < 3600) {
    return `${duration / 60} Minutes`;
  } else if (duration < 86400) {
    return `${duration / 3600} Hours`;
  } else {
    return `${duration / 86400} Days`;
  }
}

function parseDuration(str) {
  const regex = /^(\d+)([smhd])$/;
  const match = str.match(regex);
  if (!match) return 0;
  const num = parseInt(match[1]);
  const unit = match[2];
  switch (unit) {
    case 's': return num;
    case 'm': return num * 60;
    case 'h': return num * 3600;
    case 'd': return num * 86400;
    default: return 0;
  }
}

async function handleSubmit() {
  errorMessage.value = '';
  resultHash.value = '';
  loading.value = true;
  isSubmitting.value = true;

  const formData = new FormData();
  formData.append('type', type.value);

  if (type.value === 'text') {
    if (!textSecret.value.trim()) {
      errorMessage.value = getTranslation('enterTextError');
      loading.value = false;
      isSubmitting.value = false;
      return;
    }
    formData.append('data', textSecret.value);
  } else if (type.value === 'file') {
    if (!selectedFiles.value || selectedFiles.value.length === 0) {
      errorMessage.value = getTranslation('selectFileError');
      loading.value = false;
      isSubmitting.value = false;
      return;
    }

    // Create ZIP file from selected files
    try {
      const zipBlob = await createZipFromFiles(selectedFiles.value);
      const zipFile = new File([zipBlob], 'files.zip', { type: 'application/zip' });
      formData.append('file', zipFile, zipFile.name);
    } catch (error) {
      errorMessage.value = getTranslation('zipCreationError');
      loading.value = false;
      isSubmitting.value = false;
      return;
    }
  }

  if (password.value.trim()) {
    formData.append('password', password.value);
  }
  if (oneTime.value) {
    formData.append('onetime', 'true');
  }
  formData.append('expires', expires.value);

  try {
    const result = await createSend(formData);
    resultHash.value = result.hash;
    resultType.value = type.value; // Store the original type for URL generation
    // Clear form inputs but keep the result hash visible
    type.value = 'text';
    textSecret.value = '';
    selectedFiles.value = [];
    password.value = '';
    oneTime.value = false;
    expires.value = '24h';
  } catch (err) {
    errorMessage.value = err.message || getTranslation('createSecretError');
  } finally {
    loading.value = false;
    isSubmitting.value = false;
  }
}

async function createZipFromFiles(files) {
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();

  for (const file of files) {
    zip.file(file.name, file);
  }

  return await zip.generateAsync({ type: 'blob' });
}

function getSecretUrl() {
  if (resultType.value === 'text') {
    return `${baseUrl}/text/${resultHash.value}`;
  } else {
    return `${baseUrl}/view/${resultHash.value}`;
  }
}

function copyLink() {
  const link = getSecretUrl();
  navigator.clipboard.writeText(link);
  snackbar.value = true;
}
</script>

<style scoped>
.v-container {
  min-height: 85vh;
}

.v-card {
  width: 100%;
}
</style>