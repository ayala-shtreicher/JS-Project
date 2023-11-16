import { baseUrl, countries, all, container, search, selectCountries } from "./main.js";

async function render() {
    let countriesCodes = [];
    all.addEventListener("click", showAll);
    countries.forEach(item => {
        countriesCodes.push(item.id)
        item.addEventListener("click", showCountry)
    });
    await getCountries(countriesCodes).then(data => {
        data.forEach(country => {
            container.append(creatCardCountry(country))
        })
    }).catch(err => console.log(err));
    showSelect();

}
async function showSelect() {
    let options = "";
    const selectElement = document.createElement("select");
    selectElement.id = "select";
    selectElement.name = "selectCountries";
    selectElement.className = "bg-success ms-4";

    const defaultOption = document.createElement("option");
    defaultOption.value = "all_countries";
    defaultOption.innerHTML = "all countries";
    selectElement.appendChild(defaultOption);
    await getAll("name").then(data => {
        data.forEach(country => {
            const option = document.createElement("option");
            option.className = "option";
            option.value = country.name.common;
            option.innerHTML = country.name.common;
            options += option.outerHTML;
            selectElement.appendChild(option);
        })
    })
    selectElement.addEventListener("change", (e) => {
        showCountry(e.target.value);
    })
    selectCountries.appendChild(selectElement);
}

function creatCardCountry(country) {
    const cardEl = document.createElement("div");
    const cardBodyEl = document.createElement("div");
    cardEl.className = "card m-5";
    cardBodyEl.className = "card-body text-center";
    const btn = document.createElement("button");
    btn.className = "btn btn-success text-light";
    btn.innerHTML = "More details"
    cardBodyEl.innerHTML =
        `
    <img src=${country.flags.png} class="card-img-top" alt="${country.flags.alt}">
    <h5 class="card-title">${country.name.common}</h5>
    <p class="card-text">Region: ${country.region}</p>
    <p class="card-text">Population: ${country.population}</p>
    `;
    cardBodyEl.append(btn);
    cardEl.append(cardBodyEl);
    btn.addEventListener("click", () => moreDetails(country));
    return cardEl;
}

function moreDetails(country) {
    const map = document.createElement("div");
    const cardEl = document.createElement("div");
    const cardBodyEl = document.createElement("div");
    cardEl.className = "card bg-dark-subtle w-25";
    cardBodyEl.className = "card-body text-center";
    cardBodyEl.innerHTML =
        `
        <img src=${country.flags.png} class="card-img-top" alt="${country.flags.alt}">
        <h5 class="card-title">${country.name.common}</h5>
        <p class="card-text">${country.capital}</p>
        <p class="card-text">Region: ${country.region}</p>
        <p class="card-text">Coin: ${Object.values(country.currencies)[0].name} ${Object.values(country.currencies)[0].symbol}</p>
        <p class="card-text">Population: ${country.population}</p>
        <p class="card-text">languages: ${Object.values(country.languages).join(" ,")}</p>
        <p>borders: </p>
    `;
    if (country.borders) {
        country.borders.map(async border => {
            const btn = document.createElement("button");
            btn.className = "btn btn-info text-light m-2";
            await getCountryCode(border).then(data => border = data).catch(err => console.log(err))
            btn.innerHTML = border;
            btn.addEventListener("click", () => showCountry(border));
            cardBodyEl.append(btn);
        })
    }
    else {
        cardBodyEl.innerHTML += "<p class='text-danger fs-3'>no borders</p>"
    }
    map.className = "w-50"
    map.innerHTML = `
    <iframe width="100%" height="100%" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"
    src="https://maps.google.com/maps?q=${country.latlng[0]},${country.latlng[1]}&hl=iw&z=4&amp;output=embed">
    </iframe>
    `;
    cardEl.append(cardBodyEl);
    container.innerHTML = "";
    container.className += " bg-body-secondary";
    container.append(cardEl, map);
}

async function showCountry(searchValue) {
    if (typeof searchValue !== 'string') {
        searchValue = searchValue.target.innerText;
    }
    await getCountryFilter(searchValue).then(country => {
        if (country == "Unknown country") {
            container.className = "text-light text-center bg-danger";
            container.innerHTML = `<h1>${country}</h1>`
        }
        else
            moreDetails(country[0]);
    }).catch(err => console.log("getCountryFilterERROR", err))
}
async function showAll() {
    await getAll().then(data => {
        container.innerHTML = "";
        container.className = "d-flex justify-content-around flex-wrap p-5";
        data.forEach(country => {
            container.append(creatCardCountry(country));;
        })
    }).catch(err => console.log(err));
}
const getAll = async (filter = "") => {
    try {
        const res = await axios.get(`${baseUrl}/all/?fields=${filter}`)
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

const getCountryCode = async (country) => {
    try {
        const res = await axios.get(`${baseUrl}/alpha/${country}/?fields=name`)
        return res.data.name.common;
    } catch (error) {
        console.log(error);
    }
}

const getCountryFilter = async (country) => {
    try {
        const res = await axios.get(`${baseUrl}/name/${country}/?fields=name,flags,latlng,population,languages,capital,currencies,region,borders`)
        return res.data;
    } catch (error) {
        console.log("getCountryFilterErr", error);
        return "Unknown country"
    }
}
const getCountries = async (params) => {
    try {
        const res = await axios.get(`${baseUrl}/alpha?codes=${params}`)
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

function searchCountry() {
    const searchValue = search.value;
    showCountry(searchValue);
}

export { render, getCountries, getAll, searchCountry }