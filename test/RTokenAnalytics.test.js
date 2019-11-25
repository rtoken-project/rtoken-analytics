const axios = require('axios');
const ethers = require('ethers');
const RTokenAnalytics = require('../src/RTokenAnalytics');
const Registry = require('eth-registry');
var test = require('mocha').describe;
var assert = require('chai').assert;

const debug = {
  hardCodeInterestRate: '0.048356383475363732'
  // hardCodeInterestRate: false
};

const COMPOUND_URL = 'https://api.compound.finance/api/v2/ctoken?addresses[]=';
const daiCompoundAddress = '0xf5dce57282a584d2746faf1593d3121fcac444dc';

const userA = '0x0006e4548aed4502ec8c844567840ce6ef1013f5';
const interestTolerance = 0;
const network = 'mainnet';
const subgraphURL = process.env.SUBGRAPH_URL;
const subgraphID = process.env.SUBGRAPH_ID;

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

  describe('Test RTokenAnalytics', async () => {
    it('getAllRecipients()', async () => {
      let recipients = await rtokenAnalytics.getAllRecipients(userA);
      assert.isAbove(recipients.length, 0, 'no recipients were returned');
    });
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
