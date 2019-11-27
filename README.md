# rToken Analytics

This library provides easy tools for getting data about specific users of rToken. Out of the box you get:

| Feature | Status|Notes |
| --- | --- | --- |
| Subgraph for rSAI on mainnet  | :hammer_and_wrench: | Redeemable single-collateral DAI [deployed subgraph](https://thegraph.com/explorer/subgraph/pi0neerpat/rdai-graph). Recommend do not use for production until completed. |
| Subscribe to rToken data in your DAPP  | :hammer_and_wrench: | See `src/RTokenAnalytics.js`|
| Local subgraph development and testing | :white_check_mark:  | See [Deploying to a local environment](#Deploying-to-a-local-environment)|
| Bring-your-own rToken| :hammer_and_wrench:| See [instructions](#bring-your-own-rtoken) |
| Your suggested feature here | ? | |

## Usage

Current available commands

(Note these will be updated as a subscription service, rather than a single REST call)

#### Initialize

```js
import RTokenAnalytics from 'rtoken-analytics';

const rtokenAnalytics = new RTokenAnalytics(
  interestRate,
  interestTolerance,
  network,
  subgraphID,
  subgraphURL
);
```

|        Args         | Options                                                   | Notes                                                                                                                |
| :-----------------: | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
|   `interestRate`    |                                                           | Current rToken interest rate. See [Get Interest Rate](#get-interest-rate) for details                                |
| `interestTolerance` |                                                           | Todo                                                                                                                 |
|      `network`      |                                                           | "mainnet" is supported only                                                                                          |
|    `subgraphID`     |                                                           | Get the most recent ID on the subgraph page: [mainnet](https://thegraph.com/explorer/subgraph/pi0neerpat/rdai-graph) |
|   `[subgraphURL]`   | optional, default: https://api.thegraph.com/subgraphs/id/ |                                                                                                                      |

## In Development

#### User Stats

Based on your own principal

```js
getTotalInterestGenerated(address, timePeriod);
// Returns all interest accrued within time period no matter where it was sent

getTotalInterestRetained(address, timePeriod);
// Returns all accrued interest retained by the wallet

getTotalInterestSent(address, timePeriod);
// Returns all interest sent to wallets other than the user’s

getAllRecipients(address, timePeriod);
// Returns list of addresses that an address has sent interest to
```

#### Sending / Receiving

Based on external wallets only

```js
getTotalInterestReceivedExternal(address, timePeriod);
// Returns total amount of interest received by an address from all sources
// Excludes interest generated from user’s own wallet

getInterestSentByAddress(addressFrom, addressTo, timePeriod);
// Returns total amount of interest received by an address from a single address

getAllPayers(address, timePeriod);
// Returns list of addresses that have sent any interest to this, and the amounts
```

#### Global

```js
getGlobalInterestGenerated(timePeriod);

getGlobalInterestSent(timePeriod);
```

#### Token Balance Tracking

```js
getTokenBalanceHistoryByAddress(address, timePeriod);
// Returns array of objects for each instance that a address’ rToken balance changes. Object returns:
return {
  // Amount of balance change
  // Transaction Hash
};
```

#### Get Interest Rate

This is the suggested method for obtaining the Compound interest rate

```js
import axios from 'axios';

const COMPOUND_URL = 'https://api.compound.finance/api/v2/ctoken?addresses[]=';
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

console.log(`Compound Rate: ${compoundRateFormatted}%`);
// > Compound Rate: 4.56%

// We recommend saving the rate for quick reference, as the API can be slow.
if (typeof window !== 'undefined') {
  localStorage.setItem('compoundRate', compoundRate);
}
```

## Subgraph

## Usage

TODO

## Bring-your-own rToken



## Deploying to a local environment

> :warning: You probably don't need to do this! If your rToken is deployed to `Mainnet` or `Ropsten`, then you should use the hosted servers provided by The Graph.

The rToken team uses a local subgraph deployment to enable rapid development and testing of the tools provided here. In this section we will do the following:

1. Deploy the `rtoken-analytics` subgraph to a local docker container on your machine.
2. Deploy the contracts to a local Ganache instance.
3. Check that your setup is operating correctly.

### Setup a local subgraph

If you get stuck, see additional instructions from The Graph docs [here](https://thegraph.com/docs/quick-start#local-development).

Install dependencies

```bash
sudo apt install docker
yarn global add truffle ganache-cli @graphprotocol/graph-cli
```

Start running ganache-cli (yes, we need to do this before starting docker)

```bash
ganache-cli -h 0.0.0.0 -m sweet
# The mnemonic ensures addresses stay the same each time ganache starts.
```

Download the `graph-node` Docker instance.

```bash
git clone https://github.com/graphprotocol/graph-node/
cd graph-node/docker
```

If on Linux, run the following script. Note I had problems here, so you may need to troubleshoot by first running `docker-compose create` or `docker-compose up`. If you get a "version" error, update your docker-compose with [these instructions](https://docs.docker.com/compose/install/). If you get an error like `ERROR: could not find an available, non-overlapping IPv4 address...` then take off your tin-foil hat and stop running OpenVPN, or follow [this tutorial](https://stackoverflow.com/questions/45692255/how-make-openvpn-work-with-docker).

```bash
sudo apt install jq docker-compose
./setup.sh
```

Now lets start our subgraph Docker instance.

> Note: Each time you restart ganache, you must first delete the postgres database with `rm -rf data/postgres` in the docker folder.

```bash
docker-compose up
```

Now we must fetch the latest contracts from the `rtoken-contracts` repo, and deploy them to ganache.

```bash
# TODO: check is correct
# TODO: add fetch contract script
yarn deploy_contracts_subgraph
```

You should see the deployed rToken address is `0x68078D223678A257302c9c99F2E4bF4FE8ec7dF3`. Before deploying the subgraph to your docker instance, check that the address in `/subgraph/subgraph.yaml` matches the above.

```bash
cd subgraph
yarn create-local  # Only needs to be run the first time
yarn deploy-local
```

Great job! Now let's make sure things are working properly by doing a sanity check using Postman, or other API tool.

| Property     | value                                                                  |
| ------------ | ---------------------------------------------------------------------- |
| URL          | `http://localhost:8000/subgraphs/name/rtoken-project/rtoken-analytics` |
| Request type | POST                                                                   |
| body         | GraphQL                                                                |

```graphql
query {
  users(first: 5) {
    id
    sentAddressList
    receivedAddressList
  }
}
```

You should get a response like this

```js
{
    "data": {
        "users": [
            {
                "id": "0x1eeee046f7722b0c7f04ecc457dc5cf69f4fba99",
                "receivedAddressList": [
                    "0xbf44e907c4b6583d2cd3d0a0c403403bb44c4a3c",
                    "0xbf44e907c4b6583d2cd3d0a0c403403bb44c4a3c",
                    "0xbf44e907c4b6583d2cd3d0a0c403403bb44c4a3c"
                ],
                "sentAddressList": []
            },
            ...
```

### Testing and restarting

Here are the current steps for re-deploying a subgraph once you've made some changes.

Stop your docker instance, and restart it.

```bash
sudo rm -rf data # optional, use if you see "Error creating the subgraph: subgraph already exists"
docker-compose up
```
Open a new terminal, at the root directory of this repository.

```bash
yarn start_ganache
```

In a new terminal, deploy the contracts and start the automatic re-deployment of a new subgraph, whenever subgraph.yaml is changed.
```bash
yarn start_subgraph
# Leave running
```

In a new terminal, start the test suite
```bash
nodemon -x yarn test_local
```

TODO

## Contributing

Contributions, suggestions, and issues are welcome. At the moment, there are no strict guidelines to follow.
