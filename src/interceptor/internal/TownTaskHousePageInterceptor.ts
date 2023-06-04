import LocationStateMachine from "../../core/state/LocationStateMachine";
import TownTaskHousePageProcessor from "../../processor/internal/TownTaskHousePageProcessor";
import PageProcessorContext from "../../processor/PageProcessorContext";
import PageInterceptor from "../PageInterceptor";

class TownTaskHousePageInterceptor implements PageInterceptor {

    readonly #processor = new TownTaskHousePageProcessor();

    accept(cgi: string, pageText: string): boolean {
        if (cgi === "town.cgi") {
            return pageText.includes("＜＜ * 网 球 场 *＞＞");
        }
        return false;
    }

    intercept(): void {
        LocationStateMachine.create()
            .load()
            .whenInTown(townId => {
                const context = new PageProcessorContext().withTownId(townId);
                this.#processor.process(context);
            })
            .fork();
    }

}

export = TownTaskHousePageInterceptor;