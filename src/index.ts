import { Hono } from "hono";

// Grouping related routes
// step 1: creating sub application
const form = new Hono();

form.get("/", (c) => c.text("form get route"));
form.post("/:id", (c) => {
  const { id } = c.req.param();
  return c.text(id);
});

const app = new Hono();

// middleware
app.use(async (c, next) => {
  console.log("inside middleware");
  await next();
});

// step 2: connect the sub application with the main one
app.route("/form", form);

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
