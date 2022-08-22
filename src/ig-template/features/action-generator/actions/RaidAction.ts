import {AbstractAction} from "@/ig-template/tools/actions/AbstractAction";
import {NoRequirement} from "@/ig-template/tools/requirements/NoRequirement";

export abstract class RaidAction extends AbstractAction {
    isLocked: boolean = false;

    protected constructor(description: string, duration: number) {
        super(description, duration, Infinity, new NoRequirement());
    }
}
