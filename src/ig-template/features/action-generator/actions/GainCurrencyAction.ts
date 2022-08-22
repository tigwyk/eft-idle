import {RaidAction} from "@/ig-template/features/action-generator/actions/RaidAction";
import {Currency} from "@/ig-template/features/wallet/Currency";
import {Wallet} from "@/ig-template/features/wallet/Wallet";
import {Random} from "@/ig-template/tools/probability/Random";

export class GainCurrencyAction extends RaidAction {
    _wallet: Wallet;
    currency: Currency;


    constructor(duration: number, currency: Currency, wallet: Wallet) {
        super(`${currency.amount < 0 ? 'Lose' : 'Gain'} ${currency.amount} ${currency.type}`, Random.fuzzInt(duration, 0.2));
        this.currency = currency;
        this._wallet = wallet;
    }

    gainReward(): boolean {
        this._wallet.gainCurrency(this.currency);
        return true;
    }

}
