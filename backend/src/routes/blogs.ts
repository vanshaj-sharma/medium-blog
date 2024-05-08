import { Context, Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";
import { createBlogInput, updateBlogInput } from "@vanshajsharma/medium-common";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

//middleware
blogRouter.use("/*", async (c, next) => {
  //verify header
  const header = c.req.header("authorization") || "";
  const token = header.split(" ")[1];

  try {
    const payload = await verify(token, c.env.JWT_SECRET);
    if (!payload) {
      c.status(401);
      return c.json({ error: "unauthorized" });
    }

    c.set("userId", payload.id);
    await next();
  } catch (error) {
    c.status(403);
    return c.json({ error: "unauthorized user" });
  }
});
///-------------------------------------------

blogRouter.post("/", async (c) => {
  const body = await c.req.json();
  const { success } = createBlogInput.safeParse(body);
  console.log(success);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Blog is not validated",
    });
  }

  const authorId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const post = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: authorId,
    },
  });

  return c.json({
    id: post.id,
  });
});

blogRouter.put("/", async (c) => {
  const body = await c.req.json();
  const { success } = updateBlogInput.safeParse(body);
  console.log(success);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Blog is not validated",
    });
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blog = await prisma.post.update({
      where: {
        id: body.id,
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });

    return c.json({ id: blog.id });
  } catch (err) {
    c.status(403);
    return c.json({ message: err });
  }
});

//Todo : add pagination
//bulk was moved up the chain to allow the api to be caught first
//as the api thought /:id = /bulk, which
//then gives an error as bulk is not an id
blogRouter.get("/bulk", async (c) => {
  // const body = await c.req.json();
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const posts = await prisma.post.findMany();

    return c.json({ posts });
  } catch (err) {
    c.status(411);
    return c.json({ message: "err while fetching blogs" });
  }
});

blogRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blog = await prisma.post.findFirst({
      where: {
        id: id,
      },
    });

    return c.json({ blog });
  } catch (err) {
    c.status(411);
    return c.json({ message: "err while fetching blogs" });
  }
});
