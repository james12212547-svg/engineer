export const DB_NAME = 'EquipmentAppDB';
export const STORE_NAME = 'images';

export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
};

export const saveImage = async (id, base64Data) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(base64Data, id);
    
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(new Error('Transaction aborted'));
  });
};

export const loadImage = async (id) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getAllImages = async () => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    const keysRequest = store.getAllKeys();
    
    request.onsuccess = () => {
      keysRequest.onsuccess = () => {
        const images = {};
        keysRequest.result.forEach((key, index) => {
          images[key] = request.result[index];
        });
        resolve(images);
      };
      keysRequest.onerror = () => reject(keysRequest.error);
    };
    request.onerror = () => reject(request.error);
  });
};

export const saveMultipleImages = async (imagesObj) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    Object.keys(imagesObj).forEach(key => {
      store.put(imagesObj[key], key);
    });
    
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};
