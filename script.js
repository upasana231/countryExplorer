document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search");
    const suggestionsDiv = document.getElementById("suggestions");
    const countriesContainer = document.getElementById("countries");
    const loadMoreBtn = document.getElementById("loadMore");
    const favoritesPanel = document.getElementById("favorites");
    const favoritesList = document.getElementById("favoritesList");
    const detailsPopup = document.getElementById("countryDetailsPopup");
    const overlay = document.getElementById("overlay");
    const regionSelect = document.getElementById("regionSelect");
    const languageSelect = document.getElementById("languageSelect");

    const apiUrl = 'https://restcountries.com/v3.1/all';  // Rest Countries API URL

    const maxFavorites = 5;
    let favorites = [];
    let countries = [];
    let filteredCountries = [];
    let displayedCountries = 10;

    // This function is to load countries from Rest Countries API or fallback to local JSON
    async function loadCountries() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error("Failed to fetch data from the Rest Countries API");
            }

            const data = await response.json();
            countries = data;
            filteredCountries = countries;
            displayedCountries = 10;
            displayCountries(countries.slice(0, displayedCountries));
            populateFilters(countries);
        } catch (error) {
            console.error("Error fetching country data from Rest Countries API:", error);
            loadFallbackData();
        }
    }

    // This function loads countries from fallback local JSON if API fails
    function loadFallbackData() {
        fetch('countries.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to load data from the local JSON file");
                }
                return response.json();
            })
            .then(data => {
                countries = data;
                filteredCountries = countries;
                displayedCountries = 10;
                displayCountries(countries.slice(0, displayedCountries));
                populateFilters(countries);
            })
            .catch(error => {
                console.error("Error loading fallback data:", error);
                countriesContainer.innerHTML = '<p class="error">Failed to load country data. Please try again later.</p>';
                countries = [];
                filteredCountries = [];
            });
    }

    // This function populates region and language filters
function populateFilters(countries) {
    regionSelect.innerHTML = '<option value="">All Regions</option>';
    const regions = [...new Set(countries.map(country => country.region).filter(Boolean))];
    regions.forEach(region => {
        const option = document.createElement("option");
        option.value = region;
        option.textContent = region;
        regionSelect.appendChild(option);
    });

    languageSelect.innerHTML = '<option value="">All Languages</option>';
    const languages = [...new Set(
        countries.flatMap(country => country.languages ? Object.values(country.languages) : [])
    )];
    languages.forEach(language => {
        const option = document.createElement("option");
        option.value = language;
        option.textContent = language;
        languageSelect.appendChild(option);
    });
}

    // This function displays country cards
function displayCountries(countryList) {
    countriesContainer.innerHTML = "";
    countryList.forEach(country => {
        const countryCard = document.createElement("div");
        countryCard.className = "country-card";

        // Check if country.flags exists and fetch the correct flag URL
        const flagUrl = country.flags && country.flags[1]
            ? country.flags[1]  // Large flag
            : `https://flagcdn.com/w320/${country.cca2.toLowerCase()}.png`;  // Fallback to CDN URL

        console.log(country.flags);  // Log to ensure the flags data is coming through

        countryCard.innerHTML = `
            <img src="${flagUrl}" alt="${country.name.common} flag" class="flag">
            <div class="country-name">${country.name.common}</div>
        `;
        countryCard.addEventListener("click", () => showCountryDetailsPopup(country));
        countriesContainer.appendChild(countryCard);
    });
}

