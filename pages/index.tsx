import type { NextPage } from 'next';
import { trpc } from '../utils/trpc';

const Home: NextPage = () => {

  const {data, isLoading} = trpc.useQuery(["hello",{text:'king'}])
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="text-2xl text-center">Which Pokemon is cuter?</div>
      <div className="p-2"/>
      <div className="border rounded p-8 flex justify-between items-center max-w-2xl">
        <div className="w-16 h-16 bg-red-200" />
        <div className="p-8">Vs</div>
        <div className="w-16 h-16 bg-red-200" />
      </div>
    </div>
  );
};

export default Home;
