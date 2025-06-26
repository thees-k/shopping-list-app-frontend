// LocalStorageService.ts

import { IItem } from "../model/IItem";
import { IStorageService } from "./IStorageService";

export class LocalStorageService implements IStorageService {

    private static readonly STORAGE_KEY = "shoppingList";

    async getItems(): Promise<IItem[]> {        
        return this.loadItems();
    }

    async addItem(text: string, checked: boolean): Promise<IItem> {
        const items = await this.getItems();
        const nextItemId: number = this.calculateNextItemId(items);
        const newItem: IItem = {
            id: nextItemId,
            text: text,
            checked: checked
        };
        items.push(newItem)
        this.saveItems(items);
        return newItem;
    }

    async deleteItemById(id: number): Promise<void> {
        // const items = this.getItems().filter(item => item.id !== id);
        // this.saveItems(items);        

        // Use findItemInListById() to remain consistent:
        const oldItems: IItem[] = await this.getItems();
        const toBeDeletedItem: IItem = this.findItemInListById(oldItems, id);

        const newItems: IItem[] = [];
        for(const item of oldItems) {
            if(item.id !== toBeDeletedItem.id) {
                newItems.push(item);
            }
        }
        this.saveItems(newItems);
    }

    async updateItem(changedItem: IItem): Promise<void> {
        const items: IItem[] = await this.getItems();
        const item = this.findItemInListById(items, changedItem.id);
        item.text = changedItem.text;
        item.checked = changedItem.checked;
        this.saveItems(items);
    }

    async updateItemText(id: number, text: string): Promise<void> {
        const items: IItem[] = await this.getItems();
        const item = this.findItemInListById(items, id);
        item.text = text;
        this.saveItems(items);
    }

    async checkUpdate(counter: number): Promise<{ counter: number, updated: boolean }> {        
        return  { counter: counter + 1,
                  updated: true // = Simulating "update okay":
        };
    }

    private calculateNextItemId(items: IItem[]): number {
        return items.length
            ? items[items.length - 1].id + 1
            : 1;
    }

    private findItemInListById(items: IItem[], id: number): IItem {
        const foundItems: IItem[] = [];
        for (const item of items) {
            if (item.id === id) {
                foundItems.push(item);
            }
        }
        if(foundItems.length === 1) {
            return foundItems[0];
        } if (foundItems.length > 1) {
            throw Error(`Multiple items with ID ${id} found`);
        } else {
            throw Error(`No item with ID ${id} found`);
        }        
    }

    private loadItems(): IItem[] {
        const storedData = localStorage.getItem(LocalStorageService.STORAGE_KEY);
        return storedData ? JSON.parse(storedData) as IItem[] : [];
    }

    private saveItems(items: IItem[]): void {
        localStorage.setItem(LocalStorageService.STORAGE_KEY, JSON.stringify(items));
    }
}
