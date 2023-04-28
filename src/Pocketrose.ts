import StringUtils from "./util/StringUtils";
import BattleRequestInterceptor from "./interceptor/BattleRequestInterceptor";
import PersonalRequestInterceptor from "./interceptor/PersonalRequestInterceptor";
import StatusRequestInterceptor from "./interceptor/StatusRequestInterceptor";

$(function () {
    if (!location.href.includes("pocketrose")) {
        return
    }
    pocketrose()
})

const interceptorList = [
    new BattleRequestInterceptor(),
    new PersonalRequestInterceptor(),
    new StatusRequestInterceptor()
]

function pocketrose() {
    $(document).ready(function () {
        const request = StringUtils.substringAfterLast(location.href, "/")
        let interceptor = null
        for (const it of interceptorList) {
            if (it.cgi === request) {
                interceptor = it
                break
            }
        }
        if (interceptor !== null) {
            interceptor.process()
        }
    });
}