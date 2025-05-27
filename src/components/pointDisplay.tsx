import { useEffect, useState, useContext } from "react";
import { supabase } from "../supabase-client";
import { SessionContext } from "../context/sessionContext";

type PointDisplayProps = {
  refreshTrigger?: number; // untuk memicu refresh data
};

const PointsDisplay = ({ refreshTrigger }: PointDisplayProps) => {
  const session = useContext(SessionContext);
  const [points, setPoints] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchPoints = async () => {
    if (!session || !session.user?.id) {
        setPoints(null);
        return;
    }

    setLoading(true);

    const { data, error } = await supabase
        .from("points")
        .select("value")
        .eq("user_id", session.user.id);

    setLoading(false);

    if (error) {
        console.error("Error fetching points:", error.message);
        return;
    }

  // Casting manual (jika yakin data ada dan sesuai tipe)
  const pointsData = data as { value: number }[] | null;

  const total = pointsData?.reduce((sum, p) => sum + (p.value || 0), 0) || 0;
  setPoints(total);
};



    fetchPoints();
  }, [session, refreshTrigger]);

  return (
    <div className="points-container">
      <h3 className="points-title">🏆 Poin Kamu</h3>

      {/* Highlight 3: Tampilkan loading indicator saat fetch */}
      {loading ? (
        <div className="points-score-box">Loading...</div>
      ) : (
        <div className="points-score-box">{points !== null ? points : "-"}</div>
      )}
    </div>
  );
};

export default PointsDisplay;
