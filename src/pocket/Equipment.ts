import Coordinate from "../util/Coordinate";
import TownLoader from "./TownLoader";
import PageUtils from "../util/PageUtils";
import StringUtils from "../util/StringUtils";

const PROHIBIT_SELLING_ITEM_LIST = [
    "千与千寻",
    "勿忘我",
    "神枪 永恒",
    "霸邪斧 天煌",
    "魔刀 哭杀",
    "神器 苍穹",
    "魔神器 幻空",
    "真·圣剑 苍白的正义",
    "双经斩",
    "千幻碧水猿洛克奇斯",
    "地纹玄甲龟斯特奥特斯",
    "幽冥黑鳞蟒罗尼科斯",
    "火睛混沌兽哈贝达",
    "羽翅圣光虎阿基勒斯",
    "金翅追日鹰庞塔雷斯",
    "风翼三足凤纳托利斯",
    "圣皇铠甲 天威",
    "薄翼甲",
    "魔盔 虚无",
    "神冠 灵通",
    "龙",
    "玉佩",
    "宠物蛋"
];

const NO_EXPERIENCE_ITEM_LIST = [
    "大师球",
    "宗师球",
    "超力怪兽球",
    "宠物蛋"
];

const NONE_REPAIRABLE_ITEM_LIST = [
    "大师球",
    "宗师球",
    "超力怪兽球",
    "宠物蛋"
];

const ATTRIBUTE_HEAVY_ARMOR_ITEM_LIST = [
    "千幻碧水猿洛克奇斯",
    "地纹玄甲龟斯特奥特斯",
    "幽冥黑鳞蟒罗尼科斯",
    "火睛混沌兽哈贝达",
    "羽翅圣光虎阿基勒斯",
    "金翅追日鹰庞塔雷斯",
    "风翼三足凤纳托利斯"
];

class Equipment {

    index?: number;                      // 下标（唯一性）
    selectable?: boolean;                // 是否可以被选择
    using?: boolean;                     // 是否装备
    name?: string;                       // 名字
    star?: boolean;                      // 是否齐心
    nameHTML?: string;                   // 名字HTML代码
    category?: string;                   // 种类
    power?: number;                      // 效果
    weight?: number;                     // 重量
    endure?: number;                     // 耐久
    maxEndure?: number;                  // 最大耐久
    requiredCareer?: string;             // 装备需要的职业
    requiredAttack?: number;             // 装备需要的攻击力
    requiredDefense?: number;            // 装备需要的防御力
    requiredSpecialAttack?: number;      // 装备需要的智力
    requiredSpecialDefense?: number;     // 装备需要的精神力
    requiredSpeed?: number;              // 装备需要的速度
    experience?: number;                 // 经验
    additionalPower?: number;            // 附加威力
    additionalWeight?: number;           // 附加重量
    additionalLuck?: number;             // 附加幸运
    attribute?: string;                  // 属性
    price?: number;                      // 价格
    priceHTML?: string;                  // 价格HTML代码

    parseName(nameHtml: string) {
        this.nameHTML = nameHtml;
        const s = PageUtils.convertHtmlToText(nameHtml);
        if (s.startsWith("齐心★")) {
            this.star = true;
            this.name = StringUtils.substringAfter(s, "齐心★");
        } else {
            this.star = false;
            this.name = s;
        }
    }

    parseEndure(endureText: string) {
        if (endureText.includes("/")) {
            const a = StringUtils.substringBeforeSlash(endureText);
            const b = StringUtils.substringAfterSlash(endureText);
            this.endure = parseInt(a);
            this.maxEndure = parseInt(b);
        } else {
            this.endure = parseInt(endureText);
        }
    }

    parsePrice(priceHtml: string) {
        this.priceHTML = priceHtml;
        let s = PageUtils.convertHtmlToText(priceHtml);
        if (s.includes(" ")) {
            s = StringUtils.substringBefore(s, " ");
        }
        this.price = parseInt(s);
    }

    get isWeapon() {
        return this.category === "武器";
    }

