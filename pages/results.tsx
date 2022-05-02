import { inferAsyncReturnType } from "@trpc/server";
import { count } from "console";
import type { GetServerSideProps } from "next";
import { prisma } from "../backend/utils/prisma";
import { AsyncReturnType } from "../utils/ts-bs";

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

const ResultsPage: React.FC<{
  pokemon: AsyncReturnType<typeof getPokemonInOrder>;
}> = (props) => {
  return <div>Enter</div>;
};

export default ResultsPage;

export const getStaticProps: GetServerSideProps = async () => {
  const orderedPokemon = await getPokemonInOrder();
  return { props: { pokemon: orderedPokemon },revalidate: 60};
};
