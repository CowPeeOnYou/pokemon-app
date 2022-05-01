import type { NextPage } from "next";
import { useMemo, useState } from "react";
import { getOptionsForVote } from "../utils/randomPokemon";
import { inferQueryResponse, trpc } from "../utils/trpc";
import type React from "react";

const btn =
  "inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

const Home: NextPage = () => {
  const [ids, updateIds] = useState(() => getOptionsForVote());
  const [first, second] = ids;
  const firstPokemon = trpc.useQuery(["get-pokemon-by-id", { id: first }]);
  const secondPokemon = trpc.useQuery(["get-pokemon-by-id", { id: second }]);

  if (firstPokemon.isLoading || secondPokemon.isLoading) return null;

  const votingHandler = (selected: number) => {
    //todo: fire mutaiton to persist changes

    updateIds(getOptionsForVote);
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="text-2xl text-center">Which Pokemon is cuter?</div>
      <div className="p-2" />
      <div className="border rounded p-8 flex justify-between items-center max-w-2xl">
        {!firstPokemon.isLoading &&
          firstPokemon.data &&
          !secondPokemon.isLoading &&
          secondPokemon.data && (
            <>
              <PokemonList
                pokemon={firstPokemon.data}
                vote={() => votingHandler(first)}
              />
              <div className="p-8">Vs</div>
            </>
          )}
        <div className="w-64 h-64 flex flex-col items-center">
          <img
            className="w-full h-full"
            src={secondPokemon.data?.sprites.front_default}
          />
          <div className="text-xl text-center capitalize  mt-[-2rem]">
            {secondPokemon.data?.name}
          </div>
          <button className={btn} onClick={() => votingHandler(second)}>
            Cuter
          </button>
        </div>
        <div className="p-2" />
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
    <div className="w-64 h-64 flex flex-col items-center">
      <img
        className="w-full h-full"
        src={props.pokemon.sprites.front_default}
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
