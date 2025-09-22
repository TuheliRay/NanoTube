import React, { useState, useEffect } from "react";
import axios from "axios";

export default function VideoUploader() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all uploaded videos
  const fetchVideos = async () => {
    try {
      const res = await axios.get("http://localhost:3000/videos");
      setVideos(res.data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Handle video upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!videoFile) {
      alert("Please select a video file!");
      return;
    }

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("title", title);
    formData.append("description", description);

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Video uploaded successfully!");
      setTitle("");
      setDescription("");
      setVideoFile(null);
      fetchVideos(); // Refresh the video list
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload video.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <h1 className="text-4xl font-extrabold text-blue-400 mb-8 text-center tracking-wide">
          🎬 Video Uploader
        </h1>

        <form onSubmit={handleUpload} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-1">Video Title</label>
            <input
              id="title"
              type="text"
              placeholder="e.g., My Epic Gaming Montage"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 placeholder-gray-500 text-gray-200"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">Video Description</label>
            <textarea
              id="description"
              placeholder="A brief description of your video's content..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 placeholder-gray-500 text-gray-200 resize-none"
            />
          </div>
          <div>
            <label htmlFor="videoFile" className="block text-sm font-medium text-gray-400 mb-1">Select Video File</label>
            <input
              id="videoFile"
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0])}
              className="w-full text-sm text-gray-400
                       file:mr-5 file:py-2 file:px-6
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-500 file:text-white
                       hover:file:bg-blue-600 transition duration-200
                       cursor-pointer"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold p-3 rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
            disabled={loading || !title || !description || !videoFile}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </div>
            ) : (
              "🚀 Upload Video"
            )}
          </button>
        </form>

        <hr className="my-10 border-t border-gray-700" />

        <h2 className="text-3xl font-bold text-blue-400 mb-6 text-center">
          📼 Uploaded Videos
        </h2>
        {videos.length === 0 ? (
          <p className="text-center text-gray-500">No videos uploaded yet. Get started by uploading one! ✨</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div
                key={video.id}
                className="bg-gray-700 p-5 rounded-lg shadow-xl hover:shadow-2xl transition duration-300 transform hover:scale-105 border border-gray-600"
              >
                <video
                  src={`http://localhost:3000${video.path}`}
                  controls
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="font-bold text-lg text-gray-100 mb-1 truncate">{video.title}</h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{video.description}</p>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Filename: <span className="font-mono text-gray-400">{video.originalName}</span></p>
                  <p>Size: <span className="font-mono text-gray-400">{(video.size / (1024 * 1024)).toFixed(2)} MB</span></p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}