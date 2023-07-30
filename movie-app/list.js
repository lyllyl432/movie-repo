import { WatchedStorage, ButtonMethods,FavoriteStorage } from "./movie.js";
import { API_KEY, BASE_URL, IMAGE_URL } from "./app.js";
import { WatchListStorage } from "./myList-form.js";

const fetchSpecificMovie = async(id)=>{
    const FIND_URL = BASE_URL + "/movie/" + id + "?" + API_KEY + "&language=en-US";
    const specificData = await fetch(FIND_URL);
    const result = await specificData.json();
    return result;
}
class UserUpdate {
    updatePercentage() {
        const circularProgress = document.querySelectorAll(".circular-progress");
        circularProgress.forEach((progressBar) => {
            const innerCircle = progressBar.querySelector(".inner-circle");
            let percentage = progressBar.dataset.percentage,
                percentageTextWrap = progressBar.querySelector(".percentage"),
                progressColor = progressBar.dataset.progressColor;
            percentageTextWrap.textContent = `${percentage}` + "%";
            //innerCircle bg color
            innerCircle.style.background = progressBar.dataset.innerCircleColor;
            //progressBar bg color
            progressBar.style.background = `conic-gradient(${progressColor} ${Number(percentage) * 3.6
                }deg,${progressBar.getAttribute("data-bg-color")} 0deg)`;
        })
    }
}
class FilterMethods {
    filterUtilities(showDate, showPopular, showRelease) {
        const movieContainer = document.querySelectorAll(".movie-container");
        const sortText = document.querySelectorAll(".sort-text");
        const sortContainer = document.querySelector(".sort-container");
        const filters = document.querySelector(".filters");
        const dateLink = document.querySelector(".date-filter");
        const popularityLink = document.querySelector(".popularity-filter");
        const releaseLink = document.querySelector(".release-filter");
        const filtersAnchor = document.querySelectorAll(".filter");
        const dropDownDateText = document.querySelector("#sort-date-added");
        const dropDownPopularityText = document.querySelector("#sort-popularity");
        const dropDownReleaseText = document.querySelector("#sort-release-date");


        //mouseover and mouseout the ul
        sortContainer.addEventListener("mouseover", () => {
            filters.classList.add("show");
        })
        sortContainer.addEventListener("mouseout", () => {
            filters.classList.remove("show");
        })
        //filter by date
        dateLink.addEventListener("click", (e) => {
            this.showDateFilter(e,movieContainer);
            //specific dropdown filter update
            this.filterUpdate(e,filtersAnchor,dropDownDateText,sortText)
        })
        popularityLink.addEventListener("click", (e) => {
            this.showPopularFilter(e,movieContainer);
            this.filterUpdate(e,filtersAnchor,dropDownPopularityText,sortText)
        })
        releaseLink.addEventListener("click", (e) => {
            this.showReleaseFilter(e,movieContainer);
            this.filterUpdate(e,filtersAnchor,dropDownReleaseText,sortText)
        })
        const skipArg = undefined;
        // remain the class with the use of local storage
        if (showDate === "enabled") {
            this.showDateFilter(skipArg,movieContainer,filtersAnchor);
        } else if (showPopular === "enabled") {
            this.showPopularFilter(skipArg,movieContainer,filtersAnchor);
        } else if (showRelease === "enabled") {
            this.showReleaseFilter(skipArg,movieContainer,filtersAnchor)
        }
    }
    //callback functions for event listeners in filter links
    showDateFilter(e,containers) {
        console.log(e);
        localStorage.removeItem("release-filter");
        localStorage.removeItem("popularity-filter");
        for (let container of containers) {
            container.classList.remove("show")
            if (container.classList.contains("sort-by-date")) {
                container.classList.add("show");
                localStorage.setItem("date-filter", "enabled");
            }
        }
    }
    showPopularFilter(e,containers) {
        localStorage.removeItem("release-filter");
        localStorage.removeItem("date-filter");
        for (let container of containers) {
            container.classList.remove("show")
            if (container.classList.contains("sort-by-popular")) {
                container.classList.add("show");
                localStorage.setItem("popularity-filter", "enabled");
            }
        }
    }
    showReleaseFilter(e,containers) {
        localStorage.removeItem("date-filter");
        localStorage.removeItem("popularity-filter");
        for (let container of containers) {
            container.classList.remove("show")
            if (container.classList.contains("sort-by-release")) {
                container.classList.add("show");
                localStorage.setItem("release-filter", "enabled");
            }
        }
    }
    filterUpdate(e,filters,dropText,sortText){
         //must add hide if the specific filter is clicked
         filters.forEach(filter => {
            filter.classList.remove("hide");
        })
        e.currentTarget.classList.add("hide");
         //drop-down text 
         sortText.forEach(text => {
            text.classList.remove("active");
            text.classList.add("hide")
        })
         dropText.classList.add("active");
         dropText.classList.remove("hide");
    }
}
//sort data by vote average
const sortByRelease = (data, container, sortWrap) => {
    let sortedData = data.sort(({ vote_average: a }, { vote_average: b }) => {
        let voteA = a;
        let voteB = b;
        return voteA - voteB;
    })
    displaySortMovies(sortedData, container, sortWrap);
    const movieContainer = sortWrap.querySelectorAll(".movie-container");
    for (let movie of movieContainer) {
        movie.classList.add("sort-by-release");
    }
}
//sort data by popularity
const sortByPopularity = (data, container, sortWrap) => {
    let sortedData = data.sort(({ popularity: a }, { popularity: b }) => {
        let popularA = a;
        let popularB = b;
        return popularB - popularA;
    })
    displaySortMovies(sortedData, container, sortWrap);
    const movieContainer = sortWrap.querySelectorAll(".movie-container");
    for (let movie of movieContainer) {
        movie.classList.add("sort-by-popular");
    }


}
//sort data by dates
const sortByDate = (data, container, sortWrap) => {
    let sortedData = data.sort(({ release_date: a }, { release_date: b }) => {
        let dataA = new Date(a);
        let dataB = new Date(b);
        return dataA - dataB;
    })
    displaySortMovies(sortedData, container, sortWrap);
    const movieContainer = sortWrap.querySelectorAll(".movie-container");
    for (let movie of movieContainer) {
        movie.classList.add("sort-by-date");
    }

}
const removeWatchedStorage = (id) => {
    const ids = WatchedStorage.getLocalStorage();
    const newWatched = ids.filter(movieId => movieId != id);
    WatchedStorage.setLocalStorage(newWatched);
}
//action button functions
ButtonMethods.prototype.removeWatchedMovie = (container) => {
    const removeBarBtn = document.querySelectorAll(".remove-bar-btn");
    removeBarBtn.forEach(item => {
        item.addEventListener("click", e => {
            const currentElem = e.currentTarget;
            const id = currentElem.dataset.id;
            console.log(id);
            container.removeChild(currentElem.parentElement.parentElement.parentElement.parentElement);
            removeWatchedStorage(id);
        })
    })
}
//add watch list button function
ButtonMethods.prototype.getWatchList = ()=>{
    const addBarBtn = document.querySelectorAll(".add-bar-btn");
    const listCreator = document.querySelectorAll(".list-creator");
    let lastID;
    //toggle add-bar-btn
    addBarBtn.forEach(btn => {
        btn.addEventListener("click",(e)=>{
            e.stopPropagation();
            const currentBtn = e.currentTarget;
            listCreator.forEach(list => {
                list.classList.remove("show");
            })
            currentBtn.nextElementSibling.nextElementSibling.classList.add("show");
            
        })
    //remove the pop up button when click outside the button
    })
    window.addEventListener("click",(e)=>{
        listCreator.forEach(list =>{
            if(!list.contains(e.target)){
                list.classList.remove("show");
            }
        })
    })
    // add the watch list storage in DOM
    const getListData = WatchListStorage.getLocalStorage("watchlist-data");
    let movieId;
    let storageId;

    const watchStorageWrapper = document.querySelectorAll(".watch-storage-wrapper");
    getListData.forEach(list => {
        let {title,description,privacy,"data-id":id} = list;
        watchStorageWrapper.forEach(wrapper => {
            movieId = wrapper.dataset.movieid;
            const storageElem = document.createElement("div");
            storageElem.classList.add("watch-list-storage");
            storageElem.setAttribute("data-movieid",movieId);
            storageElem.setAttribute("data-storageid",id);
            storageElem.innerHTML = `<span class="watch-list-storage-title">${title}</span>`
            wrapper.appendChild(storageElem);
        })
    })
    
    const watchListStorage = document.querySelectorAll(".watch-list-storage");
    watchListStorage.forEach(list => {
        list.addEventListener("click", (e)=>{
            storageId = e.currentTarget.dataset.storageid;
            movieId = e.currentTarget.dataset.movieid;
            console.log(movieId);
            const findKeyStorage = WatchListStorage.getLocalStorage("watch-list-id").find(id => id === storageId);
           //fetch specific movie data
            fetchSpecificMovie(movieId).then(data => {
          
            const movieData = {
                poster_path : data.poster_path,
                vote_average: data.vote_average,
                id: data.id
            }
            const movieLibraryList = WatchListStorage.getLocalStorage(findKeyStorage);
            if(movieLibraryList.find(data => data.id == movieId)){
                alert("Already Added To The List");
                return;
            }
            movieLibraryList.push(movieData);
            WatchListStorage.setLocalStorage(movieLibraryList,findKeyStorage);
            alert("Successfully Added To The List");
           })

            
            
            
        })
    })
}
//display filter movies
export const displaySortMovies = (data, container, sortWrap) => {
    data.forEach(movie => {
        const { poster_path, title, release_date, overview, id, vote_average } = movie;
        const percentage = Math.round((vote_average / 10) * 100);
        const divElem = document.createElement("div");
        divElem.classList.add("movie-container");
        divElem.classList.add("movie-container-static")
        sortWrap.classList.add("container");
        divElem.innerHTML = `<div class="list-img">
        <img src="${IMAGE_URL + poster_path}" alt="watched movie">
    </div>
    <div class="details">
        <div class="head-details-wrapper">
        <div class="ring-percent">
        <div class="circular-progress circular-progress-sm" data-percentage="10"
        data-progress-color = "#fff" data-inner-circle-color="#087CA7" data-bg-color = "#000">
            <div class="inner-circle">
                <p class="percentage">0%</p>
            </div>
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
            <div id="rating-system" class ="rating-system--width-none">
            <div class="ratings-container">
            <button class="btn rate-btn rate-btn--sm" data-id = ${id}><i data-id = ${id} class="fa-solid fa-star"></i></button>
            <span>Your rating</span>
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
            <div class="favorite-bar">
                <button class="favorite-bar-btn" data-id=${id}><i class="fa-regular fa-heart"></i></button>
                <span>Favorite</span>
            </div>
            <div class="add-bar">
            <button class="add-bar-btn" data-id=${id}><i class="fa-solid fa-list"></i></button>
            <span>Add to list</span>
            <div class="list-creator" data-id=${id}>
                <h3 class="list-creator-heading">
                    <a href="#" id="create-link"><i class="fa-solid fa-plus"></i><span class="create-text">Create New List</span></a>
                </h3>
                <div class="movie-to-add-wrapper">
                    <span class="movie-to-add-title">Add ${title}</span>
                    <span id="title-dropdown"><i class="fa-sharp fa-solid fa-caret-down"></i></span>
                    <div class="movie-add-search">
                        <form id="form">
                            <input id="search" type="text" class="input" name="movie">
                            <button class="search-icon"><i class="fa-solid fa-magnifying-glass"></i></button>
                        </form>
                        <div class="watch-storage-wrapper" data-movieid="${id}">
                        <div class="movie-to-add-wrapper movie-to-add-wrapper-dark-variant">
                 <span class="movie-to-add-title">Add ${title}</span>
            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
            <div class="remove-bar">
                <button class="remove-bar-btn" data-id=${id}><i class="fa-solid fa-x"></i></button>
                <span>Remove</span>
            </div>
        </div>
    </div>`;
        sortWrap.appendChild(divElem);
        container.appendChild(sortWrap);
    })
}
//fetch the movie using the find URL in API and use the get local storage
//use the specific id
export const fetchSpecificDetails = async (movieIds) => {
    const mapData = Promise.all(movieIds.map(async (id) => {
        const FIND_URL = BASE_URL + "/movie/" + id + "?" + API_KEY + "&language=en-US";
        const data = await fetch(FIND_URL);
        const result = await data.json();
        return result;
    }))
    const dataResult = await mapData;
    return dataResult;
}

