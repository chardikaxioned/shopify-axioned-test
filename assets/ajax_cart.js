const defaults = {
    cartModal: '.js-ajax-cart-modal', // classname
    cartModalContent: '.js-ajax-cart-modal-content', // classname
    cartModalClose: '.js-ajax-cart-modal-close', // classname
    cartDrawer: '.js-ajax-cart-drawer', // classname
    cartDrawerContent: '.js-ajax-cart-drawer-content', // classname
    cartDrawerClose: '.js-ajax-cart-drawer-close', // classname
    cartDrawerTrigger: '.js-ajax-cart-drawer-trigger', // classname
    cartOverlay: '.js-ajax-cart-overlay', // classname
    cartCounter: '.js-ajax-cart-counter', // classname
    addToCart: '.js-ajax-add-to-cart', // classname
    removeFromCart: '.js-ajax-remove-from-cart', //classname
    removeFromCartNoDot: 'js-ajax-remove-from-cart', //classname,
    checkoutButton: '.js-ajax-checkout-button',
};



const cartModal = document.querySelector(defaults.cartModal);
const cartModalContent = document.querySelector(defaults.cartModalContent);
const cartModalClose = document.querySelector(defaults.cartModalClose);
const cartDrawer = document.querySelector(defaults.cartDrawer);
const cartDrawerContent = document.querySelector(defaults.cartDrawerContent);
const cartDrawerClose = document.querySelector(defaults.cartDrawerClose);
const cartDrawerTrigger = document.querySelector(defaults.cartDrawerTrigger);
const cartOverlay = document.querySelector(defaults.cartOverlay);
const cartCounter = document.querySelector(defaults.cartCounter);
const addToCart = document.querySelectorAll(defaults.addToCart);
let removeFromCart = document.querySelectorAll(defaults.removeFromCart);
const checkoutButton = document.querySelector(defaults.checkoutButton);
const htmlSelector = document.documentElement;

for (let i = 0; i < addToCart.length; i++) {

    addToCart[i].addEventListener('click', function(event) {

        event.preventDefault();
//         console.log($(this).parents().find('form'));
        const formID =  $(this).closest('.product-form').attr('data-id');
        //const formID = this.parentNode.getAttribute('id');
//         console.log(formID);

//         addProductToCart(formID);

    });

}

function addProductToCart(formID) {
    $.ajax({
        type: 'POST',
        url: '/cart/add.js',
        dataType: 'json',
        data: $('#' + formID)
            .serialize(),
        success: addToCartOk,
        error: addToCartFail,
    });
}

function fetchCart() {
    $.ajax({
        type: 'GET',
        url: '/cart.js',
        dataType: 'json',
        headers: {
            'Cache-Control': 'max-age=1000'
        },
        success: function(cart) {
            onCartUpdate(cart);
			console.log(cart)
            if (cart.item_count === 0) {
                cartDrawerContent.innerHTML = $('.emptyCart').html();
                $('.ajax-cart.banner').html("");
                $('.ajax-cart-drawer__buttons').hide();
                $(".ajax_suggestions").hide();
                checkoutButton.classList.add('is-hidden');
            } else {

                renderCart(cart);
                checkoutButton.classList.remove('is-hidden');
            }

        },
    });
}

function changeItem(line,quantity, callback) {

    $.ajax({
        type: 'POST',
        url: '/cart/change.js',
        data: 'quantity=' + quantity + '&line=' + line,
        dataType: 'json',
        success: function(cart) {
            if ((typeof callback) === 'function') {
                callback(cart);
            } else {
                onCartUpdate(cart);
                fetchCart();
                removeProductFromCart();
            }
        },
    });
}

function onCartUpdate(cart) {
//     console.log('items in the cart?', cart.item_count);
}

function addToCartOk(product) {
 
    cartModalContent.innerHTML = product.title + ' was added to the cart!';
  
//   if(cartCounter.firstElementChild){
//     cartCounter.innerHTML = Number(cartCounter.firstElementChild.innerHTML) + 1;
//   }
//   else{
//     cartCounter.innerHTML = Number(cartCounter.innerHTML) + 1;
//   }
    // openAddModal();
    // openCartOverlay();

//  console.log("add")
    fetchCart();
    openCartDrawer();
    openCartOverlay();
  
}

function removeProductFromCart() {
    cartCounter.innerHTML = Number(cartCounter.innerHTML) - 1;
}

