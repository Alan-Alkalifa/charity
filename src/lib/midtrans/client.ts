import MidtransClient from "midtrans-client";

let _snap: InstanceType<typeof MidtransClient.Snap> | null = null;
let _coreApi: InstanceType<typeof MidtransClient.CoreApi> | null = null;

export function getSnap() {
  if (!_snap) {
    _snap = new MidtransClient.Snap({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
      serverKey: process.env.MIDTRANS_SERVER_KEY!,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
    });
  }
  return _snap;
}

export function getCoreApi() {
  if (!_coreApi) {
    _coreApi = new MidtransClient.CoreApi({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
      serverKey: process.env.MIDTRANS_SERVER_KEY!,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
    });
  }
  return _coreApi;
}
