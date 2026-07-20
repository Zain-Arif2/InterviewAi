const mongoose = require('mongoose');

async function makeAdmin() {
  await mongoose.connect(process.env.MONGODB_URI);

  const db = mongoose.connection.db;
  const result = await db.collection('users').updateOne(
    { email: 'arifzain2499@gmail.com' },
    { $set: { role: 'admin' } }
  );

  console.log(`Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);

  await mongoose.disconnect();
  process.exit(0);
}

makeAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});