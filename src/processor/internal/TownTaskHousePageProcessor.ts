import NpcLoader from "../../core/NpcLoader";
import TownLoader from "../../core/TownLoader";
import Credential from "../../util/Credential";
import StorageUtils from "../../util/StorageUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class TownTaskHousePageProcessor extends PageProcessorCredentialSupport {

    doProcess(credential: Credential, context?: PageProcessorContext): void {
        const roleTask = loadRoleTask(credential);

        $("table:eq(1)")
            .find("tbody:first")
            .find("> tr:first")
            .find("> td:first")
            .attr("id", "pageTitle")
            .removeAttr("bgcolor")
            .removeAttr("width")
            .removeAttr("height")
            .css("text-align", "center")
            .css("font-size", "150%")
            .css("font-weight", "bold")
            .css("background-color", "navy")
            .css("color", "yellowgreen")
            .text("＜＜  任 务 屋  ＞＞");

        $("#pageTitle")
            .parent()
            .next()
            .find("> td:first")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:first")
            .find("> td:last")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:first")
            .find("> td:first")
            .find("> table:first")
            .attr("id", "roleStatus")
            .find("> tbody:first")
            .append($("" +
                "<tr>" +
                "<td style='background-color:#E0D0B0'>当前任务</td>" +
                "<td style='background-color:#E8E8D0;color:red;text-align:right;font-weight:bold' " +
                "id='roleTask' colspan='3'>" + (roleTask === "" ? "-" : roleTask) + "</td>" +
                "</tr>" +
                ""));

        $("#pageTitle")
            .parent()
            .next()
            .next()
            .find("> td:first")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:first")
            .find("> td:first")
            .attr("id", "messageBoard")
            .removeAttr("bgcolor")
            .removeAttr("width")
            .css("background-color", "black")
            .css("color", "white")
            .css("width", "100%")
            .html("<b style='font-size:120%;color:wheat'>为老菜鸟们提供简易任务指南。切记完成后要回来消任务！</b>")
            .next()
            .attr("id", "messageBoardManager")
            .css("width", "64px")
            .css("height", "64px")
            .html(NpcLoader.randomNpcImageHtml());

        let html = "";
        html += "<tr style='display:none'>";
        html += "<td id='hidden-1'></td>";
        html += "</tr>"
        html += "<tr style='display:none'>";
        html += "<td id='hidden-2'></td>";
        html += "</tr>"
        html += "<tr style='display:none'>";
        html += "<td id='hidden-3'></td>";
        html += "</tr>"
        html += "<tr>";
        html += "<td id='task' style='background-color:#F8F0E0;text-align:center'></td>";
        html += "</tr>"
        html += "<tr>";
        html += "<td style='background-color:#F8F0E0;text-align:center'>";
        html += "<button role='button' id='returnButton'>返回" + TownLoader.getTownById(context?.get("townId")!)?.name + "</button>";
        html += "</td>";
        html += "</tr>"

        $("#pageTitle")
            .parent()
            .next()
            .next()
            .next().hide()
            .after($(html));

        $("#returnButton").on("click", () => {
            $("input:submit[value='返回城市']").trigger("click");
        });
    }

}

function loadRoleTask(credential: Credential) {
    const key = "_ct_" + credential.id;
    return StorageUtils.getString(key);
}

export = TownTaskHousePageProcessor;