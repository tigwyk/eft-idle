<template>
  <div :class="{'dark': darkMode}">
    <igt-notifications></igt-notifications>
    <div class="flex flex-col h-screen">
      <sj-header></sj-header>
      <igt-tabs>
      <igt-tab name="Raids" :selected="true">
      <sj-action-generator class="flex-grow"></sj-action-generator>
      </igt-tab>
      <igt-tab name="Character">
        <sj-character></sj-character>
      </igt-tab>
      </igt-tabs>
      <sj-footer></sj-footer>
    </div>

  </div>

</template>

<script>
import {App} from "@/App.ts"
import IgtNotifications from "@/components/util/igt-notifications";
import IgtTab from "@/components/util/igt-tab";
import IgtTabs from "@/components/util/igt-tabs";
import SjActionGenerator from "@/components/features/action-generator/sj-action-generator";
import SjCharacter from "@/components/features/character-screen/sj-character";
import SjHeader from "@/components/sj-header";
import SjFooter from "@/components/sj-footer";

export default {
  components: {
    SjFooter,
    SjHeader,
    SjActionGenerator,
    IgtNotifications,
    IgtTabs,
    IgtTab,
    SjCharacter
  },
  data() {
    return {
      game: App.game
    }
  },
  computed: {
    showDevPanel() {
      return !App.inProduction;
    },
    darkMode() {
      return App.game.features.settings.darkMode.value;
    }
  },
}
</script>

<style>
</style>
