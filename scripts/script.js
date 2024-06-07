"use strict";
//global scope variables
document.addEventListener("DOMContentLoaded", init);
const enContainer = document.getElementById("enContainer");
const staticSelector = document.getElementById("staticSelect");


//initializing functions
function init(){
    addEventListeners();
}

function addEventListeners(){
    //listens to chosen option
    staticSelector.addEventListener("change",chosenOption);

}

//dtermines if categories or all is chosen
function chosenOption(){
    //get value
    let selectValue = staticSelector.value;
    const displayDes = document.getElementById("displayDescription");

    const existingCatSelect = document.getElementById("catSelect");
    if (existingCatSelect) {
        existingCatSelect.remove();
        displayDes.innerHTML = "";
    }

    //check the value
    //this displayes the second select menu
    if(selectValue == "cat"){
        console.log("okay");
        let table = document.getElementById("displayTable");
        table.innerHTML = "";
        creatNewSelector();
        setCatHandler();
    }
    //this displays all
    else if(selectValue == "all"){
        console.log("lmao");
        let table = document.getElementById("displayTable");
        table.innerHTML = "";
        displayAllProducts();
    }
    //this displays none
    else{
        console.log("no");
        let table = document.getElementById("displayTable");
        table.innerHTML = "";
    }
}

//creates a new selector with categories
function creatNewSelector(){
    const catSelect = document.createElement("select");
    catSelect.id = "catSelect";
    enContainer.appendChild(catSelect);
    console.log(enContainer);
    populateCatDropdown();
}

//adds categories to the new selector
async function populateCatDropdown(){
    const catSelect = document.getElementById("catSelect");
    const response = await fetch('http://localhost:8081/api/categories');
    const categories = await response.json();

    const fragment = document.createDocumentFragment();

    for(let i = 0; i < categories.length; i++){
        const option = new Option(`${categories[i].name} `, categories[i].categoryId);
        fragment.appendChild(option);
    }
    catSelect.appendChild(fragment);
}

// give the new selector functionality
async function setCatHandler(){
    const catSelect = document.getElementById("catSelect");
    catSelect.addEventListener("change", getCatDesc);
    catSelect.addEventListener("change", displayChosenProducts);
}

//display the chosen category description
async function getCatDesc(){
    const displayDes = document.getElementById("displayDescription");
    const catSelect = document.getElementById("catSelect");
    const response = await fetch('http://localhost:8081/api/categories');
    const categories = await response.json();
    //match each value to its value in the array
    const catValue = Number(catSelect.value) - 1;
    console.log(catValue);

    displayDes.innerHTML = `Description: 
                            ${categories[catValue].description}`;
}

//display all the products
async function displayAllProducts(){
    let table = document.getElementById("displayTable");
    table.innerHTML = "";
    const response = await fetch('http://localhost:8081/api/products');
    const products = await response.json();
    table.insertAdjacentHTML('beforeend',`<thead>
        <td>Name</td>
        <td>Cost</td>
        <td>Quantity</td>
        <td>Supplier</td>
      </thead>
      `);

    for(let i = 0; i < products.length; i++){
        table.insertAdjacentHTML('beforeend',`
            <tr>
                <td>${products[i].productName}</td>
                <td>$${(Number(products[i].unitPrice)).toFixed(2)}</td>
                <td>${products[i].unitsInStock}</td>
                <td>${products[i].supplier}</td>
            </tr>
            `);
    }
    
}

async function displayChosenProducts(){
    const catSelect = document.getElementById("catSelect");
    const displayValue = catSelect.value;
    let table = document.getElementById("displayTable");
    table.innerHTML = "";
    const response = await fetch('http://localhost:8081/api/products');
    const products = await response.json();
    table.insertAdjacentHTML('beforeend',`<thead>
            <td>Name</td>
            <td>Cost</td>
            <td>Quantity</td>
            <td>Supplier</td>
          </thead>
          `);

    for(let i = 0; i < products.length; i++){
        if(products[i].categoryId == displayValue){
        console.log(products[i]);
        table.insertAdjacentHTML('beforeend',`
            <tr>
                <td>${products[i].productName}</td>
                <td>$${(Number(products[i].unitPrice)).toFixed(2)}</td>
                <td>${products[i].unitsInStock}</td>
                <td>${products[i].supplier}</td>
            </tr>
            `);
        }
    }

}