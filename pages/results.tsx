import { inferAsyncReturnType } from "@trpc/server";
import { count } from "console";
import type { GetServerSideProps } from "next";
import { prisma } from "../backend/utils/prisma";
import { AsyncReturnType } from "../utils/ts-bs";
import Image from "next/image";
import Link from "next/link";

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
  return (
    <>
      <Link href="/">
        <a className="ml-8 absolute top-4"><img width="48px" height="48px" src="..//arrow.png"/></a>
      </Link>
      <div className="flex flex-col items-center">
        <h1 className="text-2xl p-4">Results</h1>
        <div className="p-2" />
        <div className="flex flex-col w-full max-w-2xl border">
          {props.pokemon.map((currentPokemon, index) => {
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
