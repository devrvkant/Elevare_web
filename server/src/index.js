import express from "express";
import cors from "cors";
import { config } from "./config/env.js";
import connectToMongoDB from "./lib/mongoDB.js";
import careerRouter from "./routes/carrer.routes.js";
import roadmapRouter from "./routes/roadmap.routes.js";
import gapAnalysisRouter from "./routes/gapAnalysis.routes.js";

const PORT = config.port || 5500;
const app = express();

// using middlewares
app.use(express.json()); // allow us to parse incoming requests :- req.body
app.use(
  cors({
    origin:
      config.nodeEnv === "development"
        ? ["http://localhost:5173"]
        : ["https://elevare.jangir.me", "https://elevare-client.onrender.com"],
    credentials: true,
  })
); // prevent from CORS errors(allow cross origin access)

// using routes
app.get("/", (req, res) => {
  res.send("Welcome to Elevare Server!");
});
app.use("/api/career", careerRouter);
app.use("/api/roadmap", roadmapRouter);
app.use("/api/gap-analysis", gapAnalysisRouter);

app.listen(PORT, () => {
  console.log(`Server is running on PORT : ${PORT}`);
  // As soon as the server starts, we can connect to MongoDB
  connectToMongoDB();
});
