import Processor from "../Processor";
import PageUtils from "../../util/PageUtils";
import TownGemHouse from "../../pocket/house/TownGemHouse";
import TownGemHousePage from "../../pocket/house/TownGemHousePage";
import Credential from "../../util/Credential";
import NpcLoader from "../../pocket/NpcLoader";
import MessageBoard from "../../util/MessageBoard";

class TownGemHouseProcessor implements Processor {

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
            return pageText.includes("＜＜ * 合 成 屋 *＞＞");
        }
        return false;
    }

    process(): void {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
        TownGemHouse.parsePage(PageUtils.currentPageHtml())
            .then(page => {
                doProcess(page);
            });
    }

}

function doProcess(page: TownGemHousePage) {
    const t1 = $("table:eq(1)");

    t1.find("td:first")
        .attr("id", "title_cell")
        .removeAttr("width")
        .removeAttr("height")
        .removeAttr("bgcolor")
        .css("text-align", "center")
        .css("font-size", "150%")
        .css("font-weight", "bold")
        .css("background-color", "navy")
        .css("color", "yellowgreen")
        .text("＜＜  宝 石 屋  ＞＞")
        .parent()
        .next()
        .find("table:first")
        .find("td:eq(1)")
        .find("table:first")
        .find("td:first")
        .find("table:first")
        .find("td:last")
        .attr("id", "roleCash");

    t1.find("tr:first")
        .next()
        .next()
        .find("table:first")
        .find("td:first")
        .attr("id", "messageBoard")
        .removeAttr("width")
        .removeAttr("bgcolor")
        .css("width", "100%")
        .css("background-color", "black")
        .css("color", "white")
        .next()
        .attr("id", "messageBoardManager");

    // 清空原来的页面内容，准备重新绘制
    t1.find("tr:first")
        .next()
        .next()
        .next()
        .html("<td id='gem_house_UI' style='width:100%;text-align:center'></td>")
        .next()
        .remove();

    // 绘制新的内容
    let html = "";
    html += "<table style='width:100%;border-width:0;background-color:#888888;margin:auto'>";
    html += "<tbody>";
    // ------------------------------------------------------------------------
    // 隐藏的表单
    // ------------------------------------------------------------------------
    html += "<tr style='display:none'>";
    html += "<td id='hidden_form_cell'></td>";
    html += "</tr>";
    // ------------------------------------------------------------------------
    // 主菜单
    // ------------------------------------------------------------------------
    html += "<tr>";
    html += "<td style='background-color:#F8F0E0;text-align:center'>";
    html += "<input type='button' id='refresh_button' value='刷新宝石屋'>";
    html += "<input type='button' id='return_button' value='离开宝石屋'>";
    html += "</td>";
    // ------------------------------------------------------------------------
    // 个人物品栏
    // ------------------------------------------------------------------------
    html += "<tr style='display:none'>";
    html += "<td id='equipment_list_cell'></td>";
    html += "</tr>";
    // ------------------------------------------------------------------------
    // 宝石栏
    // ------------------------------------------------------------------------
    html += "<tr style='display:none'>";
    html += "<td id='gem_list_cell'></td>";
    html += "</tr>";
    html += "</tbody>";
    html += "</table>";

    $("#gem_house_UI").html(html);

    doGenerateHiddenForm(page.credential);
    doBindReturnButton();
    doBindRefreshButton(page.credential);

    doRender(page);
}

function doGenerateHiddenForm(credential: Credential) {
    let html = "";
    // noinspection HtmlUnknownTarget
    html += "<form action='status.cgi' method='post' id='return_form'>";
    html += "<input type='hidden' name='id' value='" + credential.id + "'>";
    html += "<input type='hidden' name='pass' value='" + credential.pass + "'>";
    html += "<input type='hidden' name='mode' value='STATUS'>";
    html += "<input type='submit' id='return_submit'>";
    html += "</form>";
    $("#hidden_form_cell").html(html);
}

function doBindReturnButton() {
    $("#return_button").on("click", function () {
        $("#return_submit").trigger("click");
    });
}

function doRefresh(credential: Credential) {
    document.getElementById("title_cell")?.scrollIntoView();
    $("#equipment_list_cell").parent().hide();
    $("#gem_list_cell").parent().hide();
    $(".dynamic_button_class").off("click");
    new TownGemHouse(credential).enter()
        .then(page => {
            const roleCash = page.roleCash!;
            $("#roleCash").text(roleCash + " GOLD");
            doRender(page);
        });
}

function doBindRefreshButton(credential: Credential) {
    $("#refresh_button").on("click", function () {
        $("#messageBoardManager").html(NpcLoader.randomNpcImageHtml());
        MessageBoard.resetMessageBoard("钻石恒久远，一颗永流传。");
        doRefresh(credential);
    });
}

function doRender(page: TownGemHousePage) {

}

export = TownGemHouseProcessor;