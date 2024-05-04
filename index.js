import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const listOfAvailableProducts = document.getElementById("products-list")
const listOfProductsInCart = document.querySelector(".products-in-cart")
const checkoutSummarySection = document.querySelector(".checkout-summary")
const promocodeSection = document.querySelector("#promo-code-section")
const applyPromoCodeButton = document.querySelector("#apply-button")
const promocodeInput = document.querySelector("#promo-input")
// const removeAppliedPromocode = document.querySelector("#remove-promo-code")

const totalPriceSection = document.createElement('div');
const shoppingCheckoutButtonSection  = document.createElement('div');
let promocodeIsInvalidMessageShown = false;
let alreadyValidPromocodeGiven = false;
let availablePromoCodes = [];
let invalidPromocodeMessageOnScreen = false;

const invalidPromocodeMessage = document.createElement('h3');
invalidPromocodeMessage.className = "invalid-promocode-message";

const alreadyHavePromotionApplied = document.createElement('h3');
alreadyHavePromotionApplied.className = "already-have-promotion-applied";

const appSettings = {
    databaseURL: "https://gentlemens-products-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const availableProductsInDB = ref(database, "Products")
const promocodeInDB = ref(database, "Promo-Code")
let itemsInCart = []

onValue(promocodeInDB, function(snapshot) {
    if (snapshot.exists()) {
        availablePromoCodes = Object.values(snapshot.val())
    }
})

onValue(availableProductsInDB, function(snapshot) {
    
    if (snapshot.exists()) {
        let listOfProducts = Object.values(snapshot.val())
            
        for (let i = 0; i < listOfProducts.length; i++) {
            let currentProduct = listOfProducts[i]
            
            populateListOfAvailableProducts(currentProduct)
        }
        // if (localStorage.getItem("productsInCart") === null) {
        //     localStorage.setItem("totalCostOfProductsInCart", `${0}`);
        // } 
        clearShoppingCart();
        populateShoppingCartFromLocalStorage();
        populateAppliedPromocode();
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
            itemsInCart = [];
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
    totalPriceSection.innerHTML = "";
    shoppingCheckoutButtonSection.innerHTML = "";  
}

function populateShoppingCartFromLocalStorage() {
    if (localStorage.getItem("productsInCart") != null) {
        clearShoppingCart();
        const itemCost = localStorage.getItem("productsInCart");
        const parsedItemCost = JSON.parse(itemCost);
        for (let i = 0; i < parsedItemCost.length; i++) {
            const currentProduct = parsedItemCost[i];
            addItemToCart(currentProduct.name, currentProduct.cost);
        }    
        updateTotalPriceOfShoppingCart();
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

listOfProductsInCart.addEventListener('click', function(event) {
    let deleteOneItemOfNameFromCart = false;
    if (event.target.classList.contains('remove-from-cart')) {
        const productName = event.target.getAttribute('data-product');
        const itemsInCart = localStorage.getItem("productsInCart");
        const parsedItemsInCart = JSON.parse(itemsInCart);
        for (let i = 0; i < parsedItemsInCart.length; i++) {
            const currentProduct = parsedItemsInCart[i];
            if (currentProduct.name === productName && deleteOneItemOfNameFromCart === false) {
                deleteOneItemOfNameFromCart = true;
                parsedItemsInCart.splice(i, 1);
                localStorage.setItem("productsInCart", JSON.stringify(parsedItemsInCart));
                clearShoppingCart();
                populateShoppingCartFromLocalStorage();
            }
        }
    }
});

function latestTotalPriceOfShoppingCart() {
    let totalCartCost = 0;
    const itemCost = localStorage.getItem("productsInCart");
    const parsedItemCost = JSON.parse(itemCost);
    for (let i = 0; i < parsedItemCost.length; i++) {
        const currentProduct = parsedItemCost[i];
        totalCartCost += parseInt(currentProduct.cost);
    }   

    if (localStorage.getItem("appliedValidPromocode") != null) {
        const appliedPromocode = localStorage.getItem("appliedValidPromocode");
        const parsedAppliedPromocode = JSON.parse(appliedPromocode);
        const promocodeValue = Object.values(parsedAppliedPromocode)[0];
        totalCartCost = totalCartCost - parseInt(promocodeValue);
    }
    return totalCartCost;
}

function updateTotalPriceOfShoppingCart() {
    const totalPrice = latestTotalPriceOfShoppingCart();
    totalPriceSection.className = "checkout-summary-price";
    shoppingCheckoutButtonSection.className = "checkout-button";
    totalPriceSection.innerHTML = `
        <span>Total Price:</span>
        <span id="total">$${totalPrice}</span>
    `;
    shoppingCheckoutButtonSection.innerHTML = `
        <button class="checkout-button">Complete order</button>
    `;
    checkoutSummarySection.appendChild(totalPriceSection);
    checkoutSummarySection.appendChild(shoppingCheckoutButtonSection);
}

applyPromoCodeButton.addEventListener('click', function() {
    const userInputedPromocode = promocodeInput.value;
    promocodeInput.value = "";
    for (let i = 0; i < availablePromoCodes.length; i++) {
        const currentPromocodeDetails = availablePromoCodes[i];
        const currentPromocodeKey = Object.keys(currentPromocodeDetails)[0];
        const currentPromocodeDiscountValue = Object.values(currentPromocodeDetails)[0];
        if (currentPromocodeKey === userInputedPromocode) {
            if (invalidPromocodeMessageOnScreen){
                promocodeSection.removeChild(invalidPromocodeMessage);
            }

            if(localStorage.getItem("appliedValidPromocode") === null) {
                localStorage.setItem("appliedValidPromocode", `{"${currentPromocodeKey}": "${currentPromocodeDiscountValue}"}`);
                console.log("appliedValidPromocode set in local storage")
                // const totalPriceSection = document.createElement('div');
                // totalPriceSection.className = "checkout-promotional-code";
                // totalPriceSection.innerHTML = `
                //     <h3 class="promo-code-used">${currentPromocodeKey}</h3>
                //     <button class="remove-promo-code">x</button>
                // `;

                populateAppliedPromocode();
                // .textContent = `${currentPromocodeKey}`; 
                // promocodeSection.appendChild(totalPriceSection);

            } else {
                alreadyHavePromotionApplied.textContent = "*One promocode has already been applied to your order"; 
                promocodeSection.appendChild(alreadyHavePromotionApplied);
                alreadyValidPromocodeGiven = false;

            }

            
            // const totalPrice = latestTotalPriceOfShoppingCart();
            // const discountedPrice = totalPrice * 0.9;
            // totalPriceSection.innerHTML = `
            //     <span>Total Price:</span>
            //     <span id="total">$${discountedPrice}</span>
            // `;
            // promocodeInput.value = "";
            alreadyValidPromocodeGiven = true;
            invalidPromocodeMessageOnScreen = false;

        }   else {
                if(promocodeIsInvalidMessageShown === false && alreadyValidPromocodeGiven === false) {
                    console.log(" reaches point where invalid promocode message should be shown")
                    promocodeIsInvalidMessageShown = true;
                    invalidPromocodeMessageOnScreen = true;
                    invalidPromocodeMessage.textContent = "*This promocode is invalid. Please try again."; 

                    // this condition isn't achieving it's purpose since it's not removing the alreadyHavePromotionApplied message but I think it's fine for now
                    if (promocodeSection.contains(alreadyHavePromotionApplied)){
                        console.log("already have promotion applied message removed");
                        promocodeSection.removeChild(alreadyHavePromotionApplied);
                    }
                    promocodeSection.appendChild(invalidPromocodeMessage);
                }
        }
    }
    alreadyValidPromocodeGiven = false;
})

function populateAppliedPromocode() {
    console.log("populateAppliedPromocode function called")
    const appliedPromocode = localStorage.getItem("appliedValidPromocode");
    if (appliedPromocode != null) {
        const parsedAppliedPromocode = JSON.parse(appliedPromocode);
        const promocodeKey = Object.keys(parsedAppliedPromocode)[0];
        const promocodeValue = Object.values(parsedAppliedPromocode)[0];
        const totalPriceSection = document.createElement('div');
        totalPriceSection.className = "checkout-promotional-code";
        totalPriceSection.innerHTML = `
            <h3 class="promo-code-used">${promocodeKey}</h3>
            <button id="remove-promo-code" class="remove-promo-code">x</button>
        `;
        promocodeSection.appendChild(totalPriceSection);

        // The reduction in price when promotion code is applied
        const promotionalItem = document.createElement('li');
        promotionalItem.className = "item-in-cart";
        // change button for promo code removal as the event listener function will have diff action
        promotionalItem.innerHTML = `
        <div class="product-in-cart-info">
            <div class="product-name-and-remove-section">
                <span class="promocode-applied-text">${promocodeKey}</span>
            </div>
            <span class="promocode-discounted-value">-$${promocodeValue}</span>
        </div>`;
        listOfProductsInCart.appendChild(promotionalItem); 

        //total price after promo code applied
        updateTotalPriceOfShoppingCart()

        const removeAppliedPromocode = document.getElementById('remove-promo-code');
        removeAppliedPromocode.addEventListener('click', function() {
            if (localStorage.getItem("appliedValidPromocode") != null) {
                localStorage.removeItem("appliedValidPromocode");
                promocodeSection.removeChild(promocodeSection.lastChild);
                listOfProductsInCart.removeChild(listOfProductsInCart.lastChild); 
                updateTotalPriceOfShoppingCart();
            }
        })

    }
}
