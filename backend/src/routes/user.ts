import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";
import { signinInput, signupInput } from "@vanshajsharma/medium-common";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

userRouter.post("/signup", async (c) => {
  const body = await c.req.json();
  //validation//sanitize the inputs

  const { success } = signupInput.safeParse(body);
  console.log(success);
  if (!success) {
    c.status(411);
    return c.json({
      message: "inputs not correct",
    });
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.username,
        password: body.password,
      },
    });
    console.log(user);
    const token = await sign({ id: user.id }, c.env.JWT_SECRET);

    return c.json({ jwt: token });
  } catch (error) {
    return c.status(403);
  }
  // return c.text("sign up route");
});

userRouter.post("/signin", async (c) => {
  const body = await c.req.json();
  const { success } = signinInput.safeParse(body);
  console.log(success);
  if (!success) {
    c.status(411);
    return c.json({
      message: "inputs not correct",
    });
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const user = await prisma.user.findUnique({
    where: {
      email: body.username,
      password: body.password,
    },
  });

  if (!user) {
    c.status(403);
    return c.json({ error: "Invalid user" });
  }

  const token = await sign({ id: user.id }, c.env.JWT_SECRET);

  return c.json({
    jwt: token,
  });
});

userRouter.use("//getmyinfo", async (c, next) => {
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

//route to get signed in user's name

userRouter.get("/getmyinfo", async (c) => {
  const header = c.req.header("authorization") || "";
  const token = header.split(" ")[1];
  if (!token) {
    c.status(403);
    return c.json({ error: "User not signed in" });
  }
  const payload = await verify(token, c.env.JWT_SECRET);
  if (!payload) {
    c.status(401);
    return c.json({ error: "unauthorized user detected" });
  }
  const userId = payload.id;
  // console.log(userId);

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        name: true,
      },
    });
    return c.json({
      user,
    });
  } catch (error) {
    console.log(error + "Error while retriving data");
  }
});
