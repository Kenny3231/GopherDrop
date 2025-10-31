<template>
  <div>
    <div v-if="textContent" class="text-display mb-4">
      <v-card variant="outlined" class="pa-4">
        <v-card-title class="text-h6 mb-3">
          <v-icon left>mdi-text</v-icon>
          {{ getTranslation('secretText') }}
        </v-card-title>
        <v-card-text class="text-body-1">
          <div class="secret-text-container">
            <pre class="secret-text" @click="selectAllText">{{ textContent }}</pre>
            <div class="copy-hint">{{ getTranslation('clickToSelect') }}</div>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <div v-if="file">
      <v-btn color="primary" @click="download" block x-large height="50" rounded>
        <v-icon left>mdi-download</v-icon> {{ getTranslation('downloadFile') }}
      </v-btn>
    </div>

    <v-btn v-if="textContent" color="primary" @click="copy" block x-large height="50" rounded class="mt-4">
      <v-icon left>mdi-content-copy</v-icon> {{ getTranslation('copySecret') }}
    </v-btn>

    <v-snackbar v-model="snackbar" timeout="2000">
      {{ getTranslation('textCopied') }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { downloadFile } from '../utils/fileDownloader.js';

const props = defineProps({
  textContent: String,
  file: Blob,
  filename: String
});

const snackbar = ref(false);

const currentLanguage = computed(() => {
  return localStorage.getItem('language') || 'fr';
});

const translations = {
  fr: {
    secretText: 'Texte du secret',
    downloadFile: 'Télécharger le fichier',
    copySecret: 'Copier le secret',
    textCopied: 'Texte copié dans le presse-papiers !',
    clickToSelect: 'Cliquez pour sélectionner tout le texte'
  },
  en: {
    secretText: 'Secret Text',
    downloadFile: 'Download File',
    copySecret: 'Copy Secret',
    textCopied: 'Text copied to clipboard!',
    clickToSelect: 'Click to select all text'
  },
  es: {
    secretText: 'Texto del secreto',
    downloadFile: 'Descargar archivo',
    copySecret: 'Copiar secreto',
    textCopied: '¡Texto copiado al portapapeles!',
    clickToSelect: 'Haz clic para seleccionar todo el texto'
  }
};

function getTranslation(key) {
  return translations[currentLanguage.value] && translations[currentLanguage.value][key] || translations.fr[key];
}

function download() {
  if (props.file) {
    downloadFile(props.file, props.filename);
  }
}

function copy() {
  if (props.textContent) {
    navigator.clipboard.writeText(props.textContent);
    snackbar.value = true;
  }
}

function selectAllText(event) {
  const range = document.createRange();
  range.selectNodeContents(event.target);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}
</script>

<style scoped>
.secret-text {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Courier New', monospace;
  background-color: rgba(var(--v-theme-surface-variant), 0.1);
  padding: 12px;
  border-radius: 8px;
  border: 1px solid rgba(var(--v-theme-outline), 0.2);
  margin: 0;
  cursor: text;
  user-select: text;
  transition: background-color 0.2s ease;
}

.secret-text:hover {
  background-color: rgba(var(--v-theme-surface-variant), 0.15);
}

.secret-text-container {
  position: relative;
}

.copy-hint {
  font-size: 0.75rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
  margin-top: 4px;
  text-align: center;
}

.text-display {
  max-width: 100%;
}
</style>