import PocketDatabase from "../../util/PocketDatabase";
import StringUtils from "../../util/StringUtils";
import BankRecord from "./BankRecord";

class BankRecordStorage {

    async loads(): Promise<BankRecord[]> {
        const db = await PocketDatabase.connectDatabase();
        return new Promise<BankRecord[]>((resolve, reject) => {
            const request = db
                .transaction(["BankRecord"], "readonly")
                .objectStore("BankRecord")
                .getAll();
            request.onerror = reject;
            request.onsuccess = () => {
                const dataList: BankRecord[] = [];
                if (request.result && request.result.length > 0) {
                    request.result.forEach(it => {
                        const data = new BankRecord();
                        data.id = it.result.id;
                        data.roleId = it.result.roleId;
                        data.createTime = it.result.createTime;
                        data.updateTime = it.result.updateTime;
                        data.recordDate = it.result.recordDate;
                        data.cash = it.result.cash;
                        data.saving = it.result.saving;
                        data.revision = it.result.revision;
                        dataList.push(data);
                    });
                }
                resolve(dataList);
            };
        });
    }

    async load(roleId: string): Promise<BankRecord | null> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<BankRecord | null>((resolve, reject) => {
                const store = db
                    .transaction(["BankRecord"], "readonly")
                    .objectStore("BankRecord");
                const indexRequest = store.index("roleId")
                    .getAllKeys(roleId);
                indexRequest.onerror = reject;
                indexRequest.onsuccess = () => {
                    if (!indexRequest.result || indexRequest.result.length === 0) {
                        resolve(null);
                    } else {
                        const recordDate = indexRequest.result
                            .map(it => it.toString())
                            .map(it => StringUtils.substringAfter(it, "/"))
                            .sort()
                            .reverse()[0];
                        const id = roleId + "/" + recordDate;
                        const dataRequest = store.get(id);
                        dataRequest.onerror = reject;
                        dataRequest.onsuccess = () => {
                            if (!dataRequest.result) {
                                resolve(null);
                            } else {
                                const data = new BankRecord();
                                data.id = dataRequest.result.id;
                                data.roleId = dataRequest.result.roleId;
                                data.createTime = dataRequest.result.createTime;
                                data.updateTime = dataRequest.result.updateTime;
                                data.recordDate = dataRequest.result.recordDate;
                                data.cash = dataRequest.result.cash;
                                data.saving = dataRequest.result.saving;
                                data.revision = dataRequest.result.revision;
                                resolve(data);
                            }
                        };
                    }
                };
            });
        })();
    }

    async find(roleId: string): Promise<BankRecord[]> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<BankRecord[]>((resolve, reject) => {
                const store = db
                    .transaction(["BankRecord"], "readonly")
                    .objectStore("BankRecord");
                const request = store.index("roleId")
                    .getAll(roleId);
                request.onerror = reject;
                request.onsuccess = () => {
                    const dataList: BankRecord[] = [];
                    if (request.result && request.result.length > 0) {
                        request.result.forEach(it => {
                            const data = new BankRecord();
                            data.id = it.result.id;
                            data.roleId = it.result.roleId;
                            data.createTime = it.result.createTime;
                            data.updateTime = it.result.updateTime;
                            data.recordDate = it.result.recordDate;
                            data.cash = it.result.cash;
                            data.saving = it.result.saving;
                            data.revision = it.result.revision;
                            dataList.push(data);
                        });
                    }
                    resolve(dataList);
                };
            });
        })();
    }

    async upsert(data: BankRecord): Promise<void> {
        const db = await PocketDatabase.connectDatabase();
        return await (() => {
            return new Promise<void>((resolve, reject) => {
                const id = data.roleId + "/" + data.recordDate;
                const store = db
                    .transaction(["BankRecord"], "readwrite")
                    .objectStore("BankRecord");

                const readRequest = store.get(id);
                readRequest.onerror = reject;
                readRequest.onsuccess = () => {
                    if (readRequest.result) {
                        const document = readRequest.result;
                        document.updateTime = Date.now();
                        // Increment revision
                        let revision = document.revision;
                        revision = revision === undefined ? 1 : revision;
                        revision++;
                        document.revision = revision;
                        if (data.cash !== undefined) {
                            document.cash = data.cash;
                        }
                        if (data.saving !== undefined) {
                            document.saving = data.saving;
                        }
                        const writeRequest = store.put(document);
                        writeRequest.onerror = reject;
                        writeRequest.onsuccess = () => resolve();
                    } else {
                        const current = Date.now();
                        const document = data.asDocument();
                        // @ts-ignore
                        document.id = id;
                        // @ts-ignore
                        document.createTime = current;
                        // @ts-ignore
                        document.updateTime = current;
                        // @ts-ignore
                        document.revision = 1;
                        const writeRequest = store.add(document);
                        writeRequest.onerror = reject;
                        writeRequest.onsuccess = () => resolve();
                    }
                };
            });
        })();
    }

}

export = BankRecordStorage;