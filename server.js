const http = require("http");
const app = require("./index");

const port = process.env.PORT || 5000;
const host = "0.0.0.0"; // <-- Important for Render

const server = http.createServer(app);

server.listen(port, host, () => {
  console.log(`🚀 App is running on http://${host}:${port}`);
});
