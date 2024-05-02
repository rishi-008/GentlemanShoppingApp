import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const listOfAvailableProducts = document.getElementById("products-list")

const appSettings = {
    databaseURL: "https://gentlemens-products-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const booksInDB = ref(database, "Products")
console.log("herllo")

onValue(booksInDB, function(snapshot) {
    
    if (snapshot.exists()) {
        let listOfProducts = Object.values(snapshot.val())
            
        for (let i = 0; i < listOfProducts.length; i++) {
            let currentProduct = listOfProducts[i]
            
            populateListOfAvailableProducts(currentProduct)
        }
    } else {
        listOfAvailableProducts.innerHTML = ""
    }
})


// products-list
function populateListOfAvailableProducts(item) {
    const listItems = document.createElement('li')
    listItems.className = "product-item"
    listItems.innerHTML += `
    <div class="all-items">
        <div class="item-left">
            <img class="product-img" src="Images/${item.name}.jpg" alt="image of ${item.name}">
            <div class="product-info">
                <span class="boldedProductName">${item.name}</span>
                <span class="listOfTags"> ${item.tags.join(', ')}</span>
                <span class="boldedProductCost">$${item.cost}</span>
            </div>
        </div>
        <div class="middle-button-arrangement">
            <button class="add-to-cart" data-product="${item.name}" ></button>
        </div>
    </div>
    `

    listOfAvailableProducts.addEventListener('click', function(event) {
        if (event.target.classList.contains('add-to-cart')) {
            const productName = event.target.getAttribute('data-product');
            console.log(productName);
        }
    });

    listOfAvailableProducts.appendChild(listItems)
}

