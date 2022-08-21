<template>
  <div class="w-full h-20 bg-gray-500 shadow-xl flex flex-row items-center justify-center text-white">
    <div class="p-4 flex flex-row items-center" title="Rouble">
      <span class="m-2 text-lg">{{ rouble }}</span>
      <img class="w-8 h-8" :src="require('@/assets/images/currencies/rouble.svg')">
    </div>
    <div class="p-4 flex flex-row items-center" title="Dollar">
      <span class="m-2 text-lg">{{ dollar }}</span>
      <img class="w-8 h-8" :src="require('@/assets/images/currencies/dollar.svg')">
    </div>

    <div class="p-4 flex flex-row items-center" title="Euro">
      <span class="m-2 text-lg">{{ euro }}</span>
      <img class="w-8 h-8" :src="require('@/assets/images/currencies/euro.svg')">
    </div>
    <div class="p-4 flex flex-row items-center" title="Diamond">
      <span class="m-2 text-lg">{{ diamond }}</span>
      <img class="w-8 h-8" :src="require('@/assets/images/currencies/diamond.svg')">
    </div>
  </div>
</template>

<script>
import {App} from "@/App.ts"

export default {
  name: "sj-header",
  data() {
    return {
      wallet: App.game.features.wallet,
    }
  },
  computed: {
    rouble() {
      return this.wallet.rouble;
    },
    dollar() {
      return this.wallet.dollar;
    },
    euro() {
      return this.wallet.euro;
    },
    diamond() {
      return this.wallet.diamond;
    }
  },

}
</script>

<style scoped>

</style>
