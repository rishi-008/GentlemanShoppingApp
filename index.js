import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const listOfAvailableProducts = document.getElementById("products-list")
const listOfProductsInCart = document.querySelector(".products-in-cart")

const appSettings = {
    databaseURL: "https://gentlemens-products-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const booksInDB = ref(database, "Products")
let itemsInCart = []

onValue(booksInDB, function(snapshot) {
    
    if (snapshot.exists()) {
        let listOfProducts = Object.values(snapshot.val())
            
        for (let i = 0; i < listOfProducts.length; i++) {
            let currentProduct = listOfProducts[i]
            
            populateListOfAvailableProducts(currentProduct)
        }
        clearShoppingCart();
        populateShoppingCartFromLocalStorage();
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
            <button class="add-to-cart" data-product="${item.cost}" data-key="${item.name}"></button>
        </div>
    </div>
    `

    listOfAvailableProducts.appendChild(listItems)
}

listOfAvailableProducts.addEventListener('click', function(event) {
   
    if (event.target.classList.contains('add-to-cart')) {
        const productName = event.target.getAttribute('data-key');
        const productCost = event.target.getAttribute('data-product');
        // console.log(productName, productCost);
        
        if (localStorage.getItem("productsInCart") != null) {
            const itemCost = localStorage.getItem("productsInCart");
            const parsedItemCost = JSON.parse(itemCost);
            for (let i = 0; i < parsedItemCost.length; i++) {
                const currentProduct = parsedItemCost[i];
                itemsInCart.push({name: currentProduct.name, cost: currentProduct.cost});
            }
        }

        itemsInCart.push({name: productName, cost: productCost});
        localStorage.setItem("productsInCart", JSON.stringify(itemsInCart)); // JSON.stringify(
        // localStorage.setItem('productInCart', JSON.stringify(itemsInCart));
        // console.log(JSON.parse(localStorage.getItem('productInCart'))[0]);
        clearShoppingCart();
        populateShoppingCartFromLocalStorage();
    }
});

function clearShoppingCart() {
    listOfProductsInCart.innerHTML = "";
}

function populateShoppingCartFromLocalStorage() {
    listOfProductsInCart.innerHTML = "";
    const itemCost = localStorage.getItem("productsInCart");
    const parsedItemCost = JSON.parse(itemCost);
    for (let i = 0; i < parsedItemCost.length; i++) {
        const currentProduct = parsedItemCost[i];
        addItemToCart(currentProduct.name, currentProduct.cost);
    }    
}

function addItemToCart(productName, productCost) {
    const cartItem = document.createElement('li');
    cartItem.className = "item-in-cart";
    cartItem.innerHTML = `
    <div class="product-in-cart-info">
        <div class="product-name-and-remove-section">
            <span>${productName}</span>
            <button class="remove-from-cart" data-product="${productName}">remove</button>
        </div>
        <span>$${productCost}</span>
    </div>`;
    listOfProductsInCart.appendChild(cartItem); 
}