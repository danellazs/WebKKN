import { useState, useContext, useEffect, useRef } from "react";
import { supabase } from "../supabase-client";
import { SessionContext } from "../context/sessionContext";

const BASE_PET_URL = "https://ufcbttlleeeycgqgaqgm.supabase.co/storage/v1/object/public/pet-images/";

const PETS = [
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
  const [result, setResult] = useState<{ name: string; gif: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [userPets, setUserPets] = useState<{ id: string; gif: string; name: string }[]>([]);

  const GACHA_COST = 20;

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
    fetchUserPets();
    setLoading(false);
  };

  const fetchUserPets = async () => {
    if (!session) return;

    const { data, error } = await supabase
      .from("user_pets")
      .select("pet_id")
      .eq("user_id", session.user.id);

    if (!error && data) {
      const owned = data.map((d: any) => PETS.find((p) => p.id === d.pet_id)).filter(Boolean);
      setUserPets(owned as any);
    }
  };

  useEffect(() => {
    if (!session) {
      setUserPets([]);
    } else {
      fetchUserPets();
    }
    }, [session]);

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

      {session && (
        <div style={{ marginTop: 30 }}>
          <h3>Kolam wkwk</h3>
          <div
            style={{
              position: "relative",
              width: "500px",
              height: "300px",
              border: "2px solid #999",
              overflow: "hidden",
              background: "#f9f9f9",
            }}
          >
            {userPets.map((pet, idx) => (
              <MovingPet key={idx} gif={pet.gif} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const MovingPet = ({ gif }: { gif: string }) => {
  const [pos, setPos] = useState({ x: Math.random() * 400, y: Math.random() * 200 });
  const directionRef = useRef({ dx: Math.random() * 2 - 1, dy: Math.random() * 2 - 1 });

  useEffect(() => {
    const move = () => {
      setPos((prev) => {
        let { x, y } = prev;
        let { dx, dy } = directionRef.current;

        x += dx * 2;
        y += dy * 2;

        if (x < 0 || x > 450) directionRef.current.dx *= -1;
        if (y < 0 || y > 250) directionRef.current.dy *= -1;

        return { x: Math.max(0, Math.min(x, 450)), y: Math.max(0, Math.min(y, 250)) };
      });
    };

    const interval = setInterval(move, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <img
      src={gif}
      alt="pet"
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        width: 50,
        height: 50,
        transition: "transform 0.2s",
      }}
    />
  );
};

export default Gacha;
