import _ from "lodash";
import StringUtils from "../../util/StringUtils";
import StorageUtils from "../../util/StorageUtils";
import BattleDeclarationManager from "./BattleDeclarationManager";
import BattlePage from "./BattlePage";
import MonsterProfileLoader from "../monster/MonsterProfileLoader";
import Credential from "../../util/Credential";
import SetupLoader from "../config/SetupLoader";

//ythy
class BattlePageParser {
  static async parse(
    html: string,
    credential: Credential
  ): Promise<BattlePage> {
    const zoom = StorageUtils.getInt("_pa_053_" + credential.id, 0) == 9;
    const page = new BattlePage();

    let table = $(html)
      .find("img:first")
      .closest("table")
      .parent()
      .closest("table")
      .parent()
      .closest("table");
    let div = table.prev();

    table
      .find("> tbody:first")
      .find("> tr:eq(3)")
      .find("> td:first")
      .find("> table:first")
      .find("> tbody:first")
      .find("> tr:first")
      .find("> td:first")
      .find("> table:first")
      .find("> tbody:first")
      .find("> tr:eq(2)")
      .find("> td:first")
      .next()
      .html((idx, html) => {
        page.roleNameHtml = html;
        return html;
      })
      .prev()
      .html((idx, html) => {
        const ids = Array.from(credential.id)
          .reverse()
          .map(
            (m) =>
              "_" +
              Array.from(m.charCodeAt(0) + "")
                .reverse()
                .join("")
          )
          .join("");
        page.roleImageHtml = $("<td>" + html + "</td>")
          .find("> img:first")
          .attr("title", page.roleNameHtml!)
          .attr(
            "onclick",
            `javascript:window.open("https://pocketrose.itsns.net.cn/pocketrose/cgi/status_print2.cgi?id=${ids}")`
          )
          .attr("width", zoom ? 96 : 64)
          .attr("height", zoom ? 96 : 64)
          .parent()
          .html();
        return html;
      });

    table
      .find("> tbody:first")
      .find("> tr:eq(4)")
      .find("> td:first")
      .find("> table:first")
      .find("> tbody:first")
      .find("> tr:first")
      .find("> td:first")
      .find("> table:first")
      .find("> tbody:first")
      .find("> tr:eq(2)")
      .find("> td:first")
      .html((idx, html) => {
        page.monsterNameHtml = html;
        page.monsterProfile = MonsterProfileLoader.load(
          html.replace(/.+\((\d+)\)/i, "$1")
        );
        return html;
      })
      .parent()
      .find("> td:last")
      .html((idx, html) => {
        const monsterProfile = page.monsterProfile;
        const spellSettings = SetupLoader.getGoodSpell();
        const s1 = spellSettings.gold;
        const s2 = spellSettings.silver;
        const s3 = spellSettings.copper;
        const s4 = spellSettings.iron;

        let spells = "";
        if (monsterProfile?.spellText?.trim()) {
          spells = monsterProfile.spellText
            .split(" ")
            .map((v: string) => {
              if (s1.includes(v))
                return `<span style="color:red;font-weight:600">${v}</span>`;
              else if (s2.includes(v))
                return `<span style="color:purple;font-weight:550">${v}</span>`;
              else if (s3.includes(v))
                return `<span style="color:blue;font-weight:500">${v}</span>`;
              else if (s4.includes(v))
                return `<span style="color:green;font-weight:450">${v}</span>`;
              else return v;
            })
            .join(" ");
        }

        page.monsterImageHtml = (
          spells
            ? $(`<td style="display: flex;">
                  ${html}
                   <div style="display:flex;font-size:${
                     zoom ? 20 : 16
                   }px;margin-left:2px" >
                      <div style="border: 1px black solid; width: 40px;line-height:1.5; ">${
                        monsterProfile["catchRatio"]
                      }</div>
                      <div style="border: 1px black solid; border-left-width: 0; width: 50px;line-height:1.5;background-color:c8f4dd ">${
                        monsterProfile["perfectHealth"]
                      }</div>
                      <div style="border: 1px black solid; border-left-width: 0; width: 40px;line-height:1.5; ">${
                        monsterProfile["perfectAttack"]
                      }</div>
                      <div style="border: 1px black solid; border-left-width: 0; width: 40px;line-height:1.5; ">${
                        monsterProfile["perfectDefense"]
                      }</div>
                      <div style="border: 1px black solid; border-left-width: 0; width: 40px;line-height:1.5;background-color:#c8f4dd">${
                        monsterProfile["perfectSpecialAttack"]
                      }</div>
                      <div style="border: 1px black solid; border-left-width: 0; width: 40px;line-height:1.5;">${
                        monsterProfile["perfectSpecialDefense"]
                      }</div>
                      <div style="border: 1px black solid; border-left-width: 0; width: 40px;line-height:1.5;background-color:#c8f4dd">${
                        monsterProfile["perfectSpeed"]
                      }</div>
                  
                      <div style="border: 1px black solid; border-left-width: 0; width:40px;">命${
                        monsterProfile["healthEffort"]
                      }</div>
                      <div style="border: 1px black solid; border-left-width: 0; width:40px;">攻${
                        monsterProfile["attackEffort"]
                      }</div>
                      <div style="border: 1px black solid; border-left-width: 0; width:40px;">防${
                        monsterProfile["defenseEffort"]
                      }</div>
                      <div style="border: 1px black solid; border-left-width: 0; width:40px;background-color:#c8f4dd">智${
                        monsterProfile["specialAttackEffort"]
                      }</div>
                      <div style="border: 1px black solid; border-left-width: 0; width:40px;">精${
                        monsterProfile["specialDefenseEffort"]
                      }</div>
                      <div style="border: 1px black solid; border-left-width: 0; width:40px;background-color:#c8f4dd">速${
                        monsterProfile["speedEffort"]
                      }</div>
                      <div style="border: 1px black solid; border-left-width: 0; width:40px;line-height:1.5">${
                        monsterProfile.growExperience
                      }</div>
                  </div>
                  <div onclick="javascript:$('#phyform').submit()" style="border:1px black solid;border-top-width:0; width:572px;font-size:${
                    zoom ? 20 : 16
                  }px;text-align:left;margin-left:2px;padding:0px 5px;">${spells}
                     <form id="phyform" action="town.cgi" style="display:inline-block;">
                       <input type="hidden" name="id" value="${
                         credential.id
                       }" />
                       <input type="hidden" name="pass" value="${
                         credential.pass
                       }" />
                       <input type="hidden" name="select" value="${
                         monsterProfile.code
                       }" />
                       <input type="hidden" name="pmid" value="${
                         monsterProfile.code
                       }" />
                       <input type="hidden" name="mode" value="PETFUTURE" />
  
                     </form>
                  </div>
                  </td>`)
            : $("<td>" + html + "</td>")
        )
          .find("> img:first")
          .attr("title", page.monsterNameHtml!)
          .attr("alt", page.monsterNameHtml!)
          .attr("width", zoom ? 128 : 64)
          .attr("height", zoom ? 128 : 64)
          .parent()
          .html();
        return html;
      });

    table
      .find("> tbody:first")
      .find("> tr:first")
      .find("> td:first")
      .find("> font:first")
      .find("> b:first")
      .each((idx, b) => {
        let battleField = $(b).text();
        page.treasureBattle = battleField.includes("秘宝之岛");
        page.primaryBattle = battleField.includes("初级之森");
        page.juniorBattle = battleField.includes("中级之塔");
        page.seniorBattle = battleField.includes("上级之洞窟");
        page.zodiacBattle = battleField.includes("十二神殿");
      });

    let petName = "";
    const endureList: number[] = [];
    for (const s of _.split(div.text(), "\n")) {
      if (_.endsWith(s, "耐久度")) {
        if (
          !s.includes("大师球") &&
          !s.includes("宗师球") &&
          !s.includes("超力怪兽球") &&
          !s.includes("宠物蛋")
        ) {
          let t = StringUtils.substringBetween(s, "剩余", "耐久度");
          let n = parseInt(t);
          endureList.push(n);
        }
      }
      if (_.endsWith(s, "回)")) {
        let t = StringUtils.substringBetween(s, "(剩余", "回)");
        let n = parseInt(t);
        endureList.push(n);
      }
      if (s.includes(" 获得 ") && s.includes(" 经验值.")) {
        // 这一行是宠物获得经验值的那一行
        // 记录下宠物名
        petName = StringUtils.substringBefore(s, " 获得 ");
      }
      if (petName !== "") {
        const searchString = petName + "等级上升！";
        if (s.includes(searchString)) {
          page.petUpgrade = true;
        }
      }
    }
    if (endureList.length > 0) {
      page.lowestEndure = _.min(endureList);
    }

    let battleTable = table
      .find("> tbody:first")
      .find("> tr:eq(5)")
      .find("> td:first")
      .find("> table:first");

    const imgSrcList: string[] = [];
    battleTable
      .find("> tbody:first")
      .find("> tr:first")
      .find("> td:first")
      .find("> center:first")
      .find("> h1:eq(1)")
      .find("> font:first")
      .find("> b:first")
      .find("> p:first")
      .find("> table:first")
      .find("> tbody:first")
      .find("> tr")
      .filter((idx) => idx > 1)
      .find("img")
      .each((idx, img) => {
        const src = $(img).attr("src")!;
        imgSrcList.push(src);
      });
    if (imgSrcList.length === 3) {
      // 在战斗的第一个回合的表格中找到3张图片，说明有宠物
      const roleImageSrc = $(page.roleImageHtml!).attr("src")!;
      const monsterImageSrc = $(page.monsterImageHtml!).attr("src")!;
      let petImageSrc = "";
      for (const imgSrc of imgSrcList) {
        // 过滤掉角色图片和怪物图片剩下的就是宠物图片
        if (imgSrc === roleImageSrc || imgSrc === monsterImageSrc) {
          continue;
        }
        petImageSrc = imgSrc;
      }
      if (petImageSrc === "") {
        // 没有找到？那说明宠物图片和怪物图片是一个
        petImageSrc = monsterImageSrc;
      }
      page.petImageHtml = `<img src="${petImageSrc}" alt='' width='${
        zoom ? 128 : 64
      }' height='${zoom ? 128 : 64}'>`;
    }

    battleTable
      .find("> tbody:first")
      .find("> tr:first")
      .find("> td:first")
      .find("> center:first")
      .find("> h1:eq(1)")
      .find("> font:first")
      .find("> b:first")
      .find("> p:first")
      .find("> table:eq(1)")
      .find("> tbody:first")
      .find("> tr:first")
      .find("> td:first")
      .find("> table:first")
      .find("> tbody:first")
      .find("> tr:eq(4)")
      .each((idx, tr) => {
        page.petNameHtml = $(tr).find("> td:first").html();
      });

    battleTable
      .find("td:contains('＜怪物＞')")
      .filter((idx, td) => $(td).text() === "＜怪物＞")
      .each((idx, td) => {
        let monsterTable = $(td).closest("table");
        let roleTable = monsterTable.parent().prev().find("table:first");

        roleTable
          .find("tr:first")
          .next()
          .next()
          .find("td:eq(1)")
          .each((i, td) => {
            let s = StringUtils.substringBefore($(td).text(), " / ");
            page.roleHealth = _.parseInt(s);
            s = StringUtils.substringAfter($(td).text(), " / ");
            page.roleMaxHealth = _.parseInt(s);
          })
          .next()
          .each((i, td) => {
            let s = StringUtils.substringBefore($(td).text(), " / ");
            page.roleMana = _.parseInt(s);
            s = StringUtils.substringAfter($(td).text(), " / ");
            page.roleMaxMana = _.parseInt(s);
          });

        monsterTable
          .find("tr:first")
          .next()
          .next()
          .find("td:eq(1)")
          .each((i, td) => {
            let s = StringUtils.substringBefore($(td).text(), " / ");
            page.monsterHealth = _.parseInt(s);
            s = StringUtils.substringAfter($(td).text(), " / ");
            page.monsterMaxHealth = _.parseInt(s);
          });
      });

    if (page.roleHealth! === 0) {
      page.battleResult = "战败";
    } else if (page.monsterHealth! === 0) {
      page.battleResult = "战胜";
    } else {
      page.battleResult = "平手";
    }

    page.harvestList = [];
    battleTable
      .find("p")
      .filter((idx, p) => $(p).text().includes("入手！"))
      .each((idx, p) => {
        _.split($(p).html(), "<br>").forEach((it) => {
          if (it.endsWith("入手！")) {
            page.harvestList!.push(it);
          }
        });
      });

    page.eggBorn = html.includes("孵化成功");
    page.monsterTask = html.includes("完成杀怪任务");
    page.petLearnSpell =
      html.includes("遗忘了技能") || html.includes("学会了新技能");

    generateBattleReport(battleTable, page, zoom);

    $(page.reportHtml!)
      .find("font[color='orange']")
      .each((idx, font) => {
        let t = $(font).text();
        if (!page.additionalRP && _.startsWith(t, "RP上升1点")) {
          t = StringUtils.substringAfter(t, "RP上升1点，达到了");
          t = StringUtils.substringBefore(t, "点");
          page.additionalRP = _.parseInt(t);
        }
      });

    return await (() => {
      return new Promise<BattlePage>((resolve) => resolve(page));
    })();
  }
}

