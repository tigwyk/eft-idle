import {IgtLoot} from "@/ig-template/tools/loot-tables/rewards/IgtLoot";
import {KeyItems} from "@/ig-template/features/key-items/KeyItems";
import {KeyItem} from "@/ig-template/features/key-items/KeyItem";

export class KeyItemLoot extends IgtLoot {
    loot: KeyItem;
    _keyItems: KeyItems;


    constructor(loot: KeyItem, keyItems: KeyItems) {
        super(1);
        this.loot = loot;
        this._keyItems = keyItems;
    }

    apply(): void {
        this._keyItems.gainKeyItem(this.loot.id);
    }

    equals(other: IgtLoot): boolean {
        return other instanceof KeyItemLoot && other.loot.id === this.loot.id;
    }

}
