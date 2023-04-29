import PageProcessor from "../PageProcessor";
import PageUtils from "../../util/PageUtils";
import Credential from "../../util/Credential";
import RoleLoader from "../../pocket/RoleLoader";
import Role from "../../pocket/Role";
import DOMAIN from "../../util/Constants";
import MessageBoard from "../../util/MessageBoard";
import SetupItem001 from "./internal/SetupItem001";
import SetupItem002 from "./internal/SetupItem002";
import SetupItem003 from "./internal/SetupItem003";
import SetupItem004 from "./internal/SetupItem004";
import SetupItem005 from "./internal/SetupItem005";
import SetupItem006 from "./internal/SetupItem006";
import SetupItem007 from "./internal/SetupItem007";
import SetupItem008 from "./internal/SetupItem008";
import SetupItem009 from "./internal/SetupItem009";
import SetupItem010 from "./internal/SetupItem010";
import SetupItem011 from "./internal/SetupItem011";
import SetupItem012 from "./internal/SetupItem012";
import SetupItem013 from "./internal/SetupItem013";
import SetupItem014 from "./internal/SetupItem014";
import SetupItem015 from "./internal/SetupItem015";
import SetupItem016 from "./internal/SetupItem016";
import SetupItem017 from "./internal/SetupItem017";
import SetupItem018 from "./internal/SetupItem018";

class SetupProcessor extends PageProcessor {

    process() {
        PageUtils.removeUnusedHyperLinks();
        PageUtils.removeGoogleAnalyticsScript();
        const credential = PageUtils.currentCredential();
        doInitialize(credential);
    }

}

const setupItemList: SetupItem[] = [
    new SetupItem001(),
    new SetupItem002(),
    new SetupItem003(),
    new SetupItem004(),
    new SetupItem005(),
    new SetupItem006(),
    new SetupItem007(),
    new SetupItem008(),
    new SetupItem009(),
    new SetupItem010(),
    new SetupItem011(),
    new SetupItem012(),
    new SetupItem013(),
    new SetupItem014(),
    new SetupItem015(),
    new SetupItem016(),
    new SetupItem017(),
    new SetupItem018()
];

function doInitialize(credential: Credential) {
    // 整个页面是放在一个大form里面，删除重组
    const lastDivHtml = $("div:last").html();
    $("form:first").remove();
    $("body:first").prepend($("<div id='top_container'></div>" +
        "<hr style='height:0;width:100%'>" +
        "<div style='text-align:center'>" + lastDivHtml + "</div>"));

    // 绘制新的页面
    let html = "";
    html += "<div id='eden' style='display:none'>";
    html += "<form action='' method='post' id='eden_form'>";
    html += "<input type='hidden' name='id' value='" + credential.id + "'>";
    html += "<input type='hidden' name='pass' value='" + credential.pass + "'>";
    html += "<div style='display:none' id='eden_form_payload'></div>";
    html += "<input type='submit' id='eden_form_submit'>";
    html += "</form>";
    html += "</div>";
    $("#top_container").append($(html));

    html = "";
    html += "<table style='background-color:#888888;width:100%;text-align:center'>";
    html += "<tbody style='background-color:#F8F0E0'>";
    html += "<tr>";
    html += "<td style='background-color:navy;color:yellowgreen;font-size:200%;font-weight:bold'>" +
        "＜＜ 口 袋 助 手 设 置 ＞＞" +
        "</td>";
    html += "</tr>";
    html += "<tr>";
    html += "<td id='message_board_container'></td>";
    html += "</tr>";
    html += "<tr>";
    html += "<td id='setup_item_container'></td>";
    html += "</tr>";
    html += "<tr>";
    html += "<td style='text-align:center'>" +
        "<input type='button' id='refreshButton' value='刷新助手设置'>" +
        "<input type='button' id='returnButton' value='返回城市界面'>" +
        "</td>";
    html += "</tr>";
    html += "</tody>";
    html += "</table>";
    $("#top_container").append($(html));

    __bindRefreshButton(credential);
    __bindReturnButton();

    new RoleLoader(credential).load()
        .then(role => {
            const image = (role as Role).image!;
            const src = DOMAIN + "/image/head/" + image;
            const imageHtml = "<img src='" + src + "' alt='' width='64' height='64' id='roleImage'>";
            MessageBoard.createMessageBoard("message_board_container", imageHtml);

            $("#roleImage").on("dblclick", function () {
                // Get setup 001-005 status
                const s1 = $("#select_001").val();
                const s2 = $("#select_002").val();
                const s3 = $("#select_003").val();
                const s4 = $("#select_004").val();
                const s5 = $("#select_005").val();
                if (s1 === "1" &&
                    s2 === "0.2" &&
                    s3 === "20" &&
                    s4 === "20" &&
                    s5 === "2") {
                    if ($("#battle_field_setup").length > 0) {
                        $("#battle_field_setup").toggle();
                    }
                }
            });
        });

    doRender(credential);
}

function doRender(credential: Credential) {
    let html = "";
    html += "<table style='background-color:#888888;width:100%;text-align:center'>";
    html += "<tbody style='background-color:#F8F0E0' id='setup_item_table'>";
    html += "<tr>";
    html += "<th style='background-color:#E8E8D0'>名字</th>";
    html += "<th style='background-color:#E8E8D0'>专属</th>";
    html += "<th style='background-color:#EFE0C0'>设置</th>";
    html += "<th style='background-color:#E0D0B0'>选择</th>";
    html += "</tr>";
    html += "</tbody>";
    html += "</table>";
    $("#setup_item_container").html(html);

    for (const it of setupItemList) {
        it.render(credential.id);
    }

}

function __bindRefreshButton(credential: Credential) {
    $("#refreshButton").on("click", function () {
        $("#setup_item_table").html("");
        $(".dynamic_button").off("click");
        doRender(credential);
    });
}

function __bindReturnButton() {
    $("#returnButton").on("click", function () {
        $("#eden_form").attr("action", "status.cgi");
        $("#eden_form_payload").html("<input type='hidden' name='mode' value='STATUS'>");
        $("#eden_form_submit").trigger("click");
    });
}

export = SetupProcessor;