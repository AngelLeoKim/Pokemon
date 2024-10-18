const searchBar = document.getElementById("search-bar");
const pokemonList = document.getElementById("pokemon-list");
const modal = document.getElementById("pokemon-modal");
const modalContent = document.getElementById("pokemon-modal-content");
const closeModal = document.getElementsByClassName("close")[0];
let allPokemonData = [];

// Fetch all Pokémon names and details on page load
async function getPokemonList() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=150"); // Adjust the limit as needed
  const data = await response.json();

  const promises = data.results.map(async (pokemon) => {
    const res = await fetch(pokemon.url);
    return res.json();
  });

  allPokemonData = await Promise.all(promises);
  displayPokemonList(allPokemonData);
}

// Function to handle search and filter Pokémon
function searchPokemon() {
  const query = searchBar.value.toLowerCase();
  const filteredList = allPokemonData.filter((pokemon) =>
    pokemon.name.includes(query)
  );
  displayPokemonList(filteredList);
}

// Display Pokémon list with red and white background, including basic info
function displayPokemonList(pokemonArray) {
  pokemonList.innerHTML = "";

  pokemonArray.forEach((pokemon) => {
    const pokemonCard = document.createElement("div");
    pokemonCard.classList.add("pokemon-card");

    pokemonCard.innerHTML = `
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
      <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
      <p>Height: ${pokemon.height / 10} m</p>
      <p>Weight: ${pokemon.weight / 10} kg</p>
    `;

    pokemonCard.addEventListener("click", () => {
      displayPokemonInfo(pokemon);
    });

    pokemonList.appendChild(pokemonCard);
  });
}

// Display Pokémon details in modal popup when card is clicked
function displayPokemonInfo(pokemon) {
  modal.style.display = "block";
  modalContent.innerHTML = `
    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
    <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
    <p>Height: ${pokemon.height / 10} m</p>
    <p>Weight: ${pokemon.weight / 10} kg</p>
    <p>Base Experience: ${pokemon.base_experience}</p>
    <p>Abilities: ${pokemon.abilities.map((a) => a.ability.name).join(", ")}</p>
  `;
}

// Close modal
closeModal.onclick = function () {
  modal.style.display = "none";
};

// Close modal if user clicks outside of the modal
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// Load the Pokémon list on page load
getPokemonList();
