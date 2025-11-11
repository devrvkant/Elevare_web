import express from "express";
// import cors from "cors";
import { config } from "./config/env.js";
import connectToMongoDB from "./lib/mongodb.js";
import careerRouter from "./routes/carrer.routes.js";
import roadmapRouter from "./routes/roadmap.routes.js";

const PORT = config.port || 5500;
const app = express();

// using middlewares
app.use(express.json()); // allow us to parse incoming requests :- req.body
// app.use(
//   cors({
//     origin:
//       config.nodeEnv === "production"
//         ? ["https://zuno.jangir.me"]
//         : [
//             "http://localhost:5173",
//             "https://zuno.jangir.me",
//           ],
//     credentials: true,
//   })
// ); // prevent from CORS errors(allow cross origin access)

// using routes
app.get("/", (req, res) => {
  res.send("Welcome to Elevare Server!");
});
app.use("/api/career", careerRouter);
app.use("/api/roadmap", roadmapRouter);

app.listen(PORT, () => {
  console.log(`Server is running on PORT : ${PORT}`);
  // As soon as the server starts, we can connect to MongoDB
  connectToMongoDB();
});
