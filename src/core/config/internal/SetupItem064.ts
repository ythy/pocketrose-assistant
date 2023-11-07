import MessageBoard from "../../../util/MessageBoard";
import StorageUtils from "../../../util/StorageUtils";
import SetupItem from "../SetupItem";
import SetupLoader from "../SetupLoader";
import Constants from "../../../util/Constants";

//ythy
class SetupItem064 implements SetupItem {
  code(): string {
    return code;
  }

  render(id?: string): void {
    doRender();
  }
}

const code: string = "064";
const name: string = "特别技能";
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

  const value = SetupLoader.getGoodSpell();

  $(`#text_${code}1`).val(value["gold"].join(","));
  $(`#text_${code}2`).val(value["silver"].join(","));
  $(`#text_${code}3`).val(value["copper"].join(","));
  $(`#text_${code}4`).val(value["iron"].join(","));

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
    Constants.GoodSpell1.join(",") +
    "'></textarea>";
  html +=
    "<textarea id='text_" +
    code +
    "2'   rows='1'  style='margin: 5px 0px;width:90%'  placeholder='" +
    Constants.GoodSpell2.join(",") +
    "'></textarea>";
  html +=
    "<textarea id='text_" +
    code +
    "3'   rows='1'  style='margin: 5px 0px;width:90%'  placeholder='" +
    Constants.GoodSpell3.join(",") +
    "'></textarea>";
  html +=
    "<textarea id='text_" +
    code +
    "4'   rows='2'  style='margin: 5px 0px;width:90%'  placeholder='" +
    Constants.GoodSpell4.join(",") +
    "'></textarea>";
  return html;
}

function doSaveSetupItem() {
  let gold = $(`#text_${code}1`).val();
  let silver = $(`#text_${code}2`).val();
  let copper = $(`#text_${code}3`).val();
  let iron = $(`#text_${code}4`).val();

  StorageUtils.set(
    key,
    JSON.stringify({
      gold: String(gold ?? "").split(","),
      silver: String(silver ?? "").split(","),
      copper: String(copper ?? "").split(","),
      iron: String(iron ?? "").split(","),
    })
  );
  MessageBoard.publishMessage(
    "<b style='color:red'>" + name + "</b>已经设置。"
  );
  $("#refreshButton").trigger("click");
}

export = SetupItem064;
