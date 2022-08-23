import {UpgradesFeature} from "@/ig-template/features/UpgradesFeature";
import {ContinuousExpLevel} from "@/ig-template/tools/exp-level/ContinuousExpLevel";
import {Features} from "@/ig-template/Features";
import {ActionGeneratorSaveData} from "@/ig-template/features/action-generator/ActionGeneratorSaveData";
import {RaidAction} from "@/ig-template/features/action-generator/actions/RaidAction";
import {GainExpAction} from "@/ig-template/features/action-generator/actions/GainExpAction";
import { GainItemAction } from "@/ig-template/tools/actions/GainItemAction";
import {Random} from "@/ig-template/tools/probability/Random";
import {GainCurrencyAction} from "@/ig-template/features/action-generator/actions/GainCurrencyAction";
import {CurrencyType} from "@/ig-template/features/wallet/CurrencyType";
import {Currency} from "@/ig-template/features/wallet/Currency";
import {DiscreteUpgrade} from "@/ig-template/tools/upgrades/DiscreteUpgrade";
import {UpgradeId} from "@/ig-template/tools/upgrades/UpgradeId";
import {UpgradeType} from "@/ig-template/tools/upgrades/UpgradeType";
import {CurrencyBuilder} from "@/ig-template/features/wallet/CurrencyBuilder";
import {ArrayBuilder} from "@/ig-template/util/ArrayBuilder";
import {SingleLevelUpgrade} from "@/ig-template/tools/upgrades/SingleLevelUpgrade";
import {WeightedDistribution} from "@/ig-template/tools/probability/WeightedDistribution";
import {Outcome} from "@/ig-template/tools/probability/Outcome";
import { ShootScavAction } from "./actions/ShootScavAction";

export class ActionGenerator extends UpgradesFeature {

    actions: RaidAction[] = [];
    playerLevel: ContinuousExpLevel;

    refreshDurationUpgrade: DiscreteUpgrade;
    maxActionsUpgrade: DiscreteUpgrade;
    negativeRateUpgrade: DiscreteUpgrade;
    betterGems: DiscreteUpgrade;
    speedBoostUpgrade: DiscreteUpgrade;
    locks: DiscreteUpgrade;
    highlightNegatives: SingleLevelUpgrade;
    completeTheGame: SingleLevelUpgrade;

    public checkCounter: number = 0;
    public luckChance: number = 10;

