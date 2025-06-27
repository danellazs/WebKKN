import { useEffect, useState, useContext } from "react";
import { supabase } from "../supabase-client";
import { SessionContext } from "../context/sessionContext";

type PointDisplayProps = {
  refreshTrigger?: number;
  onDeduct?: (deductFn: (amount: number) => Promise<void>) => void;
};

const PointsDisplay = ({ refreshTrigger, onDeduct }: PointDisplayProps) => {
  const session = useContext(SessionContext);
  const [points, setPoints] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

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

    const pointsData = data as { value: number }[] | null;
    const total = pointsData?.reduce((sum, p) => sum + (p.value || 0), 0) || 0;
    setPoints(total);
  };

  const deductPoints = async (amount: number) => {
    if (!session || !session.user?.id) return;

    const { error } = await supabase.from("points").insert([
      {
        user_id: session.user.id,
        value: -amount,
        source: `Pengurangan poin sebanyak ${amount}`,
      },
    ]);

    if (!error) {
      await fetchPoints();
    } else {
      console.error("Gagal mengurangi poin:", error.message);
    }
  };

  useEffect(() => {
    fetchPoints();
  }, [session, refreshTrigger]);

  useEffect(() => {
    if (onDeduct) {
      onDeduct(deductPoints);
    }
  }, [session]);

  return (
    <div className="points-container">
      <div className="points-score-box">
        {loading
          ? "Loading..."
          : points !== null
          ? `${points} ⚪`
          : "- ⚪"}
      </div>
    </div>
  );
};

export default PointsDisplay;
