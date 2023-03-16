// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import Stripe from "stripe";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";

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
    "whsec_93bad4a392a3feb858346fed002158a10dea253fdb6903dd3baf90966b5b4b03";

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
                const paymentIntentSucceeded = event.data.object;
                // Then define and call a function to handle the event payment_intent.succeeded
                break;
            // ... handle other event types
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        // Handle the event
        switch (event.type) {
            case "payment_intent.succeeded":
                const paymentIntentSucceeded: any = event.data.object;

                // const affilateId = (event.data as any).metadata['affilate_Id'];
                console.log("PaymentIndent :", paymentIntentSucceeded);
                console.log(
                    "affilate Id : ",
                    paymentIntentSucceeded.metadata["affilate_Id"]
                );

                let affiliateId = paymentIntentSucceeded.metadata["affilate_id"];
                let email = paymentIntentSucceeded.metadata["email"];
                if (affiliateId === undefined || email === undefined) return;

                await handleAffilate(affiliateId, email, paymentIntentSucceeded);

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

async function handleAffilate(
    affilateId: string,
    email: string,
    paymentIntentSucceeded: any
) {
    let amount = paymentIntentSucceeded.amount;

    let ref = doc(db, `users/${email}/affiliate/${affilateId}`);

    let platformFee = 0.05;
    await updateDoc(ref, {
        amount_pay: amount * platformFee * 0.2,
        status: "pending",
        fund_available_data: Date.now(),
        // currency,
        // inr_price,
        // payments: [],
    });
}
