// components/PetPool.tsx
import MovingPet from "./movingPet"; // import komponen MovingPet dari file movingPet.tsx

type Pet = {
  id: string;
  gif: string;
  name: string;
};

const PetPool = ({ userPets }: { userPets: Pet[] }) => {
  if (userPets.length === 0) return null;

  return (
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
        {userPets.map((pet) => (
          <MovingPet key={pet.id} gif={pet.gif} />
        ))}
      </div>
    </div>
  );
};

export default PetPool;
