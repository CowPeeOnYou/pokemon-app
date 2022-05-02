import { inferAsyncReturnType } from "@trpc/server";
import { count } from "console";
import type { GetServerSideProps } from "next";
import { prisma } from "../backend/utils/prisma";
import { AsyncReturnType } from "../utils/ts-bs";
import Image from "next/image";

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

const PokemonList: React.FC<{ pokemon: PokemonQueryResult[number] }> = (
  props
) => {
  return (
    <div className="flex border-b p-2 items-center w-full max-w-2xl">
      {" "}
      <Image
        layout="fixed"
        src={props.pokemon.spriteUrl}
        width={64}
        height={64}
      />
      <div className="capitalize">{props.pokemon.name}</div>
    </div>
  );
};

const ResultsPage: React.FC<{
  pokemon: AsyncReturnType<typeof getPokemonInOrder>;
}> = (props) => {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl p-4">Results</h1>
      <div className="flex flex-col items-center w-full max-w-2xl border">
        <div className="p-2"/.
      {props.pokemon.map((currentPokemon, index) => {
        return <PokemonList pokemon={currentPokemon} key={index} />;
      })}
    </div>
    </div>
  );
};

export default ResultsPage;

export const getStaticProps: GetServerSideProps = async () => {
  const orderedPokemon = await getPokemonInOrder();
  return { props: { pokemon: orderedPokemon }, revalidate: 60 };
};
