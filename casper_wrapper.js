
const { Keys, CasperClient, DeployUtil, CLPublicKey, RuntimeArgs, CLValueBuilder } = require('casper-js-sdk');

function generateNewAccount() {
    const keyPair = Keys.Ed25519.new(); 
    return {
        publicKey: keyPair.publicKey.toHex(),
        privateKey: keyPair.privateKey.toHex()
    };
}

async function transferFunds(nodeAddress, privateKey, targetPublicKeyHex, amount, fee = 10000, chainName = "casper") {
    const client = new CasperClient(nodeAddress);
    const senderKeyPair = DeployUtil.privateToPublicKey(privateKey);
    const recipientPublicKey = CLPublicKey.fromHex(targetPublicKeyHex);

    const transferDeploy = DeployUtil.makeTransferDeploy(
        new DeployUtil.DeployParams(senderKeyPair, chainName),
        recipientPublicKey,
        amount,
        fee
    );

    transferDeploy.sign(senderKeyPair);

    const deployHash = await client.putDeploy(transferDeploy);

    return deployHash;
}

async function callContractMethod(nodeAddress, privateKey, contractHash, entryPoint, args, chainName = "casper") {
    const client = new CasperClient(nodeAddress);
    const senderKeyPair = DeployUtil.privateToPublicKey(privateKey);

    const deploy = DeployUtil.makeDeploy(
        new DeployUtil.DeployParams(senderKeyPair, chainName),
        DeployUtil.ExecutableDeployItem.newStoredContractByHash(
            Uint8Array.from(Buffer.from(contractHash, 'hex')),
            entryPoint,
            args
        ),
        DeployUtil.standardPayment(10000)
    );

    deploy.sign(senderKeyPair);

    const deployHash = await client.putDeploy(deploy);

    return deployHash;
}

module.exports = { generateNewAccount, transferFunds, callContractMethod };
