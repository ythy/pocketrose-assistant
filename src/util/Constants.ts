class Constants {
  static POCKET_DOMAIN: string = "https://pocketrose.itsns.net.cn/pocketrose";

  static DATABASE_NAME: string = "pocketrose";

  static DATABASE_VERSION: number = 15;

  static MAX_TEAM_MEMBER_COUNT: number = 50;

  static MAX_NETWORK_FAILURE_RETRIES: number = 5;

  static ExcludeEventEntire = [
    "收益",
    "皇宫",
    "送物",
    "送宠物",
    "探险",
    "雅典娜",
    "任务",
    "个人天真",
    "天上掉馅饼",
    "宠物",
    "宠物图鉴",
    "加速孵化",
    "宝藏",
    "以旧换新",
  ];
  static ExcludeEventPart = ["祭奠", "十二神殿", "拯救", "上洞"];
  static MONSTER_DAMAGE_LEVEL = [0, 10000, 20000, 30000, 40000, 50000, 60000];

  static WIN_DECLARATIONS: string[] = [
    `<span style="color:indigo">%ROLE%</span><span style="color:black">的攻击！</span><br><span style="color:green">%HIT%</span><span style="color:black">回合！</span>%MONSTER%受到%DAMAGE%点伤害！`,
  ];
  static LOSE_DECLARATIONS: string[] = ["%MONSTER%你给我等着！"];
  static DRAW_DECLARATIONS: string[] = ["与%MONSTER%不分高下！"];
  static PET_UPGRADE_DECLARATIONS: string = "升级了耶！使劲吖!";
  static PET_LEARN_DECLARATIONS: string = "领悟了耶！加油吖!";

  static SPECIAL_MONSTER = [
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

  static GoodSpell1 = ["大爆炸", "自爆", "地震"];
  static GoodSpell2 = ["追击", "暴走", "激鳞"];
  static GoodSpell3 = ["见切", "电磁炮"];
  static GoodSpell4 = ["神秘的守护", "封印", "忍耐", "守护", "闪电", "喷火"];
}

export = Constants;
