// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import Stripe from "stripe";
import { addDoc, collection, doc, serverTimestamp, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { autoId } from "@/utils/autoId";
import { async } from "@firebase/util";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2022-11-15",
});
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

type Data = {
    name: string;
};
export const config = {
    api: {
        bodyParser: false,
    },
};
const endpointSecret =
    "whsec_d213ef6aa574f8eeba619296d6181d27092107b09e26dbcd43ced389ca1eb9c7";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method === "POST") {
        // res.status(200).json({ name: 'John Doe' })
        // const event = JSON.parse(req.body);
        const sig = req.headers["stripe-signature"] as string;
        const buf = await buffer(req);
        let event;
        try {
            event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
        } catch (err: any) {
            console.log("err :", err.message);

            res.status(err.status || 400).send(`Webhook Error: ${err.message}` as any);
            return;
        }

        // Handle the event
        switch (event.type) {
            case "payment_intent.succeeded":
                const paymentIntentSucceeded: any = event.data.object;

                // const affilateId = (event.data as any).metadata['affilate_Id'];
                console.log("PaymentIndent :", paymentIntentSucceeded);

                // Affiliate    
                let affiliateId = paymentIntentSucceeded.metadata["affilate_Id"];
                let email = paymentIntentSucceeded.metadata["email"];
                if (affiliateId !== undefined && email !== undefined) {
                    await handleAffilate(affiliateId, email, paymentIntentSucceeded);
                }

                break;
            case 'payout.paid':
                const payoutPaid = event.data.object;
                // Then define and call a function to handle the event payout.paid
                break;
            // ... handle other event types
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        // Return a 200 response to acknowledge receipt of the event
        res.json({ received: true } as any);
    } else {
        res.setHeader("Allow", "POST");
        res.status(405).end("Method Not Allowed");
    }
}

const handleAffilate = async (
    affilateId: string,
    email: string,
    paymentIntentSucceeded: any
) => {


    let fundAvailableDate = new Date();
    fundAvailableDate.setDate(fundAvailableDate.getDate() + 8)
    fundAvailableDate.setHours(0)
    fundAvailableDate.setMinutes(0)

    let platformFee = parseFloat(process.env.PLATFORM_FEE || "0.05");

    let ref = doc(db, `affiliate/${affilateId}`);
    let paymentRef = collection(db, `affiliate/${affilateId}/payments`)

    try {

        let amount = paymentIntentSucceeded.amount;
        let amountPay = amount * (1 - platformFee) * 0.2

        await addDoc(paymentRef, {
            status: "pending",
            fund_available_date: Timestamp.fromDate(fundAvailableDate),
            created: Timestamp.fromDate(new Date()),
            payment_id: paymentIntentSucceeded.id,
            client_secret: paymentIntentSucceeded['client_secret'],
            total_amount: paymentIntentSucceeded["amount"],
            amount: amountPay,
            currency: paymentIntentSucceeded.currency,


        })
    } catch (err) {
        console.log("err in storing affiliate payment :", err);
        await addDoc(paymentRef, {
            status: "failed",
            client_secret: paymentIntentSucceeded['client_secret'],
            created: Timestamp.fromDate(new Date()),
            total_amount: paymentIntentSucceeded["amount"],
            currency: paymentIntentSucceeded.currency,
        })

    }

}

