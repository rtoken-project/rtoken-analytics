const axios = require('axios');
const ethers = require('ethers');
const RTokenAnalytics = require('../src/RTokenAnalytics');
const Registry = require('eth-registry');
var test = require('mocha').describe;

const COMPOUND_URL = 'https://api.compound.finance/api/v2/ctoken?addresses[]=';
const daiCompoundAddress = '0xf5dce57282a584d2746faf1593d3121fcac444dc';

const userA = '0x0006e4548aed4502ec8c844567840ce6ef1013f5';

test('Test RTokenAnalytics', async accounts => {
  let rtokenAnalytics;

  before(async () => {
    const { compoundRate } = await getCompoundRate();
    const interestTolerance = 0;
    const network = 'mainnet';
    const subgraphID = 'QmUvzSkNe6R7po8EfVfCvpqhkreSN9oE1z8XqXzD1bEzr8';

    rtokenAnalytics = new RTokenAnalytics(
      compoundRate,
      interestTolerance,
      network,
      subgraphID
    );
  });

  describe('Test RTokenAnalytics', async () => {
    it('getAllRecipients()', async () => {
      let recipients = rtokenAnalytics.getAllRecipients(userA);
      assert.isOk(recipients, 'no recipients');
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