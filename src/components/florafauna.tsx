import React, { useState } from "react";
import mangroveImg from "../assets/Mangrove.png";
import rotanImg from "../assets/Rotan.jpg";
import kantongSemarImg from "../assets/Kantong Semar.jpg";
import palemMerahImg from "../assets/Palem Merah.jpeg";
import owaKalimantanImg from "../assets/Owa Kalimantan.jpg";
import lebahKelulutImg from "../assets/Lebah Kelulut.jpg";
import bekantanImg from "../assets/Bekantan.jpeg";
import PenyuBelimbing from "../assets/Penyu Belimbing.jpg";
import PenyuHijau from "../assets/Penyu-Hijau.jpg";
import PenyuLekang from "../assets/Penyu Lekang.jpg";
import PenyuSisik from "../assets/Penyu-Sisik.webp";


const floraItems = [
  {
    img: mangroveImg,
    title: "Mangrove (Rhizophora spp)",
    description:
      "Mangrove adalah hutan yang tumbuh di kawasan pesisir, dengan akar yang menyembul di atas permukaan air. Ekosistem ini berperan penting dalam melindungi pantai dari erosi dan menyediakan habitat bagi berbagai spesies fauna, seperti burung air dan kepiting.",
  },
  {
    img: rotanImg,
    title: "Rotan (Calamus spp)",
    description:
      "Rotan adalah tanaman yang tumbuh secara merambat atau memanjat, di mana banyak ditemukan di hutan-hutan Kalimantan Barat. Dikenal karena seratnya yang kuat, rotan digunakan untuk membuat berbagai produk, seperti kerajinan tangan dan furnitur.",
  },
  {
    img: kantongSemarImg,
    title: "Kantong Semar (Nepenthes sp)",
    description:
      "Kantong Semar adalah tanaman pemangsa yang memiliki kantong berfungsi untuk menangkap serangga. Tanaman ini tumbuh di daerah dengan tanah miskin nutrisi, seperti hutan tropis Kalimantan, dan memiliki bentuk yang unik.",
  },
  {
    img: palemMerahImg,
    title: "Palem Merah (Cyrtostachys lakka)",
    description:
      "Palem Merah adalah jenis palem yang tumbuh di hutan tropis Kalimantan. Dikenal dengan batangnya yang berwarna merah cerah, palem ini sering dijadikan tanaman hias karena tampilannya yang eksotis dan indah.",
  },
];

const faunaItems = [
  {
    img: bekantanImg,
    title: "Bekantan (Nasalis larvatus)",
    description:
      "Bekantan adalah primata endemik Kalimantan dengan ciri khas hidung besar yang menonjol. Spesies ini sering ditemukan di hutan mangrove dan pesisir Kalimantan Barat, termasuk di Sebubus dan sangat bergantung pada habitatnya yang terancam oleh deforestasi (penggundulan hutan).",
  },
  {
    img: owaKalimantanImg,
    title: "Uwak-uwak (Hylobates albibarbis)",
    description:
      "Uwak-uwak adalah spesies primata kecil yang hidup di hutan lindung Sebubus, Kalimantan Barat. Uwak-uwak memiliki bulu coklat kehitaman dan sering terlihat di pepohonan, bergerombol dalam kelompok kecil, serta memainkan peran penting dalam menjaga keseimbangan ekosistem hutan.",
  },
  {
    img: lebahKelulutImg,
    title: "Lebah Kelulut (Trigona spp)",
    description:
      "Lebah Kelulut adalah jenis lebah tanpa sengat yang dikenal dengan kemampuannya menghasilkan madu berkualitas tinggi. Dibiakkan oleh masyarakat Sebubus, madu Kelulut memiliki banyak manfaat kesehatan dan sering diolah menjadi produk seperti sabun alami.",
  },
  {
    img: PenyuHijau,
    title: "Penyu Hijau (Chelonia Mydas)",
    description:
      "Penyu hijau adalah jenis penyu yang paling sering dijumpai di Paloh, dengan 98% dari total penyu yang naik ke pesisir merupakan penyu hijau. Dikenal dengan cangkangnya yang berwarna hijau dan ukuran tubuhnya yang besar, penyu hijau memakan rumput laut dan alga sebagai makanannya. Keberadaan penyu hijau yang dominan menjadikan Paloh sebagai habitat peneluran penyu hijau terpanjang di Indonesia, dengan garis pantai yang membentang sepanjang 63 kilometer.",
  },
  {
    img: PenyuSisik,
    title: "Penyu Sisik (Eretmochelys Imbricata)",
    description:
      "Penyu Sisik adalah spesies penyu laut yang memiliki cangkang berwarna coklat keemasan dengan sisik tumpang tindih, dan paruhnya yang tajam membantunya dalam memakan spons dan terumbu karang. Dikenal sebagai spesies terancam punah, penyu sisik sering ditemukan di perairan tropis dan subtropis, termasuk di pantai-pantai di Indonesia, seperti Paloh, Kalimantan Barat.",
  },
  {
    img: PenyuLekang,
    title: "Penyu Lekang (Lepidochelys Olivacea)",
    description:
      "Penyu Lekang adalah spesies penyu laut terkecil di dunia, dengan ukuran karapas sekitar 60-70 cm dan berat antara 31 hingga 43 kg. Karapasnya memiliki warna abu-abu kehijauan dan bentuk yang langsing serta bersudut, berbeda dari penyu lainnya. Spesies ini dapat ditemukan di perairan tropis dan subtropis, termasuk di pesisir selatan Bali, seperti Pantai Kuta dan Klungkung, serta di pesisir Kalimantan dan Papua.",
  },
  {
    img: PenyuBelimbing,
    title: "Penyu Belimbing (Dermochelys Coriacea)",
    description:
    "Penyu Belimbing adalah penyu laut terbesar di dunia, dengan panjang hingga 2,7 meter dan berat 700 kg. Memiliki cangkang lembut dan sirip besar, penyu ini memakan ubur-ubur. Di Kalimantan Barat, meskipun jarang, penyu belimbing kadang mendarat di pantai-pantai pesisir, seperti di Paloh untuk bertelur.",
  },
];

