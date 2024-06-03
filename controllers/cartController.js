
    const user = require("../models/userModel");

    const category = require("../models/categoriesModel");

    const product = require("../models/productModels");

    const Cart = require("../models/cartModel");





  // ! product total ! ================
  const calculateproducttotal = (cartData) => {
    let producttotal = 0;

    for (const cartitems of cartData) {
        if (cartitems.product && cartitems.product.price) {
            const quantity = cartitems.quantity || 0;
            const total = cartitems.product.price * quantity;
            producttotal += total;
        } 
    }
    return producttotal;
};




// ! laod cart ! +++++++++++++++++++++++++++++++++

const cartload = async (req, res) => {
    try {
        const userId = req.session.userId;
        const cartData = await Cart.findOne({ user: userId }).populate('item.product');
        const cart = cartData ? cartData.item : [];
        const producttotal = calculateproducttotal(cart);
        let outofstockerror = false;

        if (cart.length > 0) {
            for (const cartitems of cart) {    
                // Check if cartitems and cartitems.product are defined
                if (cartitems && cartitems.product) {
                    const product = cartitems.product;

                    // Check if product.quantity and cartitems.quantity are defined
                    if (product.quantity !== undefined && cartitems.quantity !== undefined) {
                        if (product.quantity < cartitems.quantity) {
                            outofstockerror = true;
                            break;
                        }
                    }
                }
            }
        }

        res.render('cartlist', { cartData, outofstockerror, producttotal });
    } catch (error) {
        console.log(error);
        // Handle the error appropriately (send a response or redirect, etc.)
    }
};




  
    

    // cart page laod ! ===========================

    


    // ! insert to cart
    const insertToCart = async (req, res) => {
        try {
            
            const productId = req.query.id;
            const userid = req.session.userId;
            const { qty } = req.body;

            const existingCart = await Cart.findOne({ user: userid });
            let newCart = {};

            if (existingCart) {
                const existingCartItem = existingCart.item.find((item) => item.product.toString() === productId);

                if (existingCartItem) {
                    existingCartItem.quantity += parseInt(qty);
                } else {
                    existingCart.item.push({
                        product: productId,
                        quantity: parseInt(qty),
                    });
                    console.log("Existing cart products",existingCart.item)
                }

                existingCart.total = existingCart.item.reduce(
                    (total, item) => total + (item.quantity || 0),
                    0
                );

                await existingCart.save();

            } else {
                newCart = new Cart({
                    user: userid,
                    items: [{ product: productId, quantity: parseInt(qty) }],
                    total: parseInt(qty, 10),
                });
                
                

                await newCart.save();
            }

            req.session.cartLength = (existingCart || newCart).item.length;

            res.redirect('/cartlist')
        } catch (error) {
            console.log(error.message)
        }
    }   

    // ! upd qty & subttl !============================
    
    const updateQuantityAndSubtotal = async (req, res) => {
        try {   
            const { productId, newQuantity } = req.query;
            const userId = req.session.userId;
    
            const Cart = await Cart.findOne({ user: userId });  
    
            const cartItem = Cart.items.find(item => item.product.toString() === productId);
    
            if (cartItem) {
                cartItem.quantity = parseInt(newQuantity);
                await Cart.save();
    
                const subtotal = cartItem.product.Price * cartItem.quantity;
    
                res.json({ success: true, subtotal });
            } else {
                res.json({ success: false, error: 'Item not found in the cart' });
            }
        } catch (error) {
            console.error('Error updating quantity and subtotal:', error);
            res.json({ success: false, error: 'Failed to update quantity and subtotal' });
        }
    };



// remove cart item ! =====================

const removeCart = async (req, res) => {
    try {
        const userId = req.session.userId;
        const productId = req.query.productId;

        const existingCart = await Cart.findOne({ user: userId });
        
        if (existingCart) {
            const updatedItems = existingCart.item.filter(
                (item) => item._id.toString() !== productId.toString()
            );
           
        if(updatedItems){
            existingCart.item = updatedItems;
            await existingCart.save();

            res.redirect('cartlist');}
            else{
            }
        }else{     
        }
    } catch (error) {
        console.error("Error removing cart item:", error);
    }
};



// ! clear cart ! =======================================

const clearCart = async (req, res) => {
    try {
        const userId = req.session.userId
        await Cart.deleteOne({ user: userId })
        res.redirect('/cartlist');
    } catch (error) {
        console.log(error.message)
    }
}




    module.exports = {
        cartload,
        insertToCart,
        removeCart,
        clearCart,
        updateQuantityAndSubtotal
    }