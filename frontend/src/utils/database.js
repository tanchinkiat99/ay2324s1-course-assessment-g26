// THIS IS ONLY FOR SERVERLESS ENDPOINTS USING NEXTJS
// Util to check if both SQL and MongoDB servers are connected
// Currently, only checks MongoDB question database

let isConnected = false;

// TODO: Add SQL connection here, may split into two different functions if needed
export const connectToDB = async () => {
  if (isConnected) {
    console.log('MongoDB is already connected');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'peerprep',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log('MongoDB is connected');
  } catch (error) {
    console.log(error);
  }
};
