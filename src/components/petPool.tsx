import { useState } from "react";
import MovingPet from "./movingPet";
import "../App.css";
import type { Pet } from "../types/pet";

const PetPool = ({ userPets }: { userPets: Pet[] }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

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
                <li
                  key={pet.id}
                  className="pet-list-item"
                  onClick={() => setSelectedPet(pet)}
                  style={{ cursor: "pointer" }}
                  title="Klik untuk melihat deskripsi"
                >
                  <img
                    src={pet.gif_url}
                    alt={pet.name}
                    className="pet-list-img"
                  />
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

      {selectedPet && (
        <div
          className="pet-popup-overlay"
          onClick={() => setSelectedPet(null)}
        >
          <div
            className="pet-popup-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{selectedPet.name}</h3>
            <img
              src={selectedPet.gif_url}
              alt={selectedPet.name}
              className="pet-list-img"
            />
            <p>{selectedPet.description}</p>
            <button
              className="pet-btn-close"
              onClick={() => setSelectedPet(null)}
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