    get isArmor() {
        return this.category === "防具";
    }

    get isAccessory() {
        return this.category === "饰品";
    }

    get isItem() {
        return this.category === "物品";
    }

    get isTreasureBag(): boolean {
        return this.isItem && this.name === "百宝袋";
    }

    get isGoldenCage(): boolean {
        return this.isItem && this.name === "黄金笼子";
    }

    get isSellable() {
        if (this.selectable !== undefined && !this.selectable) {
            return false;
        }
        if (this.using !== undefined && this.using) {
            return false;
        }
        for (const it of PROHIBIT_SELLING_ITEM_LIST) {
            if (this.name!.endsWith(it)) {
                return false;
            }
        }
        return true;
    }

    get isRepairable() {
        if (this.isItem) {
            return this.name!.includes("(自动)");
        } else {
            return !NONE_REPAIRABLE_ITEM_LIST.includes(this.name!);
        }
    }

    get isStorable(): boolean {
        if (this.using!) {
            return false;
        }
        if (this.isItem) {
            return false;
        }
        return !NONE_REPAIRABLE_ITEM_LIST.includes(this.name!);
    }

    get fullExperienceRatio() {
        if (this.isItem) {
            return -1;
        }
        if (NO_EXPERIENCE_ITEM_LIST.includes(this.name!)) {
            return -1;
        }
        let maxExperience = 0;
        if (isAttributeHeavyArmor(this.name!)) {
            // 属性重铠满级经验为76000
            maxExperience = 76000;
        } else if (this.power !== 0) {
            const powerForUse = Math.abs(this.power!);
            maxExperience = Math.floor(powerForUse * 0.2) * 1000;
        }
        if (maxExperience === 0) {
            return -1;
        }
        if (this.experience! >= maxExperience) {
            return 1;
        }
        if (this.experience === 0) {
            return 0;
        }
        return this.experience! / maxExperience;
    }

    get checkboxHTML() {
        if (this.selectable) {
            return "<input type='checkbox' name='item" + this.index + "' value='" + this.index + "' class='personal_checkbox'>";
        } else {
            return "";
        }
    }

    get usingHTML() {
        if (!this.using) {
            return "";
        }
        const ratio = this.fullExperienceRatio;
        if (ratio === 1 || ratio < 0) {
            return "<span title='装备中' style='color:red'>★</span>";
        } else {
            return "<span title='装备中'>★</span>";
        }
    }

    get experienceHTML() {
        if (this.isItem) {
            if (this.name === "藏宝图") {
                const coordinate = new Coordinate(this.power!, this.weight!);
                if (!coordinate.isAvailable) {
                    return "<b style='color:red'>活动图</b>";
                }
                const town = TownLoader.getTownByCoordinate(coordinate);
                if (town !== null) {
                    return "<b style='color:red'>" + town.name + "</b>";
                } else {
                    return "-";
                }
            } else {
                return "-";
            }
        }
        const ratio = this.fullExperienceRatio;
        if (ratio < 0) {
            return "-";
        }
        if (ratio === 1) {
            return "<span style='color:red' title='" + this.experience + "'>MAX</span>";
        }
        const progressBar = PageUtils.generateProgressBarHTML(ratio);
        return "<span title='" + this.experience + " (" + (ratio * 100).toFixed(2) + "%)'>" + progressBar + "</span>"
    }

    get fullName() {
        if (this.star) {
            return "齐心★" + this.name!;
        } else {
            return this.name!;
        }
    }

    get endureHtml() {
        if (this.isItem && !this.name!.includes("自动")) {
            return "-";
        }
        if (this.maxEndure === undefined) {
            return this.endure!;
        } else {
            return this.endure! + "/" + this.maxEndure!;
        }
    }
}

function isAttributeHeavyArmor(name: string) {
    for (const it of ATTRIBUTE_HEAVY_ARMOR_ITEM_LIST) {
        if (name.endsWith(it)) {
            return true;
        }
    }
    return false;
}

export = Equipment;