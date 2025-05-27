const app = require("./server");
const mongoose = require("mongoose");
const startPartyStatusUpdater = require("./partyStatusUpdater");

const port = 4000;
const mongoUri = process.env.MONGODB_URI;

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");

    // Expose the database connection for use elsewhere
    app.locals.db = mongoose.connection.db;

    // Start the Express server
    app.listen(port, () => {
      console.log(`Express server running on port ${port}`);
    });

    // Start the background updater to auto-move parties from seated → done
    // This will never stop running, should it be elsewhere?
    startPartyStatusUpdater(mongoose.connection.db);
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
