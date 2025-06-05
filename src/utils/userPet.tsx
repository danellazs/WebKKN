import { Pet } from "../types";

export const mapUserPetsToFullPets = (
  userPetsFromDb: { pet_id: string }[],
  PETS: Pet[]
): Pet[] => {
  return userPetsFromDb
    .map((userPet) => {
      const petInfo = PETS.find((p) => p.id === userPet.pet_id);
      if (!petInfo) return null;
      return {
        id: petInfo.id,
        name: petInfo.name,
        gif: petInfo.gif,
      };
    })
    .filter(Boolean) as Pet[];
};
