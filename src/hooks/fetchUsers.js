import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// Link: https://jsonplaceholder.typicode.com/posts

const useFetchUsers = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        fetch("https://jsonplaceholder.typicode.com/posts")
          .then((response) => response.json())
          .then((json) => setData(json));
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { loading, data };
};

export default useFetchUsers;
