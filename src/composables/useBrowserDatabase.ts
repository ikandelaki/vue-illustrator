const DEFAULT_BROWSER_DATABASE = "browserDatabase";
const DEFAULT_VERSION = 2;

export class BrowserDatabase {
  private static instance: BrowserDatabase | null = null;
  private db: IDBDatabase | null = null;
  private ready: Promise<IDBDatabase>;

  private constructor({
    dbName = DEFAULT_BROWSER_DATABASE,
    version = DEFAULT_VERSION,
  }: {
    dbName?: string;
    version?: number;
  } = {}) {
    this.ready = this.init(dbName, version);
  }

  static getInstance(): BrowserDatabase {
    if (!BrowserDatabase.instance) {
      BrowserDatabase.instance = new BrowserDatabase();
    }
    return BrowserDatabase.instance;
  }

  private init(dbName: string, version: number): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(dbName, version);

      request.onerror = (event) => {
        console.error("BrowserDatabase request error:", event);
        reject(request.error);
      };

      request.onsuccess = (event: Event) => {
        this.db = (event.target as IDBOpenDBRequest).result;

        this.db.onerror = (event) => {
          console.error(
            `BrowserDatabase DB error: ${event.target?.error?.message}`,
          );
        };

        resolve(this.db);
      };

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains("shapes")) {
          db.createObjectStore("shapes", { keyPath: "id" });
        }
      };
    });
  }

  static async getAll(storeName: string) {
    const instance = BrowserDatabase.getInstance();
    const db = await instance.ready;

    const transaction = db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);

    return new Promise((resolve, reject) => {
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  static async get(storeName: string, key: string) {
    const instance = BrowserDatabase.getInstance();
    const db = await instance.ready;

    const transaction = db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);

    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  static async insert(storeName: string, value: any) {
    const instance = BrowserDatabase.getInstance();
    const db = await instance.ready;

    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(storeName, "readwrite");
      transaction.onerror = (event) => {
        console.error(`Transaction error for store: ${storeName}`, event);
        reject(transaction.error);
      };

      const objectStore = transaction.objectStore(storeName);
      const request = objectStore.add(value);
      request.onsuccess = () => resolve();
      request.onerror = () => {
        console.error(`Could not add object to store: ${storeName}`, value);
        reject(request.error);
      };
    });
  }
}
