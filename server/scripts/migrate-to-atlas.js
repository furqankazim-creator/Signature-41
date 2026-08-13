import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const LOCAL_URI = process.env.LOCAL_MONGODB_URI || 'mongodb://127.0.0.1:27017/signature41';
const ATLAS_URI = process.env.MONGODB_URI || 'mongodb+srv://furqankazim6_db_user:tn41Ws3hIxLm58Nb@cluster0.fyatvvb.mongodb.net/signature41?retryWrites=true&w=majority';

async function main() {
  console.log('Connecting to local MongoDB...');
  const localClient = new MongoClient(LOCAL_URI, { serverSelectionTimeoutMS: 15000 });
  await localClient.connect();

  console.log('Connecting to Atlas MongoDB...');
  const atlasClient = new MongoClient(ATLAS_URI, { serverSelectionTimeoutMS: 15000 });
  await atlasClient.connect();

  const localDb = localClient.db();
  const atlasDb = atlasClient.db();

  const collections = await localDb.listCollections({}, { nameOnly: true }).toArray();

  for (const { name } of collections) {
    const sourceCollection = localDb.collection(name);
    const targetCollection = atlasDb.collection(name);

    const docs = await sourceCollection.find({}).toArray();
    const beforeCount = await targetCollection.countDocuments();

    if (beforeCount > 0) {
      await targetCollection.deleteMany({});
    }

    if (docs.length > 0) {
      await targetCollection.insertMany(docs);
    }

    const afterCount = await targetCollection.countDocuments();
    console.log(`${name}: ${docs.length} documents copied into Atlas. Atlas now has ${afterCount} documents.`);
  }

  console.log('Migration complete.');

  await localClient.close();
  await atlasClient.close();
}

main().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
