import z from "zod";

export const signupInput = z.object({
  username: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});
//here we are exporting a "type"
export type SingupInput = z.infer<typeof signupInput>;

export const signinInput = z.object({
  username: z.string().email(),
  password: z.string().min(6),
});
//here we are exporting a "type"
export type SinginInput = z.infer<typeof signinInput>;

export const createBlogInput = z.object({
  title: z.string(),
  content: z.string(),
});
//here we are exporting a "type"
export type CreateBlogInput = z.infer<typeof createBlogInput>;

export const updateBlogInput = z.object({
  title: z.string(),
  content: z.string(),
  id: z.string(),
});
//here we are exporting a "type"
export type UpdateBlogInput = z.infer<typeof updateBlogInput>;
