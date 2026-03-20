const POKEAPI_URL = "https://pokeapi.co/api/v2/"

/*function GetData(subUrl, query){
    return new Promise((resolve, reject) =>{
        fetch(pokeapiUrl+subUrl+"/"+query)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        })
        .catch(function () {
            console.log("Couldn't do the shit");
        });
    })
}*/
async function GetData(subUrl, query) {
    const data = await fetch(POKEAPI_URL+subUrl+"/"+query);
    const dataAsJSON = await data.json();
    console.log(dataAsJSON);
    return dataAsJSON;
}

/*function GetPokemon(name){
    return new Promise((resolve, reject) =>{
        fetch(pokeapiUrl+"pokemon/"+name)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        })
        .catch(function () {
            console.log("Couldn't do the shit");
        });
    })
}*/
async function GetPokemon(nameOrID){
    return await GetData("pokemon", nameOrID);
}

async function GetPokemonData(nameOrID){
    const pokemonData = await GetPokemon(nameOrID);
    console.log(pokemonData);
    return new Pokemon(pokemonData.id, pokemonData.name, pokemonData.sprites);
}

class Pokemon{
    constructor(id, name, sprites){
        this.id = id;
        this.name = name;
        this.sprites = sprites;
    }
    getID(){return this.id}
    getName(){return this.name}
    getSprite(name){
        //TODO: Figure out how to deal with the sprites
        console.log(this.sprites)
        return null;
    }
}