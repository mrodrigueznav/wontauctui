<template>
  <div class="container mx-auto px-4 py-8">
    <AdminBackButton />
    <h1 class="text-3xl font-bold mb-8">Gestión de Subastas en Vivo</h1>
    
    <!-- Current Auction Section -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
      <h2 class="text-2xl font-semibold mb-4">Subasta Actual</h2>
      
      <div v-if="store.currentAuctionItem" class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-medium">{{ store.currentAuctionItem.name }}</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Oferta actual: ${{ store.currentAuctionItem.currentPrice }}
            </p>
          </div>
          <button
            @click="endCurrentAuction"
            class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Finalizar Subasta
          </button>
        </div>
        
        <!-- Bid Management -->
        <div class="space-y-4">
          <div class="flex gap-4">
            <input
              v-model="newBid.amount"
              type="number"
              placeholder="Monto de la oferta"
              class="flex-1 px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
            />
            <input
              v-model="newBid.bidder"
              type="text"
              placeholder="Nombre del ofertante"
              class="flex-1 px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
            />
            <button
              @click="addBid"
              class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Agregar Oferta
            </button>
          </div>
          
          <!-- Bid History -->
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 class="font-medium mb-3">Historial de Ofertas</h4>
            <div class="space-y-2">
              <div
                v-for="(bid, index) in currentBids"
                :key="index"
                class="flex justify-between items-center"
              >
                <span>{{ bid.bidder }}</span>
                <div class="flex items-center space-x-2">
                  <span class="font-medium">${{ bid.amount }}</span>
                  <button
                    @click="removeBid(index)"
                    class="text-red-500 hover:text-red-600"
                  >
                    <TrashIcon class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else>
        <p class="text-gray-500 dark:text-gray-400 mb-4">No hay subasta activa</p>
        <!-- Start New Auction -->
        <div class="space-y-4">
          <select
            v-model="selectedGameId"
            class="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">Seleccionar juego...</option>
            <option
              v-for="game in availableGames"
              :key="game.id"
              :value="game.id"
            >
              {{ game.name }}
            </option>
          </select>
          
          <button
            @click="startAuction"
            :disabled="!selectedGameId"
            class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            Iniciar Subasta
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuctionStore } from '~/stores/auction'
import { TrashIcon } from '@heroicons/vue/24/outline'

const store = useAuctionStore()
const selectedGameId = ref('')
const currentBids = ref<{ bidder: string; amount: number }[]>([])
const newBid = ref({ bidder: '', amount: 0 })

const availableGames = computed(() => {
  return store.games.filter(game => !game.isSold)
})

const startAuction = () => {
  const game = store.games.find(g => g.id === parseInt(selectedGameId.value))
  if (game) {
    store.setCurrentAuctionItem(game)
    currentBids.value = []
    selectedGameId.value = ''
  }
}

const endCurrentAuction = () => {
  if (store.currentAuctionItem && currentBids.value.length > 0) {
    const highestBid = currentBids.value[0]
    store.updateBid(store.currentAuctionItem.id, highestBid.amount)
    store.markAsSold(store.currentAuctionItem.id)
  }
  store.setCurrentAuctionItem(null)
  currentBids.value = []
}

const addBid = () => {
  if (newBid.value.bidder && newBid.value.amount > 0) {
    currentBids.value.unshift(newBid.value)
    currentBids.value.sort((a, b) => b.amount - a.amount)
    if (store.currentAuctionItem) {
      store.updateBid(store.currentAuctionItem.id, newBid.value.amount)
    }
    newBid.value = { bidder: '', amount: 0 }
  }
}

const removeBid = (index: number) => {
  currentBids.value.splice(index, 1)
  if (currentBids.value.length > 0 && store.currentAuctionItem) {
    store.updateBid(store.currentAuctionItem.id, currentBids.value[0].amount)
  }
}
</script>