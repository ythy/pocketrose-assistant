import _ from "lodash";
import EquipmentLocalStorage from "../../core/EquipmentLocalStorage";
import FastLoginManager from "../../core/FastLoginManager";
import NpcLoader from "../../core/NpcLoader";
import PetLocalStorage from "../../core/PetLocalStorage";
import Credential from "../../util/Credential";
import MessageBoard from "../../util/MessageBoard";
import PageUtils from "../../util/PageUtils";
import StorageUtils from "../../util/StorageUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

abstract class AbstractPersonalTeamPageProcessor extends PageProcessorCredentialSupport {

    doLoadButtonStyles(): number[] {
        return [35];
    }

    doProcess(credential: Credential, context?: PageProcessorContext) {
        $("table[height='100%']").removeAttr("height");
        $("form[action='status.cgi']").remove();

        $("td:first")
            .attr("id", "pageTitle")
            .removeAttr("width")
            .removeAttr("height")
            .removeAttr("bgcolor")
            .css("text-align", "center")
            .css("font-size", "150%")
            .css("font-weight", "bold")
            .css("background-color", "navy")
            .css("color", "yellowgreen")
            .text("＜＜  团 队 面 板  ＞＞");

        $("table:first")
            .find("tbody:first")
            .find("> tr:eq(2)")
            .find("td:first")
            .attr("id", "messageBoardContainer")
            .html("");
        const imageHtml = NpcLoader.randomNpcImageHtml();
        MessageBoard.createMessageBoardStyleB("messageBoardContainer", imageHtml);
        $("#messageBoard")
            .css("background-color", "black")
            .css("color", "white")
            .html(this.#welcomeMessageHtml());

        let html = "";
        html += "<tr style='display:none'>";
        html += "<td id='hidden-1'></td>";
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='hidden-2'></td>";
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='hidden-3'></td>";
        html += "</tr>";
        html += "<tr>";
        html += "<td id='menu' style='background-color:#F8F0E0;text-align:center'>";
        html += "<table style='background-color:transparent;margin:auto;border-spacing:0;border-width:0'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<td>";
        html += "<button role='button' class='button-35' id='refreshButton'>刷新团队面板</button>";
        html += "</td>";
        html += "<td>";
        html += "<button role='button' class='button-35' id='returnButton'>离开团队面板</button>";
        html += "</td>";
        html += "<td>";
        html += "<button role='button' class='button-35' id='updateEquipmentButton'>更新装备数据</button>";
        html += "</td>";
        html += "<td>";
        html += "<button role='button' class='button-35' id='updatePetButton'>更新宠物数据</button>";
        html += "</td>";
        html += "<td>";
        html += "<button role='button' class='button-35' id='listEquipmentButton'>团队装备列表</button>";
        html += "</td>";
        html += "<td>";
        html += "<button role='button' class='button-35' id='listPetButton'>团队宠物列表</button>";
        html += "</td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        html += "</td>";
        html += "</tr>";
        html += "<tr style='display:none'>";
        html += "<td id='information' style='background-color:#F8F0E0;width:100%'></td>";
        html += "</tr>";
        $("#messageBoardContainer")
            .parent()
            .after($(html));

        this.#bindRefreshButton();
        this.bindReturnButton(credential);
        this.#bindUpdateEquipmentButton(credential);
        this.#bindUpdatePetButton(credential);
        this.#bindListEquipmentButton();
        this.#bindListPetButton();
    }

    #welcomeMessageHtml() {
        return "<b style='font-size:120%;color:wheat'>什么是团队？在我看来，共同配置在快速登陆里面的才能称为团队。</b>";
    }

    #bindRefreshButton() {
        $("#refreshButton").on("click", () => {
            PageUtils.scrollIntoView("pageTitle");
            const imageHtml = NpcLoader.randomNpcImageHtml();
            $("#messageBoardManager").html(imageHtml);
            $("#messageBoard").html(this.#welcomeMessageHtml());
            $("#information").html("").parent().hide();
        });
    }

    abstract bindReturnButton(credential: Credential): void;