// This function shows country details popup when user clicks on any country card
function showCountryDetailsPopup(country) {
    const flagUrl = country.flags && country.flags[1]
        ? country.flags[1]  // Large flag
        : `https://flagcdn.com/w320/${country.cca2.toLowerCase()}.png`;  // Fallback to CDN URL

    const population = country.population ? country.population.toLocaleString() : "N/A";
    const area = country.area ? `${country.area.toLocaleString()} km²` : "N/A";
    
    // Fix for currencies (handling if available)
    const currency = country.currencies ? Object.values(country.currencies).map(curr => `${curr.name} (${curr.symbol || "N/A"})`).join(", ") : "N/A";
    
    // Fix for languages (extracting the names of languages)
    const languages = country.languages 
        ? Object.values(country.languages).join(", ") 
        : "N/A";
    
    const region = country.region || "N/A";
    const subregion = country.subregion || "N/A";
    const capital = country.capital ? country.capital.join(", ") : "N/A";
    const timezones = country.timezones ? country.timezones.join(", ") : "N/A";
    const borders = country.borders ? country.borders.join(", ") : "N/A";
    
    detailsPopup.innerHTML = `
        <div class="popup-content">
            <h2>${country.name.common}</h2>
            <img src="${flagUrl}" alt="${country.name.common} flag" class="flag-large">
            <p><strong>Region:</strong> ${region}</p>
            <p><strong>Subregion:</strong> ${subregion}</p>
            <p><strong>Capital:</strong> ${capital}</p>
            <p><strong>Population:</strong> ${population}</p>
            <p><strong>Area:</strong> ${area}</p>
            <p><strong>Currency:</strong> ${currency}</p>
            <p><strong>Languages:</strong> ${languages}</p>
            <p><strong>Timezones:</strong> ${timezones}</p>
            <p><strong>Borders:</strong> ${borders}</p>
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

    // This function adds country to favorites list
    function addToFavorites(country) {
        if (favorites.length >= maxFavorites) {
            alert("You can't add more than 5 countries to the favorites list.");
            return;
        }

        if (favorites.some(fav => fav.name === country.name)) {
            alert(`${country.name.common} is already in the favorites list.`);
            return;
        }

        favorites.push(country);
        displayFavorites();
    }

    // This function displays favorite countries in the fav section
function displayFavorites() {
    favoritesList.innerHTML = ''; // Clear the list before re-rendering
    favorites.forEach(favorite => {
        const favoriteItem = document.createElement("div");

        // Check if favorite.flags exists and fetch the correct flag URL
        const flagUrl = favorite.flags && favorite.flags[1]
            ? favorite.flags[1]  // Large flag
            : `https://flagcdn.com/w320/${favorite.cca2.toLowerCase()}.png`;  // Fallback to CDN URL

        const flagImg = document.createElement("img");
        flagImg.src = flagUrl;
        flagImg.alt = `${favorite.name.common} flag`;
        flagImg.classList.add("flag-small");

        const countryName = document.createElement("span");
        countryName.textContent = favorite.name.common;

        favoriteItem.appendChild(flagImg);
        favoriteItem.appendChild(countryName);

        const removeButton = document.createElement("button");
        removeButton.textContent = "x";
        removeButton.classList.add("remove-favorite");
        removeButton.addEventListener("click", () => removeFromFavorites(favorite));
        favoriteItem.appendChild(removeButton);

        favoritesList.appendChild(favoriteItem);
    });
}


    // This function removes country from the favorites list
    function removeFromFavorites(country) {
        const isConfirmed = confirm(`Are you sure you want to remove ${country.name.common} from your favorites?`);
        if (isConfirmed) {
            favorites = favorites.filter(fav => fav.name !== country.name);
            displayFavorites();
        }
    }

    // This function filters countries based on their region and language
function filterCountries() {
    const selectedRegion = regionSelect.value;
    const selectedLanguage = languageSelect.value;

    filteredCountries = countries.filter(country => {
        const matchesRegion = selectedRegion ? country.region === selectedRegion : true;
        const matchesLanguage = selectedLanguage
            ? country.languages && Object.values(country.languages).includes(selectedLanguage)
            : true;

        return matchesRegion && matchesLanguage;
    });

    displayCountries(filteredCountries.slice(0, displayedCountries));
    loadMoreBtn.style.display = filteredCountries.length > displayedCountries ? 'block' : 'none';
}


    // This function shows filtered country suggestions based on the first letter of the input
    function showSuggestions(searchTerm) {
        suggestionsDiv.innerHTML = ''; 

        // This function gets the selected region and language from the filters
        const selectedRegion = regionSelect.value;
        const selectedLanguage = languageSelect.value;

        // This function filters countries whose names start with the searchTerm (first letter matching)
        const limitedCountries = countries.filter(country => {
            const matchesSearch = country.name.common.toLowerCase().startsWith(searchTerm.toLowerCase());
            const matchesRegion = selectedRegion ? country.region === selectedRegion : true; 
            const matchesLanguage = selectedLanguage
                ? country.languages ? Object.values(country.languages).some(lang => lang.toLowerCase() === selectedLanguage.toLowerCase()) : false
                : true; 

            return matchesSearch && matchesRegion && matchesLanguage;
        }).slice(0, 10);  

        limitedCountries.forEach(country => {
            const suggestionItem = document.createElement('div');
            suggestionItem.className = 'suggestion-item';
            suggestionItem.textContent = country.name.common;
            suggestionItem.onclick = () => {
                searchInput.value = country.name.common;  
                displayCountries([country]);  
                suggestionsDiv.innerHTML = '';  
                suggestionsDiv.style.display = 'none';
                loadMoreBtn.style.display = 'none'; 
            };
            suggestionsDiv.appendChild(suggestionItem);
        });

        suggestionsDiv.style.display = limitedCountries.length > 0 ? 'block' : 'none';
    }

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.trim();
        if (searchTerm.length > 0) {
            showSuggestions(searchTerm);
        } else {
            suggestionsDiv.innerHTML = '';  
            suggestionsDiv.style.display = 'none';
            loadMoreBtn.style.display = 'block'; 
        }
    });

    regionSelect.addEventListener('change', filterCountries);

    languageSelect.addEventListener('change', filterCountries);

    loadMoreBtn.addEventListener('click', () => {
        displayedCountries += 10;
        displayCountries(filteredCountries.slice(0, displayedCountries));
        if (displayedCountries >= filteredCountries.length) {
            loadMoreBtn.style.display = 'none';
        }
    });

    loadCountries();
});
