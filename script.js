const POKEAPI_URL = "https://pokeapi.co/api/v2/"
const pokemonDescDiv = document.getElementById("description")
const pokemonAbilitiesDiv = document.getElementById("abilities")
const padInputEl = document.getElementById('padInput')

async function GetData(subUrl, query) {
    const data = await fetch(POKEAPI_URL + subUrl + "/" + query);
    const dataAsJSON = await data.json();
    console.log(dataAsJSON);
    return dataAsJSON;
}

async function GetPokemon(nameOrID) {
    return await GetData("pokemon", nameOrID);
}

async function GetPokemonData(nameOrID) {
    const pokemonData = await GetPokemon(nameOrID);
    console.log(pokemonData);
    const pokemonAbilities = []
    for (let i = 0; i < pokemonData.abilities.length; i++) {
        pokemonAbilities.push(
            new PokemonAbility(
                pokemonData.abilities[i].ability.name,
                pokemonData.abilities[i].ability.url
            )
        )
    }
    const pokemon = new Pokemon(
        pokemonData.id,
        pokemonData.name,
        pokemonData.height,
        pokemonData.weight,
        pokemonData.sprites,
        pokemonData.species.name,
        pokemonData.species.url,
        pokemonAbilities
    );

    // EXTRA ENDPOINTS FETCHING
    await pokemon.fetchExtraInfo(); 
    return pokemon;
}

class Pokemon {
    constructor(id, name, height, weight, sprites, species, speciesUrl, abilities) {
        this.id = id;
        this.name = name;
        this.sprites = sprites;
        this.height = height; //in dm
        this.weight = weight; //in hg
        this.species = species
        this.speciesUrl = speciesUrl
        this.abilities = abilities
        // New properties for extra endpoints
        this.flavorText = ""
        this.nextEvo = ""
    }

    // Integrated logic for Endpoint 2 (Species) and 3 (Evolution)
    async fetchExtraInfo() {
        // 1. Fetch Species Data
        const speciesData = await fetch(this.speciesUrl).then(res => res.json());
        const entry = speciesData.flavor_text_entries.find(e => e.language.name === 'en');
        this.flavorText = entry ? entry.flavor_text.replace(/\n|\f/g, ' ') : "No data available.";

        // 2. Fetch Evolution Chain
        const evoRes = await fetch(speciesData.evolution_chain.url);
        const evoData = await evoRes.json();

        // LOGIC FIX: Comprehensive search for the next stage
        let currentName = this.name.toLowerCase().trim();
        let chain = evoData.chain;
        let foundNext = "Max Stage";

        // Check Stage 1 -> Stage 2
        if (chain.species.name === currentName) {
            foundNext = chain.evolves_to[0]?.species.name || "Max Stage";
        } else {
            // Check Stage 2 -> Stage 3
            // We search inside the evolves_to array to find where the current pokemon is
            const currentStage = chain.evolves_to.find(evo => evo.species.name === currentName);
            
            if (currentStage) {
                // If found in stage 2, get stage 3
                foundNext = currentStage.evolves_to[0]?.species.name || "Max Stage";
            } else {
                // Check if it's already in Stage 3 (Evolution of an evolution)
                for (let branch of chain.evolves_to) {
                    const finalStage = branch.evolves_to.find(evo => evo.species.name === currentName);
                    if (finalStage) {
                        foundNext = "Max Stage";
                        break;
                    }
                }
            }
        }

        this.nextEvo = foundNext;
    }
    }
    getID() { return this.id }
    getName() { return this.name }
    
    getSprite(name) {
        //TODO: Figure out how to deal with the sprites
        console.log(this.sprites)
        return null;
    }

    loadDescIntoDOM() {
        pokemonDescDiv.innerHTML = "" //Kill old inner HTML

        const nameDiv = document.createElement("p");
        const heightDiv = document.createElement("p")
        const weightDiv = document.createElement("p")
        const speciesDiv = document.createElement("p")
        const bioDiv = document.createElement("p") // Bio text from species endpoint

        heightDiv.innerText = "Height: " + this.height / 10 + "m"
        weightDiv.innerText = "Weight: " + this.weight / 10 + "kg"
        speciesDiv.innerText = "From the " + this.species + " species"
        nameDiv.innerText = this.name.toUpperCase()
        
        // Styling the yellow bio (Extra Endpoint data)
        bioDiv.innerText = this.flavorText;
        bioDiv.style.color = "#ffff00";
        bioDiv.style.fontSize = "10px";
        bioDiv.style.marginTop = "8px";

        pokemonDescDiv.append(nameDiv)
        pokemonDescDiv.append(heightDiv)
        pokemonDescDiv.append(weightDiv)
        pokemonDescDiv.append(speciesDiv)
        pokemonDescDiv.append(bioDiv)
    }

    async loadAbilitiesIntoDOM() {
        pokemonAbilitiesDiv.innerHTML = ""  //Kill old inner HTML
        const titleDiv = document.createElement("h2")
        titleDiv.innerText = "ABILITIES"

        pokemonAbilitiesDiv.append(titleDiv)
        for (let i = 0; i < this.abilities.length; i++) {
            // Endpoint 4: Fetching ability effect detail
            const abilityRes = await fetch(this.abilities[i].url).then(res => res.json());
            const shortEffect = abilityRes.effect_entries.find(e => e.language.name === 'en')?.short_effect || "";

            const newElement = document.createElement("p")
            newElement.style.fontSize = "9px";
            newElement.innerHTML = `<strong>${this.abilities[i].name.toUpperCase()}:</strong> ${shortEffect}`;
            pokemonAbilitiesDiv.append(newElement)
        }
    }

    loadImgIntoDOM() {
        const imgEl = document.getElementById('pokemonImage')
        if (this.sprites && this.sprites.front_default) imgEl.src = this.sprites.front_default
        else imgEl.src = 'temp/placeholder.png'
    }

    loadIntoDOM() {
        this.loadDescIntoDOM()
        this.loadAbilitiesIntoDOM()
        this.loadImgIntoDOM()
        
        // Update the 4th black button with evolution data
        const controls = document.querySelectorAll('.control');
        if(controls[3]) controls[3].innerText = `EVO: ${this.nextEvo.toUpperCase()}`;
    }
}

class PokemonAbility {
    constructor(name, url) {
        this.name = name
        this.url = url
    }
}

const searchBtn = document.querySelector('.pad button.search')
const clearBtn = document.querySelector('.pad button.clear')
const newBtn = document.querySelector('.pad button.new')
let currentInput = ''

async function onSearch() {
    let input = padInputEl.innerText
    if (!input || input === '0') return
    
    padInputEl.innerText = 'Loading...'
    try {
        const pokemon = await GetPokemonData(input.toLowerCase())
        pokemon.loadIntoDOM()
        padInputEl.innerText = input
    } catch (err) {
        console.error(err)
        padInputEl.innerText = 'Not found'
        setTimeout(() => { padInputEl.innerText = input; }, 1200)
    }
}

function onClear() {
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
    searchBtn.addEventListener('click', async () => { onSearch() })
}

if (clearBtn) {
    clearBtn.addEventListener('click', () => { onClear() })
}

//TODO: Do I really want this? I think probably not
if (newBtn) {
    newBtn.addEventListener('click', async () => {
        const id = Math.floor(Math.random() * 898) + 1
        currentInput = String(id)
        padInputEl.innerText = currentInput
        onSearch()
    })
}
