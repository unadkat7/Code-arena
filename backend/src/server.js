import express from "express";
import path from "path";
import cors from "cors";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { serve } from "inngest/express";
import { inngest, functions } from "./lib/inngest.js";

const app = express();
const __dirname = path.resolve();

// -------------------- MIDDLEWARES --------------------
app.use(express.json());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

// -------------------- INNGEST --------------------
app.use("/api/inngest", serve({ client: inngest, functions }));

// -------------------- API ROUTES --------------------
app.get("/health", (req, res) => {
  res.status(200).json({ msg: "api is up and running!" });
});

app.get("/books", (req, res) => {
  res.status(200).json({ msg: "booooookkkksss!" });
});

// -------------------- FRONTEND (PRODUCTION) --------------------
if (ENV.NODE_ENV === "production") {
 const frontendPath = path.join(process.cwd(), "frontend", "dist");

  app.use(express.static(frontendPath));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// -------------------- START SERVER --------------------
const startServer = async () => {
  await connectDB();
  app.listen(ENV.PORT, () =>
    console.log("🚀 Server started on port", ENV.PORT)
  );
};

startServer();



