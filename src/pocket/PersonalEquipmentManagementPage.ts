import Equipment from "../common/Equipment";
import Role from "../common/Role";
import Credential from "../util/Credential";
import EquipmentParser from "./EquipmentParser";

class PersonalEquipmentManagementPage {

    readonly credential: Credential;

    role?: Role;
    equipmentList?: Equipment[];

    constructor(credential: Credential) {
        this.credential = credential;
    }

    get equipmentCount() {
        if (this.equipmentList === undefined) {
            return 0;
        } else {
            return this.equipmentList.length;
        }
    }

    findTreasureBag(): Equipment | null {
        return EquipmentParser.findTreasureBag(this.equipmentList);
    }
}

export = PersonalEquipmentManagementPage;