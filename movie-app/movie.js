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
    const addBtn = document.querySelector(".add-bar-btn");
    let id = addBtn.dataset.id;
    let idFound = WatchedStorage.getLocalStorage().find(movieId => movieId == id);
    console.log(id)
    if(idFound){
        addBtn.disabled = true;
        addBtn.classList.add("added");
    }
    addBtn.addEventListener("click", e=>{
        const newWatched = LocalStorage.getLocalStorage();
        console.log(newWatched);
        const watched = WatchedStorage.getLocalStorage();
        watched.push(newWatched);
        WatchedStorage.setLocalStorage(watched);
        const currTarget = e.currentTarget;
        currTarget.disabled = true;
        e.currentTarget.classList.add("added");
    })
} 
ButtonMethods.prototype.getFavorite = ()=>{
    const favoriteBtn = document.querySelector(".favorite-bar-btn");
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
    const rateBtn = document.querySelectorAll(".rate-btn");
    const ratingSystem = document.querySelector("#rating-system");
    const ratingForm = document.querySelectorAll(".rating-form");
    const stars = document.querySelectorAll(".label-icon");
    const fieldsetRating = document.querySelectorAll(".rating-fieldset");
    let ratingArr = [];
    rateBtn.forEach(btn => {
        btn.addEventListener("click",e=>{
            showRating(e,fieldsetRating);
        });
    })
    window.addEventListener("click",e=>{
        hideRating(e,ratingForm);
    });
    rateBtn.forEach(btn => {
        btn.addEventListener("mouseover", ()=>{
            showRatingText(ratingIdentifier);
        });
        btn.addEventListener("mouseout", ()=>{
            removeRatingText(ratingIdentifier);
        });
    })
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
ButtonMethods.prototype.onLoadRating = (ratingValue)=>{
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
    ratingForm.forEach(form => {
        if (!form.contains(e.target)) {
            form.classList.remove("show");
        }
    })
}
const showRating = function(e,fieldset){
    e.stopPropagation();
    fieldset.forEach(set => {
        set.parentElement.classList.remove("show");
        console.log(set);
        const id = e.target.dataset.id;
        const fieldId = set.dataset.id;
        if(id === fieldId){
            set.parentElement.classList.add("show");
        }
    })
}
const showRatingText = (ratingIdentifier)=>{
    ratingIdentifier.classList.add("show");
}
const removeRatingText = (ratingIdentifier)=>{
    ratingIdentifier.classList.remove("show");
}
//display movie in DOM
const displayMovie = (data)=>{
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
    buttonElement.innerHTML = ` <button class="btn add-bar-btn" data-id = ${id}><i role="list-item" class="fa-regular fa-bookmark"></i></button>
    <button href="" class="btn favorite-bar-btn" data-id = ${id}><i class="fa-solid fa-heart"></i></button>
     <div id="rating-system">
         <div class="ratings-container">
         <button class="btn rate-btn rate-btn--sm" data-id = ${id}><i data-id = ${id} class="fa-solid fa-star"></i></button>
         <div class="rating-identifier">
         <span id="rating-value">Rate It!</span>
     </div>
     <form action="" id="rating-form-handler" class="rating-form">
     <fieldset id="rating" class="rating-fieldset" data-id=${id}>
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
     </div>
`
    movieInfo.appendChild(overviewElement);
    movieInfo.appendChild(buttonElement);
    movieContainer.appendChild(movieInfo);
}

//fetch the movie using the find URL in API and use the get local storage
//use the specific id
const fetchSpecificDetails = async()=>{
    const id = LocalStorage.getLocalStorage().toString();
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

