    constructor() {
        super('action-generator-feature');

        this.playerLevel = new ContinuousExpLevel(100, (level) => {
            return 1 / 8 * (level ** 2 - level + 600 * (2 ** (level / 7) - 2 ** (1 / 7)) / (2 ** (1 / 7) - 1))
        })

        this.refreshDurationUpgrade = new DiscreteUpgrade(UpgradeId.ActionRefreshDuration, UpgradeType.None, "Refresh Duration", 10,
            CurrencyBuilder.createArray(ArrayBuilder.fromStartAndStepAdditive(0, 50, 10), CurrencyType.Rouble),
            ArrayBuilder.fromStartAndStepAdditive(10, 5, 11), 1
        )

        this.maxActionsUpgrade = new DiscreteUpgrade(UpgradeId.MaxActions, UpgradeType.None, "Max Actions", 30,
            CurrencyBuilder.createArray(ArrayBuilder.fromStartAndStepAdditive(10, 40, 30), CurrencyType.Dollar),
            ArrayBuilder.fromStartAndStepAdditive(5, 1, 31), 1
        )

        this.negativeRateUpgrade = new DiscreteUpgrade(UpgradeId.NegativeRate, UpgradeType.None, "Negative Chance", 10,
            CurrencyBuilder.createArray(ArrayBuilder.fromStartAndStepAdditive(0, 50, 10), CurrencyType.Euro),
            ArrayBuilder.fromStartAndStepAdditive(0.5, -0.05, 11), 1
        )

        this.speedBoostUpgrade = new DiscreteUpgrade(UpgradeId.SpeedBoost, UpgradeType.None, "Speed boost", 30,
            CurrencyBuilder.createArray(ArrayBuilder.fromStartAndStepAdditive(100, 100, 10), CurrencyType.Rouble).concat(
                CurrencyBuilder.createArray(ArrayBuilder.fromStartAndStepAdditive(100, 100, 8), CurrencyType.Dollar).concat(
                    CurrencyBuilder.createArray(ArrayBuilder.fromStartAndStepAdditive(50, 50, 8), CurrencyType.Euro).concat(
                        CurrencyBuilder.createArray(ArrayBuilder.fromStartAndStepAdditive(25, 25, 4), CurrencyType.Diamond).concat(
                        )
                    )
                )
            ),
            ArrayBuilder.fromStartAndStepAdditive(1, 0.1, 31), 0
        )

        this.locks = new DiscreteUpgrade(UpgradeId.Locks, UpgradeType.None, "Lock Actions", 5,
            CurrencyBuilder.createArray(ArrayBuilder.fromStartAndStepAdditive(-4, 5, 5), CurrencyType.Diamond),
            ArrayBuilder.fromStartAndStepAdditive(0, 1, 6), 1
        )


        this.betterGems = new DiscreteUpgrade(UpgradeId.BetterGems, UpgradeType.None, "Better Gem Chance", 30,
            CurrencyBuilder.createArray(ArrayBuilder.fromStartAndStepAdditive(100, 100, 12), CurrencyType.Rouble).concat(
                CurrencyBuilder.createArray(ArrayBuilder.fromStartAndStepAdditive(100, 100, 7), CurrencyType.Dollar).concat(
                    CurrencyBuilder.createArray(ArrayBuilder.fromStartAndStepAdditive(100, 100, 7), CurrencyType.Euro).concat(
                        CurrencyBuilder.createArray(ArrayBuilder.fromStartAndStepAdditive(20, 20, 4), CurrencyType.Diamond).concat(
                        )
                    )
                )
            ),
            ArrayBuilder.fromStartAndStepAdditive(0, 0.15, 31), 1
        )

        this.highlightNegatives = new SingleLevelUpgrade(UpgradeId.HighlightNegative, UpgradeType.None, "Highlight Negatives",
            new Currency(200, CurrencyType.Dollar), 1);

        this.completeTheGame = new SingleLevelUpgrade(UpgradeId.CompleteTheGame, UpgradeType.None, "Complete the game",
            new Currency(500, CurrencyType.Diamond), 1);

        this.upgrades = [
            this.refreshDurationUpgrade,
            this.maxActionsUpgrade,
            this.negativeRateUpgrade,
            this.betterGems,
            this.highlightNegatives,
            this.locks,
            this.speedBoostUpgrade,
            this.completeTheGame
        ]
    }


    start() {
        this.generateNewActions();
    }

    lock(index: number) {
        if (this.currentLock >= this.maxLock) {
            return;
        }
        this.actions[index].isLocked = !this.actions[index].isLocked;
    }

    unlock(index: number) {
        this.actions[index].isLocked = false;
    }

    get currentLock() {
        let total = 0;
        this.actions.forEach(action => {
            if (action.isLocked) {
                total++;
            }
        });
        return total;
    }

    get maxLock() {
        return this.locks.getBonus();
    }

    update(delta: number) {

        this.actions.forEach(action => {
            action.perform(delta);
        })

        this.checkCounter += delta;
        if (this.checkCounter >= this.switchTime) {
            this.generateNewActions();
            this.checkCounter = 0;
        }

        if (this.maxActionCount > this.actions.length) {
            this.actions.push(this.createCurrencyGain(this.playerLevel.getLevel(), 0))
        }
    }

    get highlightNegativeActions(): boolean {
        return this.highlightNegatives.isBought()
    }

    get speedBoost() {
        return this.speedBoostUpgrade.getBonus();
    }

    get switchTime() {
        return this.refreshDurationUpgrade.getBonus();
    }

    get gemImprovement() {
        return this.betterGems.getBonus();
    }

