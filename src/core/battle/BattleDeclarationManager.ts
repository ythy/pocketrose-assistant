import _ from "lodash";
import RandomUtils from "../../util/RandomUtils";
import SetupLoader from "../config/SetupLoader";
import Constants from "../../util/Constants";

//ythy
class BattleDeclarationManager {
  static randomWinDeclaration(
    monster: string | null | undefined,
    role: any,
    round: string,
    monsterObj: any
  ) {
    const regExpMonster = /\(|\)/;
    let foe = monster ? monster : "对手(999)";
    //特别宠物提示开始
    const monsteSplit = foe.split(regExpMonster);
    let prefix = "";
    let suffix = "";
    if (SetupLoader.getSpecialMonster().includes(monsteSplit[1]))
      prefix = `发现<span style="color:red">${monsteSplit[0]}</span>！`;
    //提升掉率开始
    const ratioMulti = SetupLoader.getDropRatio();
    const ratioTu = Math.floor(1000 / ratioMulti);
    const ratio = Math.floor(
      50000 / Math.sqrt(monsterObj?.catchRatio ?? 1) / ratioMulti
    );
    if (Math.floor(Math.random() * ratioTu) == 0)
      suffix = `<br>${ratioMulti}倍出率,1/${ratioTu}！<span style="color:blue">${monster}图鉴</span>入手！`;
    if (Math.floor(Math.random() * ratio) == 0)
      suffix += `<br>${ratioMulti}倍出率,1/${ratio}！<span style="color:red">${monster}</span>入手！`;
    //整合返回值
    foe = "<span style='color:green'>" + foe + "</span>";
    let t = RandomUtils.randomElement(Constants.WIN_DECLARATIONS)!;
    t = _.replace(t, "%MONSTER%", foe);
    t = t.replace("%ROLE%", role);
    t = t.replace("%HIT%", round);
    //计算随机伤害开始
    const randomDamage = crypto.getRandomValues(new Uint16Array(1))[0];
    let damageIndex = 0;
    Constants.MONSTER_DAMAGE_LEVEL.forEach((v, i) => {
      if (randomDamage > v) damageIndex = i;
    });
    t = t.replace(
      "%DAMAGE%",
      `<span style='color:%COLOR%'>${randomDamage}</span>`
    );
    t = t.replace("%COLOR%", MONSTER_DAMAGE_COLOR[damageIndex]);
    //结束
    return "<span style='color:black'>" + prefix + t + suffix + "</span>";
  }

  static randomLoseDeclaration(monster: string | null | undefined) {
    let foe = monster ? monster : "对手";
    foe = "<span style='color:green'>" + foe + "</span>";
    let t = RandomUtils.randomElement(Constants.LOSE_DECLARATIONS)!;
    t = _.replace(t, "%MONSTER%", foe);
    return "<span style='color:indigo'>" + t + "</span>";
  }

  static randomDrawDeclaration(monster: string | null | undefined) {
    let foe = monster ? monster : "对手";
    foe = "<span style='color:green'>" + foe + "</span>";
    let t = RandomUtils.randomElement(Constants.DRAW_DECLARATIONS)!;
    t = _.replace(t, "%MONSTER%", foe);
    return "<span style='color:indigo'>" + t + "</span>";
  }
}

const MONSTER_DAMAGE_COLOR = [
  "olivedrab",
  "darkcyan",
  "mediumorchid",
  "darkgoldenrod",
  "palevioletred",
  "crimson",
  "maroon",
];

export = BattleDeclarationManager;
