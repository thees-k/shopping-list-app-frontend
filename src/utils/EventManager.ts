// EventManager.ts
export interface EventListenerInfo {
    element: HTMLElement;
    type: string;
    callback: EventListenerOrEventListenerObject;
}

class EventManager {

    private static instance: EventManager;

    private listenerMap: Map<number, EventListenerInfo>;
    private key: number;

    private constructor() {
        this.listenerMap = new Map();
        this.key = 0;
    }

    public static getInstance(): EventManager {
        if (!EventManager.instance) {
            EventManager.instance = new EventManager();
        }
        return EventManager.instance;
    }

    /**
     * Adds an event listener and returns a unique ID for reference.
     * @param element - The target element to add the event listener to.
     * @param type - The type of event (e.g., 'click', 'mouseover').
     * @param callback - The callback function to execute when the event is triggered.
     * @returns A unique ID for the added event listener.
     */
    addEventListener(element: HTMLElement, type: string, callback: EventListenerOrEventListenerObject): number {
        const key = this.key++;
        const info: EventListenerInfo = { element, type, callback };
        this.listenerMap.set(key, info);
        element.addEventListener(type, callback);
        return key;
    }

    /**
     * Removes an event listener by its unique ID.
     * @param key - The unique ID of the event listener to remove.
     */
    removeEventListenerById(key: number): void {
        const info = this.listenerMap.get(key);
        if (info) {
            const { element, type, callback } = info;
            element.removeEventListener(type, callback);
            this.listenerMap.delete(key);
        }
    }

    /**
     * Removes all event listeners associated with a specific element.
     * @param element - The target element to remove all event listeners from.
     */
    removeAllEventListenersForElement(element: HTMLElement): void {
        for (const [key, info] of this.listenerMap) {
            if (info.element === element) {
                element.removeEventListener(info.type, info.callback);
                this.listenerMap.delete(key);
            }
        }
    }

    /**
     * Retrieves an event listener by its unique ID.
     * @param key - The unique key of the event listener to retrieve.
     * @returns The EventListenerInfo object or undefined if not found.
     */
    getEventListenerById(key: number): EventListenerInfo | undefined {
        return this.listenerMap.get(key);
    }

    /**
     * Retrieves all event listeners for a specific element and event type.
     * @param element - The target element to retrieve event listeners from.
     * @param type - The type of event (e.g., 'click', 'mouseover').
     * @returns An array of EventListenerInfo objects or an empty array if none found.
     */
    getEventListenersByElementAndType(element: HTMLElement, type: string): EventListenerInfo[] {
        const listeners = [];
        for (const info of this.listenerMap.values()) {
            if (info.element === element && info.type === type) {
                listeners.push(info);
            }
        }
        return listeners;
    }

    /**
     * Removes all event listeners managed by the EventManager.
     */
    removeAllEventListeners(): void {
        for (const [_, info] of this.listenerMap) {
            const { element, type, callback } = info;
            element.removeEventListener(type, callback);
        }
        this.listenerMap.clear();
    }
}

export default EventManager;