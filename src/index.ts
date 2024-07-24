import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { env } from "hono/adapter";

const prisma = new PrismaClient().$extends(withAccelerate());
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

app.post("/user/create", async (c) => {
  const { email, name } = await c.req.json();

  try {
    await prisma.user.create({ data: { email, name } });
    return c.json({ status: "successfully created" });
  } catch (error) {
    console.log(error);
    return c.json({ status: "failed" });
  }
});

app.get("/user", async (c) => {
  try {
    const users = await prisma.user.findMany({});
    console.log(users);
    return c.json({ status: "successful" });
  } catch (error) {
    return c.json({ status: "failed" });
  }
});

export default app;
