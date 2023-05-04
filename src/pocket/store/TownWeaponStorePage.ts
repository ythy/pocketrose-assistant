import Credential from "../../util/Credential";
import Equipment from "../Equipment";
import Merchandise from "../../common/Merchandise";

/**
 * 城市武器屋页面数据结构的描述
 */
class TownWeaponStorePage {

    credential?: Credential;
    townId?: string;
    personalEquipmentList?: Equipment[];
    weaponMerchandiseList?: Merchandise[];
    discount?: number;

}

export = TownWeaponStorePage;
