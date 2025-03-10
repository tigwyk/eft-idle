import {Game} from "./ig-template/Game";
import {Wallet} from "@/ig-template/features/wallet/Wallet";
import {CurrencyType} from "@/ig-template/features/wallet/CurrencyType";
import {Settings} from "@/ig-template/features/settings/Settings";
import {Statistics} from "@/ig-template/features/statistics/Statistics";
import {Achievements} from "@/ig-template/features/achievements/Achievements";
import {RedeemableCodes} from "@/ig-template/features/codes/RedeemableCodes";
import {ActionGenerator} from "@/ig-template/features/action-generator/ActionGenerator";
import {SpecialEvents} from "@/ig-template/features/special-events/SpecialEvents";
import {Inventory} from "@/ig-template/features/inventory/Inventory";
import {ItemList} from "@/ig-template/features/items/ItemList";
import {KeyItems} from "@/ig-template/features/key-items/KeyItems";

export class App {
    static inProduction: boolean = (process.env.NODE_ENV === "production");

    static game: Game;

    static start(): void {

        this.game = this.getDefaultGame();
        this.game.initialize();
        this.game.load();
        this.game.start();
    }


    public static getDefaultGame(): Game {
        return new Game(
            {
                wallet: new Wallet([CurrencyType.Rouble, CurrencyType.Dollar, CurrencyType.Euro, CurrencyType.Diamond]),
                settings: new Settings(),
                codes: new RedeemableCodes(),
                actionGenerator: new ActionGenerator(),
                inventory: new Inventory(),
                itemList: new ItemList(),
                keyItems: new KeyItems(),
                specialEvents: new SpecialEvents(),
                statistics: new Statistics(),
                achievements: new Achievements()
            }
        );
    }
}
