const { MongoClient } = require("mongodb");
const connectToCluster = require("./connection");

async function main() {
  let client = await connectToCluster();

  //  if connected to cluster
  if (client) {
    // const databaseList = await client.db().admin().listDatabases();
    // console.log("databases present in the cluster:");
    // //printing the db name;
    // databaseList.databases.forEach(function (db) {
    //   console.log(db.name);
    // });

    await printCheapestSuburbs(client, "Australia", "Sydney", 5);
  }
}

main();

/**
 *  Print the cheapest suburbs for a given market
 *
 * @param {MongoClient} client - the MongoClient instance that is connected to the cluster
 * @param {string} country  - the country for the given market
 * @param {string} market  - the market you want to search
 * @param {number} maxNumberToDisplay - the maximum number of suburb to print
 */
async function printCheapestSuburbs(
  client,
  country,
  market,
  maxNumberToDisplay
) {
  const pipeline = [
    {
      $match: {
        bedrooms: 1,
        "address.country": country,
        "address.market": market,
        "address.suburb": {
          $exists: 1,
          $ne: "",
        },
        room_type: "Entire home/apt",
      },
    },
    {
      $group: {
        _id: "$address.suburb",
        averagePrice: {
          $avg: "$price",
        },
      },
    },
    {
      $sort: {
        averagePrice: 1,
      },
    },
    {
      $limit: maxNumberToDisplay,
    },
  ];

  const cursor = await client
    .db(process.env.MONGODB)
    .collection(process.env.MONGODB_COLLECTION)
    .aggregate(pipeline);

  const results = await cursor.toArray();

  //print the result
  results.forEach(function (result) {
    console.log(`${result._id}: ${result.averagePrice}`);
  });
}
