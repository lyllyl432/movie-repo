import { WatchListStorage} from "./myList-form.js";
class ListWrapper{
    static getWatchWrapperId = ()=>{
        const watchWrapperLink = document.querySelectorAll(".watchlist-wrapper-link");
      watchWrapperLink.forEach(link => {
        link.addEventListener("click",e =>{
            const currTarget = e.currentTarget;
            const dataId = currTarget.dataset.id;
            WatchListStorage.setLocalStorage(dataId,"current-click");
        })
      })
    }
    static displayUpdatedTime=()=>{
        const watchListBox = document.querySelectorAll(".watchlist-box");
        watchListBox.forEach(watchlist => {
            const timeCounter = watchlist.querySelector(".time-counter");
            const date = new Date(watchlist.dataset.date);
            console.log(date);
            const currTimeAgo = this.timeAgo(date);
            timeCounter.textContent = currTimeAgo;
        })
    }
    static displayWatchListUI=(data)=>{
        const watchListContainer = document.querySelector(".watchlist-boxes-container") ;
        data.forEach(item => {
            const {title,description,privacy,"data-id":dataId,date} = item;
           watchListContainer.innerHTML += `<div class="watchlist-box"
           data-date="${date}">
           <div class="watchList-info centered-info">
               <div>
                   <a href="./myListItem.html" class="watchlist-wrapper-link" data-id="${dataId}"><h3 class="box-heading-info">${title}</h3></a>
               </div>
               <div>
                   <span class="item- counter">2 items</span>
                   <span class="privacy-info">${privacy}</span>
               </div>
               <div>
                   <p class="time-counter"></p>
               </div>
           </div>
       </div>`
        })
    }
    
    static timeAgo = (dateCreated)=>{
        const seconds = Math.floor((new Date() - dateCreated) / 1000);
        let interval = Math.floor(seconds / 31536000);
        if (interval > 1) {
            return interval + ' years ago';
          }
        
          interval = Math.floor(seconds / 2592000);
          if (interval > 1) {
            return interval + ' months ago';
          }
        
          interval = Math.floor(seconds / 86400);
          if (interval > 1) {
            return interval + ' days ago';
          }
        
          interval = Math.floor(seconds / 3600);
          if (interval > 1) {
            return interval + ' hours ago';
          }
        
          interval = Math.floor(seconds / 60);
          if (interval > 1) {
            return interval + ' minutes ago';
          }
        
          if(seconds < 10) return 'just now';
        
          return Math.floor(seconds) + ' seconds ago';
    }
}
window.addEventListener("DOMContentLoaded",()=>{
    //get data in local storage and display in UI
    const getData = WatchListStorage.getLocalTimeStorage("watchlist-data");
    console.log(getData);
    ListWrapper.displayWatchListUI(getData);
    //click event listener for create btn
    const createListBtn = document.querySelector(".create-list-btn");
    createListBtn.addEventListener("click",()=>{
        const createdListDate = new Date();
        WatchListStorage.setLocalStorage(createdListDate,"created-list-date");
    })
    //display time function
    ListWrapper.displayUpdatedTime();
    //get the data id of every link using event listener
    ListWrapper.getWatchWrapperId();
})