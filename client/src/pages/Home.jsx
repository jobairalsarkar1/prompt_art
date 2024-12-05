import { useRef, useState } from "react";
import axios from "axios";
import { GoDownload, GoShare } from "react-icons/go";

const Home = () => {
  const textareaRef = useRef(null);
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [generateing, setGenerating] = useState(false);
  const [shareing, setSharing] = useState(false);

  const handleInput = (e) => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }

    const givenPrompt = e.target.value;
    setPrompt(givenPrompt);
  };

  const generateImage = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return alert("Please Enter a Prompt.");
    setGenerating(true);
    try {
      const payload = {
        prompt: prompt,
        output_format: "webp",
      };
      const response = await axios.postForm(
        `https://api.stability.ai/v2beta/stable-image/generate/ultra`,
        axios.toFormData(payload, new FormData()),
        {
          validateStatus: undefined,
          responseType: "arraybuffer",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_STABILITY_API_KEY}`,
            Accept: "image/*",
          },
        }
      );

      if (response.status == 200) {
        const blob = new Blob([response.data], { type: "image/webp" });
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
      } else {
        throw new Error("Failed to generate image");
      }
    } catch (error) {
      setGenerating(false);
      // alert("Failed to Generate Image.");
      console.log(error);
    } finally {
      setGenerating(false);
    }
  };

  const handleShare = async () => {
    if (!imageUrl || !prompt.trim()) {
      return alert("Please generate an image first!");
    }

    setSharing(true);
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], "generated_image.webp", {
        type: blob.type,
      });

      const formData = new FormData();
      formData.append("image", file);
      formData.append("prompt", prompt);

      const uploadResponse = await axios.post(
        "http://localhost:5000/api/v1/post/upload-img",
        formData
      );

      if (uploadResponse.status === 200) {
        alert("Image shared successfully!");
        console.log("Response:", uploadResponse.data);
      } else {
        alert("Failed to share the image.");
      }
    } catch (error) {
      console.error("Error sharing the image:", error);
      alert("An error occurred while sharing the image.");
    } finally {
      setSharing(false);
    }
  };

  return (
    <section className="max-container font-mono">
      <div className="mt-2 flex flex-col items-center justify-center">
        <h3 className="text-3xl sm:text-4xl font-bold sm:text-center">
          <span className="text-4xl sm:text-5xl bg-gradient-to-r from-green-400 via-sky-400 to-blue-500 text-transparent bg-clip-text">
            PromptArt
          </span>{" "}
          <br />
          Your Personal Image Generator.
        </h3>
      </div>
      <form
        onSubmit={generateImage}
        className="mt-4 sm:mt-5 flex flex-col items-center justify-start sm:justify-center"
      >
        <textarea
          ref={textareaRef}
          name="prompt"
          id="prompt"
          onInput={handleInput}
          placeholder="Ask me what type of image do you want?"
          className="w-full min-h-[40px] border-2 border-gray-300 max-w-lg px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden text-base"
        ></textarea>
        <button
          type="submit"
          className="mt-4 border border-blue-500 px-8 py-2 rounded-lg text-white bg-gradient-to-l from-sky-400 to-blue-500 hover:from-blue-500 hover:to-sky-400"
        >
          {generateing ? "Generating...." : "Generate Image"}
        </button>
      </form>

      <div className="mt-9 flex items-center justify-center relative">
        <div className="w-full max-w-xl h-72 bg-cover rounded-lg border-2 border-gray-300 shadow-lg">
          {imageUrl && (
            <>
              <img
                src={imageUrl}
                // src="https://i.ibb.co.com/8rdBS8L/360-F-814150626-q-Xa4-BWl-Rqs-PFx-PP57-CS6g-IXLEio-FF7-BQ.jpg"
                alt="Generated Image"
                className="w-full h-full object-cover rounded-lg"
              />
              <a
                href={imageUrl}
                download="generated_image.webp"
                className="absolute top-2 left-0 right-0 bottom-0 flex items-start justify-end bg-transparent text-white px-4 py-2 rounded-full opacity-0 hover:opacity-100 transition-opacity"
              >
                <GoDownload className="w-7 h-7" />
              </a>
              <div className="mt-2 w-full flex items-center justify-center">
                <button
                  onClick={handleShare}
                  className="mt-5 px-5 py-2 flex items-center justify-center gap-5 border border-blue-500 rounded-lg text-white bg-gradient-to-l from-sky-400 to-blue-500 hover:from-blue-500 hover:to-sky-400"
                >
                  {shareing ? "Sharing..." : "Share"}
                  <GoShare className="font-bold" />
                </button>
              </div>
            </>
          )}
          {!imageUrl && (
            <img
              src="https://placehold.co/600x400.png"
              // src="https://i.ibb.co.com/8rdBS8L/360-F-814150626-q-Xa4-BWl-Rqs-PFx-PP57-CS6g-IXLEio-FF7-BQ.jpg"
              alt="Placeholder"
              className="w-full h-full object-cover rounded-lg"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Home;
