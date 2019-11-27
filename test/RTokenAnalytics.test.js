const axios = require('axios');
const RTokenAnalytics = require('../src/RTokenAnalytics');
const Registry = require('eth-registry');
var test = require('mocha').describe;
var assert = require('chai').assert;

const BigNumber = require('bignumber.js');

const debug = {
  hardCodeInterestRate: '0.048356383475363732'
  // hardCodeInterestRate: false
};

const COMPOUND_URL = 'https://api.compound.finance/api/v2/ctoken?addresses[]=';
const daiCompoundAddress = '0xf5dce57282a584d2746faf1593d3121fcac444dc';

const userA = '0x0006e4548aed4502ec8c844567840ce6ef1013f5';
const userB = '0x5d7d257d97d8a81f51187a77c6dd226fb8424d90';
const userC = '0xa153b8891e77f1ae037026514c927530d877fab8';

const interestTolerance = 0;
const network = 'mainnet';
const subgraphURL = process.env.SUBGRAPH_URL;
const subgraphID = process.env.SUBGRAPH_ID;
const isLocal = process.env.LOCAL

console.log(subgraphURL);
console.log(subgraphID);
console.log(isLocal);

test('Test RTokenAnalytics', async accounts => {
  let rtokenAnalytics;

  before(async () => {
    let compoundRate = debug.hardCodeInterestRate;
    if (!debug.hardCodeInterestRate) {
      compoundRate = await getCompoundRate();
    }

    rtokenAnalytics = new RTokenAnalytics(
      compoundRate,
      interestTolerance,
      network,
      subgraphID
    );
  });

  it('getAllRecipients()', async () => {
    let recipients = await rtokenAnalytics.getAllRecipients(userA);
    assert.isAbove(recipients.length, 0, 'no recipients were returned');
  });

  it('getAllSenders()', async () => {
    let senders = await rtokenAnalytics.getAllSenders(userB);
    assert.isAbove(senders.length, 0, 'no senders were returned');
  });

  it('getTotalInterestPaid()', async () => {
    let totalInterestPaid = await rtokenAnalytics.getTotalInterestPaid(userC);
    let interest = new BigNumber(totalInterestPaid);
    assert.isOk(interest.isGreaterThan(0), 'no interest has been paid');
  });

  it('getInterestSent()', async () => {
    let totalInterestPaid = await rtokenAnalytics.getInterestSent(userA, userB);
    let interest = new BigNumber(totalInterestPaid);
    assert.isOk(interest.isGreaterThan(0), 'no interest has been paid');
  });
});

const getCompoundRate = async () => {
  try {
    const res = await axios.get(`${COMPOUND_URL}${daiCompoundAddress}`);
    const compoundRate = res.data.cToken[0].supply_rate.value;
    const compoundRateFormatted = Math.round(compoundRate * 10000) / 100;
    console.log(`\nCurrent Compound Rate: ${compoundRateFormatted}%`);
    return {
      compoundRate
    };
  } catch (e) {
    console.log(e.msg);
    return { e };
  }
};
