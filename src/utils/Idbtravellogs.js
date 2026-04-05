// ─── Shared IndexedDB utility for failed travel log submissions ───────────────
// Used by both NewKMLog (write) and KMLog (read / delete)
//
// KEY DESIGN: We use out-of-line keys (no keyPath on the store).
// IDB auto-assigns an integer key on add(). getAllWithKeys() returns
// [{ key, value }] so the caller always has the actual IDB key for delete().

const IDB_NAME = 'km_logs_db';
const IDB_STORE = 'failed_logs';
const IDB_VERSION = 2; // bumped to force onupgradeneeded to recreate the store

const openDB = () =>
    new Promise((resolve, reject) => {
        const req = indexedDB.open(IDB_NAME, IDB_VERSION);

        req.onupgradeneeded = (e) => {
            const db = e.target.result;
            // Drop old store if it exists (version bump handles migration)
            if (db.objectStoreNames.contains(IDB_STORE)) {
                db.deleteObjectStore(IDB_STORE);
            }
            // Out-of-line keys: no keyPath, autoIncrement integer keys
            db.createObjectStore(IDB_STORE, { autoIncrement: true });
        };

        req.onsuccess = (e) => resolve(e.target.result);
        req.onerror = () => reject(req.error);
    });

/**
 * Save a failed payload to IDB.
 * @returns {Promise<number>} The IDB key assigned to the record.
 */
export const saveFailedLog = async (payload) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(IDB_STORE, 'readwrite');
        const store = tx.objectStore(IDB_STORE);
        const req = store.add({
            ...payload,
            savedAt: new Date().toISOString(),
        });
        req.onsuccess = () => resolve(req.result); // integer key
        req.onerror = () => reject(req.error);
    });
};

/**
 * Get all failed logs with their IDB keys.
 * @returns {Promise<Array<{ idbKey: number, data: object }>>}
 */
export const getAllFailedLogs = async () => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(IDB_STORE, 'readonly');
        const store = tx.objectStore(IDB_STORE);
        const results = [];
        const req = store.openCursor();

        req.onsuccess = (e) => {
            const cursor = e.target.result;
            if (cursor) {
                results.push({ idbKey: cursor.key, data: cursor.value });
                cursor.continue();
            } else {
                resolve(results);
            }
        };
        req.onerror = () => reject(req.error);
    });
};

/**
 * Delete a single failed log by its IDB key.
 * @param {number} idbKey
 */
export const removeFailedLog = async (idbKey) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(IDB_STORE, 'readwrite');
        const req = tx.objectStore(IDB_STORE).delete(idbKey);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
    });
};