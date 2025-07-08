import React, { useState, useRef } from "react";

const ZoomIsland: React.FC = () => {
  const [zoomed, setZoomed] = useState(false);
  const [activeDescription, setActiveDescription] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleClick = () => {
    setZoomed(true);
  };

  const handleZoomedIslandClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (!target.classList.contains("hotspot")) {
      setZoomed(false);
      setActiveDescription(null);
    }
  };

  return (
    <div style={{ width: "100%", paddingTop: "5vw" }}>
      {/* Judul utama */}
      <h1
        style={{
          fontSize: "2rem",
          color: "#3D5072",
          fontFamily: "Bodar, sans-serif",
          textAlign: "center",
          margin: 0,
          paddingBottom: "1rem",
          zIndex: 10,
          position: "relative",
        }}
      >
        PETA DESKRIPTIF
      </h1>

      {/* Map container */}
      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        {!zoomed && (
          <img
            src="/assets/island.png"
            alt="Island"
            onClick={handleClick}
            style={{
              cursor: "pointer",
              zIndex: 1,
              width: "70vw",
              height: "auto",
              position: "relative",
            }}
          />
        )}

        {zoomed && (
          <div
            onClickCapture={handleZoomedIslandClick}
            style={{
              position: "relative",
              width: "70vw",
              aspectRatio: "4 / 3",
            }}
          >
            <img
              src="/assets/islandzoom.png"
              alt="Zoomed Island"
              style={{
                position: "absolute",
                zIndex: 5,
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
                objectFit: "contain",
              }}
            />

            {/* Hotspot Sebubus */}
            <div
              className="hotspot"
              onClick={() => setActiveDescription(1)}
              style={{
                position: "absolute",
                top: "30%",
                left: "22%",
                width: "5vw",
                height: "5vw",
                cursor: "pointer",
                zIndex: 10,
                backgroundColor: "transparent",
                borderRadius: "50%",
              }}
            />

            {/* Hotspot Temajuk */}
            <div
              className="hotspot"
              onClick={() => setActiveDescription(2)}
              style={{
                position: "absolute",
                top: "18%",
                left: "27%",
                width: "5vw",
                height: "5vw",
                cursor: "pointer",
                zIndex: 10,
                backgroundColor: "transparent",
                borderRadius: "50%",
              }}
            />

            {/* Banners */}
            <img
              src="/assets/sebubusbanner.png"
              alt="Sebubus"
              style={{
                position: "absolute",
                zIndex: 6,
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
                objectFit: "contain",
              }}
            />
            <img
              src="/assets/temajukbanner.png"
              alt="Temajuk"
              style={{
                position: "absolute",
                zIndex: 6,
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
                objectFit: "contain",
              }}
            />
          </div>
        )}
      </div>

      {/* Deskripsi Sambas (awal sebelum zoom) */}
      {!zoomed && (
        <div
          style={{
            position: "relative",
            marginTop: "5vw",
            padding: "0.5vw 0vw",
            fontSize: "1rem",
            lineHeight: "1.6",
            color: "#3D5072",
            maxWidth: "800px",
            marginLeft: "auto",
            marginRight: "auto",
            zIndex: 15,
          }}
        >
          <div style={{ fontFamily: "Lato, sans-serif", padding: "0vw 2vw", letterSpacing: "2px", fontStyle: "italic" }}>
            <strong>Kabupaten Sambas</strong>
          </div>
          <div style={{ padding: "0vw 5vw 3vw 5vw" }}>
            <br />
            Kabupaten Sambas terletak di bagian barat Kalimantan Barat, berbatasan dengan negara Malaysia di utara. Daerah ini memiliki potensi alam yang melimpah, termasuk hutan tropis, pesisir pantai, dan ekosistem mangrove yang kaya. Sebagai daerah yang masih sangat bergantung pada sektor pertanian dan perikanan, Sambas juga dikenal dengan keragaman budaya dan tradisi masyarakatnya yang beragam.
          </div>
        </div>
      )}

      {/* Deskripsi Paloh (zoom in, sebelum klik hotspot) */}
      {zoomed && activeDescription === null && (
        <div
          style={{
            position: "relative",
            marginTop: "5vw",
            padding: "0.5vw 0vw",
            fontSize: "1rem",
            lineHeight: "1.6",
            color: "#3D5072",
            maxWidth: "800px",
            marginLeft: "auto",
            marginRight: "auto",
            zIndex: 15,
          }}
        >
          <div style={{ fontFamily: "Lato, sans-serif", padding: "0vw 2vw", letterSpacing: "2px", fontStyle: "italic" }}>
            <strong>Kecamatan Paloh</strong>
          </div>
          <div style={{ padding: "0vw 5vw 3vw 5vw" }}>
            <br />
            Kecamatan Paloh terletak di pesisir utara Kabupaten Sambas dan berbatasan langsung dengan Malaysia. Wilayah ini dikenal dengan pantai panjang, hutan mangrove, serta menjadi habitat penting bagi penyu. Potensinya besar dalam ekowisata, konservasi, dan pengembangan sektor perikanan serta pertanian masyarakat pesisir.
          </div>
        </div>
      )}

      {/* Deskripsi Sebubus */}
      {activeDescription === 1 && (
        <div
          style={{
            position: "relative",
            marginTop: "5vw",
            padding: "0.5vw 0vw",
            fontSize: "1rem",
            lineHeight: "1.6",
            color: "#3D5072",
            maxWidth: "800px",
            marginLeft: "auto",
            marginRight: "auto",
            zIndex: 15,
          }}
        >
          <div style={{ fontFamily: "Lato, sans-serif", padding: "0vw 2vw", letterSpacing: "2px", fontStyle: "italic" }}>
            <strong>Mengenal Sebubus</strong>
          </div>
          <div style={{ padding: "0vw 5vw 3vw 5vw" }}>
            <br />
            Desa Sebubus berada di Kecamatan Paloh, Kabupaten Sambas, dengan akses ke pantai dan kawasan hutan mangrove yang luas. Desa ini dikenal dengan keanekaragaman hayati, termasuk satwa langka, seperti bekantan dan habitat penting bagi penyu. Selain itu, Sebubus memiliki potensi besar dalam pengembangan ekowisata berbasis alam dan konservasi serta kegiatan budidaya kelapa dan rotan yang menjadi mata pencaharian utama masyarakat setempat.
          </div>
        </div>
      )}

      {/* Deskripsi Temajuk */}
      {activeDescription === 2 && (
        <div
          style={{
            position: "relative",
            marginTop: "5vw",
            padding: "0.5vw 0vw",
            fontSize: "1rem",
            lineHeight: "1.6",
            color: "#3D5072",
            maxWidth: "800px",
            marginLeft: "auto",
            marginRight: "auto",
            zIndex: 15,
          }}
        >
          <div style={{ fontFamily: "Lato, sans-serif", padding: "0vw 2vw", letterSpacing: "2px", fontStyle: "italic" }}>
            <strong>Mengenal Temajuk</strong>
          </div>
          <div style={{ padding: "0vw 5vw 3vw 5vw" }}>
            <br />
            Terletak di ujung barat Kalimantan Barat, Desa Temajuk menawarkan pemandangan alam yang indah dengan garis pantai sepanjang 63 kilometer yang menjadi habitat peneluran penyu hijau. Masyarakat Temajuk sebagian besar bekerja di sektor pertanian dan perikanan dengan potensi besar dalam ekowisata. Desa ini juga memiliki potensi dalam pengembangan industri berbasis alam, seperti budidaya ikan dan pemanfaatan sumber daya alam secara berkelanjutan.
          </div>
        </div>
      )}
    </div>
  );
};

export default ZoomIsland;
