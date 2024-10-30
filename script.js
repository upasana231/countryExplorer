const countriesDiv = document.getElementById('countries');
const searchInput = document.getElementById('search');
const suggestionsDiv = document.getElementById('suggestions');
const loadMoreButton = document.getElementById('loadMore');
const favoritesDiv = document.getElementById('favorites');
let currentPage = 1;
const pageSize = 10;
let allCountries = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

async function fetchCountries() {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,flags,tld,capital,region,population,area,languages');
    allCountries = await response.json();
    displayCountries(allCountries);
    displayFavorites();
}

function displayCountries(countries) {
    countriesDiv.innerHTML = '';
    countries.slice(0, pageSize * currentPage).forEach(country => {
        const countryCard = document.createElement('div');
        countryCard.className = 'country-card';
        countryCard.innerHTML = `
            <img src="${country.flags.png}" alt="${country.name.common}" />
            <h3>${country.name.common}</h3>
        `;
        countryCard.onclick = () => {
            window.location.hash = `#country/${country.name.common}`;
            showCountryDetails(country);
        };
        countriesDiv.appendChild(countryCard);
    });
}

function showCountryDetails(country) {
    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'details';
    detailsDiv.innerHTML = `
        <h2>${country.name.common}</h2>
        <img src="${country.flags.png}" alt="${country.name.common}" />
        <p><strong>Region:</strong> ${country.region}</p>
        <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Area:</strong> ${country.area.toLocaleString()} km²</p>
        <button id="favoriteBtn">${favorites.includes(country.name.common) ? 'Remove from Favorites' : 'Add to Favorites'}</button>
        <button id="backBtn">Back</button>
    `;

    countriesDiv.innerHTML = '';
    countriesDiv.appendChild(detailsDiv);
    
    setTimeout(() => (detailsDiv.style.opacity = '1'), 50);

    document.getElementById('favoriteBtn').onclick = () => {
        toggleFavorite(country);
        showCountryDetails(country); 
    };

    document.getElementById('backBtn').onclick = () => {
        window.location.hash = ''; 
        displayCountries(allCountries); 
    };
}

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    
    const filteredCountries = allCountries.filter(country => {
        const matchesName = country.name.common.toLowerCase().includes(query);
        const matchesLanguage = Object.values(country.languages || {}).some(language =>
            language.toLowerCase().includes(query)
        );
        return matchesName || matchesLanguage;
    });

    displayCountries(filteredCountries); 
    showSuggestions(filteredCountries); 
});



function showSuggestions(countries) {
    suggestionsDiv.innerHTML = '';
    const limitedCountries = countries.slice(0); 
    limitedCountries.forEach(country => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        suggestionItem.textContent = country.name.common;
        suggestionItem.onclick = () => {
            searchInput.value = country.name.common;
            displayCountries([country]);
            suggestionsDiv.innerHTML = ''; 
            suggestionsDiv.style.display = 'none'; 
        };
        suggestionsDiv.appendChild(suggestionItem);
    });

    if (limitedCountries.length > 0) {
        suggestionsDiv.style.display = 'block'; 
    } else {
        suggestionsDiv.style.display = 'none'; 
    }
}

document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !suggestionsDiv.contains(e.target)) {
        suggestionsDiv.innerHTML = ''; 
        suggestionsDiv.style.display = 'none'; 
    }
});

loadMoreButton.onclick = () => {
    currentPage++;
    displayCountries(allCountries);
};
const toggleFavoritesButton = document.getElementById('toggleFavorites');

toggleFavoritesButton.onclick = () => {
    favoritesDiv.classList.toggle('hidden'); 
    if (favoritesDiv.classList.contains('hidden')) {
        toggleFavoritesButton.textContent = 'Show Favorites'; 
    } else {
        toggleFavoritesButton.textContent = 'Hide Favorites'; 
    }
};

favoritesDiv.classList.add('hidden'); 


function toggleFavorite(country) {
    const index = favorites.indexOf(country.name.common);
    if (index > -1) {
        favorites.splice(index, 1); 
    } else if (favorites.length < 5) {
        favorites.push(country.name.common); 
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites();
}

function displayFavorites() {
    favoritesDiv.innerHTML = '<h2>Favorites</h2>';
    favorites.forEach(favName => {
        const country = allCountries.find(c => c.name.common === favName);
        if (country) {
            const favItem = document.createElement('div');
            favItem.className = 'favorite-item';
            favItem.innerHTML = `
                <img src="${country.flags.png}" alt="${country.name.common} Flag" />
                <span>${country.name.common}</span>
            `;
            favoritesDiv.appendChild(favItem);
        }
    });
    favoritesDiv.classList.toggle('hidden', favorites.length === 0);
}

window.addEventListener('hashchange', () => {
    const hash = window.location.hash;
    if (hash.startsWith('#country/')) {
        const countryName = hash.split('/')[1];
        const country = allCountries.find(c => c.name.common === countryName);
        if (country) {
            showCountryDetails(country);
        }
    } else {
        displayCountries(allCountries); 
    }
});

fetchCountries();
displayFavorites();