function generateBattleReport(
  battleTable: JQuery,
  page: BattlePage,
  zoom: boolean
) {
  const zoomSize = zoom ? 5 : 3;
  const zoomPercent = zoom ? 180 : 120;
  let lastTurnIndex = 0; // 最后一个回合p元素对应的下标
  battleTable
    .find("> tbody:first")
    .find("> tr:first")
    .find("> td:first")
    .find("> center:first")
    .find("> h1:eq(1)")
    .find("> font:first")
    .find("> b:first")
    .find("> p")
    .each((idx, p) => {
      const t = $(p).text();
      if (_.startsWith(t, "第 ") && _.includes(t, " 回合")) {
        lastTurnIndex = idx;
      }
    });

  const pList: JQuery[] = [];
  battleTable
    .find("> tbody:first")
    .find("> tr:first")
    .find("> td:first")
    .find("> center:first")
    .find("> h1:eq(1)")
    .find("> font:first")
    .find("> b:first")
    .find("> p")
    .each((idx, p) => {
      if (idx >= lastTurnIndex) {
        pList.push($(p));
      }
    });

  let p1 = pList[0].html();
  p1 = StringUtils.substringAfterLast(p1, "</tbody></table><br>");

  const $p5 = pList[0];
  layoutOptimize($p5, zoom);
  $p5.find("> table:eq(2)").css("margin", "0 auto").next().attr("id", "last");
  const p5 = `<font size="${zoomSize}">${StringUtils.substringBefore(
    $p5.html(),
    `<br id="last">`
  )}</font>`;
  const regExpP5 = /(\d+)\<\/font\>\s回合/;
  const roundP5 = regExpP5.exec(p5)?.[1] ?? "1";

  let p2 = "";
  if (pList.length > 1) {
    p2 = pList[1].html();
  }

  let p3 = battleTable
    .find("> tbody:first")
    .find("> tr:first")
    .find("> td:first")
    .find("> center:first")
    .find("> h1:eq(1)")
    .find("> p:first")
    .find("> b:first")
    .find("> font:first")
    .html();

  // noinspection HtmlDeprecatedTag,HtmlDeprecatedAttribute,XmlDeprecatedElement
  let report =
    `<b><font size='${zoomSize}'>` +
    p1 +
    `</font></b><br><b><font size='${zoomSize}'>` +
    p2 +
    `</font></b><br><br><br><br><b><font size='${zoomSize}'>` +
    p3 +
    "</font></b><br><br><hr/>" +
    p5 +
    "<hr/>";

  while (true) {
    if (!report.includes("<br><br>")) {
      break;
    }
    report = _.replace(report, "<br><br>", "<br>");
  }

  let brs: string;
  if (page.battleResult === "战胜") {
    brs = BattleDeclarationManager.randomWinDeclaration(
      page.monsterNameHtml,
      page.roleNameHtml,
      roundP5,
      page.monsterProfile
    );
  } else if (page.battleResult === "战败") {
    brs = BattleDeclarationManager.randomLoseDeclaration(page.monsterNameHtml);
  } else {
    brs = BattleDeclarationManager.randomDrawDeclaration(page.monsterNameHtml);
  }
  // noinspection HtmlDeprecatedTag,HtmlDeprecatedAttribute,XmlDeprecatedElement
  report =
    `<p style='font-weight:bold'><font size='${zoomSize}'>` +
    brs +
    "</font></p>" +
    report;

  // 展现入手
  if (page.harvestList!.length > 0) {
    let harvest = "";
    for (const it of page.harvestList!) {
      harvest += "<b>" + it + "</b><br>";
    }
    report = "<p style='font-size:250%'>" + harvest + "</p>" + report;
  }

  // 展现宠物升级
  if (page.petUpgrade! && page.petNameHtml !== undefined) {
    let pu = "<span style='color:green'>" + page.petNameHtml + "</span> ";
    if (page.petLearnSpell!) {
      pu += `<span style='color:blue'>${
        SetupLoader.getPetDeclarations().learn
      }</span>`;
    } else {
      pu += `<span style='color:indigo'>${
        SetupLoader.getPetDeclarations().upgrade
      }</span>`;
    }
    // noinspection HtmlDeprecatedTag,HtmlDeprecatedAttribute,XmlDeprecatedElement
    report =
      `<p style='font-weight:bold'><font size='${zoomSize}'>` +
      pu +
      "</font></p>" +
      report;
  }

  report =
    "<p>" +
    page.roleImageHtml +
    (page.petImageHtml === undefined ? "" : page.petImageHtml) +
    "&nbsp;&nbsp;&nbsp;<b style='font-size:300%;color:red'>VS</b>&nbsp;&nbsp;&nbsp;" +
    page.monsterImageHtml +
    "</p>" +
    report;

  if (page.battleResult !== "战胜" && page.zodiacBattle) {
    // 十二宫战斗没有取得胜利，显示圣斗士剩余的生命
    report =
      `<p><b style='color:navy;font-size:${zoomPercent}%'>` +
      page.battleField +
      "</b></p>" +
      `<p><b style='background-color:lightgreen;font-size:${zoomPercent}%'>` +
      page.monsterHealth +
      "/" +
      page.monsterMaxHealth +
      "</b></p>" +
      "" +
      report;
  } else {
    report =
      `<p><b style='color:navy;font-size:${zoomPercent}%'>` +
      page.battleField +
      "</b></p>" +
      report;
  }

  page.reportHtml = report;
}

