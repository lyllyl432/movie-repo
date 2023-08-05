import { WatchListStorage } from "./myList-form.js";
class FORM {
    constructor(title, description, privacy, id) {
        this.title = title,
            this.description = description,
            this.privacy = privacy,
            this.id = id
    }
    static activeList() {
        const selectorList = document.querySelector(".selector-list");
        const selectorListItems = document.querySelectorAll(".selector-list-items");
        const pages = document.querySelectorAll(".list-page");

        selectorList.addEventListener("click", e => {
            selectorListItems.forEach(selector => {
                selector.classList.remove("active");
            })
            console.log(e.currentTarget)
            e.target.classList.add("active");
            pages.forEach(page => {
                console.log(page)
                page.classList.remove("active");
                if (e.target.id == "show-form" && page.id === "edit-list-form") {
                    // console.log("hello world");
                    page.classList.add("active");
                } else if (e.target.id == "show-search" && page.id === "search") {
                    page.classList.add("active");
                } else if (e.target.id == "show-image") {
                    console.log("hello night");
                } else {
                    console.log("hello world");
                }
            })
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
       WatchListStorage.setLocalStorage(updatedData, "watchlist-data");
    })
}
FORM.prototype.populateForm = function(form){
    for(const element of form){
        console.log(element.name);
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
    static getIdData(){
        const id = JSON.parse(localStorage.getItem("current-link-click"));
        const myListData = WatchListStorage.getLocalStorage("watchlist-data");
        //FIND THE DATA WITH USING ID
        const result = myListData.find(data => data["data-id"] === id);
        return result;
    }
   
}
window.addEventListener("DOMContentLoaded",()=>{
    const editListForm = document.querySelector("#edit-list-form");
    const linksData = WatchListStorage.getLocalStorage("watchlist-data");
    const data = FindData.getIdData();
    console.log(data);
    const {title,description,privacy,"data-id":id} = data;
    console.log(data);
    const editForm = new FORM(title,description,privacy,id);
    //populate form with the object data
    editForm.populateForm(editListForm);
    //active list
    FORM.activeList();
    //update the populated form
    editForm.updatePopulatedForm(editListForm,linksData);
    //update the add/edit items page and make the auto recommend search input to the movie with start letters


})

