import {Feature} from "@/ig-template/features/Feature";
import {Features} from "@/ig-template/Features";

export class Character {
    _thing = "hello"
    
    initialize(features: Features) {
        this._thing = "thing"
    }
    
    update(delta: number) {
        this._thing = "hello"
    }
}