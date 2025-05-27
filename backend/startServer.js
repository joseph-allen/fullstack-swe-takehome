const app = require("./server");
const mongoose = require("mongoose");

const port = 4000;
const mongoUri = process.env.MONGODB_URI;

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    // Set the database connection to app.locals for later use
    app.locals.db = mongoose.connection.db;
    app.listen(port, () => {
      console.log(`Express server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
