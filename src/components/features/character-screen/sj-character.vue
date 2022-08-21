<template>
  <div class="flex flex-row justify-center">
    <div>
    <igt-exp-level class="m-1" title="Each level increases raid rewards" :exp-level="level"></igt-exp-level>
    <igt-inventory></igt-inventory>
  </div>
  </div>
</template>

<script>

import {App} from "@/App.ts"
import {Character} from "@/ig-template/features/character-screen/Character";
import IgtExpLevel from "@/components/tools/exp-level/igt-exp-level";
import IgtInventory from "@/components/features/inventory/igt-inventory";

export default {
  name: "sj-character",
  components: {IgtExpLevel,IgtInventory},
  data() {
    return {
      generator: App.game.features.actionGenerator,
    }
  },
  computed: {
    level() {
      return this.generator.playerLevel;
    }
    

  }

}
</script>

<style scoped>

</style>
