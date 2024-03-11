const express = require("express");
const app = express();
const cors = require("cors");
const secp = require("ethereum-cryptography/secp256k1");
const port = 3042;
const hashMessage = require("./scripts/hashMessage.js");
const { toHex } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const balances = {
  "022847ef386ede02455f372c2f89c052c8e7a1050aa5c75a3855903b7e18007d60": 100,
  "030ae0e9755b90883d92caba44a52916b56b8daedb0071f4d1d27db8b01b17b22e": 50,
  "036e9c3a27df0184a25067a7e49f69886fc4005f14120677eb178b7bf16b87d968": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signMessage, message, privateKey } =
    req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  const senderPublicKey = secp.getPublicKey(privateKey);
  console.log("Sender Public Key : ", senderPublicKey);
  console.log("Sender Private Key : ", privateKey);
  console.log("Sender Message : ", message);
  console.log("Signed Message : ", signedMessage[0]);

  const valid = secp.verify(
    signedMessage,
    hashMessage(message),
    senderPublicKey
  );
  console.log("Is valid transaction ? : ", valid);

  if (valid) {
    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } else {
    res.send("This operation is not allowed");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
