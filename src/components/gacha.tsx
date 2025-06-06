// C:\Users\user\Desktop\github\kkn\kknpaloh\src\components\gacha.tsx

import { useState, useContext, useEffect } from "react";
import { supabase } from "../supabase-client";
import { SessionContext } from "../context/sessionContext";
import type { Pet } from "../types/pet";
import PetPool from "./petPool";

const Gacha = ({ points, refreshPoints }: { points: number; refreshPoints: () => void }) => {
  const session = useContext(SessionContext);
  const [result, setResult] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(false);

  const [userPets, setUserPets] = useState<Pet[]>([]);
  const [allPets, setAllPets] = useState<Pet[]>([]);

  const GACHA_COST = 20;

  const fetchAllPets = async () => {
    const { data, error } = await supabase.from("pets").select("*");
    if (error) {
      console.error("Gagal mengambil data pets:", error.message);
    } else {
      setAllPets(data);
    }
  };

  const fetchUserPets = async () => {
    if (!session) return;
    const { data, error } = await supabase
      .from("user_pets")
      .select("pet:pet_id (id, name, gif_url, description)")
      .eq("user_id", session.user.id);

    if (error) {
      console.error("Failed to fetch user pets:", error.message);
      return;
    }

    const pets: Pet[] = data.map((record: any) => record.pet);
    setUserPets(pets);
  };

  useEffect(() => {
    fetchAllPets();
  }, []);

  useEffect(() => {
    if (session) {
      fetchUserPets();
    }
  }, [session]);

  const handleGacha = async () => {
    if (!session || points < GACHA_COST) {
      alert("Points tidak cukup untuk gacha!");
      return;
    }

    setLoading(true);
    const randomPet = allPets[Math.floor(Math.random() * allPets.length)];

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
    fetchUserPets(); // Update daftar pet setelah gacha
    setLoading(false);
  };

  return (
    <div>
      <button onClick={handleGacha} disabled={loading}>
        {loading ? "Sedang gacha..." : `Gacha (Harga: ${GACHA_COST} points)`}
      </button>

      <PetPool userPets={userPets} allPets={allPets} />

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>Kamu mendapatkan: {result.name}</h3>
          <img src={result.gif_url} alt={result.name} width={150} height={150} />
        </div>
      )}


    </div>
  );
};

export default Gacha;
