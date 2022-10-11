var orderNum = 1;
var totalPrice = 0;

const foods = ["Hamburger", "Cheeseburger", "Hotdog", "Fries"];
const drinks = ["Coke", "Pepsi", "Dr. Pepper", "Juice"];
const snacks = ["Cookie", "Ice Cream", "Brownie", "Candy"];
const condiments = ["Ketchup", "Mustard", "Mayonnaise", "Ranch"];
var prices = {
    "foods": 5,
    "drinks": 2.5,
    "snacks": 3,
    "condiments": 0.5,
}
const billItems = {};

function addToBill(itemName) {
    // If already in dict, just update quantity
    const itemPrice = getItemPrice(itemName);
    if (billItems.hasOwnProperty(itemName)){
        console.log("in dict");
        const item = billItems[itemName];
        item.quantity += 1;
        item.totalPrice = item.quantity * item.pricePerItem;
    }
    // Else add to dict
    else {
        billItems[itemName] = {
            "pricePerItem": itemPrice,
            "quantity": 1,
            "totalPrice": itemPrice
        }
    }
    console.log(JSON.stringify(billItems));
    addTotal(itemPrice);

    // Add to bill UI
    displayBill(itemName);
    

}

function displayBill(itemName) {
    var billTable = document.getElementById("bill-table");
    console.log(billTable.rows.length);

    // Check if item already displayed
    var displayed = false;
    for(var i = 0; i < billTable.rows.length; i++){
        console.log(i);
        var currItemName = billTable.rows[i].cells[0].innerText;
        console.log(currItemName);
        if(itemName === currItemName){
            // Update quantity for item
            const totalPrice = formatPrice(billItems[itemName]["totalPrice"]);
            billTable.rows[i].cells[2].innerText = billItems[itemName]["quantity"];
            billTable.rows[i].cells[1].innerHTML = `<p style="font-size: 13px;">${itemName}</p>
            <p style="margin-top:-11px; font-size: 18px;"><b>$${totalPrice}</p>`;
            displayed = true;
        }
    }

    // If not, create new row for item
    if(displayed == false) {              
                    console.log("inserting first row");
        var row = billTable.insertRow();
        
        // Insert new cells (<td> elements)
        var value = row.insertCell(0);
        var namePrice = row.insertCell();
        // var incQuantity = row.insertCell();
        var quantity = row.insertCell();
        // var decQuantity = row.insertCell();
        var edit = row.insertCell();

        // Insert cell contents
        const totalPrice = formatPrice(billItems[itemName]["totalPrice"]);
        namePrice.innerHTML = `<p style="font-size: 13px;">${itemName}</p>
                                <p style="margin-top:-11px; font-size: 18px;"><b>$${totalPrice}</p>`;
        quantity.innerText = billItems[itemName]["quantity"];
        // incQuantity.innerHTML = "+";
        // decQuantity.innerHTML = "-";
        edit.innerHTML = `<button 
                    value="Delete"
                    onclick="removeBillItem(this)"  
                    style="background-color: #ffb7b7; color: red;">x</button>`;
        value.innerText = itemName;

        // Style cells
        namePrice.style.width = "50%";
        quantity.style.width = "30%"
        edit.style.width = "20%"
        // incQuantity.style.width = "15%"
        // decQuantity.style.width = "15%";
        value.style.display = "none";
    }
}

function addTotal(itemPrice) {
    // Get <td> holding total price
    totalPrice += itemPrice;
    document.getElementById("bill-total-td").innerHTML = "$" + formatPrice(totalPrice);
} 

function clearBill() {
    var billTable = document.getElementById("bill-table");
    var numRows = billTable.rows.length;
    for (let row = numRows-1; row > -1; row--){
        console.log(row);
        billTable.deleteRow(row);
        console.log(numRows);
    }

    // Reset bill total
    totalPrice = 0;
    document.getElementById("bill-total-td").innerHTML = "";

    // Reset bill map
    for(var item in billItems){
        delete billItems[item];
    }
    console.log(JSON.stringify(billItems));

}

function updateOrder() {
    orderNum++;
    document.getElementById("order-num-p").innerHTML = "<b> Order #" + orderNum + "</b>";
}

function newOrder() {
    clearBill();
    updateOrder();

}

function removeBillItem(r) {

    // Get item name
    currentBillItemIndex = r.parentNode.parentNode.rowIndex;
    var itemRow = document.getElementById("bill-table").rows[currentBillItemIndex];
    console.log("item: " + itemRow.cells[0].innerText);
    var itemName = itemRow.cells[0].innerText;

    // Update total
    totalPrice -= billItems[itemName]["totalPrice"];
    document.getElementById("bill-total-td").innerHTML = "$" + formatPrice(totalPrice);

    // Delete from bill dictionary
    delete billItems[itemName];
    console.log(JSON.stringify(billItems));
    
    // delete row from UI
    document.getElementById("bill-table").deleteRow(currentBillItemIndex);

    // reset currentBillItemIndex
    currentBillItemIndex = 0;
    
}

function getItemPrice(itemName) {
    var itemPrice = 0;
    if (foods.includes(itemName)){ 
        return itemPrice = prices["foods"];
    }
    else if (drinks.includes(itemName)) {
        return itemPrice = prices["drinks"];
    }
    else if (snacks.includes(itemName)) {
        return itemPrice = prices["snacks"];
    }
    else if (condiments.includes(itemName)) {
        return itemPrice = prices["condiments"];
    }

    return itemPrice;
}

function formatPrice(price) {
    return price % 1 == 0 ? price.toString() + ".00" : price.toString() + "0" ;

}

// Side navigation 
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}

function closeNav() {
document.getElementById("mySidenav").style.width = "0";
document.getElementById("main").style.marginLeft= "0";
}

// Lightboxes
function togglePaymentLightbox() {
    var lightboxWrapper = document.getElementById("lightbox-wrapper");
    var lightbox = document.getElementById("lightbox");

    if (lightboxWrapper.style.display == "none" && lightbox.style.display == "none") {
        lightboxWrapper.style.display = "block";
        lightbox.style.display = "block";
    } else {
        lightboxWrapper.style.display = "none";
        lightbox.style.display = "none";
    }

    // Animate payment processing
    var lightboxText = document.getElementById("lightbox-p");
    lightboxText.innerHTML = "Payment processing...";

    // Save to firestore
    console.log(JSON.stringify(billItems));
    addToFirestore(billItems, totalPrice, orderNum);
            
    lightboxText.innerHTML = "Payment successful!";
    timeout = setTimeout(function() {
        lightboxWrapper.style.display = "none";
    lightbox.style.display = "none";
    }, 4000);

    newOrder();

}

function toggleReceiptLightbox() {
    var lightboxWrapper = document.getElementById("lightbox-wrapper");
    var lightbox = document.getElementById("lightbox");

    if (lightboxWrapper.style.display == "none" && lightbox.style.display == "none") {
        lightboxWrapper.style.display = "block";
        lightbox.style.display = "block";

    } else {
        lightboxWrapper.style.display = "none";
        lightbox.style.display = "none";
    }
    
    // Animate print receipt
    var lightboxText = document.getElementById("lightbox-p");
    lightboxText.innerHTML = "Printing receipt...";
    timeout = setTimeout(function() {
        lightboxWrapper.style.display = "none";
    lightbox.style.display = "none";
    }, 4000);
}