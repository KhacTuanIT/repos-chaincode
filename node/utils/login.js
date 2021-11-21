"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendProposal = void 0;
var jsrsasign_1 = require("jsrsasign");
var elliptic_1 = require("elliptic");
var calculateSignature = function (_a) {
    var privateKeyPEM = _a.privateKeyPEM, proposalDigest = _a.proposalDigest;
    var key = jsrsasign_1.KEYUTIL.getKey(privateKeyPEM);
    var ecdsa = new elliptic_1.ec('p256');
    var signKey = ecdsa.keyFromPrivate(key.prvKeyHex, 'hex');
    var sig = ecdsa.sign(Buffer.from(proposalDigest, 'hex'), signKey);
    var halfOrderSig = preventMalleability(sig, ecdsa);
    var signature = Buffer.from(halfOrderSig.toDER());
    return signature;
};
var preventMalleability = function (sig, ecdsa) {
    var halfOrder = ecdsa.n.shrn(1);
    if (sig.s.cmp(halfOrder) === 1) {
        var bigNum = ecdsa.n;
        sig.s = bigNum.sub(sig.s);
    }
    return sig;
};
exports.sendProposal = function (_a) {
    var client = _a.client, user = _a.user, privateKeyPEM = _a.privateKeyPEM, channel = _a.channel, chaincode = _a.chaincode, fcn = _a.fcn, args = _a.args;
    // create an identity context
    var idx = client.newIdentityContext(user);
    // build the proposal
    var endorsement = channel.newEndorsement(chaincode);
    var build_options = { fcn: fcn, args: args };
    var proposalBytes = endorsement.build(idx, build_options);
    // hash the proposal
    var proposalDigest = user.getCryptoSuite().hash(proposalBytes.toString(), { algorithm: 'SHA2' });
    // calculate the signature
    var signature = calculateSignature({ privateKeyPEM: privateKeyPEM, proposalDigest: proposalDigest });
    // sign the proposal endorsment
    endorsement.sign(signature);
    // send the proposal
    return endorsement.send({ targets: channel.getEndorsers() });
};