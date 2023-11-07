import MessageBoard from "../../../util/MessageBoard";
import StorageUtils from "../../../util/StorageUtils";
import SetupItem from "../SetupItem";
import SetupLoader from "../SetupLoader";
import Constants from "../../../util/Constants";

//ythy
class SetupItem065 implements SetupItem {
  code(): string {
    return code;
  }

  render(id?: string): void {
    doRender();
  }
}

const code: string = "065";
const name: string = "宠物升级词条";
const key: string = "_pa_" + code;

function doRender() {
  let html = "";
  html += "<tr>";
  html += "<th style='background-color:#E8E8D0'>" + name + "</th>";
  html += "<td style='background-color:#E8E8D0'></td>";
  html +=
    "<td style='background-color:#EFE0C0'><input type='button' class='dynamic_button' id='setup_" +
    code +
    "' value='设置'></td>";
  html +=
    "<td style='background-color:#E0D0B0;text-align:left' colspan='2'>" +
    doGenerateSetupItem() +
    "</td>";
  html += "</tr>";
  $("#setup_item_table").append($(html));

  const value = SetupLoader.getPetDeclarations();

  $(`#text_${code}1`).val(value["upgrade"]);
  $(`#text_${code}2`).val(value["learn"]);

  $("#setup_" + code).on("click", function () {
    doSaveSetupItem();
  });
}

function doGenerateSetupItem() {
  let html = "";
  html +=
    "<textarea  id='text_" +
    code +
    "1'   rows='1'  style='margin: 5px 0px;width:90%' placeholder='" +
    Constants.PET_UPGRADE_DECLARATIONS +
    "'></textarea>";
  html +=
    "<textarea id='text_" +
    code +
    "2'   rows='1'  style='margin: 5px 0px;width:90%'  placeholder='" +
    Constants.PET_LEARN_DECLARATIONS +
    "'></textarea>";
  return html;
}

function doSaveSetupItem() {
  let upgrade = $(`#text_${code}1`).val() ?? "";
  let learn = $(`#text_${code}2`).val() ?? "";

  StorageUtils.set(
    key,
    JSON.stringify({
      upgrade,
      learn,
    })
  );
  MessageBoard.publishMessage(
    "<b style='color:red'>" + name + "</b>已经设置。"
  );
  $("#refreshButton").trigger("click");
}

export = SetupItem065;
