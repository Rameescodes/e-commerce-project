const Wishlist = require("../models/whishlistModel");


// add to wishlist ! =======================


const addTowishlist = async (req, res) => {
    try {
        const userId = req.session.userId;
        const productId = req.query.id;

        let userWishlist = await Wishlist.findOne({ user: userId });
     
        if (!userWishlist) {
          
            userWishlist = new Wishlist({
                user: userId,
                items: [{ product: productId }],
            });
        } else {
          
            const existingWishlistItem = userWishlist.items.find((item) => item.product.toString() === productId);

            if (existingWishlistItem) {
              
                res.redirect('/wishlist')
            } else {
                userWishlist.items.push({ product: productId });
            }
        }
      
        await userWishlist.save();
        res.redirect(`/wishlist`)

    } catch (error) {   
        console.error(error.message);
    }
};




// ! loadwishlist ! ========================================

const loadWishlist = async (req,res ) =>{
    try{
        const userId = req.session.userId;
        const userwishlist = await Wishlist.findOne({user:userId}).populate("items.product")
        
    const userWishlistItems = userwishlist ? userwishlist.items:[];
    res.render("wishlist",{Wishlist:userWishlistItems});
    
}catch(error) {
    console.error("error fetching wishlist",error); 
}

};
// ! remove  from wishlist ! =================

const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.session.userId;
        const productId = req.query.productId;

        const existingCart = await Wishlist.findOne({ user: userId });
        if (existingCart) {
            const updatedItems = existingCart.items.filter(
                (item) => item.product.toString() !== productId
            );
                
            existingCart.items = updatedItems;
            await existingCart.save();

            res.redirect('wishlist')
        }
    } catch (error) {
        console.error("Error removing cart item:", error);
    }
};













module.exports = {
    addTowishlist,
    loadWishlist,
    removeFromWishlist
}