import {SaveData} from "@/ig-template/tools/saving/SaveData";

export interface WalletSaveData extends SaveData {
    rouble: number;
    dollar: number;
    euro: number;
    diamond: number;
}
