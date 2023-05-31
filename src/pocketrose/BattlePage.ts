import _ from "lodash";
import StringUtils from "../util/StringUtils";

class BattlePage {

    treasureBattle?: boolean;       // 秘宝之岛
    primaryBattle?: boolean;        // 初级之森
    juniorBattle?: boolean;         // 中级之塔
    seniorBattle?: boolean;         // 上级之洞窟
    zodiacBattle?: boolean;         // 十二神殿
    petUpgrade?: boolean;           // 宠物是否升级
    lowestEndure?: number;          // 战斗后装备剩余最低耐久度（排除大师球、宗师球、超力怪兽球、宠物蛋）
    roleHealth?: number;            // 角色剩余生命
    roleMaxHealth?: number;         // 角色最大生命
    roleMana?: number;              // 角色剩余魔力
    roleMaxMana?: number;           // 角色最大魔力
    monsterHealth?: number;         // 怪物剩余生命
    battleResult?: string;          // 战斗结果
    harvestList?: string[];         // 入手列表
    monsterTask?: boolean;          // 杀怪任务
    petLearnSpell?: boolean;        // 宠物是否学会新技能

    roleImageHtml?: string;
    monsterImageHtml?: string;
    reportHtml?: string;

    constructor() {
        this.treasureBattle = false;
        this.primaryBattle = false;
        this.juniorBattle = false;
        this.seniorBattle = false;
        this.zodiacBattle = false;
        this.petUpgrade = false;
        this.lowestEndure = 999;
    }

    get battleField() {
        if (this.treasureBattle) {
            return "＜ 秘 宝 之 岛 ＞";
        }
        if (this.primaryBattle) {
            return "＜ 初 级 之 森 ＞";
        }
        if (this.juniorBattle) {
            return "＜ 中 级 之 塔 ＞";
        }
        if (this.seniorBattle) {
            return "＜ 上 级 之 洞 窟 ＞";
        }
        if (this.zodiacBattle) {
            return "＜ 十 二 神 殿 ＞";
        }
        return "UNKNOWN";
    }

    static parse(html: string) {
        const page = new BattlePage();

        let table = $(html).find("tbody:first").parent();
        let div = table.prev();

        page.roleImageHtml = table.find("> tbody:first")
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
            .html();

        page.monsterImageHtml = table.find("> tbody:first")
            .find("> tr:eq(4)")
            .find("> td:first")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:first")
            .find("> td:first")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:eq(2)")
            .find("> td:last")
            .html();

        table.find("> tbody:first")
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
                if (!s.includes("大师球") &&
                    !s.includes("宗师球") &&
                    !s.includes("超力怪兽球") &&
                    !s.includes("宠物蛋")) {
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
                    })

                monsterTable
                    .find("tr:first")
                    .next()
                    .next()
                    .find("td:eq(1)")
                    .each((i, td) => {
                        let s = StringUtils.substringBefore($(td).text(), " / ");
                        page.monsterHealth = _.parseInt(s);
                    })
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
                _.split($(p).html(), "<br>").forEach(it => {
                    if (it.endsWith("入手！")) {
                        page.harvestList!.push(it);
                    }
                });
            });


        page.monsterTask = html.includes("完成杀怪任务");
        page.petLearnSpell = html.includes("遗忘了技能") || html.includes("学会了新技能");


        // let p1 = battleTable
        //     .find("> tbody:first")
        //     .find("> tr:first")
        //     .find("> td:first")
        //     .find("> center:first")
        //     .find("> h1:eq(1)")
        //     .find("> font:first")
        //     .find("> b:first")
        //     .find("> p:last")
        //     .html();
        //
        // p1 = StringUtils.substringAfterLast(p1, "</tbody></table><br>");
        //
        // let p2 = battleTable
        //     .find("> tbody:first")
        //     .find("> tr:first")
        //     .find("> td:first")
        //     .find("> center:first")
        //     .find("> h1:eq(1)")
        //     .find("> p:first")
        //     .html();
        //
        // let p3 = "<p><b><font size='3'>" + p1 + "</font></b></p>" + "<p>" + p2 + "</p>";
        // while (true) {
        //     if (!p3.includes("<br><br>")) {
        //         break;
        //     }
        //     p3 = _.replace(p3, "<br><br>", "<br>");
        // }
        // p3 = "<p>" + page.roleImageHtml +
        //     "&nbsp;&nbsp;&nbsp;<b style='font-size:300%;color:red'>VS</b>&nbsp;&nbsp;&nbsp;" +
        //     page.monsterImageHtml + "</p>" + p3;
        //
        // p3 = "<p><b style='color:navy;font-size:120%'>" + page.battleField + "</b></p>" + p3;
        //
        // page.reportHtml = p3;

        generateBattleReport(battleTable, page);

        return page;
    }
}

function generateBattleReport(battleTable: JQuery, page: BattlePage) {
    let lastTurnIndex = 0;  // 最后一个回合p元素对应的下标
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
        .html();

    // noinspection HtmlDeprecatedTag,HtmlDeprecatedAttribute,XmlDeprecatedElement
    let report = "<b><font size='3'>" + p1 + "</font></b><br><b><font size='3'>" + p2 + "</font></b><br>" + p3;
    while (true) {
        if (!report.includes("<br><br>")) {
            break;
        }
        report = _.replace(report, "<br><br>", "<br>");
    }

    report = "<p>" + page.roleImageHtml +
        "&nbsp;&nbsp;&nbsp;<b style='font-size:300%;color:red'>VS</b>&nbsp;&nbsp;&nbsp;" +
        page.monsterImageHtml + "</p>" + report;

    report = "<p><b style='color:navy;font-size:120%'>" + page.battleField + "</b></p>" + report;

    page.reportHtml = report;
}

export = BattlePage;