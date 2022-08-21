<template>
  <div class="flex flex-row justify-center">
    <span class="mr-2">{{ currency.amount }}</span>
    <span v-if="currency.type === CurrencyType.Rouble">
            <img class="w-8 h-8" :src="require('@/assets/images/currencies/rouble.svg')">
    </span>
    <span v-if="currency.type === CurrencyType.Dollar">
            <img class="w-8 h-8" :src="require('@/assets/images/currencies/dollar.svg')">
    </span>
    <span v-if="currency.type === CurrencyType.Euro">
            <img class="w-8 h-8" :src="require('@/assets/images/currencies/euro.svg')">
    </span>
    <span v-if="currency.type === CurrencyType.Diamond">
            <img class="w-8 h-8" :src="require('@/assets/images/currencies/diamond.svg')">
    </span>
  </div>
</template>

<script>

import {Currency} from "@/ig-template/features/wallet/Currency";
import {CurrencyType} from "@/ig-template/features/wallet/CurrencyType";

export default {
  name: "sj-currency",
  props: {
    currency: {
      type: Currency,
      required: true,
    },
  },
  data() {
    return {
      CurrencyType: CurrencyType,
    }
  },

}
</script>

<style scoped>

</style>
