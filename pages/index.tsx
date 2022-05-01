import type { NextPage } from "next";
import { useMemo, useState } from "react";
import { getOptionsForVote } from "../utils/randomPokemon";
import { trpc } from "../utils/trpc";

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
        <div className="w-64 h-64 flex flex-col">
          <img
            className="w-full h-full"
            src={firstPokemon.data?.sprites.front_default}
          />
          <div className="text-xl text-center capitalize mt-[-2rem]">
            {firstPokemon.data?.name}
          </div>
          <button onClick={() => votingHandler(first)}>Cuter</button>
        </div>
        <div className="p-8">Vs</div>
        <div className="w-64 h-64 flex flex-col">
          <img
            className="w-full h-full"
            src={secondPokemon.data?.sprites.front_default}
          />
          <div className="text-xl text-center capitalize  mt-[-2rem]">
            {secondPokemon.data?.name}
          </div>
          <button onClick={() => votingHandler(second)}>Cuter</button>
        </div>
        <div className="p-2" />
      </div>
    </div>
  );
};

export default Home;
