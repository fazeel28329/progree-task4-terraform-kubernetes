const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Progree Task 4",
    project: "Terraform and Kubernetes Orchestration",
    status: "running",
    hostname: require("os").hostname()
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy"
  });
});


app.get("/load", (req, res) => {
  const end = Date.now() + 500;
  while (Date.now() < end) {
    Math.sqrt(Math.random());
  }
  res.json({ status: "load generated" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Application running on port ${PORT}`);
});
