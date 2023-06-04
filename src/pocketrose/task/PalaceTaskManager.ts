import _ from "lodash";
import PetLocationLoader from "../../core/PetLocationLoader";
import Pokemon from "../../core/Pokemon";
import Credential from "../../util/Credential";
import TaskStorageManager from "./TaskStorageManager";

class PalaceTaskManager {

    readonly #credential: Credential;

    constructor(credential: Credential) {
        this.#credential = credential;
    }

    async createMonsterTask(monsterName: string): Promise<void> {
        return await (() => {
            return new Promise<void>(resolve => {
                TaskStorageManager.getPalaceTaskStorage()
                    .updateMonsterTask(this.#credential.id, monsterName)
                    .then(() => resolve());
            });
        })();
    }

    async updateMonsterTask(monsterName: string): Promise<void> {
        return await (() => {
            return new Promise<void>(resolve => {
                TaskStorageManager.getPalaceTaskStorage()
                    .updateMonsterTask(this.#credential.id, monsterName, false)
                    .then(() => resolve());
            });
        })();
    }

    async completeMonsterTask(monsterName: string): Promise<void> {
        return await (() => {
            return new Promise<void>(resolve => {
                TaskStorageManager.getPalaceTaskStorage()
                    .updateMonsterTask(this.#credential.id, monsterName, true)
                    .then(() => resolve());
            });
        })();
    }


    async finishMonsterTask(): Promise<void> {
        return await (() => {
            return new Promise<void>(resolve => {
                TaskStorageManager.getPalaceTaskStorage()
                    .finishMonsterTask(this.#credential.id)
                    .then(() => resolve());
            });
        })();
    }

    async monsterTaskHtml(): Promise<string> {
        return await (() => {
            return new Promise<string>(resolve => {
                TaskStorageManager.getPalaceTaskStorage()
                    .load(this.#credential.id)
                    .then(task => {
                        if (task === null) {
                            resolve("");
                            return;
                        }
                        if (task.monster === undefined) {
                            resolve("");
                            return;
                        }

                        const ss = _.split(task.monster, "/");
                        const a = ss[0];
                        const b = ss[1];

                        const s1: string = Pokemon.pokemonWikiReplacement(a);
                        const s2: string = PetLocationLoader.getPetLocation(a)!;
                        const s3: string = b === "1" ? "<span style='color:blue'>已完成</span>" : "进行中";

                        const html = "杀怪任务：" + s1 + " (" + s2 + ") " + s3;
                        resolve(html);
                    });
            });
        })();
    }
}