    get negativeProb() {
        return this.negativeRateUpgrade.getBonus()
    }

    get maxActionCount() {
        return this.maxActionsUpgrade.getBonus();
    }

    initialize(features: Features) {
        this._wallet = features.wallet;
        this._inventory = features.inventory;
        this._itemList = features.itemList;
    }

    private generateNewActions() {
        const newActions = [];
        for (let i = 0; i < this.maxActionCount; i++) {
            const oldAction = this.actions[i];
            if (!oldAction) {
                newActions.push(this.getAction());
                continue;
            }
            if (oldAction.isLocked) {
                newActions.push(oldAction);
                continue;
            }

            const wasStarted = oldAction.isStarted;
            const newAction = this.getAction();
            newAction.isStarted = wasStarted
            newActions.push(newAction)
        }
        this.actions = newActions;
    }


    private getAction(): RaidAction {
        const level = this.playerLevel.getLevel();
        const negativeProb = this.negativeProb;
        const possibleActions = [];
        for (let i = 0; i < 13; i++) {
            possibleActions.push(this.createCurrencyGain(level, negativeProb))
        }
        for (let i = 0; i < 7; i++) {
            possibleActions.push(this.createExpGain(level, negativeProb))
        }
        for (let i = 0; i < 5; i++) {
            possibleActions.push(this.createScavAction(level, negativeProb))
        }
        for (let i = 0; i < 2; i++) {
            possibleActions.push(this.createRandomItemDrop(level, negativeProb))
        }
        possibleActions.forEach(action => {
            action.duration /= this.speedBoost;
        })
        return Random.fromArray(possibleActions);
    }

    createScavAction(level: number, negativeProb: number) {
        const benefit = Math.floor(3 + Math.pow(level + 2, 1.4));
        const duration = Math.max(12, Random.fuzzInt(Math.sqrt(benefit * 5), 0.3));
        const scavAction = new ShootScavAction(duration, this.playerLevel, Random.fuzzInt(benefit, 0.2),this._wallet);
        scavAction.onCompletion.subscribe(action => {
            console.log("Completed", action.description);
            const index = this.actions.indexOf(scavAction, 0);
            if (index > -1) {
                this.actions.splice(index, 1);
            }
        });
        return scavAction;
    }

    createItemDrop(level: number, negativeProb: number) {
        const benefit = Math.floor(3 + Math.pow(level + 2, 1.4));
        const duration = Math.max(12, Random.fuzzInt(Math.sqrt(benefit * 5), 0.3));
        return new GainItemAction(this._itemList.helmet.id,"Shoot Scavs",duration,this._inventory, this._itemList)
    }

    createRandomItemDrop(level: number, negativeProb: number): GainItemAction {
        const distribution = new WeightedDistribution([
            new Outcome<GainItemAction>(this.createHelmetDrop(level, false), 8 - this.gemImprovement),
            new Outcome<GainItemAction>(this.createArmorDrop(level, false), 5 - this.gemImprovement / 2),
            new Outcome<GainItemAction>(this.createWeaponDrop(level, false), 2 + this.gemImprovement / 2),
            new Outcome<GainItemAction>(this.createBagDrop(level, false), -1 + this.gemImprovement),
        ])
        return distribution.draw();
    }

    createExpGain(level: number, negativeProb: number) {
        const benefit = Math.floor(3 + Math.pow(level + 2, 1.4));
        const duration = Math.max(12, Random.fuzzInt(Math.sqrt(benefit * 5), 0.3));
        return new GainExpAction(duration, this.playerLevel, Random.fuzzInt(benefit, 0.2))
    }

    createCurrencyGain(level: number, negativeProb: number): GainCurrencyAction {
        const distribution = new WeightedDistribution([
            new Outcome<GainCurrencyAction>(this.createRouble(level, false), 8 - this.gemImprovement),
            new Outcome<GainCurrencyAction>(this.createDollar(level, false), 5 - this.gemImprovement / 2),
            new Outcome<GainCurrencyAction>(this.createEuro(level, false), 2 + this.gemImprovement / 2),
            new Outcome<GainCurrencyAction>(this.createDiamond(level, false), -1 + this.gemImprovement),
        ])
        return distribution.draw();
    }

