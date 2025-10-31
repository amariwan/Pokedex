"use client";

import dynamic from "next/dynamic";
import type { PokemonGridProps } from "./PokemonGrid";

const PokemonGrid = dynamic(() => import("./PokemonGrid").then((m) => m.PokemonGrid), {
  ssr: false,
});

export default function PokemonGridClient(props: PokemonGridProps) {
  return <PokemonGrid {...props} />;
}
