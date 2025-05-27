import { useState, useContext } from "react";
import { supabase } from "../supabase-client";
import { SessionContext } from "../context/sessionContext";

// Contoh daftar pet (GIF) dan nama
const PETS = [
    { id: "pet1", name: "Fluffy", gif: "src/assets/penyucoklat.gif" },
    { id: "pet2", name: "Spark", gif: "src/assets/penyubiru.gif" },
    { id: "pet3", name: "Bubbles", gif: "src/assets/penyumerah.gif" },
    { id: "pet4", name: "Spark", gif: "src/assets/penyualbino.gif" },
    { id: "pet5", name: "Shadow", gif: "src/assets/penyuungu.gif" },
    { id: "pet6", name: "Sunny", gif: "src/assets/penyucentil.gif" },
    { id: "pet7", name: "Coco", gif: "src/assets/kurakura.gif" },
    { id: "pet8", name: "Luna", gif: "src/assets/penyugem.gif" },
];

const Gacha = ({ points, refreshPoints }: { points: number; refreshPoints: () => void }) => {
  const session = useContext(SessionContext);
  const [result, setResult] = useState<{ name: string; gif: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const GACHA_COST = 20;

  const handleGacha = async () => {
    if (!session || points < GACHA_COST) {
      alert("Points tidak cukup untuk gacha!");
      return;
    }

    setLoading(true);

    // Random pilih pet
    const randomPet = PETS[Math.floor(Math.random() * PETS.length)];

    // Kurangi points user di DB dengan insert negative point
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

    // Simpan hasil gacha ke tabel pet user
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

    // Update state hasil
    setResult(randomPet);

    // Refresh poin setelah gacha berhasil
    refreshPoints();

    setLoading(false);
  };

  return (
    <div>
      <button onClick={handleGacha} disabled={loading}>
        {loading ? "Sedang gacha..." : `Gacha (Harga: ${GACHA_COST} points)`}
      </button>

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
