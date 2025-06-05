//C:\Users\user\Desktop\github\kkn\kknpaloh\src\components\gacha.tsx

import { useState, useContext, useEffect} from "react";
import { supabase } from "../supabase-client";
import { SessionContext } from "../context/sessionContext";
import type { Pet } from "../types/pet";
import PetPool from "./petPool";

const BASE_PET_URL = "https://ufcbttlleeeycgqgaqgm.supabase.co/storage/v1/object/public/pet-images/";

export const PETS = [
  { id: "pet1", name: "Fluffy", gif: `${BASE_PET_URL}penyucoklat.gif` },
  { id: "pet2", name: "Spark", gif: `${BASE_PET_URL}penyubiru.gif` },
  { id: "pet3", name: "Bubbles", gif: `${BASE_PET_URL}penyumerah.gif` },
  { id: "pet4", name: "Spark", gif: `${BASE_PET_URL}penyualbino.gif` },
  { id: "pet5", name: "Shadow", gif: `${BASE_PET_URL}penyuungu.gif` },
  { id: "pet6", name: "Sunny", gif: `${BASE_PET_URL}penyucentil.gif` },
  { id: "pet7", name: "Coco", gif: `${BASE_PET_URL}kurakura.gif` },
  { id: "pet8", name: "Luna", gif: `${BASE_PET_URL}penyugem.gif` },
];

const Gacha = ({ points, refreshPoints }: { points: number; refreshPoints: () => void }) => {
  const session = useContext(SessionContext);
  const [result, setResult] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [userPets, setUserPets] = useState<Pet[]>([]);

  const GACHA_COST = 20;

  const fetchUserPets = async () => {
    if (!session) return;
    const { data, error } = await supabase
      .from("user_pets")
      .select("pet_id")
      .eq("user_id", session.user.id);

    if (error) {
      console.error("Failed to fetch user pets:", error.message);
      return;
    }

    // Cocokkan pet_id dari db dengan PETS
    const ownedPets = PETS.filter((pet) => data.some((up) => up.pet_id === pet.id));
    setUserPets(ownedPets);
  };

  useEffect(() => {
    fetchUserPets();
  }, [session]);


  const handleGacha = async () => {
    if (!session || points < GACHA_COST) {
      alert("Points tidak cukup untuk gacha!");
      return;
    }

    setLoading(true);
    const randomPet = PETS[Math.floor(Math.random() * PETS.length)];

    const { error: insertError } = await supabase.from("points").insert([
      {
        user_id: session.user.id,
        value: -GACHA_COST,
        source: `Gacha pet ${randomPet.name}`,
      },
    ]);
    if (insertError) {
      alert("Error saat mengurangi points: " + insertError.message);
      setLoading(false);
      return;
    }

    const { error: petError } = await supabase.from("user_pets").insert([
      {
        user_id: session.user.id,
        pet_id: randomPet.id,
      },
    ]);
    if (petError) {
      alert("Error menyimpan pet: " + petError.message);
      setLoading(false);
      return;
    }

    setResult(randomPet);
    refreshPoints();
    setLoading(false);
  };

  return (
    <div>
      <button onClick={handleGacha} disabled={loading}>
        {loading ? "Sedang gacha..." : `Gacha (Harga: ${GACHA_COST} points)`}
      </button>
      <PetPool  userPets={userPets} />

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>Kamu mendapatkan: {result.name}</h3>
          <img src={result.gif} alt={result.name} width={150} height={150} />
        </div>
      )}

    </div>
  );
};

export default Gacha;
