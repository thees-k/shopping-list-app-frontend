// ManagedList.ts

import { ApiStorageService } from "../services/ApiStorageService";
import { IStorageService } from "../services/IStorageService";
import { LocalStorageService } from "../services/LocalStorageService";
import { IItem } from "./IItem";

export class ManagedList {

  private static instance: ManagedList | null = null;
  public items: IItem[] = [];
  private counter: number = 0;
  private storageService: IStorageService;

  private constructor(storageService: IStorageService) {
    this.storageService = storageService;
  }

  public static async getInstance(): Promise<ManagedList> {
    if (!ManagedList.instance) {
      const isDevelopmentMode: boolean = import.meta.env.MODE === 'development'
      const storageService = isDevelopmentMode ? new LocalStorageService() : new ApiStorageService();
      ManagedList.instance = new ManagedList(storageService);

      ManagedList.instance.counter = (await storageService.checkUpdate(-1)).counter;
      await ManagedList.instance.reloadItems();
    }
    return ManagedList.instance;
  }

  public async addItem(text: string, checked: boolean): Promise<boolean> {
    if (await this.performUpdateCheck()) {
      const newItem = await this.storageService.addItem(text, checked);
      this.items.push(newItem);
      return true;
    }
    return false;
  }

  public async removeItem(id: number): Promise<boolean> {
    if (await this.performUpdateCheck()) {
      await this.storageService.deleteItemById(id);
      this.items = this.items.filter(item => item.id !== id);
      return true;
    }
    return false;
  }

  public async updateItem(changedItem: IItem): Promise<boolean> {
    if (await this.performUpdateCheck()) {
      await this.storageService.updateItem(changedItem);
      this.updateItemInList(changedItem.id, changedItem.text, changedItem.checked);
      return true;
    }
    return false;
  }

  public async updateItemText(id: number, text: string): Promise<boolean> {
    if (await this.performUpdateCheck()) {
      await this.storageService.updateItemText(id, text);
      this.updateItemInList(id, text);
      return true;
    }
    return false;
  }

  public async refresh(): Promise<boolean> {
    const { counter, updated } = await this.storageService.checkUpdate(this.counter);
    this.counter = counter;
    if (!updated) {
      await this.reloadItems();
    }
    return updated;
  }

  private async reloadItems(): Promise<void> {
    this.items = await this.storageService.getItems();
  }

  private async performUpdateCheck(): Promise<boolean> {
    const updated: boolean = await this.refresh();
    if(!updated) {
      alert("The action was NOT executed!");
    }
    return updated;
  }

  private updateItemInList(id: number, text: string, checked: boolean | null = null) {
    const matchingItems = this.items.filter(item => item.id === id);

    if (matchingItems.length === 1) {
      const item = matchingItems[0];
      item.text = text;
      if (checked !== null) {
        item.checked = checked;
      }
    } else if (matchingItems.length > 1) {
      throw new Error(`Multiple items with ID ${id} found.`);
    } else {
      throw new Error(`No item with ID ${id} found.`);
    }
  }
}