import PageUtils from "../../../util/PageUtils";
import PersonalEquipmentManagement from "../../../pocket/PersonalEquipmentManagement";
import MessageBoard from "../../../util/MessageBoard";
import NpcLoader from "../../../pocket/NpcLoader";

class MapPersonalEquipmentManagementProcessor {

    process() {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
        doProcess();
    }

}

function doProcess() {
    const page = PersonalEquipmentManagement.parsePage(PageUtils.currentPageHtml());

    // 重组旧的页面
    $("table[height='100%']").removeAttr("height");
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
        .text("＜＜  装 备 管 理 （ 野 外 ）  ＞＞")
        .parent()
        .attr("id", "tr0")
        .next()
        .attr("id", "tr1")
        .find("td:first")
        .find("table:first")
        .find("tr:first")
        .find("td:first")
        .attr("id", "roleImage")
        .next()
        .removeAttr("width")
        .css("width", "100%")
        .next().remove();

    $("#tr1")
        .next()
        .attr("id", "tr2")
        .find("td:first")
        .attr("id", "messageBoardContainer")
        .removeAttr("height");

    MessageBoard.createMessageBoardStyleB("messageBoardContainer", NpcLoader.randomNpcImageHtml());
    $("#messageBoard")
        .css("background-color", "black")
        .css("color", "wheat");

    let html = "";
    html += "<tr id='tr3' style='display:none'>";
    html += "<td>";
    html += PageUtils.generateReturnMapForm(page.credential);
    html += "</td>";
    html += "</tr>"
    $("#tr2").after($(html));

    html = "";
    html += "<tr id='tr4'>";
    html += "<td style='background-color:#F8F0E0;text-align:center'>";
    html += "<input type='button' id='returnButton' value='退出装备管理'>";
    html += "</td>";
    html += "</tr>"
    $("#tr3").after($(html));
    $("#returnButton").on("click", function () {
        $("#returnMap").trigger("click");
    });

    console.log(PageUtils.currentPageHtml());
}

export = MapPersonalEquipmentManagementProcessor;