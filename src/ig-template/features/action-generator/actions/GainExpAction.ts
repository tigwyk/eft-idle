import {RaidAction} from "@/ig-template/features/action-generator/actions/RaidAction";
import {AbstractExpLevel} from "@/ig-template/tools/exp-level/AbstractExpLevel";

export class GainExpAction extends RaidAction {
    _expLevel: AbstractExpLevel
    amount: number;


    constructor(duration: number, expLevel: AbstractExpLevel, amount: number) {
        super(`${amount < 0 ? 'Lose' : 'Gain'} ${amount} EXP`, duration);
        this._expLevel = expLevel;
        this.amount = amount;
    }

    gainReward(): boolean {
        this._expLevel.gainExperience(this.amount);
        return true;
    }

}
