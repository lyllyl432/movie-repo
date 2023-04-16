import { WatchedStorage, ButtonMethods} from "./movie.js";
import {API_KEY, BASE_URL,IMAGE_URL} from "./app.js";
class UserUpdate{
    updatePercentage(){
        const circularProgress = document.querySelectorAll(".circular-progress");
        circularProgress.forEach((progressBar)=> {
            const innerCircle = progressBar.querySelector(".inner-circle");
            let percentage = progressBar.dataset.percentage,
            percentageTextWrap = progressBar.querySelector(".percentage"),
            progressColor = progressBar.dataset.progressColor;
            percentageTextWrap.textContent = `${percentage}` + "%";
            //innerCircle bg color
            innerCircle.style.background = progressBar.dataset.innerCircleColor;
            //progressBar bg color
            progressBar.style.background = `conic-gradient(${progressColor} ${
                Number(percentage) * 3.6
              }deg,${progressBar.getAttribute("data-bg-color")} 0deg)`;
        })
    }
}
class FilterMethods{
    filterUtilities(showDate,showPopular,showRelease){
        const movieContainer = document.querySelectorAll(".movie-container");
        const sortText = document.querySelectorAll(".sort-text");
        const sortContainer = document.querySelector(".sort-container");
        const filters = document.querySelector(".filters");
        const dateLink = document.querySelector(".date-filter");
        const popularityLink = document.querySelector(".popularity-filter");
        const voteLink = document.querySelector(".vote-filter");

        //mouseover and mouseout the ul
        sortContainer.addEventListener("mouseover",()=>{
            filters.classList.add("show");
        })
        sortContainer.addEventListener("mouseout",()=>{
            filters.classList.remove("show");
        })
        //filter by date
        dateLink.addEventListener("click",()=>{
          this.showDateFilter(movieContainer);
        })
        popularityLink.addEventListener("click",()=>{
            this.showPopularFilter(movieContainer);
        })
        voteLink.addEventListener("click",()=>{
            this.showReleaseFilter(movieContainer);
        })

        // remain the class with the use of local storage
        if(showDate === "enabled"){
            this.showDateFilter(movieContainer,showDate);
        }else if(showPopular === "enabled"){
            this.showPopularFilter(movieContainer,showPopular);
        }else if(showRelease === "enabled"){
            this.showReleaseFilter(movieContainer,showRelease)
        }
    } 
    //callback functions for event listeners in filter links
    showDateFilter(containers){
        localStorage.removeItem("release-filter");
        localStorage.removeItem("popularity-filter");
            for(let container of containers){
                container.classList.remove("show")
                if(container.classList.contains("sort-by-date")){
                    container.classList.add("show");
                    localStorage.setItem("date-filter","enabled");
                 }
            }
        }
    showPopularFilter(containers){
        localStorage.removeItem("release-filter");
        localStorage.removeItem("date-filter");
        for(let container of containers){
            container.classList.remove("show")
            if(container.classList.contains("sort-by-popular")){
                container.classList.add("show");
                localStorage.setItem("popularity-filter","enabled");
             }
        }
    }
    showReleaseFilter(containers){
        localStorage.removeItem("date-filter");
        localStorage.removeItem("popularity-filter");
        for(let container of containers){
            container.classList.remove("show")
            if(container.classList.contains("sort-by-release")){
                container.classList.add("show");
                localStorage.setItem("release-filter","enabled");
             }
        }
    }

  
}




