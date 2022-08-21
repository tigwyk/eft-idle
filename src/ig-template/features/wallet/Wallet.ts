import {Currency} from "./Currency";
import {CurrencyType} from "./CurrencyType";

import {ISimpleEvent, SimpleEventDispatcher} from "strongly-typed-events";
import {Feature} from "@/ig-template/features/Feature";
import {WalletSaveData} from "@/ig-template/features/wallet/WalletSaveData";


export class Wallet extends Feature {
    private _currencies: Record<CurrencyType, number> = {} as Record<CurrencyType, number>
    private _multipliers: Record<CurrencyType, number> = {} as Record<CurrencyType, number>

    private _onCurrencyGain = new SimpleEventDispatcher<Currency>();

    private readonly _supportedCurrencies: CurrencyType[];

    constructor(supportedCurrencies: CurrencyType[]) {
        super("wallet");

        this._supportedCurrencies = supportedCurrencies;

        // Initialize currencies and multipliers
        for (const type of this._supportedCurrencies) {
            this._currencies[type as CurrencyType] = 0;
            this._multipliers[type as CurrencyType] = 1;
        }
    }

    public getAmount(type: CurrencyType): number {
        if (!this.supportsCurrencyType(type)) {
            return 0;
        }
        return this._currencies[type];
    }

    /**
     * Gain the specified currency and apply the global multiplier
     */
    public gainCurrency(currency: Currency): void {
        currency.multiply(this.getCurrencyMultiplier(currency.type));

        if (!currency.isValid() || !this.supportsCurrencyType(currency.type)) {
            console.warn(`Could not add currency ${currency.toString()}`);
            return;
        }

        this._onCurrencyGain.dispatch(currency);
        this._currencies[currency.type] += currency.amount;
    }

    /**
     * Return true if all currencies are valid and the player has the specified amount.
     */
    hasCurrencies(costs: Currency[]) {
        for (const cost of costs) {
            if (!this.hasCurrency(cost)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Return true if the currency is valid and the player has the specified amount.
     */
    public hasCurrency(currency: Currency): boolean {
        if (!this.supportsCurrencyType(currency.type)) {
            return false;
        }
        return this._currencies[currency.type] >= currency.amount;
    }


    public loseCurrency(currency: Currency): void {
        if (!currency.isValid() || !this.supportsCurrencyType(currency.type)) {
            console.warn(`Could not lose currency ${currency.toString()}`);
            return;
        }
        this._currencies[currency.type] -= Math.min(currency.amount, this._currencies[currency.type]);
    }

    /**
     * Remove the currencies amounts from the specified currency.
     * IMPORTANT: This method does not care if amounts go negative
     */
    public loseMultipleCurrencies(currencies: Currency[]) {
        for (const currency of currencies) {
            this.loseCurrency(currency);
        }
    }

    /**
     * Subtracts the specified currencies and returns true if the wallet has enough.
     * Otherwise return false and don't subtract anything
     */
    public payMultipleIfPossible(currencies: Currency[]): boolean {
        if (this.hasCurrencies(currencies)) {
            this.loseMultipleCurrencies(currencies);
            return true;
        }
        return false;
    }

    /**
     * Subtracts the specified currency and returns true if the wallet has enough.
     * Otherwise return false and don't subtract anything
     * @param currency
     * @constructor
     */
    public payIfPossible(currency: Currency): boolean {
        if (this.hasCurrency(currency)) {
            this.loseCurrency(currency);
            return true;
        }
        return false;
    }

    /**
     * Return 1 if the multiplier is not set
     */
    public getCurrencyMultiplier(type: CurrencyType): number {
        return this._multipliers[type] ?? 1;
    }

    public setCurrencyMultiplier(multiplier: number, type: CurrencyType): void {
        if (multiplier <= 0 || isNaN(multiplier) || !this.supportsCurrencyType(type)) {
            return;
        }
        this._multipliers[type] = multiplier;
    }

    public supportsCurrencyType(type: CurrencyType): boolean {
        return this._supportedCurrencies.includes(type);
    }

    public canAccess(): boolean {
        return true;
    }

    public save(): WalletSaveData {
        return {
            rouble: this._currencies[CurrencyType.Rouble],
            dollar: this._currencies[CurrencyType.Dollar],
            euro: this._currencies[CurrencyType.Euro],
            diamond: this._currencies[CurrencyType.Diamond],
        }
    }

    public load(data: WalletSaveData): void {
        this._currencies[CurrencyType.Rouble] = data.rouble ?? this._currencies[CurrencyType.Rouble];
        this._currencies[CurrencyType.Dollar] = data.dollar ?? this._currencies[CurrencyType.Dollar];
        this._currencies[CurrencyType.Euro] = data.euro ?? this._currencies[CurrencyType.Euro];
        this._currencies[CurrencyType.Diamond] = data.diamond ?? this._currencies[CurrencyType.Diamond];
    }

    /**
     * Emitted whenever a currency is gained
     * @private
     */
    public get onCurrencyGain(): ISimpleEvent<Currency> {
        return this._onCurrencyGain.asEvent();
    }

    public get rouble(): number {
        return this._currencies.Rouble;
    }

    public get dollar(): number {
        return this._currencies.Dollar;
    }

    public get euro(): number {
        return this._currencies.Euro;
    }

    public get diamond(): number {
        return this._currencies.Diamond;
    }

    public set money(value: number) {
        this._currencies.Diamond = value;
    }
}
