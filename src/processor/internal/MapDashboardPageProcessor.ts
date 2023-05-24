import SetupLoader from "../../config/SetupLoader";
import EventHandler from "../../core/EventHandler";
import MapBuilder from "../../core/MapBuilder";
import CastleInformation from "../../pocketrose/CastleInformation";
import MapDashboardPage from "../../pocketrose/MapDashboardPage";
import Coordinate from "../../util/Coordinate";
import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import StringUtils from "../../util/StringUtils";
import PageProcessorContext from "../PageProcessorContext";
import PageProcessorCredentialSupport from "../PageProcessorCredentialSupport";

class MapDashboardPageProcessor extends PageProcessorCredentialSupport {

    doProcess(credential: Credential, context?: PageProcessorContext): void {
        if (context === undefined || context.get("coordinate") === undefined) {
            return;
        }

        const page = MapDashboardPage.parse(PageUtils.currentPageHtml());

        $("table:first")
            .find("tbody:first")
            .find("> tr:eq(2)")
            .attr("id", "mapRow");

        let travelJournals = $("#mapRow")
            .find("> td:last")
            .html();

        $("#mapRow").html("" +
            "<td colspan='2'>" +
            "<table style='background-color:transparent;margin:auto;width:100%'>" +
            "<tbody>" +
            "<tr>" +
            "<td id='map' style='background-color:#F8F0E0'></td>" +
            "<td id='travelJournals' style='background-color:#EFE0C0;width:100%'></td>" +
            "</tr>" +
            "</tbody>" +
            "</table>" +
            "</td>");
        $("#map").html(MapBuilder.buildMapTable());
        $("#travelJournals").html(travelJournals);

        MapBuilder.updateTownBackgroundColor();

        // 如果有必要的话绘制城堡
        new CastleInformation()
            .load(page.role!.name!)
            .then(castle => {
                const coordinate = castle.coordinate!;
                const buttonId = "location_" + coordinate.x + "_" + coordinate.y;
                $("#" + buttonId)
                    .attr("value", "堡")
                    .css("background-color", "fuchsia")
                    .parent()
                    .attr("title", "城堡" + coordinate.asText() + " " + castle.name)
                    .attr("class", "color_fuchsia");
            });

        const coordinate = Coordinate.parse(context.get("coordinate")!);
        const buttonId = "location_" + coordinate.x + "_" + coordinate.y;
        $("#" + buttonId)
            .closest("td")
            .css("background-color", "black")
            .css("color", "yellow")
            .css("text-align", "center")
            .html($("#" + buttonId).val() as string);

        this.#bindLocationButtons();

        this.#renderMenu();
        this.#renderExperience();
        this.#renderEventBoard();
    }

    #bindLocationButtons() {
        $(".location_button_class")
            .on("mouseenter", function () {
                $(this).css("background-color", "red");
            })
            .on("mouseleave", function () {
                const s = $(this).parent().attr("class")!;
                const c = StringUtils.substringAfter(s, "_");
                if (c !== "none") {
                    $(this).css("background-color", c);
                } else {
                    $(this).removeAttr("style");
                }
            });
    }

    #renderMenu() {
        $("option[value='MAP_VISIT']")
            .css("background-color", "yellow")
            .text("拜访·驿站");
    }

    #renderExperience() {
        if (!SetupLoader.isExperienceProgressBarEnabled()) {
            return;
        }
        $("td:contains('经验值')")
            .filter(function () {
                return $(this).text() === "经验值";
            })
            .next()
            .each(function (_idx, th) {
                const expText = $(th).text();
                const experience = parseInt(StringUtils.substringBefore(expText, " EX"));
                if (experience >= 14900) {
                    $(th).css("color", "blue").text("MAX");
                } else {
                    const level = Math.ceil(experience / 100) + 1;
                    const ratio = level / 150;
                    const progressBar = PageUtils.generateProgressBarHTML(ratio);
                    $(th).html("<span title='" + expText + "'>" + progressBar + "</span>");
                }
            });
    }

    #renderEventBoard() {
        $("td:contains('最近发生的事件')")
            .filter(function () {
                return $(this).text() === "最近发生的事件";
            })
            .parent()
            .next()
            .find("td:first")
            .attr("id", "eventBoard");

        const eventHtmlList: string[] = [];
        $("#eventBoard").html()
            .split("<br>")
            .filter(it => it.endsWith(")"))
            .map(function (it) {
                // noinspection HtmlDeprecatedTag,XmlDeprecatedElement,HtmlDeprecatedAttribute
                const header: string = "<font color=\"navy\">●</font>";
                return StringUtils.substringAfter(it, header);
            })
            .map(function (it) {
                return EventHandler.handleWithEventHtml(it);
            })
            .forEach(it => eventHtmlList.push(it));

        let html = "";
        html += "<table style='border-width:0;width:100%;height:100%;margin:auto'>";
        html += "<tbody>";
        eventHtmlList.forEach(it => {
            html += "<tr>";
            html += "<th style='color:navy;vertical-align:top'>●</th>";
            html += "<td style='width:100%'>";
            html += it;
            html += "</td>";
            html += "</tr>";
        });
        html += "</tbody>";
        html += "</table>";

        $("#eventBoard").html(html);
    }
}

export = MapDashboardPageProcessor;