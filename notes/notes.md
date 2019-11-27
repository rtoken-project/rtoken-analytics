### General

Call handlers can subscribe to functions rather than events, but not available on Rinkeby or Ganache (due to lack of Parity tracing API)

### Commands

test if the mapping is correct with

`yarn build`

Generate the output with

`yarn codegen`

## Other tools

sweet set up that generates a subgraph.yaml dynamically with a handlebars template

Oh, it's so you can keep multiple subgraphs on the same git branch
Imagine you want to deploy to both Mainnet and Kovan
What you normally do is either swap the contract addresses and network name just for deployment purposes and then revert, OR you keep different branches
Both solutions are janky and slow down development
With a template, you can run deployments like this:

- yarn run deploy:mainnet
- yarn run deploy:kovan

https://github.com/sablierhq/sablier-subgraph/blob/master/subgraph.template.yaml

Auto-deploy subgraph
https://github.com/sablierhq/sablier-subgraph/blob/master/.github/workflows/deploy.yml

## Deploying to a local environment

> :warning: You probably don't need to do this! If your rToken is deployed to `Mainnet` or `Ropsten`, then you should use the hosted servers provided by The Graph.

The rToken team uses a local subgraph deployment to enable rapid development and testing of the tools provided here. Before continuing, you should be familiar with creating a subgraph and using GraphQL.

In this section we will provide instructions for the following:

1. Deploy the rToken-Analytics subgraph to a local docker container on your machine.
2. Deploy the contracts to a local Ganache instance.
3. Run tests to ensure your setup is complete.

### Set-up:

If you get stuck, see additional instructions from The Graph docs [here](https://thegraph.com/docs/quick-start#local-development).

Install dependencies

```bash
sudo apt install docker
yarn global add truffle ganache-cli @graphprotocol/graph-cli
```

Start running ganache-cli

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

Now lets get things started with

```bash
docker-compose up
```

Now we must fetch the latest contracts from the `rtoken-contracts` repo, and deploy them to ganache.

```bash
# TODO: check is correct
# TODO: add fetch contract script
yarn deploy_contracts_subgraph
```

NOTE: Each time you restart ganache with a fresh network, you must delete the postgres database with `rm -rf data/postgres` in the docker folder.

Deploy the subgraph to your docker instance.

```bash
cd subgraph
yarn create-local  # Only needs to be run the first time
yarn deploy-local
```

Now perform a sanity check in Postman, or other API tool.

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

TODO: add the correct ganache address to the truffle config file in this repo.
Also add the contracts- pull from external or no?

- Add contract to schema.graphql
- Add user address to `test/rtokenAnalytics.test.js`
- add

3. Start

## Discussion on loan tracking with Miao

Question: How much interest (rDAI/DAI, what if it is cDAI) Alice has earned thanks to Bob?

Bob mints 10 rDAI, Alice is one recipient

LoanTransfered(bob → alice, isDistribution = true, 10 DAI, 100 cDAI (10 DAI))

Alice’s account info: 10 rDAI, 100 cDAI (worths 10 DAI)

100 cDAI = 100 cDAI (owed to Bob effectively) + 0 cDAI (owned by Alice fully)

.... eons later ...

Alice’s account info: 10 rDAI, 100 cDAI (worths 11 DAI)

100 cDAI = 91 cDAI (owed to Bob effectively) + 9 cDAI (owned by Alice fully)

… more eons later ...

100 cDAI = 1 cDAI (owed to Bob effectively) + 99 cDAI (owned by Alice fully)

--- Alice earned 1 rDAI from Bob's contribution

Bob redeems 5 rDAI

LoanTransfered(bob ← alice, isDistribution = false, 5 DAI, 45 cDAI );

-5 DAI -45 cDAI

Alice’s account info: 5 rDAI, 55 cDAI (worths 6 DAI)

--- Alice earned (6-5) = 1 rDAI from Bob’s contribution

Bob redeems 10 rDAI

LoanTransfered(bob ← alice, isDistribution = false, 10 DAI, 91 cDAI );

-10 DAI -91 cDAI

Alice’s account info: 0 rDAI, 9 cDAI (worths 1 DAI)

---

From this moment forward, Bob’s contribution to Alice is no longer calculated.

Bob transfers 10 rDAI to Jack, who doesn’t contribute to Alice

LoanTransfered(bob ← alice, isDistribution = false, 10 DAI, 91 cDAI );
LoanTransfered(bob → jack, isDistribution = true, 10 DAI, 91 cDAI );

Alice pays all interest

Alice’s account info: 1 rDAI, 9 cDAI (worths 1 DAI)

Alice redeems all

Alice’s account info: 0 rDAI, 0 cDAI

```

```