    #bindUpdateEquipmentButton(credential: Credential) {
        $("#updateEquipmentButton").on("click", () => {
            $("button").prop("disabled", true);
            $("input").prop("disabled", true);
            MessageBoard.publishMessage("开始更新装备数据......");
            new EquipmentLocalStorage(credential).updateEquipmentStatus().then(() => {
                MessageBoard.publishMessage("装备数据更新完成。");
                $("button").prop("disabled", false);
                $("input").prop("disabled", false);
            });
        });
    }

    #bindUpdatePetButton(credential: Credential) {
        $("#updatePetButton").on("click", () => {
            $("button").prop("disabled", true);
            $("input").prop("disabled", true);
            MessageBoard.publishMessage("开始更新宠物数据......");
            const petLocalStorage = new PetLocalStorage(credential);
            petLocalStorage.updatePetMap().then(() => {
                petLocalStorage.updatePetStatus().then(() => {
                    MessageBoard.publishMessage("宠物数据更新完成。");
                    $("button").prop("disabled", false);
                    $("input").prop("disabled", false);
                });
            });
        });
    }

    #bindListEquipmentButton() {
        $("#listEquipmentButton").on("click", () => {
            let html = "";
            html += "<table style='margin:auto;border-width:0;text-align:center;background-color:#888888;width:100%'>";
            html += "<tbody id='equipmentStatusList'>";
            html += "<tr>";
            html += "<th style='background-color:#F8F0E0'>队员</th>";
            html += "<th style='background-color:#F8F0E0'>名字</th>";
            html += "<th style='background-color:#F8F0E0'>种类</th>";
            html += "<th style='background-color:#F8F0E0'>效果</th>";
            html += "<th style='background-color:#F8F0E0'>重量</th>";
            html += "<th style='background-color:#F8F0E0'>耐久</th>";
            html += "<th style='background-color:#F8F0E0'>威＋</th>";
            html += "<th style='background-color:#F8F0E0'>重＋</th>";
            html += "<th style='background-color:#F8F0E0'>幸＋</th>";
            html += "<th style='background-color:#F8F0E0'>经验</th>";
            html += "<th style='background-color:#F8F0E0'>位置</th>";
            html += "</tr>";
            html += "</tbody>";
            html += "</table>";
            $("#information").html(html).parent().hide();

            const configs = FastLoginManager.getAllFastLogins();
            for (const config of configs) {
                const key = "_es_" + config.id;
                const value = StorageUtils.get(key);
                if (value === null || value === "") {
                    continue;
                }
                const equipments = _.split(value, "$$");

                let html = "";
                let row = 0;
                for (const it of equipments) {
                    const ss = _.split(it, "/");
                    html += "<tr>";
                    if (row === 0) {
                        html += "<td style='background-color:#F8F0E0;vertical-align:center' rowspan='" + (equipments.length) + "'>" + config.name + "</td>";
                    }
                    html += "<td style='background-color:#E8E8D0'>" + _.unescape(ss[0]) + "</td>";
                    html += "<td style='background-color:#E8E8B0'>" + ss[1] + "</td>";
                    html += "<td style='background-color:#E8E8D0'>" + ss[2] + "</td>";
                    html += "<td style='background-color:#E8E8B0'>" + ss[3] + "</td>";
                    html += "<td style='background-color:#E8E8D0'>" + ss[4] + "</td>";
                    html += "<td style='background-color:#E8E8B0'>" + ss[5] + "</td>";
                    html += "<td style='background-color:#E8E8D0'>" + ss[6] + "</td>";
                    html += "<td style='background-color:#E8E8B0'>" + ss[7] + "</td>";
                    html += "<td style='background-color:#E8E8D0'>" + ss[8] + "</td>";
                    html += "<td style='background-color:#E8E8B0'>" + ss[9] + "</td>";
                    html += "</tr>";
                    row++;
                }

                $("#equipmentStatusList").append($(html));
            }
            $("#information").parent().show();
        });
    }

    #bindListPetButton() {
        $("#listPetButton").on("click", () => {
            let html = "";
            html += "<table style='margin:auto;border-width:0;text-align:center;background-color:#888888;width:100%'>";
            html += "<tbody id='petStatusList'>";
            html += "<tr>";
            html += "<th style='background-color:#F8F0E0'>队员</th>";
            html += "<th style='background-color:#F8F0E0'>名字</th>";
            html += "<th style='background-color:#F8F0E0'>性别</th>";
            html += "<th style='background-color:#F8F0E0'>等级</th>";
            html += "<th style='background-color:#F8F0E0'>生命</th>";
            html += "<th style='background-color:#F8F0E0'>攻击</th>";
            html += "<th style='background-color:#F8F0E0'>防御</th>";
            html += "<th style='background-color:#F8F0E0'>智力</th>";
            html += "<th style='background-color:#F8F0E0'>精神</th>";
            html += "<th style='background-color:#F8F0E0'>速度</th>";
            html += "<th style='background-color:#F8F0E0'>位置</th>";
            html += "</tr>";
            html += "</tbody>";
            html += "</table>";
            $("#information").html(html).parent().hide();

            const configs = FastLoginManager.getAllFastLogins();
            for (const config of configs) {
                const key = "_ps_" + config.id;
                const value = StorageUtils.get(key);
                if (value === null || value === "") {
                    continue;
                }
                const pets = _.split(value, "$$");

                let html = "";
                let row = 0;

                for (const it of pets) {
                    const ss = _.split(it, "/");
                    html += "<tr>";
                    if (row === 0) {
                        html += "<td style='background-color:#F8F0E0;vertical-align:center' rowspan='" + (pets.length) + "'>" + config.name + "</td>";
                    }
                    html += "<td style='background-color:#E8E8D0'>" + _.unescape(ss[0]) + "</td>";
                    html += "<td style='background-color:#E8E8B0'>" + ss[1] + "</td>";
                    html += "<td style='background-color:#E8E8D0'>" + ss[2] + "</td>";
                    html += "<td style='background-color:#E8E8B0'>" + ss[3] + "</td>";
                    html += "<td style='background-color:#E8E8D0'>" + ss[4] + "</td>";
                    html += "<td style='background-color:#E8E8B0'>" + ss[5] + "</td>";
                    html += "<td style='background-color:#E8E8D0'>" + ss[6] + "</td>";
                    html += "<td style='background-color:#E8E8B0'>" + ss[7] + "</td>";
                    html += "<td style='background-color:#E8E8D0'>" + ss[8] + "</td>";
                    html += "<td style='background-color:#E8E8B0'>" + ss[9] + "</td>";
                    html += "</tr>";
                    row++;
                }

                $("#petStatusList").append($(html));

            }
            $("#information").parent().show();
        });
    }
}


export = AbstractPersonalTeamPageProcessor;