//sort data by vote average
const sortByRelease = (data,container,sortWrap)=>{
    let sortedData = data.sort(({vote_average:a},{vote_average:b})=>{
        let voteA = a;
        let voteB = b;
        return voteA - voteB;
    })
    displaySortMovies(sortedData,container,sortWrap);
    const movieContainer = sortWrap.querySelectorAll(".movie-container");
    for(let movie of movieContainer){
        movie.classList.add("sort-by-release");
       }
}
//sort data by popularity
const sortByPopularity = (data,container,sortWrap)=>{
    let sortedData = data.sort(({popularity:a},{popularity:b})=>{
        let popularA = a;
        let popularB = b;
        return popularB - popularA;
    })
    displaySortMovies(sortedData,container,sortWrap);
    const movieContainer = sortWrap.querySelectorAll(".movie-container");
    for(let movie of movieContainer){
        movie.classList.add("sort-by-popular");
       }
    

}
//sort data by dates
const sortByDate = (data,container,sortWrap)=>{
   let sortedData = data.sort(({release_date: a},{release_date: b})=>{
     let dataA = new Date(a);
     let dataB = new Date(b);
     return dataA - dataB;
   })
   displaySortMovies(sortedData,container,sortWrap);
   const movieContainer = sortWrap.querySelectorAll(".movie-container");
   for(let movie of movieContainer){
    movie.classList.add("sort-by-date");
   }

}
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
//display date filter movies
// export const displaySortVote = (data,container)=>{
//     data.forEach(movie =>{
//         const {poster_path,title,release_date,overview,id,vote_average} = movie;
//         const percentage = Math.round((vote_average / 10) * 100);
//         const divElem = document.createElement("div");
//         divElem.classList.add("movie-container");
//         divElem.classList.add("container");
//         divElem.classList.add("sort-by-vote")
//         divElem.innerHTML = ` <div class="list-img">
//         <img src="${IMAGE_URL + poster_path}" alt="watched movie">
//     </div>
//     <div class="details">
//         <div class="head-details-wrapper">
//             <div class="ring-percent">
//                 <div class="circle">
//                     <h6 class="circle-num">${percentage}%</h6>
//                 </div>
//             </div>
//             <div class="title-wrapper">
//                 <h3 class="title">${title}</h3>
//                 <small class="date">${release_date}</small>
//             </div>
//         </div>
//             <div class="overview">
//                 <p>${overview}</p>
//             </div>
//             <div class="action-bar">
//             <div class="rating-bar">
//                 <button class="rating-bar-btn" data-id=${id}><i class="fa-regular fa-star"></i></button>
//                 <span>Your rating</span>
//             </div>
//             <div class="favorite-bar">
//                 <button class="favorite-bar-btn" data-id=${id}><i class="fa-regular fa-heart"></i></button>
//                 <span>Favorite</span>
//             </div>
//             <div class="add-bar">
//                 <button class="add-bar-btn" data-id=${id}><i class="fa-solid fa-list"></i></button>
//                 <span>Add to list</span>
//             </div>
//             <div class="remove-bar">
//                 <button class="remove-bar-btn" data-id=${id}><i class="fa-solid fa-x"></i></button>
//                 <span>Remove</span>
//             </div>
//         </div>
//     </div>`;
//     container.appendChild(divElem);
//     })
// }
//display popular filter movies
// export const displaySortPopular = (data,container)=>{
//     data.forEach(movie =>{
//         const {poster_path,title,release_date,overview,id,vote_average} = movie;
//         const percentage = Math.round((vote_average / 10) * 100);
//         const divElem = document.createElement("div");
//         divElem.classList.add("movie-container");
//         divElem.classList.add("container");
//         divElem.classList.add("sort-by-popular")
//         divElem.innerHTML = ` <div class="list-img">
//         <img src="${IMAGE_URL + poster_path}" alt="watched movie">
//     </div>
//     <div class="details">
//         <div class="head-details-wrapper">
//             <div class="ring-percent">
//                 <div class="circle">
//                     <h6 class="circle-num">${percentage}%</h6>
//                 </div>
//             </div>
//             <div class="title-wrapper">
//                 <h3 class="title">${title}</h3>
//                 <small class="date">${release_date}</small>
//             </div>
//         </div>
//             <div class="overview">
//                 <p>${overview}</p>
//             </div>
//             <div class="action-bar">
//             <div class="rating-bar">
//                 <button class="rating-bar-btn" data-id=${id}><i class="fa-regular fa-star"></i></button>
//                 <span>Your rating</span>
//             </div>
//             <div class="favorite-bar">
//                 <button class="favorite-bar-btn" data-id=${id}><i class="fa-regular fa-heart"></i></button>
//                 <span>Favorite</span>
//             </div>
//             <div class="add-bar">
//                 <button class="add-bar-btn" data-id=${id}><i class="fa-solid fa-list"></i></button>
//                 <span>Add to list</span>
//             </div>
//             <div class="remove-bar">
//                 <button class="remove-bar-btn" data-id=${id}><i class="fa-solid fa-x"></i></button>
//                 <span>Remove</span>
//             </div>
//         </div>
//     </div>`;
//     container.appendChild(divElem);
//     })
// }
//display date filter movies
export const displaySortMovies = (data,container,sortWrap)=>{
    data.forEach(movie =>{
        const {poster_path,title,release_date,overview,id,vote_average} = movie;
        const percentage = Math.round((vote_average / 10) * 100);
        const divElem = document.createElement("div");
        divElem.classList.add("movie-container");
        sortWrap.classList.add("container");
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
    sortWrap.appendChild(divElem);
    container.appendChild(sortWrap);
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
    const listContainer = document.querySelector(".list-container");
    const sortDateWrap = document.querySelector("#sort-date-wrapper");
    const sortPopularityWrap = document.querySelector("#sort-popularity-wrapper");
    const sortVoteWrap = document.querySelector("#sort-vote-wrapper");
    const buttonUtilities = new ButtonMethods();
    const filter = new FilterMethods();
    const updateUser = new UserUpdate();
    let showMovies = [localStorage.getItem("date-filter"),localStorage.getItem("popularity-filter"),localStorage.getItem("release-filter")];
    console.log(showMovies);
    const movieIds = WatchedStorage.getLocalStorage();
    //update user percentage;
    updateUser.updatePercentage();
    //sort by date
    fetchSpecificDetails(movieIds).then(data => {
        sortByDate(data,listContainer,sortDateWrap);
        sortByPopularity(data,listContainer,sortPopularityWrap);
        sortByRelease(data,listContainer,sortVoteWrap);
    }).then((data)=> {
        console.log(data);
         //remove list
         buttonUtilities.removeWatchedMovie(listContainer)
         //click filter
         filter.filterUtilities(...showMovies);
       })
})




