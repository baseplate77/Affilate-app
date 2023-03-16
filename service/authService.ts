import { auth, db } from "@/utils/firebase";
import { IUser } from "@/utils/types";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";

class AuthService {


    async saveUserToFirebase(params: any) {
        const { name, email, image: avatar } = params.user;
        const { provider } = params.account;
        const { email_verified: emailVerified, locale } = params.profile;

        const credential = GoogleAuthProvider.credential(params.account?.id_token!);
        const { user: firebaseUser } = await signInWithCredential(auth, credential);

        const id = firebaseUser.uid;
        const user = {
            id,
            name,
            email,
            avatar,
            provider,
            emailVerified,
            locale,
            createdAt: serverTimestamp(),
        };

        const isRegistered = await this.getUserByEmail(email);

        if (isRegistered) return;

        const ref = doc(db, "users/" + email);

        await setDoc(ref, user);
    }

    async getUserByEmail(email: string) {
        const ref = doc(db, `users/${email}/`);
        const snap = await getDoc(ref);
        return snap.exists();
    }
}

const authService = new AuthService()

export default authService;