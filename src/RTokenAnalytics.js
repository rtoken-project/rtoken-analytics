const { execute, makePromise } = require('apollo-link');
const gql = require('graphql-tag');

const fetch = require('node-fetch');
const { createHttpLink } = require('apollo-link-http');
require('babel-polyfill');
const ethers = require('ethers');

const BigNumber = require('bignumber.js');

const { parseUnits, bigNumberify, formatUnits } = ethers.utils;

const DEFAULT_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/id/';
const DEFAULT_SUBGRAPH_ID = 'QmfUZ16H2GBxQ4eULAELDJjjVZcZ36TcDkwhoZ9cjF2WNc';

class RTokenAnalytics {
  constructor(options = {}) {
    this.interestRate = options.interestRate || 0; // Currently unused
    this.interestTolerance = options.interestTolerance || 0; // Currently unused
    const uri = options.subgraphURL || DEFAULT_SUBGRAPH_URL;
    const id = options.subgraphID || DEFAULT_SUBGRAPH_ID;
    this.link = new createHttpLink({
      uri: `${uri}${id}`,
      fetch: fetch
    });
    console.log(uri);
  }

  // USER STATS

  // Returns all interest accrued within time period no matter where it was sent
  getTotalInterestGenerated(address, timePeriod) {
    // TODO:
    return {};
  }

  // Returns all accrued interest retained by the wallet
  //TODO

  // Returns all interest paid to the user
  async getTotalInterestPaid(address, timePeriod) {
    const operation = {
      query: gql`
        query getUser($id: Bytes) {
          user(id: $id) {
            id
            totalInterestPaid
          }
        }
      `,
      variables: { id: address }
    };
    let res = await makePromise(execute(this.link, operation));
    return res.data.user.totalInterestPaid;
  }

  // Returns all interest sent to wallets other than the user’s
  getTotalInterestSent(address, timePeriod) {
    // TODO:
    return {};
  }

  // Returns list of addresses that an address has sent interest to
  async getAllOutgoing(address, timePeriod) {
    const operation = {
      query: gql`
        query getAccount($id: Bytes) {
          account(id: $id) {
            balance
            loansOwned {
              amount
              recipient {
                id
              }
              hat {
                id
              }
              transfers {
                value
                transaction {
                  id
                  timestamp
                  blockNumber
                }
              }
            }
          }
        }
      `,
      variables: { id: address }
    };
    let res = await makePromise(execute(this.link, operation));
    return res.data.account.loansOwned;
  }

  // Returns list of addresses that have sent any interest to this address, and the amounts
  async getAllIncoming(address, timePeriod) {
    const operation = {
      query: gql`
        query getAccount($id: Bytes) {
          account(id: $id) {
            loansReceived {
              amount
              recipient {
                id
              }
              hat {
                id
              }
              transfers {
                value
                transaction {
                  id
                  timestamp
                  blockNumber
                }
              }
            }
          }
        }
      `,
      variables: { id: address }
    };
    let res = await makePromise(execute(this.link, operation));
    return res.data.account.loansReceived;
  }

  // SENDING / RECEIVING

  // Returns total amount of interest received by an address from all sources
  // Excludes interest generated from user’s own wallet
  getTotalInterestReceivedExternal(address, timePeriod) {
    // TODO:
    return {};
  }

  // Returns total amount of interest received by an address from a single address
  async getInterestSent(addressFrom, addressTo, timePeriod) {
    const operation = {
      query: gql`
        query getAccount($from: Bytes) {
          account(id: $from) {
            balance
            loansOwned {
              amount
              recipient {
                id
              }
              hat {
                id
              }
              transfers {
                value
                transaction {
                  id
                  timestamp
                  blockNumber
                }
              }
            }
          }
        }
      `,
      variables: { from: addressFrom, to: addressTo }
    };
    let res = await makePromise(execute(this.link, operation));

    let interestSent = 0;

    res.data.account.loansOwned.forEach(loan => {
      if (loan.recipient.id === addressTo) {
        let value = new BigNumber(0);
        loan.transfers.forEach((transfer, index) => {
          const rate = 0.04;

          // Skip the first transfer
          if (index === 0) {
            value = value.plus(transfer.value);
            return;
          }
          // If this is the final transfer, add interest until current time
          if (index === loan.transfers.length - 1) {
            value = value.plus(transfer.value);

            const start = transfer.transaction.timestamp;
            const date = new Date();
            const now = Math.round(date.getTime() / 1000);

            interestSent += this._calculateInterestOverTime(
              value,
              start,
              now,
              rate
            );
            // console.log('Final ransfer. Current value: ', value.toNumber());
          }

          // Add the accumulated interest between the transfers
          interestSent += this._calculateInterestOverTime(
            value,
            loan.transfers[index - 1].transaction.timestamp,
            transfer.transaction.timestamp,
            rate
          );

          // Add the current transfer value to the running value
          value = value.plus(transfer.value);
        });
      }
    });
    return interestSent;
  }

  _calculateInterestOverTime(value, start, end, startingAPY) {
    const duration = end - start;
    const period = duration / 31557600; // Adjust for APY
    return value * period * startingAPY;
  }

  // GLOBAL
  getGlobalInterestGenerated(timePeriod) {
    // TODO:
    return {};
  }

  getGlobalInterestSent(timePeriod) {
    // TODO:
    return {};
  }

  // TOKEN BALANCE TRACKING
  // Returns array of objects for each instance that a address’ rToken balance changes. Object returns:
  getTokenBalanceHistoryByAddress(address, timePeriod) {
    // TODO
    return {
      // Amount of balance change
      // Transaction Hash
    };
  }
}

module.exports = RTokenAnalytics;
