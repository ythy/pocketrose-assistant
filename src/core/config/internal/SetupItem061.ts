import MessageBoard from "../../../util/MessageBoard";
import StorageUtils from "../../../util/StorageUtils";
import SetupItem from "../SetupItem";
import SetupLoader from "../SetupLoader";

//ythy
class SetupItem061 implements SetupItem {
  code(): string {
    return code;
  }

  render(id?: string): void {
    doRender();
  }
}

const code: string = "061";
const name: string = "出率提升";
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

  const value = SetupLoader.getDropRatio();
  $(".option_class_" + code + "[value='" + Number(value) + "']").prop(
    "selected",
    true
  );
  $("#setup_" + code).on("click", function () {
    doSaveSetupItem();
  });
}

function doGenerateSetupItem() {
  let html = "";
  html += "<select id='select_" + code + "'>";
  html += "<option class='option_class_" + code + "' value='1'>默认</option>";
  html += "<option class='option_class_" + code + "' value='3'>3倍</option>";
  html += "<option class='option_class_" + code + "' value='5'>5倍</option>";
  html += "<option class='option_class_" + code + "' value='10'>10倍</option>";
  html += "<option class='option_class_" + code + "' value='15'>15倍</option>";
  html += "<option class='option_class_" + code + "' value='20'>20倍</option>";
  html += "<option class='option_class_" + code + "' value='25'>25倍</option>";
  html += "<option class='option_class_" + code + "' value='30'>30倍</option>";
  html += "<option class='option_class_" + code + "' value='40'>40倍</option>";
  html += "<option class='option_class_" + code + "' value='50'>50倍</option>";
  html +=
    "<option class='option_class_" + code + "' value='100'>100倍</option>";
  html +=
    "<option class='option_class_" + code + "' value='200'>200倍</option>";
  html += "</select>";
  return html;
}

function doSaveSetupItem() {
  const value = $("#select_" + code).val();
  StorageUtils.set(key, value!.toString());
  MessageBoard.publishMessage(
    "<b style='color:red'>" + name + "</b>已经设置。"
  );
  $("#refreshButton").trigger("click");
}

export = SetupItem061;
