import {ItemId} from "@/ig-template/features/items/ItemId";
import {AbstractItem} from "@/ig-template/features/items/AbstractItem";
import {ItemType} from "@/ig-template/features/items/ItemType";

export class ItemWithData extends AbstractItem {
    durability: number;

    constructor(customData: number = 3) {
        super('Helmet', `This custom data is also saved`, ItemId.ItemWithData, ItemType.Default, 1);
        this.durability = customData;
    }

    save(): object {
        return {
            customData: this.durability
        }
    }

    load(data: any) {
        this.durability = data.customData ?? this.durability;
        this.description = `This custom data is also saved. Durability: (${this.durability})`;
    }
}
