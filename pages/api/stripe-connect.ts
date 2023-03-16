// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { async } from "@firebase/util";
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2022-11-15",
});
type Data = {
    name: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const account = await stripe.accounts.create({
        type: "express",
        email: "dops77548@gmail.com",
        capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true },
        },
        business_type: 'individual',
        business_profile: { url: 'https://www.flutteruidev.tech/' },
    });
    const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: 'https://example.com/reauth',
        return_url: 'https://example.com/return',
        type: 'account_onboarding',
    });

    res.status(200).json({ accountId: account.id, accountLink: accountLink.url } as any);
}