function layoutOptimize(p: any, zoom: boolean) {
  let tr = p
    .find("> table:eq(1)")
    .css("width", "90%")
    .css("margin-left", "10px")
    .find("> tbody:first")
    .find("> tr:first");
  tr.after($("<tr></tr>").append(tr.find("> td:eq(1)")));

  p.find("> table:eq(0)").before(p.find("> table:eq(1)"));
  if (zoom) {
    p.find("td, b").each((_: any, d: any) => {
      $(d).css("font-size", "22px");
    });
    p.find("font[color='#FFF0FF'], font[color='#F1F1F1']").each(
      (_: any, f: any) => {
        $(f).attr("size", 4);
      }
    );
    p.find(`font[color='009900'], br + font, font[color='red']`).each(
      (_: any, f: any) => {
        $(f).attr("size", 5);
      }
    );
  }

  if (p.find("> table").length == 2) p.find("> table:eq(0)").hide();
  else {
    const roletd = p
      .find("> table:eq(0)")
      .find("> tbody:first")
      .find("> tr:first")
      .find("> td:first");
    const tbody1 = roletd.find("tbody:first");
    const r2 = tbody1.find("tr:eq(2)").hide().next();
    if (r2.find("> td:first").attr("colspan") == 7) {
      r2.hide();
    }
  }
}

export = BattlePageParser;
