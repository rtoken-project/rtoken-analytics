# rToken Analytics & API

Using TheGraph ([see deployed subgraph](https://thegraph.com/explorer/subgraph/pi0neerpat/rdai-graph)) and Express to create a REST API.

## Usage

Current available commands

#### Initialize

```js
import RTokenAnalytics from 'rtoken-analytics'

const rtokenAnalytics = new RTokenAnalytics(
  interestRate, interestTolerance, network, subgraphID
)

```

| Args | Options | Notes|
|:---:|---|---|
|`interestRate` | | Current rToken interest rate. See [Get Interest Rate](#get-interest-rate) for details
|`interestTolerance`| | Todo |
| `network` ||  "mainnet" is supported only |
|`subgraphID` | | Get the most recent ID on the subgraph page: [mainnet](https://thegraph.com/explorer/subgraph/pi0neerpat/rdai-graph) |


## In Development

#### General

```js
estimatePrincipalRequired(payout, frequency, [inflationRate]);
// Estimates principal required to generate a specific annuity.

estimateFutureInterestGenerated(principal, timePeriod);
// Estimate amount of rToken that will be generated over specified time period
```

#### User Stats

Based on your own principal

```js
getTotalInterestGenerated(address, [timePeriod]);
// Returns all interest accrued within time period no matter where it was sent

getTotalInterestRetained(address, [timePeriod]);
// Returns all accrued interest retained by the wallet

getTotalInterestSent(address, [timePeriod]);
// Returns all interest sent to wallets other than the user’s

getAllRecipients(address, [timePeriod]);
// Returns list of addresses that an address has sent interest to
```

#### Sending / Receiving

Based on external wallets only

```js
getTotalInterestReceivedExternal(address, [timePeriod]);
// Returns total amount of interest received by an address from all sources
// Excludes interest generated from user’s own wallet

getInterestSentByAddress(addressFrom, addressTo, [timePeriod]);
// Returns total amount of interest received by an address from a single address

getAllPayers(address, [timePeriod]);
// Returns list of addresses that have sent any interest to this, and the amounts
```

#### Global

```js
getGlobalInterestGenerated([timePeriod]);

getGlobalInterestSent([timePeriod]);
```

#### Token Balance Tracking

```js
getTokenBalanceHistoryByAddress(address, [timePeriod]);
// Returns array of objects for each instance that a address’ rToken balance changes. Object returns:
return {
  // Amount of balance change
  // Transaction Hash
};
```

#### Get Interest Rate

This is the suggested method for obtaining the Compound interest rate
```js
import axios from "axios"

const COMPOUND_URL = 'https://api.compound.finance/api/v2/ctoken?addresses[]= ';
const daiCompoundAddress = '0xf5dce57282a584d2746faf1593d3121fcac444dc';

const getCompoundRate = async () => {
  const res = await axios.get(`${COMPOUND_URL}${daiCompoundAddress}`);
  const compoundRate = res.data.cToken[0].supply_rate.value;
  const compoundRateFormatted = Math.round(compoundRate * 10000) / 100;

  return {
    compoundRate,
    compoundRateFormatted
  };
};

// Usage

const { compoundRate, compoundRateFormatted } = await getCompoundRate();

console.log(`Compound Rate: ${compoundRateFormatted}%`)
// > Compound Rate: 4.56%

// We recommend saving the rate for quick reference, as the API can be slow.
if (typeof window !== 'undefined') {
  localStorage.setItem('compoundRate', compoundRate);
}

```

## Subgraph

## Usage

TODO

## Contributing

TODO
