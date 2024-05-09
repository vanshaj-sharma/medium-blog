import { Hono } from "hono";
import { userRouter } from "./routes/user";
import { blogRouter } from "./routes/blogs";
import { cors } from "hono/cors";
const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

app.use("/*", cors());

//proper routing:
app.route("api/v1/user", userRouter);
app.route("api/v1/blog", blogRouter);

//--------------------------------------------------------------------

//--------------------------------------------------------------------
//routes
// app.get("/", (c) => {
//   return c.text("Hello Hono!");
// });

export default app;
