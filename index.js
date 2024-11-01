const connectToCluster = require("./connection");

async function main() {
  let client = await connectToCluster();

  //  if connected to cluster
  if (client) {
    const databaseList = await client.db().admin().listDatabases();
    console.log("databases present in the cluster:");
    //printing the db name;
    databaseList.databases.forEach(function (db) {
      console.log(db.name);
    });
  }
}

main();
