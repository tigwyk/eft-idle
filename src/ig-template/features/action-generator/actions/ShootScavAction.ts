import {RaidAction} from "@/ig-template/features/action-generator/actions/RaidAction";
import {AbstractExpLevel} from "@/ig-template/tools/exp-level/AbstractExpLevel";
import {Currency} from "@/ig-template/features/wallet/Currency";
import {Wallet} from "@/ig-template/features/wallet/Wallet";
import {WeightedDistribution} from "@/ig-template/tools/probability/WeightedDistribution";
import {Outcome} from "@/ig-template/tools/probability/Outcome";
import {CurrencyType} from "@/ig-template/features/wallet/CurrencyType";

export class ShootScavAction extends RaidAction {
    _expLevel: AbstractExpLevel
    amount: number;
    _wallet: Wallet;


    constructor(duration: number, expLevel: AbstractExpLevel, amount: number, wallet: Wallet) {
        super(`Shoot ${amount} Scavs`, duration);
        this._expLevel = expLevel;
        this.amount = amount;
        this._wallet = wallet;
    }

    gainReward(): boolean {
        this._expLevel.gainExperience(this.amount);
        // const reward = new Currency(benefit, CurrencyType.Dollar)
        const distribution = new WeightedDistribution([
            new Outcome<Currency>(new Currency(this.amount, CurrencyType.Dollar),8 - this.amount),
            new Outcome<Currency>(new Currency(this.amount, CurrencyType.Rouble),5 - this.amount)
        ]) ; 
        this._wallet.gainCurrency(distribution.draw());
                return true;
    }

}