function addToCartFail() {
    $('.js-ajax-add-to-cart .text').html("Sold Out");
    cartModalContent.innerHTML = 'The product you are trying to add is out of stock.';
    // openAddModal();
    // openCartOverlay();
}

function renderCart(cart) {

    $('.ajax-cart-drawer__buttons').show();
    $(".ajax_suggestions").show();

    clearCartDrawer();
    $('.recommendedProducts').show();
    var strapCounter = 0;
//     console.log(cart.items);
    cart.items.forEach(function(item, index) {
        if(item.properties){
            if(item.properties['_Strap'] ){

                strapCounter =strapCounter + item.quantity ;
            }
        }
//         console.log(strapCounter);
        //console.log(item.title);
        //console.log(item.image);
        //console.log(item.line_price);
        //console.log(item.quantity);
        if($('#ProductSection-'+item.product_id).length > 0){
            $('#ProductSection-'+item.product_id).toggle();
        }

        const productTitle = '<div class="ajax-cart-item__title">' + item.title + '</div>';
        const productImage = '<img loading="lazy" class="ajax-cart-item__image" src="' + item.image + '" >';
        const productPrice = item.original_price > item.discounted_price  ?"<s>$"+item.original_price*item.quantity/100+"</s>$"+(item.discounted_price*item.quantity)/100:"$"+item.line_price/100;
        const productQuantity = '<div class="ajax-cart-item__quantity">' + item.quantity + '</div>';
        const productRemove = '<div class="ajax-cart-item__remove ' + defaults.removeFromCartNoDot + '"></div>';

        var itemHtml = ' <div class="ajax-cart-item__image">\n' +
            '                <img loading="lazy" src="'+item.image+'" alt="">\n' +
            '            </div>\n' +
            '            <div class="row flex align_center">\n' +
            '                <div class="left-content">\n' +
            '                    <div class="left-details">\n' +
            '                        <div class="ajax-cart-item__title">'+item.title+'</div>\n' +
            '                    </div>\n' +
            '                </div>\n' +
            
            '            </div>\n' +
            '            <div class="row flex align_center qty-price-cont">\n' +
            '                <div class="left-content">\n' +
            '                    <div class="ajax-cart-item__quantity flex align_center"><div onclick="keyToClick(event);" onkeydown="keyToClick(event);" tabindex="0" class="cart-item_dec cart_qty">-<span class="visually-hidden"> Decrease Quantity</span></div><input title="Input Product Quantity" class="cart-item_no" max="25" type="text" value="'+item.quantity+'" name="cart-item_no"><div onclick="keyToClick(event);" onkeydown="keyToClick(event);" tabindex="0" class="cart-item_inc cart_qty">+<span class="visually-hidden"> Increase Quantity</span></div></div>\n' +
            '                </div>\n' +
            '                <div class="right-content">\n' +
            '                    <div class="ajax-cart-item__price text_center">'+productPrice+'</div>\n' +
            '                </div>\n' +
            '                <div class="right-content">\n' +
            '                    <div tabindex="0" onkeydown="keyToClick(event);" class="ajax-cart-item__remove  ' + defaults.removeFromCartNoDot + '"><img src="https://cdn.shopify.com/s/files/1/0596/2688/1181/files/Group_8_2x_24e5a2ee-70ff-4ac7-9c57-a67d2881c163.png?v=1634164050"><span class="visually-hidden">Remove Item From Cart</span></div>\n' +
            '                </div>\n' +
            '            </div>';
        const concatProductInfo = '<div class="ajax-cart-item__single flex" data-line="' + Number(index + 1) + '">' + itemHtml + '</div>';

        cartDrawerContent.innerHTML = cartDrawerContent.innerHTML + concatProductInfo;

    });
    getRecommendedProductsData(cart.items);

    // document.querySelectorAll('.js-ajax-remove-from-cart')
    //     .forEach((element) => {
    //         element.addEventListener('click', function() {
    //             const lineID = this.parentNode.getAttribute('data-line');
    //             console.log('aa');
    //         });
    //     });

    //turn below script for dynamic cart drawer meesaging
    /*
    if(cart.total_discount > 0){
        var disc = Math.ceil(((cart.original_total_price - cart.total_price)/cart.original_total_price)*100);
        $('.ajax-cart.banner').html("Congrats! You saved "+disc+"%");


    }else{
        if(strapCounter > 2){
            $('.ajax-cart.banner').html("Congrats! You qualified for discount");
        }

       else if(strapCounter > 1){
            $('.ajax-cart.banner').html("Add 1 more strap to save 15%");
        }else{
            $('.ajax-cart.banner').html("Add 2 more straps to save 15%");

        }
    }

     */
    $('.ajax-cart.banner').html("$2 Shipping Worldwide");
//     const cartTotal = cart.total_discount > 0 ?"<s>"+theme.Currency.formatMoney( cart.original_total_price)+"</s>"+theme.Currency.formatMoney( cart.total_price,theme.moneyFormatWithCurrency):theme.Currency.formatMoney( cart.total_price,theme.moneyFormatWithCurrency);
//     const cartTotal = "<s>"+Currency.formatMoney( cart.original_total_price)+"</s>";

  const cartTotal = cart.original_total_price/100;
  $('.cart-subtotal__price').html("$"+cartTotal);
$('.js-ajax-checkout-button').val("Checkout-$"+cartTotal);
    removeFromCart = document.querySelectorAll(defaults.removeFromCart);

    for (let i = 0; i < removeFromCart.length; i++) {
        removeFromCart[i].addEventListener('click', function() {
            const line = $(this).parents().find('.ajax-cart-item__single').attr('data-line');
            //const line = this.parentNode.getAttribute('data-line');

            changeItem(line,0);
        });
    }

    $('.cart-item_no').change(function () {
        const line = $(this).closest('.ajax-cart-item__single').attr('data-line');
        //const line = this.parentNode.getAttribute('data-line');

        changeItem(line,$(this).val());
    })


}
var _config ={};
var getRecommendedProductsData = function(items) {
    console.log(12345);
    var url = $('.ajax-cart__modal').attr('data-recommended-products-url');
    if( _config.cartRecommendedProductsData == null ) {
        $.ajax({
            url: url,
            type: "GET",
            dataType: "JSON",
            success: function (data) {
                var formatedData = {};
                for(var i = 0; i < data.length; i++) {
                    if( data[i].hasOwnProperty('handle') ) {
                        if( !formatedData[data[i].handle] ) {
                            formatedData[data[i].handle] = [];
                        }

                        Object.keys(data[i]).forEach(function (key) {
                            if( key !== 'handle' ) {
                                if( data[i][key].length )
                                    formatedData[data[i].handle].push(data[i][key]);
                            }
                        });
                    }
                }

                _config.cartRecommendedProductsData = formatedData;

                getRecommendedProducts(items);
            }
        });
    } else {
        getRecommendedProducts(items);
    }
}

