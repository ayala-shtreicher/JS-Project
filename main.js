import { render ,searchCountry} from "./functions.js";
const baseUrl = `https://restcountries.com/v3.1`;


const all = document.querySelector(".all");
const countries = document.querySelectorAll(".country");
const container = document.querySelector("#container");
const submit = document.querySelector("#submit");
const search = document.querySelector("#search");
submit.addEventListener("click",searchCountry);
const selectCountries=document.getElementById("selectCountries");

render();
export { baseUrl, countries, all ,container,search,selectCountries}

