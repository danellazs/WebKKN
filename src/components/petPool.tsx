import { useState } from "react";
import MovingPet from "./movingPet";
import "../App.css";
import type { Pet } from "../types/pet";

const PetPool = ({ userPets, allPets }: { userPets: Pet[]; allPets: Pet[] }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  if (userPets.length === 0) return null;

  return (
    <div className="pet-container">
      <h3>Kolam kamu</h3>

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
            {/* 🔽 NEW SECTION: ALL PETS DISPLAYED WITH OWNED CHECK 🔽 */}
            <div className="pet-list-section">
              <h3>📜 Semua Pet yang Tersedia</h3>
              <div className="pet-list-grid">
                {allPets.map((pet) => {
                  const owned = userPets.some((up) => up.id === pet.id);
                  return (
                    <div
                      key={pet.id}
                      className={`pet-card ${owned ? "owned" : "unowned"}`}
                      onClick={() => setSelectedPet(pet)}
                    >
                      <img
                        src={pet.gif_url}
                        alt={pet.name}
                        className="pet-image"
                      />
                      <div>{pet.name}</div>
                      <div>{owned ? "✅ Dimiliki" : "❌ Belum"}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* 🔼 END NEW SECTION 🔼 */}
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
