import Credential from "../../util/Credential";
import PageUtils from "../../util/PageUtils";
import StringUtils from "../../util/StringUtils";
import TreasureLoader from "../equipment/TreasureLoader";
import PalaceTaskManager from "../task/PalaceTaskManager";
import BattleLog from "./BattleLog";
import BattleLogStorage from "./BattleLogStorage";
import BattlePage from "./BattlePage";
import BattlePageParser from "./BattlePageParser";
import BattleRecommendation from "./BattleRecommendation";
import BattleRecord from "./BattleRecord";
import BattleRecordStorage from "./BattleRecordStorage";
import BattleResultStorage from "./BattleResultStorage";

//ythy
class BattleProcessor {
  readonly #credential: Credential;
  readonly #html: string;
  readonly #battleCount: number;

  page?: BattlePage;
  recommendation?: string;

  constructor(credential: Credential, html: string, battleCount: number) {
    this.#credential = credential;
    this.#html = html;
    this.#battleCount = battleCount;
  }

  get obtainBattleCount(): number {
    return this.#battleCount;
  }

  get obtainPage(): BattlePage {
    return this.page!;
  }

  get obtainRecommendation(): string {
    return this.recommendation!;
  }

  async doProcess() {
    // 解析战斗页面
    this.page = await BattlePageParser.parse(this.#html, this.#credential);

    // 确认后续行为
    this.recommendation = await BattleRecommendation.analysis(
      this.#battleCount,
      this.obtainPage
    );

    // 检查是否完成了皇宫任务
    if (this.page.monsterTask!) {
      await new PalaceTaskManager(this.#credential).completeMonsterTask();
    }
    await this.#internalProcess();

    return await (() => {
      return new Promise<void>((resolve) => resolve());
    })();
  }

  async #internalProcess() {
    // 写入战斗记录到DB
    const record = new BattleRecord();
    record.id = this.#credential.id;
    record.html = this.obtainPage.reportHtml;
    await BattleRecordStorage.getInstance().write(record);

    // 分析入手的结果
    let catchCount: number | undefined = undefined;
    let photoCount: number | undefined = undefined;
    let treasures: Map<string, number> | undefined = undefined;
    const monster = PageUtils.convertHtmlToText(this.page!.monsterNameHtml!);
    if (
      this.page!.harvestList !== undefined &&
      this.page!.harvestList.length > 0
    ) {
      for (const harvest of this.page!.harvestList) {
        const it = PageUtils.convertHtmlToText(harvest);
        if (it.includes(monster + "入手")) {
          if (catchCount === undefined) {
            catchCount = 0;
          }
          catchCount++;
        } else if (it.includes("图鉴入手")) {
          if (photoCount === undefined) {
            photoCount = 0;
          }
          photoCount++;
        } else {
          const treasureName = StringUtils.substringBefore(it, "入手");
          const code = TreasureLoader.getCodeAsString(treasureName);
          if (treasures === undefined) {
            treasures = new Map<string, number>();
          }
          const tc = treasures.get(code);
          if (tc === undefined) {
            treasures.set(code, 1);
          } else {
            treasures.set(code, tc + 1);
          }
        }
      }
    }

    // 战斗日志
    const log = new BattleLog();
    log.initialize();
    log.roleId = this.#credential.id;
    log.monster = monster;
    log.result = this.page!.battleResult!;
    log.catch = catchCount;
    log.photo = photoCount;
    log.treasures = treasures;
    await BattleLogStorage.getInstance().write(log); // 写入战斗日志
    await BattleResultStorage.getInstance().replay(log); // 写入战斗结果

    return await (() => {
      return new Promise<void>((resolve) => resolve());
    })();
  }
}

export = BattleProcessor;
