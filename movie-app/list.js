import { WatchedStorage, ButtonMethods} from "./movie.js";
import {API_KEY, BASE_URL,IMAGE_URL} from "./app.js"
const listContainer = document.querySelector(".list-container");

const removeWatchedStorage = (id)=> {
    const ids = WatchedStorage.getLocalStorage();
    const newWatched = ids.filter(movieId => movieId != id);
    WatchedStorage.setLocalStorage(newWatched);
}
//action button functions
ButtonMethods.prototype.removeWatchedMovie = (container)=>{
    const removeBarBtn = document.querySelectorAll(".remove-bar-btn");
    removeBarBtn.forEach(item =>{
        item.addEventListener("click",e =>{
            const currentElem = e.currentTarget;
            const id = currentElem.dataset.id;
            console.log(id);
            container.removeChild(currentElem.parentElement.parentElement.parentElement.parentElement);
            removeWatchedStorage(id);
        })
    })
}
//display watched movies
export const displayMovieList = (data,container)=>{
    data.forEach(movie =>{
        const {poster_path,title,release_date,overview,id,vote_average} = movie;
        const percentage = Math.round((vote_average / 10) * 100);
        const divElem = document.createElement("div");
        divElem.classList.add("movie-container");
        divElem.classList.add("container");
        divElem.innerHTML = ` <div class="list-img">
        <img src="${IMAGE_URL + poster_path}" alt="watched movie">
    </div>
    <div class="details">
        <div class="head-details-wrapper">
            <div class="ring-percent">
                <div class="circle">
                    <h6 class="circle-num">${percentage}%</h6>
                </div>
            </div>
            <div class="title-wrapper">
                <h3 class="title">${title}</h3>
                <small class="date">${release_date}</small>
            </div>
        </div>
            <div class="overview">
                <p>${overview}</p>
            </div>
            <div class="action-bar">
            <div class="rating-bar">
                <button class="rating-bar-btn" data-id=${id}><i class="fa-regular fa-star"></i></button>
                <span>Your rating</span>
            </div>
            <div class="favorite-bar">
                <button class="favorite-bar-btn" data-id=${id}><i class="fa-regular fa-heart"></i></button>
                <span>Favorite</span>
            </div>
            <div class="add-bar">
                <button class="add-bar-btn" data-id=${id}><i class="fa-solid fa-list"></i></button>
                <span>Add to list</span>
            </div>
            <div class="remove-bar">
                <button class="remove-bar-btn" data-id=${id}><i class="fa-solid fa-x"></i></button>
                <span>Remove</span>
            </div>
        </div>
    </div>`;
    container.appendChild(divElem);
    })
}
//fetch the movie using the find URL in API and use the get local storage
//use the specific id
export const fetchSpecificDetails = async(movieIds)=>{
    const mapData = Promise.all(movieIds.map( async (id) => {
        const FIND_URL = BASE_URL + "/movie/" + id + "?" + API_KEY + "&language=en-US";
        const data = await fetch(FIND_URL);
        const result = await data.json();
        return result;
    }))
    const dataResult = await mapData;
    return dataResult;
}
window.addEventListener("load",()=>{    
    const buttonUtilities = new ButtonMethods();
    const movieIds = WatchedStorage.getLocalStorage();
    fetchSpecificDetails(movieIds).then((data)=> displayMovieList(data,listContainer)).then(()=> buttonUtilities.removeWatchedMovie(listContainer));
})