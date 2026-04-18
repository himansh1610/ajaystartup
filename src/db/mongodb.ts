import { Db, MongoClient, MongoClientOptions } from 'mongodb';

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri) {
  throw new Error('Missing MONGODB_URI in environment variables');
}

if (!dbName) {
  throw new Error('Missing MONGODB_DB in environment variables');
}

const options: MongoClientOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
};

const client = new MongoClient(uri, options);

const clientPromise: Promise<MongoClient> =
  globalThis._mongoClientPromise ?? (globalThis._mongoClientPromise = client.connect());

export async function getDb(): Promise<Db> {
  const mongoClient = await clientPromise;
  return mongoClient.db(dbName);
}
