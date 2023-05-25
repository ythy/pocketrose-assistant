import NpcLoader from "../../core/NpcLoader";
import TownLoader from "../../core/TownLoader";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
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
        html += "<button role='button' id='refreshButton'>刷新任务</button>";
        html += "<button role='button' id='returnButton'>返回" + TownLoader.getTownById(context?.get("townId")!)?.name + "</button>";
        html += "</td>";
        html += "</tr>"

        $("#pageTitle")
            .parent()
            .next()
            .next()
            .next().hide()
            .after($(html));

        $("#refreshButton").on("click", () => {
            PageUtils.scrollIntoView("pageTitle");
            $("#messageBoardManager").html(NpcLoader.randomNpcImageHtml());
            refresh(credential);
        });
        $("#returnButton").on("click", () => {
            $("input:submit[value='返回城市']").trigger("click");
        });

        renderTask(credential, roleTask);
    }

}

function renderTask(credential: Credential, roleTask: string) {
    let html = "";
    html += "<table style='margin:auto;border-width:0;text-align:center;background-color:#888888'>";
    html += "<tbody>";

    html += "<tr>";
    html += "<th style='background-color:#F8F0E0;width:72px'>任务名称</th>";
    html += "<th style='background-color:#E8E8D0'>任务指南</th>";
    html += "<th style='background-color:#E8E8B0'>相关人物</th>";
    html += "</tr>";

    // --------------------------------------------------------------------
    // 新手任务
    // --------------------------------------------------------------------
    html += "<tr>";
    html += "<td style='background-color:#F8F0E0;width:72px;font-weight:bold'>新手任务</td>";
    html += "<td style='background-color:#E8E8D0'>";
    html += "<button role='button' class='taskButton getTask' id='t-1'>获取任务指南<button";
    html += "</td>";
    html += "<td style='background-color:#E8E8B0;text-align:left'>";
    html += "<table style='background-color:transparent;margin:auto;border-spacing:0;border-width:0;width:100%'>";
    html += "<tbody>";
    html += "<tr>";
    html += "<td>";
    html += NpcLoader.getTaskNpcImageHtml("瓦格纳");
    html += "</td>";
    html += "</tr>";
    html += "</tbody>";
    html += "</table>";
    html += "</td>";
    html += "</tr>";

    // --------------------------------------------------------------------
    // 落凤坡
    // --------------------------------------------------------------------
    html += "<tr>";
    html += "<td style='background-color:#F8F0E0;width:72px;font-weight:bold'>落凤坡</td>";
    html += "<td style='background-color:#E8E8D0'>";
    html += "<button role='button' class='taskButton getTask' id='t-2'>获取任务指南<button";
    html += "</td>";
    html += "<td style='background-color:#E8E8B0;text-align:left'>";
    html += "<table style='background-color:transparent;margin:auto;border-spacing:0;border-width:0;width:100%'>";
    html += "<tbody>";
    html += "<tr>";
    html += "<td>";
    html += NpcLoader.getTaskNpcImageHtml("诸葛亮");
    html += "</td>";
    html += "<td>";
    html += NpcLoader.getTaskNpcImageHtml("庞统");
    html += "</td>";
    html += "</tr>";
    html += "</tbody>";
    html += "</table>";
    html += "</td>";
    html += "</tr>";

    // --------------------------------------------------------------------
    // 辕门射戟
    // --------------------------------------------------------------------
    html += "<tr>";
    html += "<td style='background-color:#F8F0E0;width:72px;font-weight:bold'>辕门射戟</td>";
    html += "<td style='background-color:#E8E8D0'>";
    html += "<button role='button' class='taskButton getTask' id='t-3'>获取任务指南<button";
    html += "</td>";
    html += "<td style='background-color:#E8E8B0;text-align:left'>";
    html += "<table style='background-color:transparent;margin:auto;border-spacing:0;border-width:0;width:100%'>";
    html += "<tbody>";
    html += "<tr>";
    html += "<td>";
    html += NpcLoader.getTaskNpcImageHtml("吕布");
    html += "</td>";
    html += "</tr>";
    html += "</tbody>";
    html += "</table>";
    html += "</td>";
    html += "</tr>";

    // --------------------------------------------------------------------
    // 葵花宝典
    // --------------------------------------------------------------------
    html += "<tr>";
    html += "<td style='background-color:#F8F0E0;width:72px;font-weight:bold'>葵花宝典</td>";
    html += "<td style='background-color:#E8E8D0'>";
    html += "<button role='button' class='taskButton getTask' id='t-4'>获取任务指南<button";
    html += "</td>";
    html += "<td style='background-color:#E8E8B0;text-align:left'>";
    html += "<table style='background-color:transparent;margin:auto;border-spacing:0;border-width:0;width:100%'>";
    html += "<tbody>";
    html += "<tr>";
    html += "<td>";
    html += NpcLoader.getTaskNpcImageHtml("东方不败");
    html += "</td>";
    html += "</tr>";
    html += "</tbody>";
    html += "</table>";
    html += "</td>";
    html += "</tr>";

    // --------------------------------------------------------------------
    // 五丈原
    // --------------------------------------------------------------------
    html += "<tr>";
    html += "<td style='background-color:#F8F0E0;width:72px;font-weight:bold'>五丈原</td>";
    html += "<td style='background-color:#E8E8D0'>";
    html += "<button role='button' class='taskButton getTask' id='t-5'>获取任务指南<button";
    html += "</td>";
    html += "<td style='background-color:#E8E8B0;text-align:left'>";
    html += "<table style='background-color:transparent;margin:auto;border-spacing:0;border-width:0;width:100%'>";
    html += "<tbody>";
    html += "<tr>";
    html += "<td>";
    html += NpcLoader.getTaskNpcImageHtml("司马懿");
    html += "</td>";
    html += "</tr>";
    html += "</tbody>";
    html += "</table>";
    html += "</td>";
    html += "</tr>";

    html += "<tr>";
    html += "<td style='background-color:#F8F0E0;text-align:center' colspan='3'>";
    html += "<button role='button' class='taskButton cancelTask' id='t-0'>取消任务指南<button";
    html += "</td>";
    html += "</tr>";

    html += "</tbody>";
    html += "</table>";
    $("#task").html(html);

    if (roleTask === "") {
        $(".cancelTask").prop("disabled", true);
        doBindGetTaskButton(credential);
    } else {
        $(".getTask").prop("disabled", true);
        doBindCancelTaskButton(credential);
    }
}

function doBindGetTaskButton(credential: Credential) {
    $(".getTask").on("click", event => {
        const buttonId = $(event.target).attr("id")!;
        const task = $("#" + buttonId)
            .parent()
            .prev()
            .text();
        const key = "_ct_" + credential.id;
        StorageUtils.set(key, task);
        refresh(credential);
    });
}

function doBindCancelTaskButton(credential: Credential) {
    $(".cancelTask").on("click", () => {
        const key = "_ct_" + credential.id;
        StorageUtils.remove(key);
        refresh(credential);
    });
}

function loadRoleTask(credential: Credential) {
    const key = "_ct_" + credential.id;
    return StorageUtils.getString(key);
}

function refresh(credential: Credential) {
    $(".taskButton").off("click");
    const roleTask = loadRoleTask(credential);
    if (roleTask !== "") {
        $("#roleTask").text(roleTask);
    } else {
        $("#roleTask").text("-");
    }
    renderTask(credential, roleTask);
}

export = TownTaskHousePageProcessor;