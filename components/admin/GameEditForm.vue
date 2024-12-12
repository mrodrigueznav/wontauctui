<template>
    <form @submit.prevent="saveChanges" class="space-y-6">
      <!-- Image Uploader -->
      <ImageUploader
        v-model:existingImages="formData.existingImages"
        v-model:newImages="formData.images"
        :maxImages="10"
      />
  
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Basic Info -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Nombre</label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1">Editorial</label>
            <input
              v-model="formData.publisher"
              type="text"
              required
              class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
  
          <div>
            <label class="block text-sm font-medium mb-1">Estado</label>
            <select
              v-model="formData.condition"
              required
              class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="New">Nuevo</option>
              <option value="Like New">Como Nuevo</option>
              <option value="Excellent">Excelente</option>
              <option value="Very Good">Muy Bueno</option>
            </select>
          </div>
        </div>
  
        <!-- Pricing -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Precio Original ($)</label>
            <input
              v-model.number="formData.msrp"
              type="number"
              required
              min="0"
              class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1">Precio Inicial ($)</label>
            <input
              v-model.number="formData.startingPrice"
              type="number"
              required
              min="0"
              class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
  
          <div>
            <label class="block text-sm font-medium mb-1">Precio Actual ($)</label>
            <input
              v-model.number="formData.currentPrice"
              type="number"
              required
              min="0"
              class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>
      </div>
  
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Descripción</label>
          <textarea
            v-model="formData.description"
            rows="3"
            class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
          ></textarea>
        </div>
      </div>
  
      <!-- Error Message -->
      <div v-if="error" class="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
        <p class="text-red-600 dark:text-red-400">{{ error }}</p>
      </div>
  
      <div class="flex justify-end space-x-4">
        <button
          type="button"
          @click="$emit('cancel')"
          class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          :disabled="isLoading"
          class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          {{ isLoading ? 'Guardando...' : 'Guardar Cambios' }}
        </button>
      </div>
    </form>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive } from 'vue'
  import { useApi } from '~/composables/useApi'
  import type { BoardGame } from '~/types/boardgame'
  
  const props = defineProps<{
    game: BoardGame
  }>()
  
  const emit = defineEmits<{
    (e: 'saved'): void
    (e: 'cancel'): void
  }>()
  
  const api = useApi()
  const { error, isLoading } = api
  
  const formData = reactive({
    ...props.game,
    existingImages: [...(props.game.images || [])],
    images: [] as File[]
  })
  
  const saveChanges = async () => {
    try {
      await api.updateItem(props.game.id, {
        description: formData.description,
        startingPrice: formData.startingPrice,
        msrp: formData.msrp,
        condition: formData.condition,
        bggRating: formData.bggRating,
        playerCount: formData.playerCount,
        publisher: formData.publisher,
        releaseYear: formData.releaseYear,
        existingImages: formData.existingImages,
        images: formData.images
      })
      emit('saved')
    } catch (err) {
      console.error('Error saving changes:', err)
    }
  }
  </script>