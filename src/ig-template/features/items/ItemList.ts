import {Feature} from "@/ig-template/features/Feature";
import {SaveData} from "@/ig-template/tools/saving/SaveData";
import {MoneyPouch} from "@/ig-template/features/items/instances/MoneyPouch";
import {Features} from "@/ig-template/Features";
import {ItemWithData} from "@/ig-template/features/items/instances/ItemWithData";
import {EmptyItem} from "@/ig-template/features/items/instances/EmptyItem";
import {RawFish} from "@/ig-template/features/items/instances/RawFish";
import {CookedFish} from "@/ig-template/features/items/instances/CookedFish";
import { ItemId } from "@/ig-template/features/items/ItemId";
import {Armor} from "@/ig-template/features/items/instances/Armor";

export class ItemList extends Feature {

    _features = undefined as unknown as Features

    constructor() {
        super('item-list');
    }


    initialize(features: Features) {
        super.initialize(features);
        this._features = features;
    }

    get empty(): EmptyItem {
        return new EmptyItem();
    }

    get moneyPouch(): MoneyPouch {
        return new MoneyPouch(this._features.wallet)
    }

    get itemWithData(): ItemWithData {
        return new ItemWithData();
    }

    get rawFish(): RawFish {
        return new RawFish();
    }
    get cookedFish(): CookedFish {
        return new CookedFish();
    }
    get armor(): Armor {
        return new Armor("Body Armor","Maybe you can wear it?", ItemId.Armor);
    }

    get helmet(): Armor {
        return new Armor("Helmet","Maybe you can wear it?",ItemId.Helmet);
    }

    get bag(): Armor {
        return new Armor("Bag","Maybe you can wear it?", ItemId.Bag);
    }

    load(): void {
        // Empty
    }

    save(): SaveData {
        return {}
    }
}
