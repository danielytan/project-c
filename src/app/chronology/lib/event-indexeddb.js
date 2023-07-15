const OBJECT_STORE_NAME = 'local-notes';

let db;

export const openDB = () => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
    } else {
      const request = indexedDB.open('project-c', 1);

      request.onupgradeneeded = (event) => {
        db = event.target.result;
        //db.createObjectStore('requests', { keyPath: 'id', autoIncrement: true });
        try {
          db.deleteObjectStore(OBJECT_STORE_NAME);
        } catch {
        }
        db.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'localId' });
      };

      request.onsuccess = (event) => {
        db = event.target.result;
        resolve(db);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    }
  });
};

export const storeOfflineEvent = async (note) => {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(OBJECT_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(OBJECT_STORE_NAME);

    const request = store.add(note);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

export const deleteOfflineEvent = async (localId) => {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(OBJECT_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(OBJECT_STORE_NAME);

    const request = store.delete(localId);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

export const editOfflineEvent = async (updatedNote) => {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(OBJECT_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(OBJECT_STORE_NAME);

    const request = store.put(updatedNote);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

export const getOfflineEvent = async (localId) => {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(OBJECT_STORE_NAME, 'readonly');
    const store = transaction.objectStore(OBJECT_STORE_NAME);

    const request = store.get(localId);

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

export const getOfflineEvents = async () => {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(OBJECT_STORE_NAME, 'readonly');
    const store = transaction.objectStore(OBJECT_STORE_NAME);

    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}