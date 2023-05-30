import SetupLoader from "../config/SetupLoader";
import TownDashboardPage from "../pocketrose/TownDashboardPage";
import Credential from "../util/Credential";
import TownDashboardLayout from "./TownDashboardLayout";

class TownDashboardLayout002 extends TownDashboardLayout {

    id(): number {
        return 2;
    }

    render(credential: Credential, page: TownDashboardPage): void {
        $("center:first").hide();
        $("br:first").hide();

        $("table:first")
            .find("> tbody:first")
            .find("> tr:eq(1)")
            .find("> td:first")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:first").hide();

        $("#leftPanel").hide();

        $("#rightPanel")
            .removeAttr("width")
            .css("width", "100%")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:eq(1)")
            .find("> td:first")
            .find("> table:first")
            .find("> tbody:first")
            .find("> tr:first")
            .find("> th:first")
            .css("font-size", "200%");

        if (page.role!.country !== "在野" && page.role!.country === page.townCountry) {
            $("#rightPanel")
                .find("> table:first")
                .find("> tbody:first")
                .find("> tr:eq(1)")
                .find("> td:first")
                .find("> table:first")
                .find("> tbody:first")
                .find("> tr:eq(3)")
                .each((idx, tr) => {
                    const tax = page.townTax!;
                    $(tr).after($("<tr><td>收益</td><th id='townTax'>" + tax + "</th><td colspan='2'></td></tr>"));
                    if (tax - Math.floor(tax / 50000) * 50000 <= 10000) {
                        $("#townTax")
                            .css("color", "white")
                            .css("background-color", "green")
                            .css("font-weight", "bold")
                            .on("click", () => {
                                if (!SetupLoader.isCollectTownTaxDisabled()) {
                                    $("option[value='MAKE_TOWN']")
                                        .prop("selected", true)
                                        .closest("td")
                                        .next()
                                        .find("> input:submit:first")
                                        .trigger("click");
                                }
                            });
                    }
                });
        }

        $("table:first")
            .next()
            .find("> tbody:first")
            .find("> tr:first").hide()
            .next()
            .next()
            .find("> td:first")
            .removeAttr("width")
            .css("width", "100%")
            .next().hide();

        const enlargeRatio = SetupLoader.getEnlargeBattleRatio();
        if (enlargeRatio > 0) {
            const fontSize = 100 * enlargeRatio;
            $("#battleCell")
                .find("select:first")
                .css("font-size", fontSize + "%");
            $("#townCell")
                .find("select:first")
                .css("font-size", fontSize + "%");
            $("#personalCell")
                .find("select:first")
                .css("font-size", fontSize + "%");
            $("#countryNormalCell")
                .find("select:first")
                .css("font-size", fontSize + "%");
            $("#countryAdvancedCell")
                .find("select:first")
                .css("font-size", fontSize + "%");
        }
        $("#battleCell")
            .parent()
            .before($("<tr><td colspan='4'>　</td></tr>"))
            .after($("<tr><td colspan='4'>　</td></tr>"));
        $("#townCell")
            .parent()
            .after($("<tr><td colspan='4'>　</td></tr>"));
        $("#personalCell")
            .parent()
            .after($("<tr><td colspan='4'>　</td></tr>"));
        $("#countryNormalCell")
            .parent()
            .after($("<tr><td colspan='4'>　</td></tr>"));
    }

}

export = TownDashboardLayout002;