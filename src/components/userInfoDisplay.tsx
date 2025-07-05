import { useEffect, useState, useContext } from "react";
import { supabase } from "../supabase-client";
import { SessionContext } from "../context/sessionContext";

const UserInfoDisplay = () => {
  const session = useContext(SessionContext);
  const [name, setName] = useState<string | null>(null);
  const [points, setPoints] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!session?.user?.id) {
        setName(null);
        setPoints(null);
        return;
      }

      setLoading(true);

      const { data: userData } = await supabase
        .from("users")
        .select("name")
        .eq("id", session.user.id)
        .single();

      setName(userData?.name || "User tidak login");

      const { data: pointsData } = await supabase
        .from("points")
        .select("value")
        .eq("user_id", session.user.id);

      const total = pointsData?.reduce((sum, p) => sum + (p.value || 0), 0) || 0;
      setPoints(total);
      setLoading(false);
    };

    fetchUserInfo();
  }, [session]);

  if (loading || !session) return null;

  return (
    <div className="user-info-container">
      <div className="name-badge">{name}</div>
      <div className="points-badge">{points ?? "-"} ⚪</div>
    </div>
  );
};

export default UserInfoDisplay;
