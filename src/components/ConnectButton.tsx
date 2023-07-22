import { generateKeyPair } from "../util/generateEcdsaKeyPair";
import axios from "axios";
import { useState } from "react";
import QRCode from "react-qr-code";

const DeepLinkQRCode = ({ deepLinkUrl }: { deepLinkUrl: string }) => {
  return <QRCode value={deepLinkUrl} />;
};

const pollForSigner = async (token: string) => {
  while (true) {
    // make sure to poll at a reasonable rate to avoid rate limiting
    // sleep 1s
    await new Promise((r) => setTimeout(r, 2000));

    const signerRequest = await axios
      .get(`https://api.warpcast.com/v2/signer-request`, {
        params: {
          token,
        },
      })
      .then((response) => response.data.result.signerRequest);

    if (signerRequest.base64SignedMessage) {
      console.log("signer is approved with fid: ", signerRequest.fid);
      break;
    }
  }
};

export function ConnectButton() {
  const [deepLink, setDeepLink] = useState<string>("");
  const connect = async () => {
    const { publicKey, privateKey } = await generateKeyPair();

    console.log("Public Key: ", publicKey);

    const pkToS = "0x" + Buffer.from(publicKey).toString("hex");
    console.log(pkToS);

    const { token, deepLinkUrl } = await axios
      .post(`https://api.warpcast.com/v2/signer-requests`, {
        publicKey: pkToS,
        name: "Democast",
      })
      .then((response) => response.data.result);

    setDeepLink(deepLinkUrl);
    pollForSigner(token);
  };

  return (
    <>
      <button type="button" onClick={connect}>
        Connect with Warpcast
      </button>
      {deepLink !== "" ? <DeepLinkQRCode deepLinkUrl={deepLink} /> : <></>}
    </>
  );
}
