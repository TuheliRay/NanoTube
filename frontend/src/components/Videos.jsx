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
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Upload a Video</h1>

      <form onSubmit={handleUpload} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Video Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 border rounded"
        />
        <textarea
          placeholder="Video Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideoFile(e.target.files[0])}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Video"}
        </button>
      </form>

      <hr className="my-6" />

      <h2 className="text-xl font-bold mb-4">Uploaded Videos</h2>
      {videos.length === 0 ? (
        <p>No videos uploaded yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {videos.map((video) => (
            <div
              key={video.id}
              className="border p-4 rounded shadow-sm flex flex-col gap-2"
            >
              <h3 className="font-semibold">{video.title}</h3>
              <p>{video.description}</p>
              <video
                src={`http://localhost:3000/${video.path}`}
                controls
                className="w-full max-h-64"
              />
              <small>Filename: {video.originalName}</small>
              <small>Size: {(video.size / (1024 * 1024)).toFixed(2)} MB</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
