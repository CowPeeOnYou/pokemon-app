import type { NextPage } from 'next';
import { getOptionsForVote } from '../utils/randomPokemon';
import { trpc } from '../utils/trpc';

const Home: NextPage = () => {
  const [first, second] = getOptionsForVote();
  const firstPokemon = trpc.useQuery(['get-pokemon-by-id',{id:first}])
  console.log(firstPokemon)

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="text-2xl text-center">Which Pokemon is cuter?</div>
      <div className="p-2"/>
      <div className="border rounded p-8 flex justify-between items-center max-w-2xl">
        <div className="w-16 h-16 bg-red-800">{first}</div>
        <div className="p-8">Vs</div>
        <div className="w-16 h-16 bg-red-800" >{second}</div>
      </div>
    </div>
  );
};

export default Home;
