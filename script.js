const POKEAPI_URL = "https://pokeapi.co/api/v2/"
const pokemonDescDiv = document.getElementById("description")
const pokemonAbilitiesDiv = document.getElementById("abilities")

async function GetData(subUrl, query) {
    const data = await fetch(POKEAPI_URL+subUrl+"/"+query);
    const dataAsJSON = await data.json();
    console.log(dataAsJSON);
    return dataAsJSON;
}
async function GetPokemon(nameOrID){
    return await GetData("pokemon", nameOrID);
}

async function GetPokemonData(nameOrID){
    const pokemonData = await GetPokemon(nameOrID);
    console.log(pokemonData);
    const pokemonAbilities = []
    for(let i = 0; i < pokemonData.abilities.length; i++){
        pokemonAbilities.push(
            new PokemonAbility(
                pokemonData.abilities[i].name,
                pokemonData.abilities[i].url
            )
        )
    }
    return new Pokemon(
        pokemonData.id, 
        pokemonData.name, 
        pokemonData.height, 
        pokemonData.weight, 
        pokemonData.sprites,
        pokemonData.species.name,
        pokemonData.species.url,
        pokemonAbilities
    );
}

class Pokemon{
    constructor(id, name, height, weight, sprites, species, speciesUrl, abilities){
        this.id = id;
        this.name = name;
        this.sprites = sprites;
        this.height = height; //in dm
        this.weight = weight; //in hg
        this.species = species
        this.speciesUrl = speciesUrl
        this.abilities = abilities
    }
    getID(){return this.id}
    getName(){return this.name}
    getSprite(name){
        //TODO: Figure out how to deal with the sprites
        console.log(this.sprites)
        return null;
    }
    loadDescIntoDOM(){
        pokemonDescDiv.innerHTML = "" //Kill old inner HTML

        const nameDiv = document.createElement("p");
        const heightDiv = document.createElement("p")
        const weightDiv = document.createElement("p")
        const speciesDiv = document.createElement("p")

        heightDiv.innerText = "Height: "+this.height/10+"m"
        weightDiv.innerText = "Weight: "+this.weight/10+"kg"
        speciesDiv.innerText = "From the "+this.species+" species"

        nameDiv.innerText = this.name

        pokemonDescDiv.append(nameDiv)
        pokemonDescDiv.append(heightDiv)
        pokemonDescDiv.append(weightDiv)
        pokemonDescDiv.append(speciesDiv)
    }
    loadAbilitiesIntoDOM(){
        pokemonAbilitiesDiv.innerHTML = ""  //Kill old inner HTML
        const titleDiv = document.createElement("h2")
        titleDiv.innerText = "ABILITIES"

        pokemonAbilitiesDiv.append(titleDiv)
        for(let i = 0; i < this.abilities.length; i++){
            const newElement = document.createElement("p")
            newElement.innerText = this.abilities[i].name
            pokemonAbilitiesDiv.append(newElement)
        }
    }
    loadIntoDOM(){
        this.loadDescIntoDOM()
        this.loadAbilitiesIntoDOM()
    }
}
class PokemonAbility{
    constructor(name, url){
        this.name = name
        this.url = url
    }
}
//TEST THE SHIT
/*const testPokemon = new Pokemon(
    1,
    "TestPokemon", 
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    null
)*/