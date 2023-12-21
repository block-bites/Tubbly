const { generateNewAccount, transferFunds, callContractMethod, requestTestnetTokens } = require('./casper_wrapper');

const newAccount = generateNewAccount();
console.log("New Account Details:", newAccount);

// I cannot get this to work, but I'm leaving it here for reference
// You have to use casper-client to request tokens or sent them to your account
/*
requestTestnetTokens(newAccount.publicKey)
  .then(response => console.log('Tokens requested successfully:', response.data))
  .catch(error => console.error('Error:', error));
*/