var getRecommendedProducts  = function(items) {

    var recommendedProductsHandles = [],
        recommendedProducts = [],
        productsAlreadyInCart = [];

    for(var i = 0; i < items.length; i++) {
        var item = items[i];
        productsAlreadyInCart.push(item.handle);

        if( recommendedProductsHandles.length >= 2 ){
            break;
        } else {
            if( _config.cartRecommendedProductsData.hasOwnProperty(item.handle) && _config.cartRecommendedProductsData[item.handle].length ) {

                for(var j = 0; j < _config.cartRecommendedProductsData[item.handle].length; j++) {
                    recommendedProductsHandles.push(_config.cartRecommendedProductsData[item.handle][j]);
                }
            }
        }
    }

    foo(recommendedProductsHandles, function (products) {
        renderRecommendedProducts(products);
    });

    function foo(productsHandlesArray, callback) {
        if(productsHandlesArray.length) {
            // console.log('checking');
            var product_handle = productsHandlesArray.shift();
            if( productsAlreadyInCart.indexOf(product_handle) === -1 ) {
                $.ajax({
                    url: "/products/" + product_handle + ".json",
                    type: "GET",
                    dataType: "JSON",
                    success: function (data) {
                        recommendedProducts.push(data.product);
                        foo(productsHandlesArray, callback);
                    }
                })
            } else {
                foo(productsHandlesArray, callback);
            }
        } else {
            callback(recommendedProducts);
        }
    }
}

