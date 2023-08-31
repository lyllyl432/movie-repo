import { WatchListStorage } from "./my-list-form.js";
import {SEARCH_URL,IMAGE_URL} from "./app.js";
import { currentClickId } from "./my-list-item.js";
class FORM {
    constructor(title, description, privacy, id) {
        this.title = title,
            this.description = description,
            this.privacy = privacy,
            this.id = id
    }
    static activeList(actions) {
        const pages = document.querySelectorAll(".list-page");

        actions.forEach(action => {
            const element = document.getElementById(action.id);
            const page = document.getElementById(action.pageId)
            // console.log(element,page);

            element.addEventListener("click",(e)=>{
                pages.forEach(page => {
                    page.classList.remove("active");
                })
                if(e.currentTarget.id === action.id && page.id === action.pageId){
                    page.classList.add("active");
                }
            })
        })
    }
    static updateMovieList(){
        const searchForm = document.querySelector("#search-form");
        const searchSuggestList = document.querySelector("#search-suggest-list");
        const suggestListWrapper = document.querySelector(".search-suggest-list-wrapper");
        const dataWarning = document.querySelector(".no-data-warning");
        searchForm.addEventListener("keyup",event => {
            const inputSearchValue = event.target.value;
                if(!inputSearchValue){
                    dataWarning.classList.add("show");
                    searchSuggestList.innerHTML = "";
                    return;
                }
                dataWarning.classList.remove("show");
                suggestListWrapper.classList.add("show");
                this.searchMoviesData(SEARCH_URL + "&query=" + inputSearchValue).then(result=>{
                    //this load search movies
                    this.loadSearchMovies(result,searchSuggestList,dataWarning);
                    //this add/update items to the movie list
                    const options = {
                        method: 'GET',
                        headers: {
                          accept: 'application/json',
                          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMzRiYmRlNjljYWRkNmIwZjM5ZDcxODU5MjM5YTE5NCIsInN1YiI6IjYzZWEzY2RkNmM4NDkyMDBjZmIzNDRlZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.AB7lC5hyv8kynXFd0nusaRlAqgrAd4Oy0z9H94eHrss'
                        }
                      };
                    this.addStorageList(options);

                });
        })
        document.addEventListener("click",e=>{
            if(!suggestListWrapper.contains(e.target)){
                suggestListWrapper.classList.remove("show");
            }
        })
    }
    static loadSearchMovies(result,suggestList,dataWarning){
        suggestList.innerHTML = "";
        const datas = result;
        let url = IMAGE_URL;
        if(Array.isArray(datas) && datas.length === 0){
            dataWarning.classList.add("show");
        }
        datas.forEach(data =>{
            let {title,poster_path,release_date,vote_average,id} = data;
             if(poster_path === null){
            url = "img/";
            poster_path = "404.png";
        }
        else if(poster_path !== null){
            url = "https://image.tmdb.org/t/p/w500";
            poster_path = poster_path;
        }
            let percentage = (vote_average / 10) * 100;
            percentage = Math.round(percentage); 
            const listElem = document.createElement("li");
            listElem.classList.add("suggest-list-items");
            listElem.setAttribute("data-id",id);
            listElem.innerHTML = `<div class="suggest-items-image"><img src="${url + poster_path}" alt="movie image"></div><div class="suggest-items-info">
            <h6 class="suggest-list-title">${title}</h6>
            <span class="release-date-info">${release_date}</span>
            <span class="percentage-info">${percentage}%</span>
        </div>`
        suggestList.appendChild(listElem);
        })
    }
    static async searchMoviesData(url){
        try{
            const data = await fetch(url);
            const result = await data.json();
            return result.results;
        }
        catch(error){
            console.log(error);
        }

    }
    static addStorageList(options){
        const searchSuggestListItem = document.querySelectorAll(".suggest-list-items");
        searchSuggestListItem.forEach(suggestList => {
            suggestList.addEventListener("click",async e=>{
               const queryDataId = e.currentTarget.dataset.id;
               let data = await fetch(`https://api.themoviedb.org/3/movie/${queryDataId}?language=en-US`, options);
                let result = await data.json();
                
            })
        })   
    }
    static populateStorageList(){
        const searchMovieSave = document.querySelector(".search-movie-save");
        const datas = WatchListStorage.getLocalStorage(currentClickId);
        console.log(datas);
        datas.forEach(data => {
            // const {title} = data;

        })
        
    }
   
    
}

FORM.prototype.getCurrentIndex = function(arr){
    let currIndex = arr.findIndex(({"data-id":dataID}=obj)=> dataID === this.id);
    return currIndex;  
}
FORM.prototype.updatePopulatedForm = function(form,data){
    form.addEventListener("submit",e=>{
        e.preventDefault();
        const inputNameValue = document.querySelector("#input-name").value;
        const inputDescValue = document.querySelector("#input-description").value;
        const privacySelectionValue = document.querySelector("#privacy-selection").value;
        const id = this.id;
        console.log(inputNameValue,inputDescValue,privacySelectionValue);
        const updatedInput = {
           "title": inputNameValue,
           "description": inputDescValue,
           "privacy":privacySelectionValue,
           "data-id":this.id,
           "date": new Date()
        }
        // const index = this.getCurrentIndex(data);
       const updatedData = data.map(item => {
        let {"data-id":objID} = item
        if(objID === id){
            item.title = inputNameValue;
            item.description = inputDescValue;
            item.privacy = privacySelectionValue;
            objID = id;
            item.date = new Date();
        }
        return item;
       })
       console.log(updatedData);
       WatchListStorage.setLocalStorage(updatedData, "watchlist-storage");
    })
}
FORM.prototype.populateForm = function(form){
    for(const element of form){
        // console.log(element.name);
       switch(element.name){
        case "name": 
        element.value = this.title;
        break;
        case "description":
        element.value = this.description;
        break;
        case "boolean":
            element.value = this.privacy;
        break;
       }
    }
}
class FindData{
    static getIdData(data){
        const id = JSON.parse(localStorage.getItem("current-link-click"));
        const myListData = data;
        console.log(myListData);
        //FIND THE DATA WITH USING ID
        const result = myListData.find(data => data["storage-id"] === id);
        return result;
    }
   
}
window.addEventListener("DOMContentLoaded",()=>{
    const editListForm = document.querySelector("#edit-list-form");
    const linksData = WatchListStorage.getLocalStorage("watchlist-storage");
    console.log(linksData);
    const data = FindData.getIdData(linksData);
    const {title,description,privacy,"data-id":id} = data;
    const editForm = new FORM(title,description,privacy,id);
    //populate form with the object data
    editForm.populateForm(editListForm);
    //active list
    const actions = [
        { id: "show-form", pageId: "edit-list-form" },
        { id: "show-search", pageId: "search" },
        { id: "choose-image", pageId: "choose-image" },
        { id: "show-delete", pageId: "delete-list" }
    ];
    FORM.activeList(actions);
    //update the populated form
    editForm.updatePopulatedForm(editListForm,linksData);
    //update the add/edit items page and make the auto recommend search input to the movie with start letters
    FORM.updateMovieList();
    //populate movie list
    FORM.populateStorageList();
    


})

