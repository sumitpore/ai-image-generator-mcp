# Usage Examples

## Complete Examples for Using the Image Generator MCP Server

Once you've configured the server in Cursor or Claude Desktop, you can use these example prompts to generate images.

## Basic Examples

### Example 1: Simple Landscape
```
Generate an image of a peaceful mountain landscape with a lake in the foreground
```

**Expected Response:**
```json
{
  "success": true,
  "imagekitUrl": "https://ik.imagekit.io/your-id/generated-1729123456789.png",
  "falImageUrl": "https://v3.fal.media/files/...",
  "seed": 123456,
  "message": "Image generated and uploaded successfully!"
}
```

### Example 2: Character Portrait
```
Generate an image of a friendly robot character with big eyes and a smile
```

### Example 3: Interior Scene
```
Generate an image of a modern minimalist living room with large windows and natural light
```

## Advanced Examples

### Example 4: With Negative Prompt
```
Generate an image with these specifications:
- Prompt: A detailed steampunk airship floating above Victorian-era city
- Negative prompt: blurry, low quality, distorted, ugly, cropped

Use the generate_and_upload_image tool with:
- prompt: "A detailed steampunk airship floating above Victorian-era city"
- negative_prompt: "blurry, low quality, distorted, ugly, cropped"
```

### Example 5: High Resolution
```
Generate a high-resolution image:
- Prompt: A majestic dragon perched on a mountain peak at dawn
- Resolution: 2K

Create a 2K resolution image for maximum quality.
```

### Example 6: Food Photography
```
Generate an image:
- Prompt: A gourmet burger with melted cheese, fresh vegetables, perfectly styled on a wooden board with dramatic lighting
- Negative prompt: artificial, plastic, unappetizing, blurry
- Resolution: 2K
```

### Example 7: Abstract Art
```
Generate an image of flowing abstract shapes in vibrant colors, reminiscent of oil painting with bold brushstrokes
```

### Example 8: Wildlife
```
Generate an image:
- Prompt: A majestic tiger walking through a misty jungle at golden hour, photorealistic style
- Negative prompt: cartoon, animated, low quality
- Resolution: 2K
```

## Tips for Better Prompts

### 1. Be Specific
❌ **Poor**: "A car"
✅ **Good**: "A sleek red sports car on a mountain road at sunset"

### 2. Include Style References
```
Generate an image of a fantasy castle in the style of watercolor painting with soft colors and dreamy atmosphere
```

### 3. Use Descriptive Adjectives
```
Generate an image of a cozy coffee shop interior with warm lighting, rustic wooden furniture, hanging plants, and vintage decor
```

### 4. Specify Lighting
```
Generate an image of a forest path with dappled sunlight filtering through the trees, creating dramatic light and shadow
```

### 5. Use Negative Prompts Effectively
Common negative prompt terms:
- Quality issues: `blurry, low quality, distorted, pixelated, noise`
- Composition issues: `cropped, cut off, out of frame, bad framing`
- Style issues: `ugly, deformed, disfigured, poor details`
- Text issues: `text, watermark, signature, letters`

## Example Workflow in Cursor

### Scenario: Creating a Hero Image for Website

**Step 1**: Generate initial concept
```
Generate an image:
- Prompt: Modern tech startup office with diverse team collaborating, bright and airy space, natural light, professional photography style
- Resolution: 2K
- Negative prompt: blurry, dark, cluttered, unprofessional
```

**Step 2**: Review the response
```json
{
  "success": true,
  "imagekitUrl": "https://ik.imagekit.io/xyz/generated-123.png",
  "seed": 42
}
```

**Step 3**: Use the ImageKit URL in your project
```html
<img src="https://ik.imagekit.io/xyz/generated-123.png" alt="Team collaboration" />
```

**Step 4**: If you want a similar image, note the seed
```
I liked the previous image (seed: 42). Generate another similar one with:
- Prompt: Modern tech startup office from different angle, showing more of the workspace
- Resolution: 2K
```

## Practical Use Cases

### 1. Blog Post Headers
```
Generate an image of an open book with a warm coffee cup, soft morning light, cozy reading nook atmosphere, perfect for blog header
```

### 2. Product Mockups
```
Generate an image of a sleek smartphone displaying a colorful app interface, placed on a minimalist desk with soft shadows
```

