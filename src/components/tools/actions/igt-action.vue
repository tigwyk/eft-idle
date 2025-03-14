<template>
  <div
      class="w-44 h-28 border-4 shadow-lg hover:opacity-80 flex flex-col justify-center cursor-pointer"
      :class="color"
      @click="action.toggle()">
    <div class="flex flex-col w-full relative">
      <div class="absolute right-0 -top-2">
        <span class="fa px-3 py-3" :class="lockImage" @click.stop="lock"></span>
      </div>
      <div class="p-4 flex flex-col w-full space-y-1">
        <p class="text-center text-white">{{ action.description }}</p>
        <span class="text-center text-white"> <span class="fa fa-clock"/> {{ action.duration | numberFormat }}</span>
        <igt-progress-bar :percentage="progressPercentage" fg-class="bg-gray-600"
                          bg-class="bg-gray-300"></igt-progress-bar>
      </div>
    </div>
  </div>
</template>

<script>


import IgtProgressBar from "@/components/util/igt-progress-bar";
import {RaidAction} from "@/ig-template/features/action-generator/actions/RaidAction";
import {GainExpAction} from "@/ig-template/features/action-generator/actions/GainExpAction";
import {GainCurrencyAction} from "@/ig-template/features/action-generator/actions/GainCurrencyAction";
import {CurrencyType} from "@/ig-template/features/wallet/CurrencyType";

export default {
  name: "igt-action",
  components: {IgtProgressBar},
  props: {
    index: {
      type: Number,
      required: true,
    },
    action: {
      type: RaidAction,
      required: true,
    },
    highlightNegatives: {
      type: Boolean,
      required: true,
    }
  },
  methods: {
    lock() {
      this.$emit("lock", this.index, !this.action.isLocked);
    }
  },
  computed: {
    lockImage() {
      return this.action.isLocked ? 'fa-lock text-black' : 'fa-unlock';
    },
    color() {
      if (this.highlightNegatives && this.isNegative) {
        return 'bg-yellow-500 border-yellow-700';
      }
      if (this.action instanceof GainExpAction) {
        return 'bg-purple-400 border-purple-500';
      }
      if (this.action instanceof GainCurrencyAction) {
        switch (this.action.currency.type) {
          case CurrencyType.Rouble:
            return 'bg-blue-500 border-blue-700';
          case CurrencyType.Dollar:
            return 'bg-green-500 border-green-700';
          case CurrencyType.Euro:
            return 'bg-red-600 border-red-700';
          case CurrencyType.Diamond:
            return 'bg-gray-400 border-gray-500';
        }
      }
      return 'bg-pink-500 border-pink-700';

    },
    isNegative() {
      return this.action.isNegative;
    },
    progress() {
      return this.action.getProgress();
    },
    progressPercentage() {
      return this.progress.getPercentage();
    }
  },

}
</script>

<style scoped>

</style>