//active links toggle
// const addShortcutBarUI = (links)=>{
//     for(let link of links){
//         link.addEventListener("click",e=>{
//            e.target.classList.add("active");
//         })

//     }
    
// }
window.addEventListener("load", () => {
    //toogle active links
    const watchListBar = document.querySelector("#watch-list-bar");
    const watchLinks = document.querySelectorAll(".shortcut-bar-link");
    //for watch-list shortcut bar active ui update
    // addShortcutBarUI(watchLinks,watchListBar);
    //for main shorcut bar active ui update
    const mainBar = document.querySelector("#main-bar");
    const mainLinks = mainBar.querySelectorAll(".shortcut-bar-link");

    //favorite storage list
    const favoriteStorage = FavoriteStorage.getLocalStorage();

    //for DOM manipulation
    const listContainer = document.querySelector(".list-container");
    const sortDateWrap = document.querySelector("#sort-date-wrapper");
    const sortPopularityWrap = document.querySelector("#sort-popularity-wrapper");
    const sortVoteWrap = document.querySelector("#sort-vote-wrapper");

    //utilities
    const buttonUtilities = new ButtonMethods();
    const filter = new FilterMethods();
    const updateUser = new UserUpdate();
    let showMovies = [localStorage.getItem("date-filter"), localStorage.getItem("popularity-filter"), localStorage.getItem("release-filter")];
    const movieIds = WatchedStorage.getLocalStorage();
    //update user percentage;
    updateUser.updatePercentage();
    //sort by date
    fetchSpecificDetails(movieIds).then(data => {
        sortByDate(data, listContainer, sortDateWrap);
        sortByPopularity(data, listContainer, sortPopularityWrap);
        sortByRelease(data, listContainer, sortVoteWrap);
    }).then(() => {
        //ui of movie percentage
        updateUser.updatePercentage();
        //remove list
        buttonUtilities.removeWatchedMovie(listContainer)
        //click filter
        filter.filterUtilities(...showMovies);
        //ui update of button
        //update the rating when clicked
        buttonUtilities.getRatings();
        //watch list feature
        buttonUtilities.getWatchList();

       
       
    })
})




