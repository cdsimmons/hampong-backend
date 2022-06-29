const { MongoClient, ObjectId } = require('mongodb');

const dbUri = process.env.DB_URI || "mongodb://localhost:27017?useUnifiedTopology=true";

const getDbClient = async () => {
    const client = new MongoClient(dbUri);
    await client.connect();

    return client;
}

const closeDbClient = async () => {
    await client.close();

    return client;
}

exports.getDbClient = getDbClient;
exports.closeDbClient = closeDbClient;