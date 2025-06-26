// main.ts

import './css/style.css';
import { ManagedList } from "./model/ManagedList";
import ListRenderer from './views/ListRenderer';
import { getElementById } from './utils/domUtils';
import { parseToInt } from './utils/miscUtils';
import ItemEntryUpdater from './views/ItemEntryUpdater';

const initApp = async (): Promise<void> => {
  const managedList: ManagedList = await ManagedList.getInstance();
  const listRenderer: ListRenderer = ListRenderer.getInstance();

  setupActionSelectListener(managedList, listRenderer);
  setupItemEntryListener(managedList, listRenderer);

  new ItemEntryUpdater().update();
  await listRenderer.render();
};

const setupActionSelectListener = (managedList: ManagedList, listRenderer: ListRenderer): void => {
  const actionSelect: HTMLSelectElement = getElementById<HTMLSelectElement>("actions");
  actionSelect.addEventListener("change", async () => {

    new ItemEntryUpdater().update();
    await managedList.refresh();
    await listRenderer.render();
  });
}

const setupItemEntryListener = (managedList: ManagedList, listRenderer: ListRenderer): void => {
  const itemEntryForm: HTMLFormElement = getElementById<HTMLFormElement>("itemEntryForm");
  itemEntryForm.addEventListener("submit", async (event: SubmitEvent): Promise<void> => {
    event.preventDefault();
    handleFormSubmit(managedList, listRenderer);
  });
};

const handleFormSubmit = async (managedList: ManagedList, listRenderer: ListRenderer): Promise<void> => {
  const input: HTMLInputElement = getElementById<HTMLInputElement>("newItem");
  const newEntryText: string = input.value.trim();

  if (!newEntryText.length) return;

  const id: number | null = parseToInt(input.placeholder);
  if (id) {
    if(await managedList.updateItemText(id, newEntryText)) {
      input.value = "";
      new ItemEntryUpdater().update();  
    }
  } else {
    if (await managedList.addItem(newEntryText, false)) {
      input.value = "";
    }
  }
  await listRenderer.render();
};

document.addEventListener("DOMContentLoaded", initApp);