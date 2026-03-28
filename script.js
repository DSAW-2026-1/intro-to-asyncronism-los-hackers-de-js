const POKEAPI_URL = "https://pokeapi.co/api/v2/"
const pokemonDescDiv = document.getElementById("description")
const pokemonAbilitiesDiv = document.getElementById("abilities")
const padInputEl = document.getElementById('padInput')

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
                pokemonData.abilities[i].ability.name,
                pokemonData.abilities[i].ability.url
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
    loadImgIntoDOM(){
        const imgEl = document.getElementById('pokemonImage')
        if(this.sprites && this.sprites.front_default) imgEl.src = this.sprites.front_default
        else imgEl.src = 'temp/placeholder.png'
    }
    loadIntoDOM(){
        this.loadDescIntoDOM()
        this.loadAbilitiesIntoDOM()
        this.loadImgIntoDOM()
    }
}
class PokemonAbility{
    constructor(name, url){
        this.name = name
        this.url = url
    }
}
const searchBtn = document.querySelector('.pad button.search')
const clearBtn = document.querySelector('.pad button.clear')
const newBtn = document.querySelector('.pad button.new')
let currentInput = ''

async function onSearch(params) {
    let currentInput = padInputEl.innerText
    if (!currentInput) return
        padInputEl.innerText = 'Loading...'
        try {
            const pokemon = await GetPokemonData(currentInput)
            pokemon.loadIntoDOM()
            padInputEl.innerText = currentInput
        } catch (err) {
            console.error(err)
            padInputEl.innerText = 'Not found'
            setTimeout(() => { padInputEl.innerText = currentInput; }, 1200)
        }
}
function onClear(){
    padInputEl.innerText = '0'
    currentInput = ''
}

const numberButtons = document.querySelectorAll('.pad button:not(.search):not(.clear):not(.new)')
numberButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const digit = btn.innerText.trim()
        if (currentInput === '0') currentInput = ''
        currentInput += digit
        padInputEl.innerText = currentInput
    })
})
if (searchBtn) {
    searchBtn.addEventListener('click', async () => {onSearch()})
}
if (clearBtn) {
    clearBtn.addEventListener('click', () => {onClear()})
}
//TODO: Do I really want this? I think probably not
if (newBtn) {
    newBtn.addEventListener('click', async () => {
        const id = Math.floor(Math.random() * 898) + 1
        currentInput = String(id)
        padInputEl.innerText = currentInput
        if (searchBtn) searchBtn.click()
    })
}