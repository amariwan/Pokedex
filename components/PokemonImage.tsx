"use client";
import Image from "next/image";

const PokemonImage = ({ image, name }: { image: string; name: string }) => {
  return (
    <div>
      <Image
        src={image}
        alt={"Picture of " + name}
        priority
        fill
        style={{ objectFit: "contain" }}
        className="transition-opacity opacity-0 duration-[2s]"
        onLoadingComplete={(image) => image.classList.remove("opacity-0")}
      />
    </div>
  );
};

export default PokemonImage;
