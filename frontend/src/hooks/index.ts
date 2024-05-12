import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";

export interface Blog {
  content: string;
  title: string;
  id: string;
  author: {
    name: string;
  };
}

export const useName = () => {
  const [name, setName] = useState<string>("");
  console.log(name);
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/user/getmyinfo`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setName(res.data.user.name);
      });
  }, [name]);
  localStorage.setItem("name", name);
  return {
    name,
  };
};

export const useBlog = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<Blog>();

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/blog/${id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setBlog(response.data.blog);
        setLoading(false);
      });
  }, [id]);
  return {
    loading,
    blog,
  };
};

export const useBlogs = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/blog/bulk`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setBlogs(response.data.posts);
        setLoading(false);
      });
  }, []);
  return {
    loading,
    blogs,
  };
};
