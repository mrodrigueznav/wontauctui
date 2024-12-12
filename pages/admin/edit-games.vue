<template>
  <div class="container mx-auto px-4 py-8">
    <AdminBackButton />
    <h1 class="text-3xl font-bold mb-8">Editar Juegos</h1>

    <div class="space-y-6">
      <!-- Game List -->
      <div v-for="game in items" :key="game.id" class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h2 class="text-2xl font-bold mb-2">{{ game.name }}</h2>
              <BGGRating :rating="game.bggRating || 0" />
            </div>
            <div class="flex space-x-2">
              <button @click="editGame(game)"
                class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                Editar
              </button>
              <button @click="confirmDelete(game)"
                class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition-colors">
                Eliminar
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div>
              <span class="text-gray-500 dark:text-gray-400">Estado:</span>
              <span class="ml-1">{{ t(game.condition) }}</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">Precio Original:</span>
              <span class="ml-1">${{ game.msrp }}</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">Precio Inicial:</span>
              <span class="ml-1">${{ game.startingPrice }}</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">Oferta Actual:</span>
              <span class="ml-1">${{ game.currentPrice }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <ClientOnly>
      <Modal :show="showEditModal" @close="showEditModal = false">
        <template #title>Editar {{ selectedGame?.name }}</template>
        <template #content>
          <GameEditForm
            v-if="selectedGame"
            :game="selectedGame"
            @saved="onGameSaved"
            @cancel="showEditModal = false"
          />
        </template>
      </Modal>
    </ClientOnly>

    <!-- Delete Confirmation Modal -->
    <ClientOnly>
      <Modal :show="showDeleteModal" @close="showDeleteModal = false">
        <template #title>Confirmar Eliminación</template>
        <template #content>
          <p>Para confirmar la eliminación, escribe "eliminar" en el campo de abajo.</p>
          <input v-model="deleteConfirmation" type="text"
            class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 mt-4" />
          <div class="flex justify-end space-x-4 mt-6">
            <button type="button" @click="showDeleteModal = false"
              class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              Cancelar
            </button>
            <button type="button" @click="deleteGame(selectedGameId)" :disabled="deleteConfirmation !== 'eliminar'"
              class="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition-colors">
              Eliminar
            </button>
          </div>
        </template>
      </Modal>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import GameEditForm from '~/components/admin/GameEditForm.vue'
import { ref } from 'vue'
import { useApi, type ApiItem } from '~/composables/useApi'

const { t } = useLocale()
const { getItems, error, isLoading } = useApi()

const showEditModal = ref(false)
const showDeleteModal = ref(false)
const selectedGame = ref<ApiItem | null>(null)
const selectedGameId = ref<number | null>(null)
const deleteConfirmation = ref('')
const items = ref<ApiItem[]>([])

const editGame = (game: ApiItem) => {
  selectedGame.value = game
  showEditModal.value = true
}

const confirmDelete = (game: ApiItem) => {
  selectedGameId.value = game.id
  deleteConfirmation.value = ''
  showDeleteModal.value = true
}

const deleteGame = async (id: number | null) => {
  if (id === null) return
  try {
    // await api.deleteItem(id)
    items.value = items.value.filter(item => item.id !== id)
    showDeleteModal.value = false
  } catch (e) {
    console.error('Failed to delete item:', e)
  }
}

const onGameSaved = async () => {
  showEditModal.value = false
  // Refresh the items list
  try {
    items.value = await getItems()
  } catch (e) {
    console.error('Failed to refresh items:', e)
  }
}

onMounted(async () => {
  try {
    items.value = await getItems()
  } catch (e) {
    console.error('Failed to fetch items:', e)
  }
})
</script>