var renderRecommendedProducts  = function(recommendedProducts){
     console.log("this",recommendedProducts)
    if ( recommendedProducts.length > 0 ) {
        $('.Drawer').find('.recomProds').addClass('show')
    }
    for(var i = 0; i < recommendedProducts.length; i++) {
        recommendedProducts[i]['product_title']=recommendedProducts[i].title;
        recommendedProducts[i]['product_url']=recommendedProducts[i].title;
        recommendedProducts[i]['product_img_src']=getSizedImageUrl(recommendedProducts[i].image.src, 'medium');
        recommendedProducts[i]['product_price']='$'+recommendedProducts[i].variants[0].price.replace('.00', '');
        recommendedProducts[i]['product_options']= recommendedProductOptions(recommendedProducts[i]);

        recommendedProducts[i]['product_id']=recommendedProducts[i].id;
        //var product = recommendedProducts[i];
        //var item =template;
        // var item = template.replace(templateVariables.productTitle, product.title);
        //  item = item.replace(templateVariables.productId, product.id);
        // item = item.replace(templateVariables.productUrl, '/products/' + product.handle);
        // item = item.replace(templateVariables.productPrice, '$' + product.variants[0].price.replace('.00', ''));
        //item = item.replace(templateVariables.productOptions, recommendedProductOptions(product));
        //item = item.replace(templateVariables.productImageSrc, getSizedImageUrl(product.image.src, 'medium'));
        // recommendedItemsHTML += item;

    }







    recommendedProducts = {
        'recommendedProducts':recommendedProducts
    }

    var source = $('.recommended-item-template').html();
    var template = Handlebars.compile(source);
    $('.ajax-cart__drawer').find('.recomProds').html(template(recommendedProducts));
    $('body .recommended-product .ProductForm__AddToCart').click(function(e){
        e.preventDefault();
        var $form = $(this).parent('form'),
            formData = $form.serialize();
        console.log(formData);
        $.ajax({
            url: '/cart/add.js',
            type: 'POST',
            dataType: 'JSON',
            data: formData,
            success: function(cart) {
                var CartSlider = fetchCart();

            }
        });
    })

}

var recommendedProductOptions  = function(product) {
    var options = "", images = {};
    product.images.forEach(function (image) {
        images[image.id] = getSizedImageUrl(image.src, 'medium');
    }.bind(this));

    product.variants.forEach(function (variant, index) {
        var selected =  index == 0 ? "selected" : "", image_data_attr = "";

        if( images.hasOwnProperty(variant.image_id) ) {
            image_data_attr = "data-image-url='" + images[variant.image_id] + "'";
        }
        options += "<option " + image_data_attr + " data-variant-price='" + variant.price + "' data-option-value='" + variant.title + "' value='" + variant.id + "' " + selected + ">" + variant.title + "</option>";
    });

    var singleSelectorOptions = "", singleSelectors = "<div class='grid_no_gutter vert-top options'>";
    product.options.forEach(function (option) {
        var values = option.values;
        singleSelectorOptions = "";
        for(var k = 0; k < values.length; k++) {
            singleSelectorOptions += "<option value='" + values[k] + "'>" + values[k] + "</option>";
        }
        singleSelectors += "<div class='grid__item one-half singleProductOption'><select class='singleOptionSelector'>" + singleSelectorOptions + "</select></div>"
    });
    singleSelectors += "</div>"

    var primarySelect = '<select name="id">' + options + "</select>";

    return "<div class='product--variants'>" +  primarySelect + singleSelectors + "</div>";
}
var singleProductOptionChange  = function(e) {
    var variant_title = "";
    var $this_product = $(e.target).closest('.product--variants');
    $this_product.find('.singleOptionSelector').each(function () {
        variant_title = variant_title.length == 0 ? $(this).val() : variant_title + " / " + $(this).val();
    });

    var $variant_option = $this_product.find('[name="id"] option[data-option-value="' + variant_title + '"]');
    $variant_option.attr('selected', true);

    var price = $variant_option.data('variant-price'),
        img_src = $variant_option.data('image-url');
    $this_product.closest('.recommended-product').find('.recommended-product-price').text('$' + price.replace('.00', ''));
    if( img_src ) {
        $this_product.closest('.recommended-product').find('.recommended-product-image img').attr('src', img_src);
    }
}

var handleRecommendedProductsATC  = function(e)  {
    e.preventDefault();
    var $form = $(e.target),
        formData = $form.serialize();
    $.ajax({
        url: '/cart/add.js',
        type: 'POST',
        dataType: 'JSON',
        data: formData,
        success: function(cart) {
            var CartSlider = new _cartSlider();
            CartSlider.refresh();
            cc_cartNotBusy = true;
        }.bind(this)
    });

}
function openCartDrawer() {
    cartDrawer.classList.add('is-open');



}

function closeCartDrawer() {
    cartDrawer.classList.remove('is-open');
}

function clearCartDrawer() {
    cartDrawerContent.innerHTML = '';
}

function openAddModal() {
    cartModal.classList.add('is-open');
}