    createHelmetDrop(level: number, isNegative: boolean) {
        const benefit = Random.intBetween(10, 10 + 6 * level)
        const duration = Math.max(12, Random.fuzzInt(Math.sqrt(benefit * 5), 0.3));
        const itemAction = new GainItemAction(this._itemList.helmet.id,"Search for Helmet",duration,this._inventory, this._itemList);
        itemAction.onCompletion.subscribe(action => {
            console.log("Completed", action.description);
            const index = this.actions.indexOf(itemAction, 0);
            if (index > -1) {
                this.actions.splice(index, 1);
            }
        });
        return itemAction;
    }

    createArmorDrop(level: number, isNegative: boolean) {
        const benefit = Random.intBetween(10, 10 + 6 * level)
        const duration = Math.max(12, Random.fuzzInt(Math.sqrt(benefit * 5), 0.3));
        const itemAction = new GainItemAction(this._itemList.helmet.id,"Search for Armor",duration,this._inventory, this._itemList);
        itemAction.onCompletion.subscribe(action => {
            console.log("Completed", action.description);
            const index = this.actions.indexOf(itemAction, 0);
            if (index > -1) {
                this.actions.splice(index, 1);
            }
        });
        return itemAction;
    }

    createWeaponDrop(level: number, isNegative: boolean) {
        const benefit = Random.intBetween(10, 10 + 6 * level)
        const duration = Math.max(12, Random.fuzzInt(Math.sqrt(benefit * 5), 0.3));
        const itemAction = new GainItemAction(this._itemList.helmet.id,"Search for Weapon",duration,this._inventory, this._itemList);
        itemAction.onCompletion.subscribe(action => {
            console.log("Completed", action.description);
            const index = this.actions.indexOf(itemAction, 0);
            if (index > -1) {
                this.actions.splice(index, 1);
            }
        });
        return itemAction;
    }

    createBagDrop(level: number, isNegative: boolean) {
        const benefit = Random.intBetween(10, 10 + 6 * level)
        const duration = Math.max(12, Random.fuzzInt(Math.sqrt(benefit * 5), 0.3));
        const itemAction = new GainItemAction(this._itemList.helmet.id,"Search for Bag",duration,this._inventory, this._itemList);
        itemAction.onCompletion.subscribe(action => {
            console.log("Completed", action.description);
            const index = this.actions.indexOf(itemAction, 0);
            if (index > -1) {
                this.actions.splice(index, 1);
            }
        });
        return itemAction;
    }

    createRouble(level: number, isNegative: boolean) {
        const benefit = Random.intBetween(10, 10 + 6 * level)
        return new GainCurrencyAction(5, new Currency(benefit, CurrencyType.Rouble), this._wallet)
    }

    createDollar(level: number, isNegative: boolean) {
        const benefit = Random.intBetween(6, 6 + 4 * level)
        return new GainCurrencyAction(15, new Currency(benefit, CurrencyType.Dollar), this._wallet)
    }

    createEuro(level: number, isNegative: boolean) {
        const benefit = Random.intBetween(3, 3 + 3 * level)
        return new GainCurrencyAction(30, new Currency(benefit, CurrencyType.Euro), this._wallet)
    }

    createDiamond(level: number, isNegative: boolean) {
        const benefit = isNegative ? -1 : 1 + Math.floor(level / 4);
        return new GainCurrencyAction(120, new Currency(benefit, CurrencyType.Diamond), this._wallet)
    }

    save(): ActionGeneratorSaveData {
        return {
            exp: this.playerLevel.exp,
            ...super.save(),
        };
    }

    load(data: ActionGeneratorSaveData) {
        super.load(data);
        this.playerLevel.exp = data.exp ?? this.playerLevel.exp;
    }
}
