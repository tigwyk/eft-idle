import {IgtLoot} from "@/ig-template/tools/loot-tables/rewards/IgtLoot";
import {Currency} from "@/ig-template/features/wallet/Currency";
import {Wallet} from "@/ig-template/features/wallet/Wallet";
import {CurrencyType} from "@/ig-template/features/wallet/CurrencyType";

export class CurrencyLoot extends IgtLoot {

    loot: CurrencyType;
    _wallet: Wallet;


    constructor(amount: number, type: CurrencyType, wallet: Wallet) {
        super(amount);
        this.loot = type;
        this._wallet = wallet;
    }

    apply(): void {
        this._wallet.gainCurrency(this.currency);
    }

    get currency(): Currency {
        return new Currency(this.amount, this.loot)
    }

    equals(other: IgtLoot): boolean {
        return other instanceof CurrencyLoot && other.loot === this.loot;
    }

}
