import { Hono } from "hono";

const app = new Hono();

app.get("/welcome", (c) => {
  // return c.body("this is a text message", 200, {
  //   "Content-Type": "text/plain",
  // });

  return c.json({ message: "This is a json message" }, 200);
});

app.post("/user", async (c) => {
  const { username, id } = await c.req.json();

  return c.json({ username, id });
});

export default app;
