// IStorageService.ts

import { IItem } from "../model/IItem";

export interface IStorageService {
    getItems(): Promise<IItem[]>;
    addItem(text: string, checked: boolean): Promise<IItem>;
    deleteItemById(id: number): Promise<void>;
    updateItem(item: IItem): Promise<void>;
    updateItemText(id: number, text: string): Promise<void>;
    checkUpdate(counter: number): Promise<{ counter: number, updated: boolean }>;
}

