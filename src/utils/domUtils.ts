// utils/domUtils.ts

/**
 * Utility function to get an element by its ID and cast it to a specific type.
 * Throws an error if the element is not found.
 * @param id - The ID of the DOM element.
 * @returns The DOM element cast to the specified type.
 */
export function getElementById<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Element with ID "${id}" not found.`);
  }
  return element as T;
}
