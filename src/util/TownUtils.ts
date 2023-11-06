import TownDashboardPage from "../core/dashboard/TownDashboardPage";

class TownUtils {
  static loadTownStyle(page: TownDashboardPage, eventpanel: any): any {
    //处理不显示的事件
    const mine = page.role?.name ?? "如水衔冰";
    const reg = new RegExp(
      ExcludeEventEntire.map((m) => `\\[${m}\\]`).join("|") +
        "|" +
        ExcludeEventPart.map((m) => `\\[${m}`).join("|")
    );
    const evntText = page
      .eventBoardHtml!.split("<br>")
      .filter((it) => it.endsWith(")"))
      .filter((it) => it.indexOf(mine) > -1 || !reg.test(it))
      .join("<br>");

    //增大显示事件文字
    eventpanel.find("form").css("margin", "auto");
    eventpanel.attr("height", "0pt");
    eventpanel.find("td").each((_: any, td: any) => {
      $(td).css("font-size", 19);
    });
    //增大更新按钮及相关行文字，倒计时
    let update = $("input[value='更新']")
      .css("font-size", 20)
      .parent()
      .css("margin", "5px auto")
      .parent();
    update.prev().css("font-size", 20).find("form").css("margin", "5px auto");
    update.prev().find("input")?.css("width", 60)?.css("height", 32);

    return evntText;
  }

  static setOptionInTown() {
    $("option[value='MAKE_TOWN']").prop("selected", true);
    $("option[value='LETTER']").prop("selected", true);
    let ss = false;
    $("select[name='level']")
      .find("option")
      .each((_, option) => {
        if ($(option).text() === "秘宝之岛") ss = true;
      });
    if (!ss) {
      $("select[name='level']")
        .find("option:contains('--')")
        .prop("selected", true);
    }
  }
}

const ExcludeEventEntire = [
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
];
const ExcludeEventPart = ["祭奠", "十二神殿", "拯救", "上洞"];

export = TownUtils;
