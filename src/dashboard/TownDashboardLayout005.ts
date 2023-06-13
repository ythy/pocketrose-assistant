import _ from "lodash";
import BattleProcessor from "../core/battle/BattleProcessor";
import BattleRecord from "../core/battle/BattleRecord";
import BattleReturnInterceptor from "../core/battle/BattleReturnInterceptor";
import BattleStorageManager from "../core/battle/BattleStorageManager";
import KeyboardShortcutManager from "../core/dashboard/KeyboardShortcutManager";
import TownDashboardPage from "../core/dashboard/TownDashboardPage";
import TownDashboardTaxManager from "../core/town/TownDashboardTaxManager";
import PersonalEquipmentManagement from "../pocketrose/PersonalEquipmentManagement";
import PersonalPetManagement from "../pocketrose/PersonalPetManagement";
import Credential from "../util/Credential";
import NetworkUtils from "../util/NetworkUtils";
import TownDashboardLayout from "./TownDashboardLayout";

class TownDashboardLayout005 extends TownDashboardLayout {

    id(): number {
        return 5;
    }

    battleMode(): boolean {
        return true;
    }

    render(credential: Credential, page: TownDashboardPage): void {
        $("#leftPanel")
            .removeAttr("width")
            .css("width", "40%")
            .find("> table:first")
            .removeAttr("width")
            .css("width", "95%");
        $("#rightPanel")
            .removeAttr("width")
            .css("width", "60%")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:eq(1)")
            .find("> td:first")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:eq(3)")
            .each((idx, tr) => {
                const tax = page.townTax!;
                $(tr).after($("<tr class='roleStatus'><td height='5'>收益</td><th id='townTax'>" + tax + "</th><td colspan='2'></td></tr>"));
                new TownDashboardTaxManager(credential, page).processTownTax($("#townTax"));
            });

        $("#rightPanel")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:eq(1)")
            .find("> td:first")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:first")
            .find("> th:first")
            .attr("id", "roleTitle")
            .parent()
            .next().addClass("roleStatus")
            .next().addClass("roleStatus")
            .next().addClass("roleStatus");

        $("#roleTitle")
            .parent()
            .after($("<tr class='additionalStatus' style='display:none'><td colspan='4'></td></tr>"));

        $("#roleTitle")
            .find("> font:first")
            .on("click", event => {
                $(event.target).off("click");

                new PersonalEquipmentManagement(credential, page.townId)
                    .open()
                    .then(equipmentPage => {
                        new PersonalPetManagement(credential, page.townId)
                            .open()
                            .then(petPage => {

                                let html = "";
                                html += "<table style='text-align:center;margin:auto;border-width:1px;border-spacing:1px;width:100%'>";
                                html += "<tbody>";
                                for (const equipment of equipmentPage.equipmentList!) {
                                    if (!equipment.using) {
                                        continue;
                                    }
                                    html += "<tr>";
                                    html += "<td style='background-color:#E8E8D0'>" + equipment.usingHTML + "</td>";
                                    html += "<td style='background-color:#F8F0E0'>" + equipment.nameHTML + "</td>";
                                    html += "<td style='background-color:#F8F0E0'>" + equipment.category + "</td>";
                                    html += "<td style='background-color:#E8E8D0'>" + equipment.experienceHTML + "</td>";
                                    html += "</tr>";
                                }
                                for (const pet of petPage.petList!) {
                                    if (!pet.using) {
                                        continue;
                                    }
                                    html += "<tr>";
                                    html += "<td style='background-color:#E8E8D0'>" + pet.usingHtml + "</td>";
                                    html += "<td style='background-color:#F8F0E0'>" + pet.nameHtml + "</td>";
                                    html += "<td style='background-color:#F8F0E0'>" + pet.imageHtml + "</td>";
                                    html += "<td style='background-color:#E8E8D0'>" + pet.levelHtml + "</td>";
                                    html += "</tr>";
                                }
                                html += "</tbody>";
                                html += "</table>";

                                $(".additionalStatus")
                                    .find("> td:first")
                                    .html(html);

                                $(".roleStatus").hide();
                                $(".additionalStatus").show();
                            });
                    });
            });

        // 在右面板最后增加一个新行，高度100%，保证格式显示不会变形。
        $("#rightPanel")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:last")
            .find("> td:first")
            .removeAttr("colspan")
            .parent()
            .after($("<tr style='height:100%'><td></td></tr>"));

        $("#leftPanel")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:first")
            .find("> th:first")
            .find("> font:first")
            .attr("id", "battlePanelTitle")
            .parent()
            .parent()
            .next()
            .removeAttr("bgcolor")
            .html("<td style='text-align:center' id='battlePanel'></td>")
            .next().hide()
            .find("> td:first")
            .removeAttr("bgcolor")
            .attr("id", "battleMenu")
            .css("text-align", "center")
            .html("")
            .parent()
            .next()
            .css("height", "100%")
            .find("> td:first")
            .html("" +
                "<div style='display:none' id='hidden-1'></div>" +
                "<div style='display:none' id='hidden-2'></div>" +
                "<div style='display:none' id='hidden-3'></div>" +
                "<div style='display:none' id='hidden-4'></div>" +
                "<div style='display:none' id='hidden-5'></div>" +
                "");

        generateDepositForm(credential);
        generateRepairForm(credential);
        generateLodgeForm(credential);

        BattleStorageManager.getBattleRecordStorage().load(credential.id).then(record => {
            const lastBattle = record.html!;
            if (lastBattle.includes("吐故纳新，扶摇直上")) {
                $("#battlePanel").css("background-color", "wheat");
            }
            $("#battlePanel").html(lastBattle);
        });

        const ksm = new KeyboardShortcutManager(credential);
        if (page.battleLevelShortcut) {
            // 只设置了一处战斗场所偏好
            ksm.bind();
        }

        $("#battleButton")
            .attr("type", "button")
            .on("click", () => {
                ksm.clear();

                $("#refreshButton").hide();
                $("#battleButton").hide();

                const request = credential.asRequestMap();
                $("#battleCell")
                    .find("> form[action='battle.cgi']")
                    .find("> input:hidden")
                    .filter((idx, input) => $(input).attr("name") !== "id")
                    .filter((idx, input) => $(input).attr("name") !== "pass")
                    .each((idx, input) => {
                        const name = $(input).attr("name")!;
                        const value = $(input).val()! as string;
                        request.set(name, value);
                    });
                $("#battleCell")
                    .find("> form[action='battle.cgi']")
                    .find("> select[name='level']")
                    .each((idx, select) => {
                        const value = $(select).val()! as string;
                        // noinspection JSDeprecatedSymbols
                        request.set("level", escape(value));
                    });

                const battleCount = _.parseInt(request.get("ktotal")!);

                NetworkUtils.post("battle.cgi", request).then(html => {
                    if (html.includes("ERROR !")) {
                        let errMsg = $(html).find("font:first").html();
                        errMsg = "<p style='color:red;font-size:200%'>" + errMsg + "</p>";
                        $("#battlePanel").html(errMsg);

                        const record = new BattleRecord();
                        record.id = credential.id;
                        record.html = errMsg;
                        BattleStorageManager.getBattleRecordStorage().write(record).then();

                        $("#battleMenu").html("" +
                            "<button role='button' class='battleButton' " +
                            "id='battleReturn' style='font-size:150%'>返回</button>" +
                            "")
                            .parent().show();
                        $("#battleReturn").on("click", () => {
                            $("#battleReturn").prop("disabled", true);
                            $("#refreshButton").trigger("click");
                        });
                        $(".battleButton").trigger("click");
                        return;
                    }

                    const currentBattleCount = battleCount + 1;

                    const processor = new BattleProcessor(credential, html, currentBattleCount);
                    processor.doProcess();

                    $("#battlePanel").html(processor.obtainPage.reportHtml!);

                    const recommendation = processor.obtainRecommendation;
                    switch (recommendation) {
                        case "修":
                            $("#battleMenu").html("" +
                                "<button role='button' class='battleButton' " +
                                "id='battleRepair' style='font-size:150%'>修理</button>" +
                                "")
                                .parent().show();
                            break;
                        case "宿":
                            $("#battleMenu").html("" +
                                "<button role='button' class='battleButton' " +
                                "id='battleLodge' style='font-size:150%'>住宿</button>" +
                                "")
                                .parent().show();
                            break;
                        case "存":
                            $("#battleMenu").html("" +
                                "<button role='button' class='battleButton' " +
                                "id='battleDeposit' style='font-size:150%'>存钱</button>" +
                                "")
                                .parent().show();
                            break;
                        case "回":
                            $("#battleMenu").html("" +
                                "<button role='button' class='battleButton' " +
                                "id='battleReturn' style='font-size:150%'>返回</button>" +
                                "")
                                .parent().show();
                            break;
                    }

                    $("#battleReturn").on("click", () => {
                        $("#battleReturn").prop("disabled", true);
                        new BattleReturnInterceptor(credential, currentBattleCount)
                            .doBeforeReturn()
                            .then(() => {
                                $("#refreshButton").trigger("click");
                            });
                    });
                    $("#battleDeposit").on("click", () => {
                        $("#battleDeposit").prop("disabled", true);
                        new BattleReturnInterceptor(credential, currentBattleCount)
                            .doBeforeReturn()
                            .then(() => {
                                $("#deposit").trigger("click");
                            });
                    });
                    $("#battleRepair").on("click", () => {
                        $("#battleRepair").prop("disabled", true);
                        new BattleReturnInterceptor(credential, currentBattleCount)
                            .doBeforeReturn()
                            .then(() => {
                                $("#repair").trigger("click");
                            });
                    });
                    $("#battleLodge").on("click", () => {
                        $("#battleLodge").prop("disabled", true);
                        new BattleReturnInterceptor(credential, currentBattleCount)
                            .doBeforeReturn()
                            .then(() => {
                                $("#lodge").trigger("click");
                            });
                    });

                    // 战斗布局模式默认开启极速战斗
                    $(".battleButton").trigger("click");
                });
            });
    }

}

