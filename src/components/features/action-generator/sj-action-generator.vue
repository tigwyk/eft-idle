<template>
  <igt-feature class="text-white">

    <div class="flex flex-row flex-wrap">
      <sj-time-upgrade :upgrade="refreshUpgrade" :can-buy="generator.canAfford(refreshUpgrade)"
                       @click.native="generator.buyUpgrade(refreshUpgrade)"></sj-time-upgrade>
      <igt-upgrade :upgrade="maxActionUpgrade" :can-buy="generator.canAfford(maxActionUpgrade)"
                   @click.native="generator.buyUpgrade(maxActionUpgrade)"></igt-upgrade>
      <igt-upgrade :upgrade="negativeRateUpgrade" :can-buy="generator.canAfford(negativeRateUpgrade)"
                   @click.native="generator.buyUpgrade(negativeRateUpgrade)"></igt-upgrade>

      <igt-upgrade :upgrade="betterGems" :can-buy="generator.canAfford(betterGems)"
                   @click.native="generator.buyUpgrade(betterGems)"></igt-upgrade>
      <igt-upgrade :upgrade="speedBoost" :can-buy="generator.canAfford(speedBoost)"
                   @click.native="generator.buyUpgrade(speedBoost)"></igt-upgrade>

      <igt-single-level-upgrade :upgrade="highlightNegativeUpgrade"
                                :can-buy="generator.canAfford(highlightNegativeUpgrade)"
                                @click.native="generator.buyUpgrade(highlightNegativeUpgrade)"></igt-single-level-upgrade>


      <igt-upgrade :upgrade="locks" :can-buy="generator.canAfford(locks)"
                   @click.native="generator.buyUpgrade(locks)"></igt-upgrade>


      <igt-single-level-upgrade v-if="generator._wallet.diamond > 10 || completeTheGame.isBought()"
                                :upgrade="completeTheGame"
                                :can-buy="generator.canAfford(completeTheGame)"
                                @click.native="buyFinalUpgrade">
      </igt-single-level-upgrade>

    </div>

    <div class="m-2 flex flex-col">
      <div class="flex flex-row justify-between">
        <span>Running Raid...</span>
        <span>{{ formatNumber(generator.checkCounter / generator.switchTime * 100) }}%</span>
        <span class=""><span class="fa fa-clock"></span> {{ generator.switchTime }}</span>
      </div>
      <igt-progress-bar :percentage="refreshProgress" fg-class="bg-gray-500" bg-class="bg-gray-600"></igt-progress-bar>
  <!-- <igt-loot-table :table="LootTable"></igt-loot-table> -->
    </div>
    <p class="m-2"><span class="fa fa-lock"></span> Locks used {{generator.currentLock}} / {{generator.maxLock}}</p>
    <div class="flex flex-row flex-wrap">
      <igt-action :action="action"
                  :index="index"
                  @lock="lock"
                  :highlight-negatives="highlightNegatives"
                  class="m-2"
                  v-for="(action, index) in actions"
                  :key="action.description + '-' + index">
      </igt-action>
    </div>

  </igt-feature>
</template>

<script>
import {App} from "@/App.ts"
import IgtFeature from "@/components/util/igt-feature";
import IgtLootTable from "@/components/features/loot-tables/igt-loot-table";
import IgtAction from "@/components/tools/actions/igt-action";
import IgtProgressBar from "@/components/util/igt-progress-bar";
import SjTimeUpgrade from "@/components/tools/upgrades/sj-time-upgrade";
import IgtUpgrade from "@/components/tools/upgrades/igt-discrete-upgrade";
import IgtSingleLevelUpgrade from "@/components/tools/upgrades/igt-single-level-upgrade";

export default {
  name: "sj-action-generator",
  // components: {IgtSingleLevelUpgrade, IgtUpgrade, SjTimeUpgrade, IgtProgressBar, IgtAction, IgtFeature, IgtLootTable},
  components: {IgtSingleLevelUpgrade, IgtUpgrade, SjTimeUpgrade, IgtProgressBar, IgtAction, IgtFeature},
  data() {
    return {
      generator: App.game.features.actionGenerator,
      inventory: App.game.inventory
    }
  },
  computed: {
    completeTheGame() {
      return this.generator.completeTheGame;
    },
    highlightNegativeUpgrade() {
      return this.generator.highlightNegatives;
    },
    highlightNegatives() {
      return this.generator.highlightNegativeActions;
    },
    speedBoost() {
      return this.generator.speedBoostUpgrade;
    },
    locks() {
      return this.generator.locks;
    },
    betterGems() {
      return this.generator.betterGems;
    },
    refreshUpgrade() {
      return this.generator.refreshDurationUpgrade
    },
    maxActionUpgrade() {
      return this.generator.maxActionsUpgrade
    },
    negativeRateUpgrade() {
      return this.generator.negativeRateUpgrade
    },
    upgrades() {
      return this.generator.upgrades;
    },
    refreshProgress() {
      return Math.min(1, Math.max(0, this.generator.checkCounter / this.generator.switchTime))
    },
    actions() {
      return this.generator.actions;
    }
  },
  methods: {
    buyFinalUpgrade() {
      const bought = this.generator.buyUpgrade(this.completeTheGame)
      if (bought) {
        this.$swal('Congratulations', "You have completed my April Fools game :)<br>" +
            "I hope you enjoyed it. It was made in 1 day with the <a target='_blank' class='text-black cursive underline' href='https://123ishatest.github.io/incremental-game-template-website/'>Incremental Game Template</a>!<br>" +
            "Want to learn more? Join the <a target='_blank' class='text-black cursive underline' href='https://discord.gg/AvNpq6Ng6S'>Discord</a>!<br>" +
            "<br><br> Thanks for playing<br>- Isha");
      }
    },
    lock(index, lock) {
      if (lock) {
        this.generator.lock(index);
      } else {
        this.generator.unlock(index);
      }
    },
    formatNumber(num) {
      return parseFloat(num).toFixed(0)
    }
  },

}
</script>

<style scoped>

</style>
