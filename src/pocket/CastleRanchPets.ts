import Pet from "./Pet";

class CastleRanchPets {

    readonly personalPetList: Pet[];
    readonly ranchPetList: Pet[];

    constructor(personalPetList: Pet[], ranchPetList: Pet[]) {
        this.personalPetList = personalPetList;
        this.ranchPetList = ranchPetList;
    }

}

export = CastleRanchPets;