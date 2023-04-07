import { displayMovieList, fetchSpecificDetails} from "./list.js";
import { FavoriteStorage,ButtonMethods } from "./movie.js";
const favoriteContainer = document.querySelector(".favorite-container");
const removeFavoriteStorage = (id)=>{
    const ids = FavoriteStorage.getLocalStorage();
    const newWatched = ids.filter(movieId => movieId != id);
    FavoriteStorage.setLocalStorage(newWatched);
}

ButtonMethods.prototype.removeFavoriteMovie = (container)=>{
    const removeBarBtn = document.querySelectorAll(".remove-bar-btn");
    removeBarBtn.forEach(item =>{
        item.addEventListener("click",e =>{
            const currentElem = e.currentTarget;
            const id = currentElem.dataset.id;
            console.log(id);
            container.removeChild(currentElem.parentElement.parentElement.parentElement.parentElement);
            removeFavoriteStorage(id);
        })
    })
}
window.addEventListener("load",()=>{
    const buttonUtilities = new ButtonMethods();
    const movieIds = FavoriteStorage.getLocalStorage();
    fetchSpecificDetails(movieIds).then(data => displayMovieList(data,favoriteContainer)).then(()=> buttonUtilities.removeFavoriteMovie(favoriteContainer));
});