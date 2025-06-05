import { useState } from "react";
import MovingPet from "./movingPet";
import "../App.css";

type Pet = {
  id: string;
  gif_url: string;
  name: string;
};

const PetPool = ({ userPets }: { userPets: Pet[] }) => {
  const [showPopup, setShowPopup] = useState(false);

  if (userPets.length === 0) return null;

  const uniquePets = Array.from(
    new Map(userPets.map((pet) => [pet.id, pet])).values()
  );

  return (
    <div className="pet-container">
      <h3>Kolam wkwk</h3>

      <div className="pet-pool">
        {userPets.map((pet) => (
          <MovingPet key={pet.id} gif={pet.gif_url} />
        ))}

        <button
          className="pet-btn-show-list"
          onClick={() => setShowPopup(true)}
          title="Tampilkan daftar pet"
        >
          List
        </button>
      </div>

      {showPopup && (
        <div className="pet-popup-overlay" onClick={() => setShowPopup(false)}>
          <div
            className="pet-popup-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Daftar Pet yang Kamu Miliki</h2>
            <ul className="pet-list">
              {uniquePets.map((pet) => (
                <li key={pet.id} className="pet-list-item">
                  <img src={pet.gif_url} alt={pet.name} className="pet-list-img" />
                  {pet.name}
                </li>
              ))}
            </ul>
            <button
              className="pet-btn-close"
              onClick={() => setShowPopup(false)}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetPool;
