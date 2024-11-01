const { MongoClient } = require("mongodb");
require("dotenv").config();

/**
 * Establishes a connection to the MongoDB cluster.
 * @return {MongoClient|null} client - The MongoClient instance if the connection is successful; otherwise, null.
 */
async function connectToCluster() {
  const client = new MongoClient(process.env.MONGO_CLUSTER_URI);

  try {
    await client.connect();
    console.log("Connected to cluster successfully");
    return client; // Return the client on a successful connection
  } catch (error) {
    console.log("Connection to cluster failed: " + error.message);
    return null; // Return null on failure
  }
}

module.exports = connectToCluster;
