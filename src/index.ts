import { Hono } from "hono";
import Route2024 from "./routes/2024";

const app = new Hono();

app.route("/2024", Route2024);

export default app;
