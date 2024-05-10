import { BlogCard } from "../components/BlogCard";

export const Blogs = () => {
  return (
    <div className="flex justify-center">
      <div className="max-w-xl">
        <BlogCard
          authorName={"Vanshaj Sharma"}
          title={
            "How an ugly single page website makes $5000 a month without affiliate marketting"
          }
          content={
            "How an ugly single page website makes $5000 a month without affiliate marketting"
          }
          publishedDate={"2nd Feb 2024"}
        />

        <BlogCard
          authorName={"Vanshaj Sharma"}
          title={
            "How an ugly single page website makes $5000 a month without affiliate marketting"
          }
          content={
            "How an ugly single page website makes $5000 a month without affiliate marketting"
          }
          publishedDate={"2nd Feb 2024"}
        />

        <BlogCard
          authorName={"Vanshaj Sharma"}
          title={
            "How an ugly single page website makes $5000 a month without affiliate marketting"
          }
          content={
            "How an ugly single page website makes $5000 a month without affiliate marketting"
          }
          publishedDate={"2nd Feb 2024"}
        />
      </div>
    </div>
  );
};
