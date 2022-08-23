import {Feature} from "@/ig-template/features/Feature";
import {Features} from "@/ig-template/Features";
import { Wallet } from "@/ig-template/features/wallet/Wallet";
import { Inventory } from "@/ig-template/features/inventory/Inventory";
import { ItemList } from "@/ig-template/features/items/ItemList";

export class Character {
    _wallet: Wallet = null as unknown as Wallet;
    _inventory: Inventory = null as unknown as Inventory;
    _itemList: ItemList = null as unknown as ItemList;
    _thing: string = "not thing";

    initialize(features: Features) {
        this._thing = "thing";
        this._wallet = features.wallet;
        this._inventory = features.inventory;
        this._itemList = features.itemList;
    }
    
    update(delta: number) {
        this._thing = "hello"
    }
}