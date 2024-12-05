import { useEffect, useState } from "react";
import axios from "axios";
import { GoDownload } from "react-icons/go";
import { io } from "socket.io-client";

const Store = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const socket = io("https://prompt-art.onrender.com");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          "https://prompt-art.onrender.com/api/v1/post/get-posts"
        );
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
    socket.on("newPost", (newPost) => {
      setPosts((prevPosts) => [newPost, ...prevPosts]); // Add new post to the top of the list
    });

    return () => {
      socket.off("newPost");
    };
  }, [socket]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredPosts = posts.filter((post) =>
    post.prompt.toLowerCase().includes(searchTerm)
  );

  // console.log(filteredPosts);
  const sanitizeFileName = (name) => name.replace(/[/\\?%*:|"<>]/g, "_");

  return (
    <section className="max-container">
      <input
        type="text"
        placeholder="Search with prompt"
        value={searchTerm}
        onChange={handleSearch}
        className="border-2 px-5 py-2 w-full rounded-lg focus:outline-blue-500"
      />
      <div className="mt-5 pb-5 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPosts.map((post) => (
          <div key={post._id} className="rounded-lg relative">
            <img
              src={post.imageUrl}
              alt={post.prompt}
              className="w-full h-64 object-cover rounded-lg transition-all duration-500 ease-in-out filter blur-sm"
              onLoad={(e) => e.target.classList.remove("blur-sm")}
            />
            <a
              href={post.imageUrl}
              download={`${sanitizeFileName(post.prompt)}.webp`}
              className="absolute top-2 left-0 right-0 flex items-start justify-end bg-transparent text-white px-4 py-2 rounded-full opacity-0 hover:opacity-100 transition-opacity"
            >
              <GoDownload className="w-7 h-7" />
            </a>
            <p className="absolute bottom-1 left-1 right-1 flex items-start justify-start bg-transparent text-white px-4 py-2 opacity-0 hover:opacity-100 backdrop-blur-sm transition-opacity font-mono">
              {post.prompt}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Store;
