import _ from "lodash";
import RandomUtils from "../../util/RandomUtils";
import SetupLoader from "../config/SetupLoader";

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
    if (SPECIAL_MONSTER.includes(monsteSplit[1]))
      prefix = `发现<span style="color:red">${monsteSplit[0]}</span>！`;
    //提升掉率开始
    const ratioMulti = SetupLoader.getDropRatio();
    const ratioTu = Math.floor(500 / ratioMulti);
    const ratio = Math.floor(
      100000 / (monsterObj?.catchRatio ?? 1) / ratioMulti
    );
    if (Math.floor(Math.random() * ratioTu) == 0)
      suffix = `<br>${ratioMulti}倍出率,1/${ratioTu}！<span style="color:blue">${monster}图鉴</span>入手！`;
    if (Math.floor(Math.random() * ratio) == 0)
      suffix += `<br>${ratioMulti}倍出率,1/${ratio}！<span style="color:red">${monster}</span>入手！`;
    //整合返回值
    foe = "<span style='color:green'>" + foe + "</span>";
    let t = RandomUtils.randomElement(WIN_DECLARATIONS)!;
    t = _.replace(t, "%MONSTER%", foe);
    t = t.replace("%ROLE%", role);
    t = t.replace("%HIT%", round);
    //计算随机伤害开始
    const randomDamage = crypto.getRandomValues(new Uint16Array(1))[0];
    let damageIndex = 0;
    MONSTER_DAMAGE_LEVEL.forEach((v, i) => {
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
    let t = RandomUtils.randomElement(LOSE_DECLARATIONS)!;
    t = _.replace(t, "%MONSTER%", foe);
    return "<span style='color:indigo'>" + t + "</span>";
  }

  static randomDrawDeclaration(monster: string | null | undefined) {
    let foe = monster ? monster : "对手";
    foe = "<span style='color:green'>" + foe + "</span>";
    let t = RandomUtils.randomElement(DRAW_DECLARATIONS)!;
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
const MONSTER_DAMAGE_LEVEL = [0, 10000, 20000, 30000, 40000, 50000, 60000];

const WIN_DECLARATIONS: string[] = [
  `<span style="color:indigo">%ROLE%</span><span style="color:black">的攻击！</span><br><span style="color:green">%HIT%</span><span style="color:black">回合！</span>%MONSTER%受到%DAMAGE%点伤害！`,
];
const LOSE_DECLARATIONS: string[] = ["%MONSTER%你给我等着！"];
const DRAW_DECLARATIONS: string[] = ["与%MONSTER%不分高下！"];

const SPECIAL_MONSTER = [
  "018",
  "093",
  "094",
  "100",
  "101",
  "109",
  "110",
  "169",
  "189",
  "251",
  "254",
  "289",
  "330",
  "492",
  "248",
  "323",
  "208",
];

export = BattleDeclarationManager;
