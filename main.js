let carts= document.querySelectorAll('.add-cart');

for(let i=0;i<carts.length;i++)
{
    carts[i].addEventListener('click', () =>{
        cartNumbers(products[i]);
        totalCost(products[i]);

    })
}
function onLoadCartNumbers()
{
    let productNumbers=localStorage.getItem('cartNumbers');
    if(productNumbers){
        document.querySelector('.cart span').textContent = productNumbers;
    }
}
function cartNumbers(product, action) {
    let productNumbers = localStorage.getItem('cartNumbers');
    productNumbers = parseInt(productNumbers);

    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);

    if( action ) {
        localStorage.setItem("cartNumbers", productNumbers - 1);
        document.querySelector('.cart span').textContent = productNumbers - 1;
        console.log("action running");
    } else if( productNumbers ) {
        localStorage.setItem("cartNumbers", productNumbers + 1);
        document.querySelector('.cart span').textContent = productNumbers + 1;
    } else {
        localStorage.setItem("cartNumbers", 1);
        document.querySelector('.cart span').textContent = 1;
    }
    setItems(product);
}
function setItems(product){
  let cartItems=localStorage.getItem('productsInCart');
  cartItems=JSON.parse(cartItems);
  
  if(cartItems != null) {
    let currentProduct = product.tag;
    if(cartItems[currentProduct] == undefined)
    {
        cartItems={
            ...cartItems,
            [currentProduct]: product
        }
    }
     cartItems[product.tag].inCart +=1;
  } else{
    product.inCart=1;
     cartItems={
        [product.tag]: product
    };
  }
    
    localStorage.setItem("productsInCart", JSON.stringify (cartItems));

}


function totalCost( product, action ) {
    let cart = localStorage.getItem("totalCost");

    if( action) {
        cart = parseInt(cart);

        localStorage.setItem("totalCost", cart - product.price);
    } else if(cart != null) {
        
        cart = parseInt(cart);
        localStorage.setItem("totalCost", cart + product.price);
    
    } else {
        localStorage.setItem("totalCost", product.price);
    }
}



function displayCart()
{
    
    let cartItems=localStorage.getItem("productsInCart");
    cartItems=JSON.parse(cartItems);
    let cart = localStorage.getItem("totalCost");
    cart = parseInt(cart);
    let productContainer=document.querySelector(".products");
    let cartCost=localStorage.getItem('totalCost');
    console.log(cartItems);
    if(cartItems && productContainer)
    {
        productContainer.innerHTML='';
        Object.values(cartItems).map(item =>
            {
                
                productContainer.innerHTML +=`
                <div class="product">
                <ion-icon name="close-circle-outline"></ion-icon>
                <img src="./Slike/artikli/${item.tag}.jpg" height="75%">
                <span class="sm-hide" name="ime">${item.name}</span>
                </div>
                
                <div class="price sm-hide">${item.price},00 KM</div>
                <div class="quantity">
                
                <ion-icon  class="decrease" name="arrow-back-circle-outline"></ion-icon>
                    <span>${item.inCart}</span>
                    <ion-icon class="increase "name="arrow-forward-circle-outline"></ion-icon> 
                </div>
                
                <div class="total">
                ${item.inCart * item.price},00 KM
                </div>
                
                `;
                
            });
            
            productContainer.innerHTML +=`
            <div class="basketTotalContainer">
            <h3 class="basketTotalTitle">
            Ukupno za platit: 
            </h3>
            <h3 class="basketTotal" name="basketTotal">
              ${cartCost},00 KM
            </h3>
            `;


            deleteButtons();
        manageQuantity();

    }
}
function manageQuantity() {
    let decreaseButtons = document.querySelectorAll('.decrease');
    let increaseButtons = document.querySelectorAll('.increase');
    let currentQuantity = 0;
    let currentProduct = '';
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);

    for(let i=0; i < increaseButtons.length; i++) {
        decreaseButtons[i].addEventListener('click', () => {
            console.log(cartItems);
            currentQuantity = decreaseButtons[i].parentElement.querySelector('span').textContent;
            console.log(currentQuantity);
            currentProduct = decreaseButtons[i].parentElement.previousElementSibling.previousElementSibling.querySelector('span').textContent.toLocaleLowerCase().replace(/ /g,'').trim();
            console.log(currentProduct);

            if( cartItems[currentProduct].inCart > 1 ) {
                cartItems[currentProduct].inCart -= 1;
                cartNumbers(cartItems[currentProduct], "decrease");
                totalCost(cartItems[currentProduct], "decrease");
                localStorage.setItem('productsInCart', JSON.stringify(cartItems));
                displayCart();
            }
        });

        increaseButtons[i].addEventListener('click', () => {
            console.log(cartItems);
            currentQuantity = increaseButtons[i].parentElement.querySelector('span').textContent;
            console.log(currentQuantity);
            currentProduct = increaseButtons[i].parentElement.previousElementSibling.previousElementSibling.querySelector('span').textContent.toLocaleLowerCase().replace(/ /g,'').trim();
            console.log(currentProduct);

            cartItems[currentProduct].inCart += 1;
            cartNumbers(cartItems[currentProduct]);
            totalCost(cartItems[currentProduct]);
            localStorage.setItem('productsInCart', JSON.stringify(cartItems));
            displayCart();
        });
    }
}

function deleteButtons() {
    let deleteButtons = document.querySelectorAll('.product ion-icon');
    let productNumbers = localStorage.getItem('cartNumbers');
    let cartCost = localStorage.getItem("totalCost");
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);
    let productName;
    console.log(cartItems);

    for(let i=0; i < deleteButtons.length; i++) {
        deleteButtons[i].addEventListener('click', () => {
            productName = deleteButtons[i].parentElement.textContent.toLocaleLowerCase().replace(/ /g,'').trim();
           
            localStorage.setItem('cartNumbers', productNumbers - cartItems[productName].inCart);
            localStorage.setItem('totalCost', cartCost - ( cartItems[productName].price * cartItems[productName].inCart));

            delete cartItems[productName];
            localStorage.setItem('productsInCart', JSON.stringify(cartItems));

            displayCart();
            onLoadCartNumbers();
        })
    }
}

onLoadCartNumbers();
displayCart();
