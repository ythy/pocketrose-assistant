import MessageBoard from "../../../util/MessageBoard";
import StorageUtils from "../../../util/StorageUtils";
import SetupItem from "../SetupItem";
import SetupLoader from "../SetupLoader";
import Constants from "../../../util/Constants";

//ythy
class SetupItem063 implements SetupItem {
  code(): string {
    return code;
  }

  render(id?: string): void {
    doRender();
  }
}

const code: string = "063";
const name: string = "特别小宠物";
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

  const value = SetupLoader.getSpecialMonster();

  $(`#text_${code}`).html(value.join(","));

  $("#setup_" + code).on("click", function () {
    doSaveSetupItem();
  });
}

function doGenerateSetupItem() {
  let html = "";
  html +=
    "<textarea  id='text_" +
    code +
    "'   rows='2'  style='margin: 5px 0px;width:90%'  placeholder='" +
    Constants.SPECIAL_MONSTER.join(",") +
    "'></textarea>";
  return html;
}

function doSaveSetupItem() {
  let value = $(`#text_${code}`).html();

  StorageUtils.set(key, String(value ?? ""));
  MessageBoard.publishMessage(
    "<b style='color:red'>" + name + "</b>已经设置。"
  );
  $("#refreshButton").trigger("click");
}

export = SetupItem063;
