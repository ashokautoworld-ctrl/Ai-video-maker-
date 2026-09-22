const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// JSON data receive करण्यासाठी
app.use(express.json());

// Frontend files serve करणे
app.use(express.static(path.join(__dirname)));

// Test API
app.get("/api/status", (req, res) => {
  res.json({
    success: true,
    message: "AI Video Maker server is running"
  });
});

// Future AI video generation endpoint
app.post("/api/generate", async (req, res) => {

  try {

    const {
      mode,
      input,
      style,
      ratio,
      duration
    } = req.body;

    if (!input) {
      return res.status(400).json({
        success: false,
        message: "Text or lyrics are required"
      });
    }

    /*
      AI VIDEO GENERATION
      -------------------
      Actual AI video API will be connected here later.

      Flow:

      Text/Lyrics
          ↓
      Scene Planning
          ↓
      AI Video Generation
          ↓
      Multiple Clips
          ↓
      FFmpeg Merge
          ↓
      Final MP4
    */

    res.json({
      success: true,
      message: "Project received successfully",
      project: {
        mode,
        style,
        ratio,
        duration
      }
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

});

app.listen(PORT, () => {

  console.log(
    `🎬 AI Video Maker running on port ${PORT}`
  );

});