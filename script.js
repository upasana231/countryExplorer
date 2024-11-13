document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search");
    const suggestionsDiv = document.getElementById("suggestions");
    const countriesContainer = document.getElementById("countries");
    const loadMoreBtn = document.getElementById("loadMore");
    const toggleFavoritesBtn = document.getElementById("toggleFavorites");
    const favoritesPanel = document.getElementById("favorites");
    const favoritesList = document.getElementById("favoritesList");
    const favoritesError = document.getElementById("favoritesError");
    const detailsPopup = document.getElementById("countryDetailsPopup");
    const overlay = document.getElementById("overlay");
    const regionSelect = document.getElementById("regionSelect");
    const languageSelect = document.getElementById("languageSelect");
    const maxFavorites = 5;
    let favorites = [];
    let countries = [];
    let filteredCountries = [];
    let displayedCountries = 10;

    async function loadCountries() {
        try {
            const response = await fetch("https://restcountries.com/v3.1/all");
            countries = await response.json();
            filteredCountries = countries;
            displayCountries(filteredCountries.slice(0, displayedCountries));
            populateFilters(countries);
        } catch (error) {
            console.error("Error fetching country data:", error);
        }
    }

    function populateFilters(countries) {
        const regions = [...new Set(countries.map(country => country.region))];
        regions.forEach(region => {
            const option = document.createElement("option");
            option.value = region;
            option.textContent = region;
            regionSelect.appendChild(option);
        });

        const languages = [...new Set(countries.flatMap(country => Object.values(country.languages || {})))];
        languages.forEach(language => {
            const option = document.createElement("option");
            option.value = language;
            option.textContent = language;
            languageSelect.appendChild(option);
        });
    }

    function displayCountries(countryList) {
        countriesContainer.innerHTML = "";
        countryList.forEach(country => {
            const countryCard = document.createElement("div");
            countryCard.className = "country-card";
            countryCard.innerHTML = `
                <img src="${country.flags.png}" alt="${country.name.common} flag" class="flag">
                <div class="country-name">${country.name.common}</div>
            `;
            countryCard.addEventListener("click", () => showCountryDetailsPopup(country));
            countriesContainer.appendChild(countryCard);
        });
    }

    function showCountryDetailsPopup(country) {
        detailsPopup.innerHTML = `
            <div class="popup-content">
                <h2>${country.name.common}</h2>
                <img src="${country.flags.png}" alt="${country.name.common} flag" class="flag-large">
                <p><strong>Region:</strong> ${country.region}</p>
                <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
                <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                <p><strong>Area:</strong> ${country.area.toLocaleString()} km²</p>
                <button id="addToFavorites" class="styled-button">Add to Favorites</button>
                <button id="closePopup" class="styled-button">Close</button>
            </div>
        `;
        overlay.classList.add("active");
        detailsPopup.classList.add("show");

        document.getElementById("addToFavorites").addEventListener("click", () => addToFavorites(country));
        document.getElementById("closePopup").addEventListener("click", closePopup);
    }

    function closePopup() {
        overlay.classList.remove("active");
        detailsPopup.classList.remove("show");
    }

    function addToFavorites(country) {
        if (favorites.some(fav => fav.name.common === country.name.common)) {
            alert("This country is already in your favorites.");
            return;
        }
        if (favorites.length >= maxFavorites) {
            favoritesError.classList.remove("hidden");
            return;
        }
        favoritesError.classList.add("hidden");
        favorites.push(country);
        displayFavorites();
    }

    function displayFavorites() {
        favoritesList.innerHTML = "";
        favorites.forEach(country => {
            const favoriteItem = document.createElement("div");
            favoriteItem.className = "favorite-item";
            favoriteItem.innerHTML = `
                <img src="${country.flags.png}" alt="${country.name.common} flag" class="flag-small">
                <span>${country.name.common}</span>
                <button class="remove-favorite" data-country-name="${country.name.common}">❌</button>
            `;
            favoritesList.appendChild(favoriteItem);
        });

        if (favorites.length > 0) {
            favoritesPanel.classList.add("show");
        } else {
            favoritesPanel.classList.remove("show"); 
        }

        
        document.querySelectorAll('.remove-favorite').forEach(button => {
            button.addEventListener('click', (e) => {
                const countryName = e.target.getAttribute('data-country-name');
                removeFavorite(countryName);
            });
        });
    }

    function removeFavorite(countryName) {
    
        favorites = favorites.filter(fav => fav.name.common !== countryName);

        
        displayFavorites();
    }
    
    
    searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filtered = countries.filter(country =>
            country.name.common.toLowerCase().includes(searchTerm)
        );
        showSuggestions(filtered);
    });

    function showSuggestions(countries) {
        suggestionsDiv.innerHTML = ''; 
        const limitedCountries = countries.slice(0, 10); 
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

    regionSelect.addEventListener("change", () => {
        filterCountries();
    });

    languageSelect.addEventListener("change", () => {
        filterCountries();
    });

    function filterCountries() {
        const region = regionSelect.value;
        const language = languageSelect.value;

        filteredCountries = countries.filter(country => {
            const regionMatch = region ? country.region === region : true;
            const languageMatch = language ? Object.values(country.languages || {}).includes(language) : true;
            return regionMatch && languageMatch;
        });

        displayCountries(filteredCountries.slice(0, displayedCountries));
    }

    loadMoreBtn.addEventListener("click", () => {
        displayedCountries += 10;
        displayCountries(filteredCountries.slice(0, displayedCountries));
    });

    loadCountries();
});
