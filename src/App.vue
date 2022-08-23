<template>
  <div :class="{'dark': darkMode}">
    <igt-notifications></igt-notifications>
    <div class="flex flex-col h-screen">
    <igt-sidebar title="EFT Idle">
    <igt-sidebar-category name="Gameplay"></igt-sidebar-category>
      <igt-tab name="Raids" :selected="true">
      <sj-action-generator class="flex-grow"></sj-action-generator>
      </igt-tab>
      <igt-tab name="Character">
        <sj-character></sj-character>
      </igt-tab>
      <igt-sidebar-category name="Other"></igt-sidebar-category>
      <igt-tab name="Settings">
        <igt-settings :settings-feature="game.features.settings"></igt-settings>
      </igt-tab>
      <igt-tab name="Developer Panel" v-if="showDevPanel">
        <igt-developer-panel :developer-panel="game.getDeveloperPanel()"></igt-developer-panel>
      </igt-tab>

      <igt-sidebar-category name="Socials"></igt-sidebar-category>
      <igt-sidebar-external-link name="Discord" link="https://discord.gg/WUYDqct2Ef"
                                 image="socials/discord.png"></igt-sidebar-external-link>
      <igt-sidebar-external-link name="Documentation"
                                 link="https://123ishatest.github.io/igt-docs"
                                 image="socials/docusaurus.svg"></igt-sidebar-external-link>
      <igt-sidebar-external-link name="GitHub" link="https://github.com/tigwyk/eft-idle"
                                 image="socials/github.png"></igt-sidebar-external-link>
      </igt-sidebar>
    </div>

</div>

</template>

<script>
import {App} from "@/App.ts"
import IgtNotifications from "@/components/util/igt-notifications";
import IgtSidebar from "@/components/util/sidebar/igt-sidebar-layout";
import IgtSidebarCategory from "@/components/util/sidebar/igt-sidebar-category";
import IgtSidebarExternalLink from "@/components/util/sidebar/igt-sidebar-external-link";
import IgtDeveloperPanel from "@/components/developer-panel/igt-developer-panel";
import IgtTab from "@/components/util/igt-tab";
import SjActionGenerator from "@/components/features/action-generator/sj-action-generator";
import SjCharacter from "@/components/features/character-screen/sj-character";
import IgtSettings from "@/components/features/settings/igt-settings";

export default {
  components: {
    SjActionGenerator,
    IgtNotifications,
    IgtDeveloperPanel,
    IgtTab,
    IgtSidebarExternalLink,
    IgtSidebarCategory,
    SjCharacter,
    IgtSettings,
    IgtSidebar
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
