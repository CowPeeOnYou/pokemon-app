const maximumId = 493;

export const randomPokemon: (notThisOne?: number) => number = (notThisOne) => {
  const pokemonNumber = Math.floor(Math.random() * maximumId)+1;

  if (pokemonNumber !== notThisOne) return pokemonNumber;

  return randomPokemon(notThisOne);
};


export const getOptionsForVote = () =>{
    const firstId = randomPokemon();
    const secondId = randomPokemon(firstId)
    return [firstId, secondId]
}