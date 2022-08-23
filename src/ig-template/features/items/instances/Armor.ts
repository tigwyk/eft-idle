import {AbstractItem} from "@/ig-template/features/items/AbstractItem";
import {ItemId} from "@/ig-template/features/items/ItemId";
import {ItemType} from "@/ig-template/features/items/ItemType";

export class Armor extends AbstractItem {
    constructor(name: string, description: string, id: ItemId) {
        super(name, description, id, ItemType.Default);
    }
}
