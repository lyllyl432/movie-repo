export const API_KEY = "api_key=034bbde69cadd6b0f39d71859239a194";
export const BASE_URL = "https://api.themoviedb.org/3/";
const API_URL = BASE_URL + "/discover/movie?sort_by=popularity.desc&" + API_KEY;
export const IMAGE_URL ="https://image.tmdb.org/t/p/w500";
const API_URL_RATING = BASE_URL + "/discover/movie/?certification_country=US&certification=R&sort_by=vote_average.desc&" + API_KEY;
export const SEARCH_URL = BASE_URL + "/search/movie?" + API_KEY;
const main = document.querySelector(".main");
const swiperWrapper =  document.querySelector(".swiper-wrapper");
const boxContainer = document.querySelector(".box-container");
const carouselTitle = document.querySelector(".carousel-title");
let idArray = [];

//create an Object of Handling the Storage of individual id to use in movie.js
export class LocalStorage{
    static getLocalStorage = ()=>{
        return localStorage.getItem("movies") ? JSON.parse(localStorage.getItem("movies")):[];
    }
    static setLocalStorage = (data)=>{
            localStorage.setItem("movies",JSON.stringify(data))
        }
}
//create an Object of Handling the storage of all movies in DOM;
export class AllStorage {
    static getAllStorage = ()=>{
        return localStorage.getItem("all") ? JSON.parse(localStorage.getItem("all")):[];
    }
    static setAllStorage = (data)=>{
        localStorage.setItem("all",JSON.stringify(data));
    }
}
//display input feature and search filter
export const searchMovies = ()=>{
    const searchIcon = document.querySelector("#search-icon");
    const form = document.querySelector(".form-group");
    searchIcon.addEventListener("click",()=>{
        const formControl = document.querySelector(".form-control");
        form.classList.toggle("show");
            form.addEventListener("submit",e =>{
                e.preventDefault();
                const value = formControl.value;
                console.log(value);
                if(value){
                    loadMovies(SEARCH_URL + "&query=" + value);
                    carouselTitle.textContent = "Search Movies";
                }
                else{
                    loadMovies(API_URL);
                    carouselTitle.textContent = "Latest Episodes";
                }
                
            })
    })
}
//display highest rating data to the DOM
const displayHighMovies = (data,url)=>{
    console.log(data);
    data.forEach(item =>{
        let {title,release_date,poster_path,popularity,id} = item;
        const divElement = document.createElement("div");
        divElement.classList.add("movie");
        divElement.dataset.id = id;
        if(poster_path === null){
            url = "img/";
            poster_path = "404.png";
        }
        else if(poster_path !== null){
            url = "https://image.tmdb.org/t/p/w500";
            poster_path = poster_path;
        }
        divElement.innerHTML = `<a href ="/movie-app/movie.html"><div class="box-image">
        <img src="${url + poster_path}" alt="${title}">
    <div class="box-item-info">
        <h4>${title}</h4>
        <small>${release_date}</small>
        <p>${popularity}</p>
    </div></a>`
    boxContainer.appendChild(divElement);
    idArray.push(id);
    AllStorage.setAllStorage(idArray);
    })
    loadSpecificMovie();
}
//fetch the highest rating data using API
const loadHighRatings = async()=>{
    try{
        const fetchData = await fetch(API_URL_RATING);
        const result = await fetchData.json();
        console.log(result.results)
        return result.results;
    }
    catch(error){
        console.log(error);
    }
}
//display specific movie using the ID when click
const loadSpecificMovie = ()=>{
    const movies = document.querySelectorAll(".movie");
    for(let i = 0; i < movies.length; i++){
        let movie = movies[i];
        movie.addEventListener("click",e =>{
        const currTarget = e.currentTarget;
        let targetId = currTarget.dataset.id;
        LocalStorage.setLocalStorage(targetId);
        
        })
    }
}
//diplay the item to the carousel DOM
const displayMovies = (data,url)=>{
    let lastData = data;
    swiperWrapper.innerHTML = "";
    console.log(data)
        lastData.forEach(item =>{
        const {title,release_date,poster_path,id} = item;
        const divElement = document.createElement("div");
        divElement.classList.add("swiper-slide")
        divElement.classList.add("movie");
        divElement.dataset.id = id;
        divElement.innerHTML = `<a href ="./movie.html">
 
        <img src="${url + poster_path}" alt="${title}">
        <div class="movie-info">
                <h4>${title}</h4>
                <small>${release_date}</small>
            </div></a>
        `
        swiperWrapper.appendChild(divElement);
        idArray.push(id);
        AllStorage.setAllStorage(idArray);
    })
    loadSpecificMovie()
}
//Fetch the popular data using API
export const loadMovies = async(url)=>{
    let lastUrl = url;  
    try{
    let data = await fetch(`${lastUrl}`);
    let result = await data.json();
    console.log(result);
    displayMovies(result.results, IMAGE_URL);
}
    catch(error){
        console.log(error);
    }

}
window.addEventListener("load",()=>{
    //POPULAR
    loadMovies(API_URL);
    //HIGHEST RATING
    loadHighRatings().then(data =>{
        displayHighMovies(data, IMAGE_URL);
    })
    //SEARCH SPECIFIC
    searchMovies();
})
                
               
