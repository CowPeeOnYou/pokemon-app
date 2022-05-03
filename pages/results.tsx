import { inferAsyncReturnType } from "@trpc/server";
import type { GetServerSideProps } from "next";
import { prisma } from "../backend/utils/prisma";
import { AsyncReturnType } from "../utils/ts-bs";
import Image from "next/image";
import Link from "next/link";
import { SetStateAction, useState } from "react";

const getPokemonInOrder = async () => {
  return await prisma.pokemon.findMany({
    orderBy: {
      VoteFor: { _count: "desc" },
    },
    select: {
      id: true,
      name: true,
      spriteUrl: true,
      _count: {
        select: {
          VoteFor: true,
          VoteAgainst: true,
        },
      },
    },
  });
};

type PokemonQueryResult = AsyncReturnType<typeof getPokemonInOrder>;

const generateCountPercent = (pokemon: PokemonQueryResult[number]) => {
  const { VoteFor, VoteAgainst } = pokemon._count;
  if (VoteFor + VoteAgainst === 0) {
    return 0;
  }
  return (VoteFor / (VoteFor + VoteAgainst)) * 100;
};

const PokemonList: React.FC<{
  pokemon: PokemonQueryResult[number];
  rank: number;
}> = ({ pokemon, rank }) => {
  return (
    <div className="flex border-b p-2 items-center justify-between">
      <div className="flex items-center">
        <div className="top-0 left-0 z-20 ml-4 flex items-center justify-center px-2 font-semibold text-white shadow-lg rounded-br-md">
          {rank}.
        </div>
        <div className="flex items-center pl-4">
          <Image
            layout="fixed"
            src={pokemon.spriteUrl}
            width={64}
            height={64}
          />
          <div className="pl-2 capitalize">{pokemon.name}</div>
        </div>
      </div>
      <div className="pr-3">
        {generateCountPercent(pokemon).toFixed(2) + "%"}
      </div>
    </div>
  );
};

const ResultsPage: React.FC<{
  pokemon: AsyncReturnType<typeof getPokemonInOrder>;
}> = (props) => {
  const [inOrder, setInOrder] = useState("descending");
  const orderHandler = (e: { target: { value: SetStateAction<string> } }) => {
    setInOrder(e.target.value);
  };

  return (
    <>
      <Link href="/">
        <a className="ml-8 absolute top-4">
          <img width="48px" height="48px" src="..//arrow.png" />
        </a>
      </Link>
      <div className="flex flex-col items-center">
        <h1 className="text-2xl p-4">Results</h1>
        <div className="p-2" />
        <select
          className="block appearance-none w-48 bg-white border text-center text-gray-700 mb-4 border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          value={inOrder}
          onChange={orderHandler}
        >
          <option selected value="descending">
            Descending
          </option>
          <option value="ascending">Ascending</option>
        </select>
        <div className="flex flex-col w-full max-w-2xl border">
          {inOrder === "descending" &&
            props.pokemon
              .sort((a, b) => generateCountPercent(b) - generateCountPercent(a))
              .map((currentPokemon, index) => {
                return (
                  <PokemonList
                    pokemon={currentPokemon}
                    key={index}
                    rank={index + 1}
                  />
                );
              })}
          {inOrder === "ascending" &&
            props.pokemon
              .sort((a, b) => generateCountPercent(a) - generateCountPercent(b))
              .map((currentPokemon, index) => {
                return (
                  <PokemonList
                    pokemon={currentPokemon}
                    key={index}
                    rank={index + 1}
                  />
                );
              })}
        </div>
      </div>
    </>
  );
};

export default ResultsPage;

export const getStaticProps: GetServerSideProps = async () => {
  const orderedPokemon = await getPokemonInOrder();
  return { props: { pokemon: orderedPokemon }, revalidate: 60 };
};
