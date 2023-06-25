
export const timeAgo = (dateCreated)=>{
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
const saveIdLocal = (id)=>{
    let watchListIds = WatchListStorage.getLocalStorage("watch-list-id");
    watchListIds.push(id);
    WatchListStorage.setLocalStorage(watchListIds,"watch-list-id");
}
export class WatchListStorage{
    static getLocalTimeStorage = (key)=>{
        return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)):null;
    }
    static getLocalStorage = (key)=>{
        return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)):[];
    }
    static setLocalStorage = (data,key)=>{
            localStorage.setItem(key,JSON.stringify(data))
        }
}
window.addEventListener("load",()=>{
    const listForm = document.querySelector("#list-form");
    const inputName = document.querySelector("#input-name");
    const inputDesc = document.querySelector("#input-description");
    const privacySelection = document.querySelector("#privacy-selection");
    const createListDate = new Date(WatchListStorage.getLocalTimeStorage("created-list-date"));
    console.log(createListDate);
        listForm.addEventListener("submit",e=>{
            e.preventDefault();
            let outputName = inputName.value;
            let outputDesc = inputDesc.value;
            let privacyValue = privacySelection.value;
            const id = "id" + Math.random().toString(16).slice(2)
            let data = {
                "title": outputName,
                "description": outputDesc,
                "privacy": privacyValue,
                "data-id": id,
                "date": new Date()
            }
            let localArrData = WatchListStorage.getLocalStorage("watchlist-data");
            let presentItem = localArrData.find(item => item.title == data.title);
            if(presentItem){
                alert("Name already exist");
            }else{
                localArrData.push(data);
                WatchListStorage.setLocalStorage(localArrData,"watchlist-data");
                 //save id
                saveIdLocal(id)
            }
        })
})