class StorageUtils {

    static set(key: string, value: string) {
        localStorage.setItem(key, value);
    }

    static get(key: string): string | null {
        return localStorage.getItem(key);
    }

    static remove(key: string) {
        localStorage.removeItem(key);
    }

    static purge() {
        localStorage.clear();
    }

    static getString(key: string) {
        const value = StorageUtils.get(key);
        if (value === undefined ||
            value === null ||
            value === "undefined" ||
            value === "null") {
            return "";
        }
        return value;
    }

    static getBoolean(key: string): boolean {
        const value = StorageUtils.getString(key);
        if (value === "") {
            return false;
        }
        return value !== "0";
    }

    static getInt(key: string, defaultValue: number): number {
        const value = StorageUtils.getString(key);
        if (value === "") {
            return defaultValue;
        }
        return parseInt(value);
    }

    static getFloat(key: string, defaultValue: number): number {
        const value = StorageUtils.getString(key);
        if (value === "") {
            return defaultValue;
        }
        return parseFloat(value);
    }

    static dumpLocalStorage() {
        const s = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key === null || key.startsWith("_lc_")) {
                continue;
            }
            const value = localStorage.getItem(key);
            if (value === null) {
                continue;
            }
            // @ts-ignore
            s[key] = value;
        }
        return JSON.stringify(s);
    }
}

export = StorageUtils;