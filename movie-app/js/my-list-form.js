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
export class LocalId extends WatchListStorage{
    static saveIdLocal(id){
        let watchListIds = super.getLocalStorage("watch-list-id");
        watchListIds.push(id);
        super.setLocalStorage(watchListIds,"watch-list-id"); 
    }
}
window.addEventListener("DOMContentLoaded",()=>{
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
                "storage-id": id,
                "date": new Date()
            }
            let localArrData = WatchListStorage.getLocalStorage("watchlist-storage");
            let presentItem = localArrData.find(item => item.title == data.title);
            if(presentItem){
                alert("Name already exist");
            }else{
                localArrData.push(data);
                WatchListStorage.setLocalStorage(localArrData,"watchlist-storage");
                 //save id
                LocalId.saveIdLocal(id)
            }
        })
})