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
    return new Pokemon(
        pokemonData.id, 
        pokemonData.name, 
        pokemonData.height, 
        pokemonData.weight, 
        pokemonData.sprites,
        pokemonData.species.name,
        pokemonData.species.url
    );
}

class Pokemon{
    //TODO: We wont need this constructor soon
    /*constructor(id, name, sprites){
        this.id = id;
        this.name = name;
        this.sprites = sprites;
        this.height = "N/A";
        this.weight = "N/A";
    }*/
    constructor(id, name, height, weight, sprites, species, speciesUrl){
        this.id = id;
        this.name = name;
        this.sprites = sprites;
        this.height = height; //in dm
        this.weight = weight; //in hg
        this.species = species
        this.speciesUrl = speciesUrl
    }
    getID(){return this.id}
    getName(){return this.name}
    getSprite(name){
        //TODO: Figure out how to deal with the sprites
        console.log(this.sprites)
        return null;
    }
    loadIntoDOM(){
        const pokemonDescDiv = document.getElementById("description")
        pokemonDescDiv.innerHTML = "" //Kill old inner HTML

        const nameDiv = document.createElement("p");
        //const descDiv = document.createElement("div")
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
}