<template>
  <v-text-field
    :label="getTranslation('passwordOptional')"
    :type="showPassword ? 'text' : 'password'"
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    variant="outlined"
    prepend-inner-icon="mdi-lock"
  >
    <template v-slot:append-inner>
      <v-tooltip :text="getTranslation('toggleVisibility')">
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props" @click="showPassword = !showPassword" size="small">
            <v-icon>{{ showPassword ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
      <v-tooltip :text="getTranslation('generatePassword')">
        <template v-slot:activator="{ props }">
          <v-btn icon color="primary" v-bind="props" @click="generateNewPassword" size="small" style="margin-left: 4px">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
    </template>
  </v-text-field>
</template>

<script setup>
import { ref, computed } from 'vue';
import { generatePassword } from '../utils/passwordGenerator.js';

const props = defineProps({
  modelValue: String
});
const emit = defineEmits(['update:modelValue']);

const showPassword = ref(false);

const currentLanguage = computed(() => {
  return localStorage.getItem('language') || 'fr';
});

const translations = {
  fr: {
    passwordOptional: 'Mot de passe (optionnel)',
    toggleVisibility: 'Basculer la visibilité du mot de passe',
    generatePassword: 'Générer un mot de passe aléatoire'
  },
  en: {
    passwordOptional: 'Password (optional)',
    toggleVisibility: 'Toggle password visibility',
    generatePassword: 'Generate random password'
  },
  es: {
    passwordOptional: 'Contraseña (opcional)',
    toggleVisibility: 'Alternar visibilidad de contraseña',
    generatePassword: 'Generar contraseña aleatoria'
  }
};

const getTranslation = (key) => {
  return translations[currentLanguage.value]?.[key] || translations.fr[key];
};

function generateNewPassword() {
  emit('update:modelValue', generatePassword());
}
</script>