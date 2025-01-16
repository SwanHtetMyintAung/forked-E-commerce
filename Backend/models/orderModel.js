 import mongoose from "mongoose";


//init the order schema for order model 
const orderSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: "User",  //Relationship with User Model
        },
        orderItems: [
            {
                name: { type: String, required: true },
                qty: { type: Number, required: true, min: 1 },
                image: { type: String, required: true },
                price: { type: Number, required: true, min: 0 },
                product: {
                    type: mongoose.Types.ObjectId,
                    required: true,
                    ref: "Product",  //Relationship with Product Model
                },
            },
        ],
        shippingAddress: {
            address: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true },
        },
        paymentMethod: { type: String, required: true },
        paymentResult: {
            id: String,
            status: String,
            update_time: String,
            email_address: String,
        },
        itemsPrice: { type: Number, required: true, default: 0.0 },
        taxPrice: { type: Number, required: true, default: 0.0 },
        shippingPrice: { type: Number, required: true, default: 0.0 },
        totalPrice: { type: Number, required: true, default: 0.0 },
        isPaid: { type: Boolean, required: true, default: false },
        paidAt: Date,
        isDelivered: { type: Boolean, required: true, default: false },
        deliveredAt: Date,
    },
    { timestamps: true }
);


const Order = mongoose.model("Order", orderSchema);
export default Order;
