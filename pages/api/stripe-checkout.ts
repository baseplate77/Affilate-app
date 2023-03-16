// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2022-11-15"
});


const DOMAIN_URL = 'http://localhost:3000/'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const { affiliateId, email } = JSON.parse(req.body)

    try {
        // Create Checkout Sessions from body params.
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: "INR",
                        unit_amount: 300 * 100,
                        product_data: {
                            name: "Flutter Notification Course",
                            images: [
                                "https://firebasestorage.googleapis.com/v0/b/flutter-course-website.appspot.com/o/website%2Fcourse-poster.png?alt=media&token=bfa2a33c-c098-416b-9b19-5773bd212766",
                            ],
                        },
                    },
                    quantity: 1,
                },
            ],
            tax_id_collection: { enabled: true },
            payment_intent_data: {
                metadata: {
                    affilate_Id: affiliateId,
                    email: email
                },
            },
            mode: "payment",
            success_url: `${DOMAIN_URL}/payments?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${DOMAIN_URL}/cancel`,
        });

        res.send({ url: session.url } as any);
    } catch (err: any) {
        console.log("error in stripe checkout : ", err);

        res.status(err.statusCode || 500).json(err.message);
    }

}

