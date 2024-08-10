import express from "express";
import Razorpay from "razorpay";

const router = express.Router();

const razorpay = new Razorpay({
    key_id: 'your_razorpay_key_id', // Replace with your actual Razorpay key ID
    key_secret: 'your_razorpay_key_secret' // Replace with your actual Razorpay key secret
});

// UPI Payment Route
router.post('/upi', async (req, res) => {
    const { amount, currency, receipt } = req.body;
    try {
        const options = {
            amount: amount * 100, // amount in the smallest currency unit
            currency,
            receipt,
            payment_capture: '1'
        };
        const order = await razorpay.orders.create(options);
        res.status(200).send({ success: true, order });
    } catch (error) {
        res.status(500).send({ success: false, error: error.message });
    }
});

export default router;