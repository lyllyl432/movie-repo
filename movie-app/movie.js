import {LocalStorage, API_KEY, BASE_URL,IMAGE_URL} from "./app.js";
const featuredMovieContainer = document.querySelector("#featured-movie")
const movieContainer = document.querySelector(".movie-container");

export class NewWatchedStorage{
    static getLocalStorage = ()=>{
        return localStorage.getItem("newlywatched") ? JSON.parse(localStorage.getItem("newlywatched")):[];
    }
    static setLocalStorage = (data)=>{
            localStorage.setItem("newlywatched",JSON.stringify(data))
        }
}
export class WatchedStorage{
    static getLocalStorage = ()=>{
        return localStorage.getItem("watched") ? JSON.parse(localStorage.getItem("watched")):[];
    }
    static setLocalStorage = (data)=>{
            localStorage.setItem("watched",JSON.stringify(data))
        }
}
export class FavoriteStorage{
    static getLocalStorage = ()=>{
        return localStorage.getItem("favorite") ? JSON.parse(localStorage.getItem("favorite")):[];
    }
    static setLocalStorage = (data)=>{
        localStorage.setItem("favorite",JSON.stringify(data))
    }
}
export class RatingStorage{
    static getLocalStorage = ()=>{
        return localStorage.getItem("rating") ? JSON.parse(localStorage.getItem("rating")):[];
    }
    static setLocalStorage = (data)=>{
        localStorage.setItem("rating",JSON.stringify(data))
    }
}
export class ButtonMethods{
}
//add method to the prototype so that it can be only use once in every instance
ButtonMethods.prototype.getCheckList = ()=>{
    const checkBtn = document.querySelector(".checkList");
    let id = checkBtn.dataset.id;
    let idFound = WatchedStorage.getLocalStorage().find(movieId => movieId == id);
    if(idFound){
        checkBtn.disabled = true;
        checkBtn.classList.add("added");
    }
    checkBtn.addEventListener("click", e=>{
        const newWatched = LocalStorage.getLocalStorage();
        console.log(newWatched);
        const watched = WatchedStorage.getLocalStorage();
        watched.push(newWatched);
        WatchedStorage.setLocalStorage(watched);
        const currTarget = e.currentTarget;
        currTarget.disabled = true;
        checkBtn.classList.add("added");
    })
} 
ButtonMethods.prototype.getFavorite = ()=>{
    const favoriteBtn = document.querySelector(".favoriteList");
    let id = favoriteBtn.dataset.id;
    let idFound = FavoriteStorage.getLocalStorage().find(movieId => movieId == id);
    if(idFound){
        favoriteBtn.disabled = true;
        favoriteBtn.classList.add("added"); //add css
    }
   
    favoriteBtn.addEventListener("click", e =>{
        const newFavorite = LocalStorage.getLocalStorage();
        const favorite = FavoriteStorage.getLocalStorage();
        favorite.push(newFavorite);
        FavoriteStorage.setLocalStorage(favorite);
        const currTarget = e.currentTarget;
        currTarget.disabled = true;
        favoriteBtn.classList.add("added"); //add css
    })
}
ButtonMethods.prototype.getRatings = (ratingIdentifier,ratingValue)=>{
    const rateBtn = document.querySelector(".rate-btn");
    const ratingForm = document.querySelector("#rating-form");
    const stars = document.querySelectorAll(".label-icon");
    let ratingArr = [];
    rateBtn.addEventListener("click",e=>{
        showRating(e,ratingForm,ratingIdentifier);
    });
    window.addEventListener("click",e=>{
        hideRating(e,ratingForm);
    });
    rateBtn.addEventListener("mouseover", ()=>{
        showRatingText(ratingIdentifier);
    });
    rateBtn.addEventListener("mouseout", ()=>{
        removeRatingText(ratingIdentifier);
    });
    for( let star of stars){
        star.addEventListener("click", function(){
            this.previousElementSibling.checked = true;
            console.log(this.previousElementSibling);
            let num = this.previousElementSibling.dataset.num;
            console.log(num);
            let productId = this.parentElement.dataset.id;
            let rating = this.previousElementSibling.value;
            console.log(rating);
            let data = {
                "num": num,
                "productId": productId,
                "rating": rating
            }
            ratingArr.push(data);
            ratingValue.textContent = rating;
            RatingStorage.setLocalStorage(ratingArr);
        });
    }
}
ButtonMethods.prototype.onLoadRating = (ratingIdentifier,ratingValue)=>{
    const ratingField = document.querySelector("#rating");
    console.log(ratingValue);
    const oddOnes = [];
    const ratings = RatingStorage.getLocalStorage();
    for(let key of ratings){
        if(ratingField.dataset.id == key.productId){
            let reverse = Array.from(ratingField.children).reverse();
            console.log(reverse);
            let index = parseInt(key["num"]) - 1;
            console.log(index);
            for(let i = 0; i < reverse.length; i++){
                if(i % 2 !== 0){
                    oddOnes.push(reverse[i]);
                }
            }
                if(oddOnes[index].dataset.id == key.productId){
                  oddOnes[index].checked = true;
                } 
         ratingValue.textContent = key.rating;
        }
    }
}
const hideRating = (e,ratingForm)=>{
    if (!ratingForm.contains(e.target)) {
        ratingForm.classList.remove("show");
    }
}
const showRating = function(e,ratingForm,ratingIdentifier){
    e.stopPropagation();
    ratingForm.classList.add("show");
    ratingIdentifier.classList.remove("show");
}
const showRatingText = (ratingIdentifier)=>{
    ratingIdentifier.classList.add("show");
}
const removeRatingText = (ratingIdentifier)=>{
    ratingIdentifier.classList.remove("show");
}
//display movie in DOM
const displayMovie = (data)=>{
    console.log(data);
    const {poster_path,title,release_date,status,genres,runtime,tagline,overview,id} = data
    const year = release_date.slice(0,4);
    featuredMovieContainer.style.backgroundImage = `url(${IMAGE_URL + poster_path})`;
    //created DIV for img block
    const imgElementContainer = document.createElement("div");
    imgElementContainer.classList.add("movie-image-container");
    const imgElement = document.createElement("img");
    const attr = document.createAttribute("src");
    attr.value = `${IMAGE_URL + poster_path}`;
    imgElement.setAttributeNode(attr);
    imgElementContainer.appendChild(imgElement);
    movieContainer.appendChild(imgElementContainer);
    //created DIV for title
    const movieInfo = document.createElement("div");
    movieInfo.classList.add("movie-info-wrapper");
    const titleDiv = document.createElement("div");
    titleDiv.classList.add("title-container")
    titleDiv.innerHTML = `<h2>${title}</h2>
    <small>(${year})</small>`
    movieContainer.appendChild(titleDiv);
    //another div
    const factsElement = document.createElement("div");
    factsElement.classList.add("facts")
    const certificationSpan = document.createElement("span");
    certificationSpan.textContent = status;
    const releaseSpan = document.createElement("span");
    releaseSpan.textContent = release_date;
    const genreSpan = document.createElement("span");
    genreSpan.classList.add("genre");
    const runtimeSpan = document.createElement("span");
    runtimeSpan.textContent = runtime + " " + "m";
    genres.forEach(genre =>{
        const anchorElement = document.createElement("a");
        anchorElement.textContent = genre.name;
        genreSpan.appendChild(anchorElement);
    })
    factsElement.appendChild(certificationSpan);
    factsElement.appendChild(releaseSpan);
    factsElement.appendChild(runtimeSpan);
    factsElement.appendChild(genreSpan);
    movieInfo.appendChild(titleDiv);
    movieInfo.appendChild(factsElement)
    //created movie information div;
    const overviewElement = document.createElement("div");
 
    overviewElement.innerHTML = `
    <h3 class="overview-title">Overview</h3>
    <div class="overview">
        <p>${overview}</p>
    </div>`;
    const buttonElement = document.createElement("ul");
    buttonElement.setAttribute("role","list");
    buttonElement.classList.add("button-wrapper");
    buttonElement.innerHTML = `<li role="list-item"><a href="" class="btn checkList" data-id = ${id}><i role="list-item" class="fa-regular fa-bookmark"></i></a></li>
    <li role="list-item"><a href="" class="btn favoriteList" data-id = ${id}><i class="fa-solid fa-heart"></i></a></li>
    <li id="rating-system">
        <div class="ratings-container">
        <a class="btn rate-btn" data-id = ${id}><i class="fa-solid fa-star"></i></a>
        <div class="rating-identifier">
        <span id="rating-value">Rate It!</span>
    </div>
    <form action="" id="rating-form">
    <fieldset id="rating" data-id=${id}>
        <input type="radio" id="star-5" class="input-identifier" name="rating" value="10.0" data-num ="10" data-id=${id}> <label class="full label-icon" for="star-5" title="5 stars"></label>
        <input type="radio" id="star-4-half" class="input-identifier"name="rating" value="9.0" data-num ="9" data-id=${id}> <label class="half label-icon" for="star-4-half" title="4 half stars"></label>
        <input type="radio" id="star-4" class="input-identifier"name="rating" value="8.0" data-num ="8" data-id=${id}"> <label class="full label-icon" for="star-4" title="4 stars"></label>
        <input type="radio" id="star-3-half" class="input-identifier"name="rating" value="7.0" data-num ="7" data-id=${id}> <label class="half label-icon" for="star-3-half" title="3 half stars"></label>
        <input type="radio" id="star-3" class="input-identifier"name="rating" value="6.0" data-num ="6" data-id=${id}> <label class="full label-icon" for="star-3" title="3 stars"></label>
        <input type="radio" id="star-2-half" class="input-identifier"name="rating" value="5.0" data-num ="5" data-id=${id}> <label class="half label-icon" for="star-2-half" title="2 half stars"></label>
        <input type="radio" id="star-2" class="input-identifier"name="rating" value="4.0" data-num ="4" data-id=${id}> <label class="full label-icon" for="star-2" title="2 stars"></label>
        <input type="radio" id="star-1-half" class="input-identifier"name="rating" value="3.0" data-num ="3" data-id=${id}> <label class="half label-icon" for="star-1-half" title="1 half stars"></label>
        <input type="radio" id="star-1" class="input-identifier"name="rating" value="2.0" data-num ="2" data-id=${id}> <label class="full label-icon" for="star-1" title="1 stars"></label>
        <input type="radio" id="star-0-half" class="input-identifier"name="rating" value="1.0" data-num ="1" data-id=${id}> <label class="half label-icon" for="star-0-half" title="0 half stars"></label>
    </fieldset>
</form>
        
        </div>
    </li>
`
    movieInfo.appendChild(overviewElement);
    movieInfo.appendChild(buttonElement);
    movieContainer.appendChild(movieInfo);
}

