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

const PokemonList: React.FC<{ pokemon: PokemonQueryResult[number] }> = ({
  pokemon,
}) => {
  return (
    <div className="flex border-b p-2 items-center justify-between">
      {" "}
      <div className="flex items-center">
        <Image layout="fixed" src={pokemon.spriteUrl} width={64} height={64} />
        <div className="pl-2 capitalize">{pokemon.name}</div>
      </div>
      <div className="pr-3">{generateCountPercent(pokemon) + "%"}</div>
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
          className="form-select form-select-lg mb-3
      appearance-none
      w-48
      px-4
      py-2
      text-xl
      text-center
      text-gray-700
      bg-white bg-clip-padding bg-no-repeat
      border border-solid border-gray-300
      rounded
      transition
      ease-in-out
      m-0
      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
      items-center "
          value={inOrder}
          onChange={orderHandler}
        >
          <option value="descending">Descending</option>
          <option value="ascending">Ascending</option>
        </select>
        <div className="flex flex-col w-full max-w-2xl border">
          {inOrder === "descending" &&
            props.pokemon
              .sort((a, b) => generateCountPercent(b) - generateCountPercent(a))
              .map((currentPokemon, index) => {
                return <PokemonList pokemon={currentPokemon} key={index} />;
              })}
          {inOrder === "ascending" &&
            props.pokemon
              .sort((a, b) => generateCountPercent(a) - generateCountPercent(b))
              .map((currentPokemon, index) => {
                return <PokemonList pokemon={currentPokemon} key={index} />;
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