### 3. Social Media Content
```
Generate an image for Instagram post:
- Prompt: Flat lay of healthy breakfast bowl with fruits, granola, and yogurt, bright natural lighting, food photography style
- Resolution: 2K
- Negative prompt: unappetizing, artificial, oversaturated
```

### 4. Presentation Backgrounds
```
Generate an image of abstract geometric patterns in blue and purple gradients, modern and professional, suitable for presentation background
```

### 5. Marketing Materials
```
Generate an image:
- Prompt: Happy diverse group of people using technology in a modern urban setting, lifestyle photography, authentic and relatable
- Resolution: 2K
- Negative prompt: staged, stock photo look, fake smiles, low quality
```

## Testing the Server

### Quick Test Command
```
Generate an image of a cute cat wearing sunglasses
```

This simple prompt should work immediately and help you verify:
- ✅ Server is connected
- ✅ fal.ai API key is valid
- ✅ ImageKit credentials work
- ✅ Image generation and upload pipeline functions

### Expected Test Duration
- 1K resolution: ~10-20 seconds
- 2K resolution: ~20-40 seconds

## Understanding Responses

### Success Response
```json
{
  "success": true,
  "imagekitUrl": "https://ik.imagekit.io/your-id/generated-1729123456789.png",
  "falImageUrl": "https://v3.fal.media/files/panda/xyz.png",
  "seed": 123456,
  "message": "Image generated and uploaded successfully!"
}
```

**What to use:**
- `imagekitUrl`: **Use this URL** - it's permanent and reliable
- `falImageUrl`: For reference only - this URL is temporary
- `seed`: Save this if you want to try generating similar images

### Error Response
```json
{
  "error": "Failed to generate image: API key is invalid"
}
```

Common errors:
- `FAL_KEY environment variable is not set`: Add your fal.ai API key
- `ImageKit credentials are not set`: Add your ImageKit keys
- `Failed to generate image: insufficient credits`: Add credits to your fal.ai account
- `ImageKit upload failed`: Check your ImageKit quota and credentials

## Pro Tips

### 1. Aspect Ratio is Fixed at 4:3
All images are generated in 4:3 format. This works well for:
- Landscape orientations
- Product shots
- Hero images
- Blog headers

### 2. Resolution Choice
- **Use 1K for**: Quick previews, social media, web thumbnails
- **Use 2K for**: Hero images, print materials, high-quality displays

### 3. Iteration Strategy
1. Start with 1K to test your prompt
2. Refine the prompt based on results
3. Generate final version in 2K

### 4. Prompt Engineering
- Start with the subject
- Add style descriptors
- Include lighting information
- Specify atmosphere/mood
- Use negative prompts to avoid unwanted elements

### 5. Save Your Seeds
If you generate an image you love, save the seed value. You can reference it later:
```
The image with seed 123456 was great. Generate something similar but with different lighting.
```

## Batch Generation

To generate multiple images, make separate requests:

```
Generate 3 different images:
1. A sunrise over mountains
2. A sunset over the ocean  
3. A midday scene in a forest

Use 1K resolution for quick generation.
```

## Integration Examples

### In HTML
```html
<img 
  src="https://ik.imagekit.io/your-id/generated-123.png"
  alt="Generated landscape"
  width="800"
  height="600"
/>
```

### In React
```jsx
<img
  src={result.imagekitUrl}
  alt="AI generated image"
  className="hero-image"
/>
```

### In Markdown
```markdown
![AI Generated Image](https://ik.imagekit.io/your-id/generated-123.png)
```

## Need Help?

If your generations aren't turning out as expected:

1. **Refine your prompt**: Add more specific details
2. **Use negative prompts**: Exclude unwanted elements
3. **Try different wording**: Sometimes rephrasing helps
4. **Check examples**: Look at fal.ai's example prompts for inspiration
5. **Start simple**: Test with basic prompts first, then add complexity

## Resources

- [Prompt Engineering Guide](https://fal.ai/models/fal-ai/imagen4/preview/ultra)
- [ImageKit Transformations](https://docs.imagekit.io/features/image-transformations)
- [MCP Documentation](https://cursor.com/docs/context/mcp)

---

**Ready to start generating?** Try the quick test command above! 🎨

