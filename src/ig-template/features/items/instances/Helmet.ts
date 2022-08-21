import {AbstractItem} from "@/ig-template/features/items/AbstractItem";
import {ItemId} from "@/ig-template/features/items/ItemId";
import {ItemType} from "@/ig-template/features/items/ItemType";

export class Helmet extends AbstractItem {
    constructor() {
        super('Helmet', 'Maybe you can wear it?', ItemId.Helmet, ItemType.Default);
    }
}
