import { useParams } from "react-router-dom";
import { FullBlog } from "../components/FullBlog";
import { useBlog, useName } from "../hooks";
import { BlogShowSkeleton } from "../components/BlogShowSkeleton";
import { Appbar } from "../components/Appbar";

export const Blog = () => {
  const { id } = useParams();
  const { loading, blog } = useBlog({
    id: id || "",
  });

  if (loading || !blog) {
    return (
      <div>
        <Appbar name={localStorage.getItem("name") || ""} />
        <BlogShowSkeleton />
      </div>
    );
  }
  return (
    <div>
      <FullBlog name={localStorage.getItem("name") || ""} blog={blog} />
    </div>
  );
};