//fetch the movie using the find URL in API and use the get local storage
//use the specific id
const fetchSpecificDetails = async()=>{
    const id = LocalStorage.getLocalStorage().toString();
    console.log(id);
    const FIND_URL = BASE_URL + "/movie/" + id + "?" + API_KEY + "&language=en-US";
    const data = await fetch(FIND_URL);
    const result = await data.json();
    return result
}

window.addEventListener("load",()=>{
    const buttonUtilities = new ButtonMethods();
    fetchSpecificDetails().then(data => displayMovie(data)).then(()=>{
        const ratingIdentifier = document.querySelector(".rating-identifier");
        const ratingValue = document.querySelector("#rating-value");
        buttonUtilities.getCheckList();
        buttonUtilities.getFavorite();
        buttonUtilities.getRatings(ratingIdentifier,ratingValue);
        buttonUtilities.onLoadRating(ratingIdentifier,ratingValue);
    });

})

























// const displayDetails = (movie)=>{
//     const moviesContainer = document.querySelector(".movies-container");
//     if(moviesContainer){
//         moviesContainer.innerHTML = `<div class="movie-img">
//         <img src="${(movie.Poster !== "N/A")? movie.Poster: "img/404.png"}">
//     </div>
//     <div class="movie-img">
//         <img src="" alt="">
//     </div><div class="movie">
//         <h2>${movie.Title}</h2>
//         <ul class="movie-info">
//             <li>${movie.Writer}</li>
//             <li>${movie.Year}</li>      
//             <li>${movie.Actors}</li>
//             <li>${movie.Genre}</li>
//             <li>${movie.Released}</li>
//             <li>${movie.Runtime}</li>
//             <li>${movie.Awards}</li>
//         </ul>
//     </div>`
//     }
// }

// const fetchDetails = async (itemID)=>{
//     const result = await fetch(`http://www.omdbapi.com/?i=${itemID}&apikey=fc1fef96`); // use this API to my movie js
//     const movieDetails = await result.json();
//     console.log(movieDetails);
//     return movieDetails
// }

// const reduceData = ()=>{
//     const getData = LocalStorage.getLocalStorage();
//     console.log(getData);
//     return getData;
// }
// window.addEventListener("DOMContentLoaded",()=>{
//     const uniqueId = reduceData();
//     fetchDetails(uniqueId).then(data => {
//         displayDetails(data);
//     })
// })
