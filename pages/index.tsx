import type { NextPage } from "next";
import { useState } from "react";
import { getOptionsForVote } from "../utils/randomPokemon";
import { inferQueryResponse, trpc } from "../utils/trpc";
import type React from "react";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";

const btn =
  "inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

const Home: NextPage = () => {
  const [ids, updateIds] = useState(() => getOptionsForVote());
  const [first, second] = ids;
  const firstPokemon = trpc.useQuery(["get-pokemon-by-id", { id: first }], {
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  const secondPokemon = trpc.useQuery(["get-pokemon-by-id", { id: second }], {
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const getCurrentUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("URL Copied!");
  };

  const voteMutation = trpc.useMutation(["cast-vote"]);

  if (firstPokemon.isLoading || secondPokemon.isLoading) return null;

  const votingHandler = (selected: number) => {
    //todo: fire mutaiton to persist changes
    if (selected === first) {
      voteMutation.mutate({ votedFor: first, votedAgainst: second });
    } else {
      voteMutation.mutate({ votedFor: second, votedAgainst: first });
    }
    updateIds(getOptionsForVote);
  };

  const dataLoaded =
    !firstPokemon.isLoading &&
    firstPokemon.data &&
    !secondPokemon.isLoading &&
    secondPokemon.data;

  return (
    <div className="h-screen w-screen flex flex-col justify-between items-center relative">
      <Head>
        <title>Cutest Pokemon!</title>
      </Head>
      <div className="text-2xl text-center py-8">Which Pokemon is Cuter?</div>
      {dataLoaded && (
        <div className=" p-16 flex justify-between items-center max-w-2xl md:flex-row ">
          <PokemonList
            pokemon={firstPokemon.data}
            vote={() => votingHandler(first)}
          />
          <div className="text-2xl text-center text-bold pt-8">Vs</div>
          <PokemonList
            pokemon={secondPokemon.data}
            vote={() => votingHandler(second)}
          />
        </div>
      )}
      {!dataLoaded && (
        <div className="flex flex-col justify-center items-center">
          <img width="24px" src="..//puff.svg" />
          <img width="36px" src="..//puff.svg" />
          <img width="48px" src="..//puff.svg" />
          <img width="64px" src="..//puff.svg" />
          <img width="80px" src="..//puff.svg" />
        </div>
      )}
      <div className="p-2" />
      <div className="absolute bottom-0 w-full text-xl text-center mb-8 ">
        <a href="https://github.com/CowPeeOnYou/pokemon-app">Github</a>
        {" | "}
        <Link href="/results">
          <a>Results</a>
        </Link>
        {" | "}
        <button onClick={() => getCurrentUrl()}> Share</button>
      </div>
    </div>
  );
};

export default Home;

type PokemonFromServer = inferQueryResponse<"get-pokemon-by-id">;
const PokemonList: React.FC<{
  pokemon: PokemonFromServer;
  vote: () => void;
}> = (props) => {
  return (
    <div className="flex flex-col items-center">
      <Image
        className="w-64 h-64 animate-bounce"
        layout="fixed"
        src={props.pokemon.spriteUrl}
        width={256}
        height={256}
      />
      <div className="text-xl text-center capitalize mt-[-2rem]">
        {props.pokemon.name}
      </div>
      <button className={btn} onClick={() => props.vote()}>
        Cuter
      </button>
    </div>
  );
};
