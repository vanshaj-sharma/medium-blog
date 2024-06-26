import { Avatar } from "./BlogCard";
import { Link } from "react-router-dom";

export const Appbar = ({
  publish,
  name,
}: {
  publish?: boolean;
  name?: string;
}) => {
  return (
    <div className="border-b flex justify-between px-10 py-4">
      <Link
        to={`/blogs`}
        className="flex flex-col justify-center cursor-pointer"
      >
        Medium
      </Link>

      <div>
        <Link to={`/`}>
          <button
            type="button"
            className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 "
          >
            Sign Out
          </button>
        </Link>

        {publish === true ? null : (
          <Link to={`/publish`}>
            <button
              type="button"
              className="mr-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700"
            >
              New
            </button>
          </Link>
        )}
        <Avatar size={"big"} name={name ? name[0] : "A"} />
      </div>
    </div>
  );
};
