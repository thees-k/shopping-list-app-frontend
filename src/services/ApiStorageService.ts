// src/services/ApiStorageService.ts

import { IItem } from "../model/IItem";
import { IStorageService } from "./IStorageService";
import axios from 'axios';

const ENDPOINT = "/shopping-list/api";

export class ApiStorageService implements IStorageService {

  async getItems(): Promise<IItem[]> {
    return await axios.get(`${ENDPOINT}/items`)
      .then(response => response.data);
  }

  async addItem(text: string, checked: boolean): Promise<IItem> {
    const newItem = { text, checked };
    return await axios.post(`${ENDPOINT}/items`, newItem)
      .then(response => response.data);
  }

  async deleteItemById(id: number): Promise<void> {
    return await axios.delete(`${ENDPOINT}/items/${id}`);
  }

  async updateItem(changedItem: IItem): Promise<void> {
    return await axios.put(`${ENDPOINT}/items/${changedItem.id}`, changedItem);
  }

  async updateItemText(id: number, text: string): Promise<void> {
    return await axios.put(`${ENDPOINT}/items/${id}`, {id: id, text: text, checked: null});
  }

  async checkUpdate(counter: number): Promise<{ counter: number, updated: boolean }> {
    try {
      return await axios.get(`${ENDPOINT}/check?counter=${counter}`)
        .then(response => response.data);
    } catch (error) {
      alert("No connection to server");
      throw error;
    }    
  }
}