function closeAddModal() {
    cartModal.classList.remove('is-open');
}

function openCartOverlay() {
    cartOverlay.classList.add('is-open');
    htmlSelector.classList.add('is-locked');
}

function closeCartOverlay() {
    cartOverlay.classList.remove('is-open');
    htmlSelector.classList.remove('is-locked');
}

cartModalClose.addEventListener('click', function() {
    closeAddModal();
    closeCartOverlay();
});

cartDrawerClose.addEventListener('click', function() {
    closeCartDrawer();
    closeCartOverlay();
});
// cart is empty stanje
cartOverlay.addEventListener('click', function() {
    closeAddModal();
    closeCartDrawer();
    closeCartOverlay();
});

cartDrawerTrigger.addEventListener('click', function(event) {
    event.preventDefault();
    //fetchCart();
    openCartDrawer();
    openCartOverlay();
});

document.addEventListener('DOMContentLoaded', function() {
    fetchCart();
});

// waitFor_jQuery(function () {
//     $('.showInst').click(function () {
//         $('.specialInst').show();
//         $('.showInst').hide();
//     })
// })









 Currency = (function() {
    var moneyFormat = '$'; // eslint-disable-line camelcase

    function formatMoney(cents, format) {
      if (typeof cents === 'string') {
        cents = cents.replace('.', '');
      }
      var value = '';
      var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
      var formatString = format || moneyFormat;

      function formatWithDelimiters(number, precision, thousands, decimal) {
        precision = slate.utils.defaultTo(precision, 2);
        thousands = slate.utils.defaultTo(thousands, ',');
        decimal = slate.utils.defaultTo(decimal, '.');

        if (isNaN(number) || number == null) {
          return 0;
        }

        number = (number / 100.0).toFixed(precision);

        var parts = number.split('.');
        var dollarsAmount = parts[0].replace(
          /(\d)(?=(\d\d\d)+(?!\d))/g,
          '$1' + thousands
        );
        var centsAmount = parts[1] ? decimal + parts[1] : '';

        return dollarsAmount + centsAmount;
      }

      switch (formatString.match(placeholderRegex)[1]) {
        case 'amount':
          value = formatWithDelimiters(cents, 2);
          break;
        case 'amount_no_decimals':
          value = formatWithDelimiters(cents, 0);
          break;
        case 'amount_with_comma_separator':
          value = formatWithDelimiters(cents, 2, '.', ',');
          break;
        case 'amount_no_decimals_with_comma_separator':
          value = formatWithDelimiters(cents, 0, '.', ',');
          break;
        case 'amount_no_decimals_with_space_separator':
          value = formatWithDelimiters(cents, 0, ' ');
          break;
      }

      return formatString.replace(placeholderRegex, value);
    }

    return {
      formatMoney: formatMoney,
    };
  })();




  
          
 document.querySelector(".js-ajax-add-to-cart").addEventListener("click", function(e){
    
//   console.log("submit")
      e.preventDefault();

  var productQty = 1;  
     var  productId = $("#product-form-installment").find("input[name='id']").val();
    if($(".quantity__input"))
    {productQty = $(".quantity__input").val()
    }
   else{
    productQty = 1;
   }    
//     console.log(productQty)
//    console.log(productId)
//  addProduct(productId,productQty)
  
	var added = true; 
  
	var $form = $(this).closest('form');
	if ($form.length > 0) {
		var id = $form.attr('id');
		if (id.length > 0) {
			addProductToCart(id);
			added = true;
		}
	}
	
	if (added === false) {
		addProduct(productId,productQty);
	}
  
    

      
       
   
  })
  





function addProduct(id,qty){



   var  items = [
    {
      'id':id,
      'quantity':qty
    }
  ];
   var formData = {
      items: items
    }
     
      fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(response => {
        return response.json();
      })
      .then(data => {
       console.log(data)
       addToCartOk(data.items[0])

        
        
      })
      .catch((error) => {
        
       console.log(error)
       console.log("error")
        addToCartFail()
      }); 


}


function getSizedImageUrl(src, size) {
    if (size === null) {
        return src;
    }

    if (size === 'master') {
        return removeProtocol(src);
    }

    var match = src.match(
        /\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i
    );

    if (match !== null) {
        var prefix = src.split(match[0]);
        var suffix = match[0];

        return removeProtocol(prefix[0] + '_' + size + suffix);
    }

    return null;
}
function removeProtocol(path) {
    return path.replace(/http(s)?:/, '');
}

