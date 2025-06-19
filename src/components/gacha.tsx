import { useState, useContext, useEffect } from "react";
import { supabase } from "../supabase-client";
import { SessionContext } from "../context/sessionContext";
import type { Pet } from "../types/pet";
import PetPool from "./petPool";
import PointsDisplay from "./pointDisplay";
import { Button } from "./ui/button";

const Gacha = ({ points, refreshPoints }: { points: number; refreshPoints: () => void }) => {
  const session = useContext(SessionContext);
  const [result, setResult] = useState<Pet | null>(null);
  const [results, setResults] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);

  const [userPets, setUserPets] = useState<Pet[]>([]);
  const [allPets, setAllPets] = useState<Pet[]>([]);

  const GACHA_COST = 20;
  const GACHA10_COST = 200;

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
    setResult(null);
    setResults([]);

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
    fetchUserPets();
    setLoading(false);
  };

  const handleGacha10 = async () => {
    if (!session || points < GACHA10_COST) {
      alert("Points tidak cukup untuk gacha 10x!");
      return;
    }

    setLoading(true);
    setResult(null);
    setResults([]);

    const newPets: Pet[] = [];
    const insertPoints = {
      user_id: session.user.id,
      value: -GACHA10_COST,
      source: "Gacha 10x",
    };

    const { error: pointError } = await supabase.from("points").insert([insertPoints]);
    if (pointError) {
      alert("Error saat mengurangi points: " + pointError.message);
      setLoading(false);
      return;
    }

    for (let i = 0; i < 10; i++) {
      const randomPet = allPets[Math.floor(Math.random() * allPets.length)];
      newPets.push(randomPet);
    }

    const inserts = newPets.map((pet) => ({
      user_id: session.user.id,
      pet_id: pet.id,
    }));

    const { error: petInsertError } = await supabase.from("user_pets").insert(inserts);
    if (petInsertError) {
      alert("Error menyimpan hasil gacha: " + petInsertError.message);
      setLoading(false);
      return;
    }

    setResults(newPets);
    refreshPoints();
    fetchUserPets();
    setLoading(false);
  };

  return (
    <div className="gacha-wrapper">
      {/* Bagian Header: Tombol dan Poin */}
      <div className="gacha-header">
        <PointsDisplay />
        <div>
          <Button className="gacha-button" onClick={handleGacha} disabled={loading} style={{ marginBottom: "0.5rem" }}>
            {loading ? "Sedang gacha..." : `Gacha (Harga: ${GACHA_COST} ⚪)`}
          </Button>
          <br />
          <Button className="gacha-button" onClick={handleGacha10} disabled={loading}>
            {loading ? "Sedang gacha..." : `Gacha 10x (Harga: ${GACHA10_COST} ⚪)`}
          </Button>
        </div>
      </div>

      {/* Pet Pool */}
      <PetPool userPets={userPets} allPets={allPets} />

      {/* Hasil Gacha 1x */}
      {result && (
        <div className="result-single">
          <h3>Kamu mendapatkan: {result.name}</h3>
          <img src={result.gif_url} alt={result.name} width={150} height={150} />
        </div>
      )}

      {/* Hasil Gacha 10x */}
      {results.length > 0 && (
        <div>
          <h3>Kamu mendapatkan:</h3>
          <div className="result-grid">
            {results.map((pet, idx) => (
              <div className="result-card" key={idx}>
                <img src={pet.gif_url} alt={pet.name} />
                <span>{pet.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gacha;
