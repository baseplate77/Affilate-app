import { autoId } from "@/utils/autoId";
import { db } from "@/utils/firebase";
import { setCookie, getCookie } from "cookies-next";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";

class AffiliateService {

    async getAffiliateId(email: string) {
        const ref = doc(db, `users/${email}`)
        let { affiliateId } = (await getDoc(ref)).data() as any;
        // if (affiliateId === undefined) return;

        console.log("affiliate id", affiliateId, typeof affiliateId);


        return affiliateId
    }
    async createAffiliate(email: string) {

        let id = autoId();
        const ref = doc(db, `affiliate/${id}`);
        const userRef = doc(db, `users/${email}`)

        await setDoc(ref, {
            affiliateId: id,
            user: email,
            createdAt: new Date(),
        });
        await updateDoc(userRef, {
            affiliateId: id,
        })
    }


    cookies(affiliateId: string) {
        let now = new Date()
        // let expireDate = new Date()
        // expireDate.setDate(now.getDate() + 3)

        setCookie("affiliate_data", JSON.stringify({ affiliateId: affiliateId, createdAt: now }), { maxAge: 24 * 60 * 60 })
    }
    getDataFromCookie() {
        let affilateData = getCookie("affiliate_data") as string;
        if (affilateData === undefined) return;
        let d = JSON.parse(affilateData)
        if (d !== undefined) return d

    }
}

const affiliateService = new AffiliateService()
export default affiliateService;
