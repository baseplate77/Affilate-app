import { db } from "@/utils/firebase";
import { async } from "@firebase/util";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { Button } from "react-daisyui";
import { autoId } from "@/utils/autoId";
import { useEffect, useState } from "react";
import affiliateService from "@/service/affiliate_service";

const Affiliate = () => {
  const { data } = useSession();

  const [affiliateId, setAffiliateId] = useState<string | undefined>();

  const [loading, setLoading] = useState(false);
  const createAffilate = async (e: any) => {
    setLoading(true);
    await affiliateService.createAffiliate(data?.user?.email!);
    setLoading(false);
  };

  const getAffiliateData = async () => {
    let d = await affiliateService.getAffiliateId(data?.user?.email!);
    console.log("data : ", d);

    if (d === undefined) {
      setAffiliateId(undefined);
    } else setAffiliateId(d as any);
  };

  useEffect(() => {
    if (data !== undefined && !affiliateId) getAffiliateData();
  }, [data]);
  return (
    <div className=" justify-center">
      <div>Affiliate Program</div>
      {affiliateId === undefined ? (
        <div className="">
          <Button loading={loading} onClick={createAffilate}>
            Create Affiliate URL
          </Button>
        </div>
      ) : (
        <div>
          you are part of affiliate Program
          <p>
            Share this link,{" "}
            <a>{`http://localhost:3000/affiliate?via=${affiliateId}`}</a>
          </p>
        </div>
      )}
    </div>
  );
};

export default Affiliate;
