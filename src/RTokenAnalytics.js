require('babel-polyfill');
const ethers = require('ethers');

const { parseUnits, bigNumberify, formatUnits } = ethers.utils;

class RTokenAnalytics {
  constructor(interestRate, interestTolerance, network, subgraphID) {
    this.interestRate = interestRate;
    this.interestTolerance = interestTolerance;
    this.network = network;
    this.subgraphID = subgraphID;
  }

  // --------------------------
  // Async internal functions
  async get_SOMETHING() {
    return {};
  }

  // --------------------------
  // Synchronous internal functions
  _calculateSomething() {
    return {};
  }
  // --------------------------
  // External functions -  general

  // Estimates principal required to generate a specific annuity (e.g. $1,000 to generate $1/month)
  estimatePrincipalRequired(payout, frequency, [inflationRate]) {
    // TODO
    return {};
  }

  // Estimate amount of rToken that will be generated over specified time period
  estimateFutureInterestGenerated(principal, timePeriod) {
    // TODO:
    return {};
  }

  // TODO: Future value of annuity
  // Gets the estimated total of rToken in the future, when you contribute on a regular basis.

  // TODO: Present value of annuity
  // How much do I need to contribute every year to reach a specific goal?

  // TODO: Present value
  // How much do I need to contribute now, with no additional contributions, to reach a specific goal?

  // TODO: Withdrawal calculator
  // How much do I need to contribute now, with no additonal contributions, to make monthly withdrawal of X for a specific period of time?
  // (Number CAN go down)
  // e.g. $1,000 deposit will allow me to buy a $3 coffee every week for 7 years. At the end of 7 years I will have $0, and will have saved $X

  // --------------------------
  // External functions - TheGraph

  // USER STATS

  // Returns all interest accrued within time period no matter where it was sent
  getTotalInterestGenerated(address, [timePeriod]) {
    // TODO:
    return {};
  }

  // Returns all accrued interest retained by the wallet
  getTotalInterestRetained(address, [timePeriod]) {
    // TODO:
    return {};
  }

  // Returns all interest sent to wallets other than the user’s
  getTotalInterestSent(address, [timePeriod]) {
    // TODO:
    return {};
  }

  // Returns list of addresses that an address has sent interest to
  getAllRecipients(address, [timePeriod]) {
    // TODO:
    return {};
  }

  // SENDING / RECEIVING

  // Returns total amount of interest received by an address from all sources
  // Excludes interest generated from user’s own wallet
  getTotalInterestReceivedExternal(address, [timePeriod]) {
    // TODO:
    return {};
  }

  // Returns total amount of interest received by an address from a single address
  getInterestSentByAddress(addressFrom, addressTo, [timePeriod]) {
    // TODO:
    return {};
  }

  // Returns list of addresses that have sent any interest to this, and the amounts
  getAllPayers(address, [timePeriod]) {
    // TODO:
    return {};
  }

  // GLOBAL
  getGlobalInterestGenerated([timePeriod]) {
    // TODO:
    return {};
  }

  getGlobalInterestSent([timePeriod]) {
    // TODO:
    return {};
  }

  // TOKEN BALANCE TRACKING
  // Returns array of objects for each instance that a address’ rToken balance changes. Object returns:
  getTokenBalanceHistoryByAddress(address, [timePeriod]) {
    // TODO
    return {
      // Amount of balance change
      // Transaction Hash
    };
  }
}

module.exports = RTokenAnalytics;
