import express from "express"
import dotenv from 'dotenv'
dotenv.config()
import   OpenAI  from 'openai'


const app=express()

app.use(express.json())

const openai=new OpenAI({
    apiKey:process.env.OPENAI_API_KEY,

})

console.log(process.env.OPENAI_API_KEY)
app.get("/health",(req,res)=>{
    res.json("Api is currently working!")


})

app.post("/api/generate-image", async (req, res) => {
  try {
    const { prompt } = req.body;
    

    if (typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({
        error: "A valid image prompt is required",
      });
    }

    // Ask the image model to generate an image.
    const result = await openai.images.generate({
      model: "gpt-image-2.5-sunburst",
      prompt: prompt.trim(),
    });

    // The API returns the image as Base64 data.
    const imageBase64 = result.data?.[0]?.b64_json;

    if (!imageBase64) {
      return res.status(502).json({
        error: "No image was returned",
      });
    }

    // Return the image data to the frontend.
    res.json({
      image: `data:image/png;base64,${imageBase64}`,
    });
  } catch (error) {
    console.error("Image generation failed:", error.message);

    res.status(500).json({
      error: "Image generation failed",
    });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Image API server is running");
});