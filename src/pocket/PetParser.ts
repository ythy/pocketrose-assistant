import StringUtils from "../util/StringUtils";
import Pet from "./Pet";

class PetParser {

    static parsePersonalPetList(pageHtml: string): Pet[] {
        const petList: Pet[] = [];
        $(pageHtml).find("input:radio[name='select']").each(function (_idx, radio) {
            const index = $(radio).val() as string;
            if (parseInt(index) >= 0) {
                // index为-1的意味着“无宠物”那个选项
                const table = $(radio).closest("table");
                // pet index & using
                const pet = new Pet();
                pet.index = parseInt(index);
                const usingText = radio.nextSibling!.nodeValue;
                if (usingText === "未使用") {
                    pet.using = false;
                }
                if (usingText === "★使用") {
                    pet.using = true;
                }
                doParsePet(pet, table);
                petList.push(pet);
            }
        });
        return petList;
    }

    static parsePersonalPetStudyStatus(html: string): number[] {
        const studyStatus: number[] = [];
        $(html).find("input:checkbox:checked").each(function (_idx, checkbox) {
            const name = $(checkbox).attr("name") as string;
            if (name.startsWith("study")) {
                studyStatus.push(parseInt($(checkbox).val() as string));
            }
        });
        return studyStatus;
    }

    static parseGoldenCagePetList(pageHtml: string): Pet[] {
        const petList: Pet[] = [];
        $(pageHtml)
            .find("input:radio")
            .each(function (_idx, radio) {
                const c0 = $(radio).parent();
                const c1 = $(c0).next();
                const c2 = $(c1).next();
                const c3 = $(c2).next();
                const c4 = $(c3).next();
                const c5 = $(c4).next();
                const c6 = $(c5).next();
                const c7 = $(c6).next();
                const c8 = $(c7).next();
                const c9 = $(c8).next();
                const c10 = $(c9).next();

                const pet = new Pet();
                pet.index = parseInt($(radio).val() as string);
                pet.name = $(c1).text();
                pet.level = parseInt($(c2).text());
                let s = $(c3).text();
                pet.health = parseInt(StringUtils.substringBeforeSlash(s));
                pet.maxHealth = parseInt(StringUtils.substringAfterSlash(s));
                pet.attack = parseInt($(c4).text());
                pet.defense = parseInt($(c5).text());
                pet.specialAttack = parseInt($(c6).text());
                pet.specialDefense = parseInt($(c7).text());
                pet.speed = parseInt($(c8).text());
                pet.experience = parseInt($(c9).text());
                pet.gender = $(c10).text();
                petList.push(pet);
            });
        return petList;
    }

}

function doParsePet(pet: Pet, table: JQuery<HTMLElement>) {
    // pet name & gender
    const nameCell = table.find("td:first");
    let petNameText = nameCell.find("b").text();
    petNameText = petNameText.substring(1);
    pet.name = petNameText.substring(0, petNameText.length - 1);
    let fullNameText = nameCell.text();
    if (fullNameText.endsWith("(公)")) {
        pet.gender = "公";
    } else if (fullNameText.endsWith("(母)")) {
        pet.gender = "母";
    } else if (fullNameText.endsWith("(无性)")) {
        pet.gender = "无性";
    }

    // pet level
    let s = table.find("tr:eq(1) td:first").text();
    pet.level = parseInt(StringUtils.substringAfter(s, "Ｌｖ"));

    // pet picture & health
    s = table.find("tr:eq(2) td:eq(0) img").attr("src") as string;
    pet.picture = s.substring(s.lastIndexOf("/") + 1);
    s = table.find("tr:eq(2) td:eq(2)").text();
    pet.health = parseInt(StringUtils.substringBeforeSlash(s));
    pet.maxHealth = parseInt(StringUtils.substringAfterSlash(s));

    // pet spells
    s = table.find("tr:eq(3) td:eq(1)").text();
    pet.spell1 = StringUtils.substringBefore(s, "(威力：");
    pet.usingSpell1 = s.includes("(使用中)");
    pet.spell1Description = s;
    pet.spell1Description += " " + table.find("tr:eq(4) td:eq(1)").text();
    s = table.find("tr:eq(5) td:eq(1)").text();
    pet.spell2 = StringUtils.substringBefore(s, "(威力：");
    pet.usingSpell2 = s.includes("(使用中)");
    pet.spell2Description = s;
    pet.spell2Description += " " + table.find("tr:eq(6) td:eq(1)").text();
    s = table.find("tr:eq(7) td:eq(1)").text();
    pet.spell3 = StringUtils.substringBefore(s, "(威力：");
    pet.usingSpell3 = s.includes("(使用中)");
    pet.spell3Description = s;
    pet.spell3Description += " " + table.find("tr:eq(8) td:eq(1)").text();
    s = table.find("tr:eq(9) td:eq(1)").text();
    pet.spell4 = StringUtils.substringBefore(s, "(威力：");
    pet.usingSpell4 = s.includes("(使用中)");
    pet.spell4Description = s;
    pet.spell4Description += " " + table.find("tr:eq(10) td:eq(1)").text();

    // pet attack & defense
    s = table.find("tr:eq(11) td:eq(1)").text();
    pet.attack = parseInt(s);
    s = table.find("tr:eq(11) td:eq(3)").text();
    pet.defense = parseInt(s);

    // pet specialAttack & specialDefense
    s = table.find("tr:eq(12) td:eq(1)").text();
    pet.specialAttack = parseInt(s);
    s = table.find("tr:eq(12) td:eq(3)").text();
    pet.specialDefense = parseInt(s);

    // pet speed & love
    s = table.find("tr:eq(13) td:eq(1)").text();
    pet.speed = parseInt(s);
    s = table.find("tr:eq(13) td:eq(3)").text();
    pet.love = parseFloat(s);

    // pet attributes
    pet.attribute1 = table.find("tr:eq(14) td:eq(1)").text();
    pet.attribute2 = table.find("tr:eq(14) td:eq(3)").text();

    // pet race & code
    s = table.find("tr:eq(16) td:eq(3)").text();
    pet.race = s;
    pet.code = StringUtils.substringBetween(s, "(", ")");
}

export = PetParser;