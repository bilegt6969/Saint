import QPAY from "@togtokh.dev/qpay";

QPAY.auth
  .TOKEN({
    username: "TEST_MERCHANT",
    password: "123456",
    invoice_code: "TEST_INVOICE",
  })
  .then(async (r) => {
    console.log("Auth Response:", r); // Check if token is received properly
    await QPAY.auth.REFRESH();
    console.log("Refreshed Auth Response:", r);
  })
  .catch((e) => {
    console.log("Error:", e);
  });


  