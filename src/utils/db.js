export const DB_NAME = 'EquipmentAppDB';
export const STORE_NAME = 'images';
export const CUSTOM_EQ_STORE = 'custom_equipment';
export const LAB_EXPERIMENTS_STORE = 'lab_experiments';

export const initDB = () => {
  return new Promise((resolve, reject) => {
    // Increased version to 3 to support lab_experiments store
    const request = indexedDB.open(DB_NAME, 3);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
      if (!db.objectStoreNames.contains(CUSTOM_EQ_STORE)) {
        db.createObjectStore(CUSTOM_EQ_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(LAB_EXPERIMENTS_STORE)) {
        db.createObjectStore(LAB_EXPERIMENTS_STORE, { keyPath: 'id' });
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

// --- Custom Equipment ---

export const saveCustomEquipmentDB = async (equipment) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CUSTOM_EQ_STORE, 'readwrite');
    const store = tx.objectStore(CUSTOM_EQ_STORE);
    store.put(equipment);
    
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

export const deleteCustomEquipmentDB = async (id) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CUSTOM_EQ_STORE, 'readwrite');
    const store = tx.objectStore(CUSTOM_EQ_STORE);
    store.delete(id);
    
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

export const getAllCustomEquipmentDB = async () => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CUSTOM_EQ_STORE, 'readonly');
    const store = tx.objectStore(CUSTOM_EQ_STORE);
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
};

// --- Lab Experiments ---

export const saveLabExperimentDB = async (experiment) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(LAB_EXPERIMENTS_STORE, 'readwrite');
    const store = tx.objectStore(LAB_EXPERIMENTS_STORE);
    store.put(experiment);
    
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

export const deleteLabExperimentDB = async (id) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(LAB_EXPERIMENTS_STORE, 'readwrite');
    const store = tx.objectStore(LAB_EXPERIMENTS_STORE);
    store.delete(id);
    
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

export const getAllLabExperimentsDB = async () => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(LAB_EXPERIMENTS_STORE, 'readonly');
    const store = tx.objectStore(LAB_EXPERIMENTS_STORE);
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
};
