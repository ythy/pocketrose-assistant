import StorageUtils from "../../util/StorageUtils";
import Constants from "../../util/Constants";
//ythy
class SetupLoader {
  static isPokemonWikiEnabled(): boolean {
    return StorageUtils.getBoolean("_pa_001");
  }

  static getLodgeHealthLostRatio(): number {
    return StorageUtils.getFloat("_pa_002", 0.6);
  }

  static getLodgeManaLostPoint(): number {
    return StorageUtils.getInt("_pa_003", 100);
  }

  static getRepairMinLimitation(): number {
    return StorageUtils.getInt("_pa_004", 100);
  }

  static getDepositBattleCount(): number {
    return StorageUtils.getInt("_pa_005", 10);
  }

  static isCareerTransferEntranceDisabled(id: string): boolean {
    return StorageUtils.getBoolean("_pa_014_" + id);
  }

  static loadEquipmentSet_A(id: string) {
    const s = StorageUtils.getString("_pa_019_" + id);
    if (s === "") {
      const value = {};
      // @ts-ignore
      value["weaponName"] = "NONE";
      // @ts-ignore
      value["armorName"] = "NONE";
      // @ts-ignore
      value["accessoryName"] = "NONE";
      return value;
    } else {
      return JSON.parse(s);
    }
  }

  static loadEquipmentSet_B(id: string) {
    const s = StorageUtils.getString("_pa_020_" + id);
    if (s === "") {
      const value = {};
      // @ts-ignore
      value["weaponName"] = "NONE";
      // @ts-ignore
      value["armorName"] = "NONE";
      // @ts-ignore
      value["accessoryName"] = "NONE";
      return value;
    } else {
      return JSON.parse(s);
    }
  }

  static loadEquipmentSet_C(id: string) {
    const s = StorageUtils.getString("_pa_021_" + id);
    if (s === "") {
      const value = {};
      // @ts-ignore
      value["weaponName"] = "NONE";
      // @ts-ignore
      value["armorName"] = "NONE";
      // @ts-ignore
      value["accessoryName"] = "NONE";
      return value;
    } else {
      return JSON.parse(s);
    }
  }

  static loadEquipmentSet_D(id: string) {
    const s = StorageUtils.getString("_pa_022_" + id);
    if (s === "") {
      const value = {};
      // @ts-ignore
      value["weaponName"] = "NONE";
      // @ts-ignore
      value["armorName"] = "NONE";
      // @ts-ignore
      value["accessoryName"] = "NONE";
      return value;
    } else {
      return JSON.parse(s);
    }
  }

  static loadEquipmentSet_E(id: string) {
    const s = StorageUtils.getString("_pa_023_" + id);
    if (s === "") {
      const value = {};
      // @ts-ignore
      value["weaponName"] = "NONE";
      // @ts-ignore
      value["armorName"] = "NONE";
      // @ts-ignore
      value["accessoryName"] = "NONE";
      return value;
    } else {
      return JSON.parse(s);
    }
  }

  static getBattleHarvestPrompt() {
    const s = StorageUtils.getString("_pa_024");
    if (s === "") {
      const value = {};
      // @ts-ignore
      value["person"] = "NONE";
      // @ts-ignore
      value["text"] = "";
      return value;
    } else {
      return JSON.parse(s);
    }
  }

  static getNormalBattlePrompt() {
    const s = StorageUtils.getString("_pa_025");
    if (s === "") {
      const value = {};
      // @ts-ignore
      value["person"] = "NONE";
      // @ts-ignore
      value["text"] = "";
      return value;
    } else {
      return JSON.parse(s);
    }
  }

  static isExperienceProgressBarEnabled(): boolean {
    return StorageUtils.getBoolean("_pa_026");
  }

  static isHiddenLeaveAndExitEnabled(): boolean {
    return StorageUtils.getBoolean("_pa_028");
  }

  static isCollectTownTaxDisabled(): boolean {
    return StorageUtils.getBoolean("_pa_030");
  }

  static isAsciiTextButtonEnabled(): boolean {
    return StorageUtils.getBoolean("_pa_035");
  }

  static getEnlargeBattleRatio(): number {
    return StorageUtils.getFloat("_pa_036", -1);
  }

  static isConsecrateStateRecognizeEnabled(id: string): boolean {
    return StorageUtils.getBoolean("_pa_037_" + id);
  }

  static isEquipmentPetSortEnabled(): boolean {
    return StorageUtils.getBoolean("_pa_038");
  }

  static getTownDashboardShortcutButton(): number {
    return StorageUtils.getInt("_pa_041", -1);
  }

  static getTownDashboardMainButton(): number {
    return StorageUtils.getInt("_pa_054", 0);
  }

  static getTownDashboardExtensionShortcutButton(): number {
    return StorageUtils.getInt("_pa_050", 1);
  }

  static getLoginPageLayout(): number {
    return StorageUtils.getInt("_pa_042", 0);
  }

  static isHideCountryInformationEnabled() {
    return StorageUtils.getBoolean("_pa_043");
  }

  static isOnlyConsecrateInitialPetEnabled() {
    return StorageUtils.getBoolean("_pa_044");
  }

  static isQiHanTitleEnabled(): boolean {
    return StorageUtils.getBoolean("_pa_048");
  }

  static getDropRatio() {
    let result = StorageUtils.getInt("_pa_061", 1);
    return result == 0 ? 1 : result;
  }

  static getEventExcludes() {
    const s = StorageUtils.getString("_pa_062");
    if (!s) {
      const value = {
        whole: Constants.ExcludeEventEntire,
        part: Constants.ExcludeEventPart,
      };
      return value;
    } else {
      return JSON.parse(s);
    }
  }

  static getSpecialMonster() {
    const s = StorageUtils.getString("_pa_063");
    if (!s) {
      return Constants.SPECIAL_MONSTER;
    } else {
      return s.split(",");
    }
  }

  static getGoodSpell() {
    const s = StorageUtils.getString("_pa_064");
    if (!s) {
      const value = {
        gold: Constants.GoodSpell1,
        silver: Constants.GoodSpell2,
        copper: Constants.GoodSpell3,
        iron: Constants.GoodSpell4,
      };
      return value;
    } else {
      return JSON.parse(s);
    }
  }

  static getPetDeclarations() {
    const s = StorageUtils.getString("_pa_065");
    if (!s) {
      const value = {
        upgrade: Constants.PET_UPGRADE_DECLARATIONS,
        learn: Constants.PET_LEARN_DECLARATIONS,
      };
      return value;
    } else {
      return JSON.parse(s);
    }
  }
}

export = SetupLoader;