function generateDepositForm(credential: Credential) {
    let form = "";
    // noinspection HtmlUnknownTarget
    form += "<form action='town.cgi' method='post'>";
    form += "<input type='hidden' name='id' value='" + credential.id + "'>";
    form += "<input type='hidden' name='pass' value='" + credential.pass + "'>"
    form += "<input type='hidden' name='azukeru' value='all'>";
    form += "<input type='hidden' name='mode' value='BANK_SELL'>";
    form += "<input type='submit' id='deposit'>";
    form += "</form>";
    $("#hidden-2").html(form);
}

function generateRepairForm(credential: Credential) {
    let form = "";
    // noinspection HtmlUnknownTarget
    form += "<form action='town.cgi' method='post'>";
    form += "<input type='hidden' name='id' value='" + credential.id + "'>";
    form += "<input type='hidden' name='pass' value='" + credential.pass + "'>"
    form += "<input type='hidden' name='arm_mode' value='all'>";
    form += "<input type='hidden' name='mode' value='MY_ARM2'>";
    form += "<input type='submit' id='repair'>";
    form += "</form>";
    $("#hidden-3").html(form);
}

function generateLodgeForm(credential: Credential) {
    let form = "";
    // noinspection HtmlUnknownTarget
    form += "<form action='town.cgi' method='post'>";
    form += "<input type='hidden' name='id' value='" + credential.id + "'>";
    form += "<input type='hidden' name='pass' value='" + credential.pass + "'>"
    form += "<input type='hidden' name='mode' value='RECOVERY'>";
    form += "<input type='submit' id='lodge'>";
    form += "</form>";
    $("#hidden-4").html(form);
}

export = TownDashboardLayout005;