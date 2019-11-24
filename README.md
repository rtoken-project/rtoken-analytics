# rToken Analytics & API

Using TheGraph ([see deployed subgraph](https://thegraph.com/explorer/subgraph/pi0neerpat/rdai-graph)) and Express to create a REST API.

## API

Current available commands

#### Constructor

```js
constructor(interestRate, interestTolerance, network, subGraphID);
```

| Args | Options | Notes|
|:---:|---|---|
|`interestRate` | | current interest rate. You can use `getInterestRate()` to get this.
|`interestTolerance`| | Todo |
| `network` ||  "mainnet" is supported only |
|`subgraphID` | | Get the latest ID on the subgraph page [here](https://thegraph.com/explorer/subgraph/pi0neerpat/rdai-graph) |


## In Development

#### General

```js
getInterestRate();
// Returns the current interest rate from Compound

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

## Subgraph

## Usage

TODO

## Contributing

TODO