type FloraFaunaProps = {
  type?: "flora" | "fauna"; // default = flora
};

const FloraFauna: React.FC<FloraFaunaProps> = ({ type = "flora" }) => {
  const items = type === "flora" ? floraItems : faunaItems;
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent((prev) => (prev + 1) % items.length);
  };

  const prev = () => {
    setCurrent((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  return (
    <div
      style={{
        backgroundImage: "url('assets/sectionbg2.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "4rem 1rem 1rem 1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2rem",
        zIndex: 20,
        width: "100%",
        position: "relative",
        minHeight: "100vh",
      }}
    >
      {/* TITLE HEADER */}
      <h1
        style={{
          fontSize: "2rem",
          color: "#3D5072",
          fontFamily: "Bodar, sans-serif",
          textAlign: "center",
          margin: 0,
        }}
      >
        {type === "flora" ? "FLORA" : "FAUNA"}
      </h1>

      {/* Top cluster: arrows, image, and title */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          maxWidth: "1000px",
          width: "100%",
          height: "300px",
          position: "relative",
          justifyContent: "center",
        }}
      >
        {/* Left Arrow */}
        <div>
          <button
            onClick={prev}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            <img
              src="/assets/leftArrowtes.png"
              alt="Left"
              width={20}
              style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.7))" }}
            />
          </button>
        </div>

        {/* Image & Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
            flex: 1,
          }}
        >
          <div
            style={{
              aspectRatio: "1 / 1",
              maxHeight: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#000",
              flexShrink: 0,
              maxWidth: "300px",
            }}
          >
            <img
              src={items[current].img}
              alt={items[current].title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              }}
            />
          </div>

          <div
            style={{
              flex: 1,
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 0.5rem",
            }}
          >
            <h2
              style={{
                fontFamily: "Lato, sans-serif",
                fontSize: "clamp(1.2rem, 2.5vw, 1.5rem)",
                color: "#fff",
                textAlign: "center",
                textShadow: "1px 1px 4px rgba(0,0,0,0.6)",
                wordBreak: "break-word",
                maxWidth: "100%",
              }}
            >
              {items[current].title}
            </h2>
          </div>
        </div>

        {/* Right Arrow */}
        <div>
          <button
            onClick={next}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            <img
              src="/assets/rightArrow.png"
              alt="Right"
              width={20}
              style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.7))" }}
            />
          </button>
        </div>
      </div>

      {/* Description */}
      <div
        style={{
          maxWidth: "800px",
          textAlign: "center",
          padding: "0rem 1rem",
        }}
      >
        <p
          style={{
            fontFamily: "Lato, sans-serif",
            fontSize: "clamp(0.85rem, 2vw, 1rem)",
            color: "#3D5072",
            fontWeight: 400,
          }}
        >
          {items[current].description}
        </p>
      </div>
    </div>
  );
};

export default FloraFauna;
