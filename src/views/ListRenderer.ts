// src/views/ListRenderer.ts

import { IItem } from "../model/IItem";
import { ManagedList } from "../model/ManagedList";
import { getElementById } from "../utils/domUtils";
import { getRandomFunnyEmoji } from "../utils/emojiUtils";
import EventManager from "../utils/EventManager";
import { getSelectedAction } from "./ItemEntryUpdater";
import { ActionType } from "./ActionType";


export default class ListRenderer {

    static instance: ListRenderer | null = null;
    unorderedList: HTMLUListElement;
    buySelectedActionHeader: HTMLOptionElement;
    selectedAction: ActionType;

    private constructor() {
        this.unorderedList = getElementById<HTMLUListElement>("listItems");
        this.buySelectedActionHeader = getElementById<HTMLOptionElement>("buyOption");
        this.selectedAction = ActionType.BUY;
    }

    static getInstance(): ListRenderer {
        if (!ListRenderer.instance) {
            ListRenderer.instance = new ListRenderer();
        }
        return ListRenderer.instance;
    }

    clear(): void {
        this.unorderedList.innerText = "";
    }

    async render(): Promise<void> {
        this.selectedAction = getSelectedAction();
        if (this.selectedAction === ActionType.BUY) {
            this.updateSelectedActionHeader();
        }        
        this.clear();
        (await ManagedList.getInstance()).items.forEach(item => this.createListItem(item));
    }

    private updateSelectedActionHeader(): void {
        this.buySelectedActionHeader.innerText = `Buy ${getRandomFunnyEmoji()}`;
    }

    private createListItem(item: IItem): void {
        const listItem = document.createElement("li") as HTMLLIElement;
        listItem.className = "item";

        this.setupCheckbox(item, listItem);
        this.addTextDiv(item, listItem);

        if (this.selectedAction === ActionType.CLEANUP_MODE) {
            this.addDeleteButton(item, listItem);
        }

        this.unorderedList.append(listItem);
    }

    private setupCheckbox(item: IItem, listItem: HTMLLIElement): void {
        const checkbox = document.createElement("input") as HTMLInputElement;
        checkbox.type = "checkbox";
        checkbox.id = item.id.toString();
        checkbox.checked = item.checked;

        listItem.append(checkbox);

        if (this.selectedAction === ActionType.BUY) {
            checkbox.addEventListener('change', async () => {
                await this.handleCheckboxChange(item, checkbox);
            });
        } else {
            checkbox.className = "disabledCheckbox";
        }
    }

    private async handleCheckboxChange(item: IItem, checkbox: HTMLInputElement): Promise<void> {
        try {
            await (await ManagedList.getInstance()).updateItem({
                id: item.id,
                text: item.text,
                checked: !item.checked
            });
        } catch (error) {
            checkbox.checked = !checkbox.checked; // Reset on error
        }
        await this.render();
    }

    private addTextDiv(item: IItem, listItem: HTMLLIElement): void {
        const div = document.createElement("div") as HTMLDivElement;
        div.classList.add("itemText");
        div.id = `text_${item.id}`;
        div.textContent = item.text;
        listItem.append(div);

        if (this.selectedAction === ActionType.EDIT_ITEM) {
            this.attachEditClickListener(div, item);
        }
    }

    private attachEditClickListener(div: HTMLDivElement, item: IItem): void {
        EventManager.getInstance().addEventListener(div, "click", async () => {
            if(await (await ManagedList.getInstance()).refresh()) {
                const input = getElementById<HTMLInputElement>("newItem");
                input.placeholder = `${item.id}`;
                input.value = div.textContent || "";
            } else {
                this.render();
            }
        });
    }

    private addDeleteButton(item: IItem, listItem: HTMLLIElement): void {
        const button = document.createElement("button") as HTMLButtonElement;
        button.className = 'button deleteButton';
        button.textContent = 'X';
        listItem.append(button);

        button.addEventListener('click', async () => {
            await (await ManagedList.getInstance()).removeItem(item.id);
            await this.render();
        });
    }
}
