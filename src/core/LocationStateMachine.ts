import StorageUtils from "../util/StorageUtils";
import LocationState from "./LocationState";
import StringUtils from "../util/StringUtils";

/**
 * Location state machine, local storage is required.
 */
class LocationStateMachine {

    readonly #storageKey: string;


    constructor(id: string) {
        this.#storageKey = "_lc_" + id;
    }

    static currentLocationStateMachine(): LocationStateMachine {
        const id = $("input:hidden[name='id']:last").val() as string;
        return new LocationStateMachine(id);
    }

    inTown() {
        const townId = $("input:hidden[name='townid']:last").val() as string;
        StorageUtils.set(this.#storageKey, "TOWN/" + townId);
    }

    inCastle() {
        const castleName = $("table:first")
            .find("tr:first")
            .next()
            .find("td:first")
            .find("table:first")
            .find("tr:eq(2)")
            .find("td:first")
            .find("table:first")
            .find("th:first")
            .text().trim();
        StorageUtils.set(this.#storageKey, "CASTLE/" + castleName);
    }

    inMap() {
        let s = $("td:contains('现在位置')")
            .filter(function () {
                return $(this).text().startsWith("\n      现在位置");
            })
            .text();
        s = StringUtils.substringBetween(s, "现在位置(", ")");
        StorageUtils.set(this.#storageKey, "WILD/" + s);
    }

    load(): LocationState {
        const location = StorageUtils.get(this.#storageKey);
        return new LocationState(location);
    }
}

export = LocationStateMachine;