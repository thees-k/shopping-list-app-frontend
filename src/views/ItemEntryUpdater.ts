// src/views/ItemEntryRenderer.ts

import { getElementById } from "../utils/domUtils";
import { ActionType } from "./ActionType";

export default class ItemEntryUpdater {

    update(): void {
        const selectedAction: ActionType = getSelectedAction();
        const isAddOrEdit = [ActionType.ADD_ITEM, ActionType.EDIT_ITEM].includes(selectedAction);
        getElementById<HTMLElement>("newItemEntry").style.display = isAddOrEdit ? "block" : "none";
        if (isAddOrEdit) {
            const input = getElementById<HTMLInputElement>("newItem");
            input.value = "";
            input.placeholder = this.createPlaceholderValue(selectedAction);
        }
    }

    private createPlaceholderValue(selectedAction: ActionType): string {
        switch (selectedAction) {
            case ActionType.ADD_ITEM:
                return "Enter item here..";
            case ActionType.EDIT_ITEM:
                return "Click on item to edit!";
            default:
                return "";
        }
    }
}

export function getSelectedAction(): ActionType {
    const actionSelect = getElementById<HTMLSelectElement>("actions");
    const selectedOption = actionSelect.options[actionSelect.selectedIndex];
    return selectedOption.value as ActionType;
}

