# Gentlemen's Haven Shopping App

## Where Can I Vist the App
You can check out the deployed app here: https://dynamic-khapse-733d60.netlify.app/

## Technologies Used:
- The Web Storage API was used to store the valid promo code that was applied in the order by the user and also the items that were added to the shopping cart by the user. The purpose for this usage was so both the items in the shopping cart and the applied valid promotional code will be persistent on the screen across tab refreshes
- The realtime firebase NoSQL database was used to store the the list of valid promotional codes that could be applied to the order and also the list of products that are currently available.
- HTML, CSS and Javascript were extensively used to structure, decorate and make the website functional

## Discount Codes Available To Try:
1. Using `EarlyUserDiscount` grants a $33 dollar discount
2. Using `YouDeserveIt` grants a $20 dollar discount
At the time of writting this README, these are the two discount codes that are actively working as they are in the SQL Database for this project

## Difficulties faced
- The decision of whether I should go with a relational or non-relational database and whether it made sense to use the Web Storage API was something that stumped me for a while. However, since this web app had information that'd frequently change and I didn't need the structured tabular rows and columns, I decided to go with a non-relational database where I also wouldn't have to worry about the hosting of the database as I used Firebase. Moreover, as this website doesn't currently support accounts, I thought it would make more sense to hold the items that a visitor wants to purchase using the Web Storage API because local storage is meant to handle the storage of small amounts of data across tab refreshes.
