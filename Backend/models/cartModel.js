import mongoose from "mongoose";


const cartItemschema = mongoose.Schema({
    product : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Product",
        required : true
    },
    
    name : { type : String, required : true},
    image : { type : String, required : true},
    price : { type : Number, required : true, min : 0},
    quantity : { type : Number, required : true, min : 1}
});




const cartSchema = mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    cartItems : [cartItemschema],
    totalPrice : { type : Number, required : true, default : 0.0}
}, {timestamps : true});


const Cart = mongoose.model("Cart", cartSchema);
export default Cart;