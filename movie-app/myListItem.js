import { WatchListStorage} from "./myList-form.js";
import { IMAGE_URL } from "./app.js";
class ListItem{
    constructor(id,title,description){
        this.title = title,
        this.description = description
        this.id = id
    }
}
ListItem.prototype.displayUI = function(){
    const datas = WatchListStorage.getLocalStorage(this.id);
    let count = 0;
    const listItems = document.querySelector(".list-items");
    datas.forEach(data => {
        const {id,poster_path,vote_average,title} = data;
        count++;
        let percentage = (vote_average / 10) * 100;
        percentage = Math.round(percentage); 
        const listItemWrapper = document.createElement("div");
        listItemWrapper.classList.add("list-item-wrapper");
        listItemWrapper.innerHTML = `<div class="list-item-image">
        <img src="${IMAGE_URL + poster_path}" alt="${title}">
    </div>
    <div class="list-flex-info">
        <span class="count">${count}</span>
        <div class="item-dynamic-info">
            <span data-id ="${id}"><i class="fa-solid fa-heart"></i></span>
            <span data-id ="${id}"><i class="fa-regular fa-bookmark"></i></span>
            <span id="movie-percentage">${percentage}%</span>
        </div>
    </div>`
    listItems.appendChild(listItemWrapper);
    });
}
ListItem.prototype.updateHeaderInfo = function(){
    const myListTitle = document.querySelector("#my-list-title");
    const description = document.querySelector("#description");
    myListTitle.textContent = this.title;
    if(this.description === null)return
    description.textContent = this.description;

}
window.addEventListener("DOMContentLoaded",()=>{
    const id = JSON.parse(localStorage.getItem("current-click")); 
    const myListData = WatchListStorage.getLocalStorage("watchlist-data");
    // console.log(myListData);
    //FIND THE DATA WITH USING ID
    const findData = myListData.find(data => data["data-id"] === id);
    // console.log(findData);
    //instance of ListItem class
    const {title,description} = findData
   const dynamicList = new ListItem(id,title,description);
   dynamicList.displayUI();
   dynamicList.updateHeaderInfo();

})