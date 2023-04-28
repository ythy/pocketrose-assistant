import PocketroseProcessor from "../PocketroseProcessor";
import PageUtils from "../../util/PageUtils";
import RoleLoader from "../../pocket/RoleLoader";
import Role from "../../pocket/Role";

class SetupProcessor extends PocketroseProcessor {

    process() {
        const credential = PageUtils.currentCredential();

        new RoleLoader(credential).load()
            .then(role => {
                console.log(JSON.stringify(role as Role));
            });
    }

}

export = SetupProcessor;