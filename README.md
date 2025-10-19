# Fal-AI - ImageKit MCP Server

An MCP (Model Context Protocol) server that generates images using [fal.ai's Imagen4 Ultra model](https://fal.ai/models/fal-ai/imagen4/preview/ultra) and automatically uploads them to [ImageKit](https://imagekit.io) for permanent hosting.

> **Note**: This project integrates Google's Imagen4 Ultra (highest quality image generation) with ImageKit for reliable cloud hosting.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
  - [For Cursor](#for-cursor)
  - [For Claude Desktop](#for-claude-desktop)
- [Quick Start](#quick-start)
- [Usage Examples](#usage-examples)
- [Tool Specification](#tool-specification)
- [Technical Details](#technical-details)
- [Troubleshooting](#troubleshooting)
- [Security](#security)
- [Customization](#customization)
- [API References](#api-references)

## Features

- 🎨 **High-Quality Generation**: Uses Google's Imagen4 Ultra model via fal.ai
- 📤 **Automatic Upload**: Direct upload to ImageKit for permanent hosting
- 🖼️ **Fixed 4:3 Aspect Ratio**: Consistent output perfect for most use cases
- ⚙️ **Configurable Resolution**: Choose between 1K or 2K quality
- 🚫 **Negative Prompts**: Better control over what to exclude from images
- 🌱 **Seed Tracking**: Reproducibility for similar image generation
- 🔒 **Secure**: API keys managed through MCP configuration
- ⚡ **Fast Integration**: Works seamlessly with Cursor and Claude Desktop

## Prerequisites

Before using this MCP server, you need:

### 1. Node.js
- Version 18 or higher
- Check with: `node --version`

### 2. fal.ai API Key
1. Sign up at [fal.ai](https://fal.ai)
2. Navigate to [dashboard/keys](https://fal.ai/dashboard/keys)
3. Copy your API key

### 3. ImageKit Account
1. Sign up at [imagekit.io](https://imagekit.io)
2. Go to your [Dashboard](https://imagekit.io/dashboard)
3. Copy your:
   - Public Key
   - Private Key

## Installation

1. **Clone or download this repository**

2. **Install dependencies**:
   ```bash
   cd /path/to/image-generator-mcp
   npm install
   ```

3. **Build the project**:
   ```bash
   npm run build
   ```

The compiled server will be in the `dist/` directory.

## Configuration

### For Cursor

1. **Locate your MCP configuration file**:
   - **MacOS**: `~/.cursor/mcp.json`
   - **Linux**: `~/.config/cursor/mcp.json`
   - **Windows**: `%APPDATA%\Cursor\mcp.json`

2. **Add the server configuration**:

```json
{
  "mcpServers": {
    "fal-imagekit": {
      "command": "/usr/local/bin/node",
      "args": [
        "/absolute/path/to/image-generator-mcp/dist/index.js"
      ],
      "env": {
        "FAL_KEY": "your_fal_api_key_here",
        "IMAGEKIT_PUBLIC_KEY": "your_imagekit_public_key_here",
        "IMAGEKIT_PRIVATE_KEY": "your_imagekit_private_key_here"
      }
    }
  }
}
```

3. **Important**: 
   - Replace `/absolute/path/to/image-generator-mcp` with your actual installation path
   - Replace all placeholder API keys with your actual credentials
   - If `/usr/local/bin/node` doesn't work, find your Node.js path with `which node` (see [troubleshooting](#spawn-node-enoent-or-command-not-found-error-macoslinux))

4. **Restart Cursor**

### For Claude Desktop

1. **Locate your configuration file**:
   - **MacOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

2. **Add the same configuration** as shown above for Cursor

3. **Restart Claude Desktop**

### Environment Variables Note

The MCP server reads API keys from environment variables that Cursor/Claude passes to it via the `env` section in your configuration. You **don't** need to create a separate `.env` file—everything is configured through the MCP configuration file.

This approach:
- ✅ Keeps credentials secure within your IDE configuration
- ✅ Simplifies setup (one configuration location)
- ✅ Works seamlessly with both Cursor and Claude Desktop
- ✅ No need for additional environment variable management

## Quick Start

Once configured, try this simple test:

```
Generate an image of a cute cat wearing sunglasses
```

You should receive a response like:

```json
{
  "success": true,
  "imagekitUrl": "https://ik.imagekit.io/your-id/generated-1234567890.png",
  "falImageUrl": "https://v3.fal.media/files/...",
  "seed": 42,
  "message": "Image generated and uploaded successfully!"
}
```

- **`imagekitUrl`**: Use this URL - it's permanent and hosted on ImageKit
- **`falImageUrl`**: Original URL from fal.ai (temporary, for reference)
- **`seed`**: Save this to regenerate similar images later

## Usage Examples

### Basic Examples

#### Example 1: Simple Landscape
```
Generate an image of a peaceful mountain landscape with a lake in the foreground
```

#### Example 2: Character Portrait
```
Generate an image of a friendly robot character with big eyes and a smile
```

#### Example 3: Interior Scene
```
Generate an image of a modern minimalist living room with large windows and natural light
```

### Advanced Examples

#### With Negative Prompt
```
Generate an image with these specifications:
- Prompt: A detailed steampunk airship floating above Victorian-era city
- Negative prompt: blurry, low quality, distorted, ugly, cropped
```

#### High Resolution
```
Generate a high-resolution image:
- Prompt: A majestic dragon perched on a mountain peak at dawn
- Resolution: 2K
```

#### Food Photography
```
Generate an image:
- Prompt: A gourmet burger with melted cheese, fresh vegetables, perfectly styled on a wooden board with dramatic lighting
- Negative prompt: artificial, plastic, unappetizing, blurry
- Resolution: 2K
```

#### Abstract Art
```
Generate an image of flowing abstract shapes in vibrant colors, reminiscent of oil painting with bold brushstrokes
```

### Tips for Better Prompts

#### 1. Be Specific
- ❌ **Poor**: "A car"
- ✅ **Good**: "A sleek red sports car on a mountain road at sunset"

#### 2. Include Style References
```
Generate an image of a fantasy castle in the style of watercolor painting with soft colors and dreamy atmosphere
```

#### 3. Use Descriptive Adjectives
```
Generate an image of a cozy coffee shop interior with warm lighting, rustic wooden furniture, hanging plants, and vintage decor
```

#### 4. Specify Lighting
```
Generate an image of a forest path with dappled sunlight filtering through the trees, creating dramatic light and shadow
```

#### 5. Use Negative Prompts Effectively
Common negative prompt terms:
- **Quality issues**: `blurry, low quality, distorted, pixelated, noise`
- **Composition issues**: `cropped, cut off, out of frame, bad framing`
- **Style issues**: `ugly, deformed, disfigured, poor details`
- **Text issues**: `text, watermark, signature, letters`

### Practical Use Cases

#### Blog Post Headers
```
Generate an image of an open book with a warm coffee cup, soft morning light, cozy reading nook atmosphere, perfect for blog header
```

#### Product Mockups
```
Generate an image of a sleek smartphone displaying a colorful app interface, placed on a minimalist desk with soft shadows
```

#### Social Media Content
```
Generate an image for Instagram post:
- Prompt: Flat lay of healthy breakfast bowl with fruits, granola, and yogurt, bright natural lighting, food photography style
- Resolution: 2K
- Negative prompt: unappetizing, artificial, oversaturated
```

#### Presentation Backgrounds
```
Generate an image of abstract geometric patterns in blue and purple gradients, modern and professional, suitable for presentation background
```

### Pro Tips

1. **Aspect Ratio**: All images are 4:3 format (perfect for landscapes, products, hero images, blog headers)
2. **Resolution Choice**:
   - Use **1K** for: Quick previews, social media, web thumbnails
   - Use **2K** for: Hero images, print materials, high-quality displays
3. **Iteration Strategy**:
   - Start with 1K to test your prompt
   - Refine based on results
   - Generate final version in 2K
4. **Save Your Seeds**: If you love an image, note the seed for similar generations later

## Tool Specification

### Tool Name
`generate_and_upload_image`

### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `prompt` | string | Yes | The text description of the image you want to generate |
| `negative_prompt` | string | No | Description of what to avoid in the generated image |
| `resolution` | string | No | Image resolution: "1K" or "2K" (default: "1K") |

### Input Schema
```json
{
  "prompt": "string (required)",
  "negative_prompt": "string (optional)",
  "resolution": "1K | 2K (optional, default: 1K)"
}
```

### Output Schema
```json
{
  "success": true,
  "imagekitUrl": "https://ik.imagekit.io/...",
  "falImageUrl": "https://v3.fal.media/...",
  "seed": 42,
  "message": "Image generated and uploaded successfully!"
}
```

### Response Fields

- **`imagekitUrl`**: Permanent URL where your image is hosted on ImageKit (use this in production)
- **`falImageUrl`**: Original URL from fal.ai (temporary, for reference only)
- **`seed`**: The seed used for generation (useful for reproducing similar images)

## Technical Details

### Architecture

```
User Prompt
    ↓
MCP Tool Call
    ↓
fal.ai API (Generate Image with Imagen4 Ultra)
    ↓
Download Image Buffer
    ↓
ImageKit API (Upload to Cloud Storage)
    ↓
Return URLs + Seed
```

### Image Generation Flow

1. **Generate**: Server calls fal.ai's Imagen4 Ultra API with your prompt
2. **Download**: Generated image is downloaded from fal.ai's temporary storage
3. **Upload**: Image is uploaded to ImageKit for permanent hosting
4. **Return**: Both URLs are returned (ImageKit for production, fal.ai for reference)

### Aspect Ratio

All images are generated with a **4:3 aspect ratio**. This provides a classic, balanced composition suitable for:
- Landscape orientations
- Product photography
- Hero images
- Blog headers
- Marketing materials

### Resolution Options

- **1K**: Faster generation, lower file size (~10-20 seconds)
- **2K**: Higher quality, larger file size (~20-40 seconds)

### Dependencies

- **@modelcontextprotocol/sdk**: MCP server framework
- **node-fetch**: HTTP requests for API calls
- **form-data**: Multipart form data for ImageKit uploads
- **TypeScript**: Full type safety

### Project Structure

```
image-generator-mcp/
├── src/
│   └── index.ts              # Main MCP server implementation
├── dist/                     # Compiled JavaScript
│   ├── index.js             # Executable MCP server
│   ├── index.d.ts           # TypeScript definitions
│   └── *.map                # Source maps
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── .gitignore               # Git ignore rules
├── README.md                # This file
└── mcp-config-example.json  # Configuration example
```

## Troubleshooting

### "FAL_KEY environment variable is not set"
- ✅ Check that you added `FAL_KEY` to the `env` section in your MCP config
- ✅ Ensure there are no typos or extra spaces in the key
- ✅ Restart your IDE after updating the config

### "ImageKit credentials are not set"
- ✅ Verify both `IMAGEKIT_PUBLIC_KEY` and `IMAGEKIT_PRIVATE_KEY` are present
- ✅ Check for any copy-paste errors in the keys
- ✅ Ensure there are no extra spaces

### Server not showing up in Cursor/Claude
- ✅ Confirm the path in `args` is correct and points to `dist/index.js`
- ✅ Verify the file exists and build was successful (`dist/` folder exists)
- ✅ Check that `node_modules/` exists (dependencies installed)
- ✅ Restart your IDE completely
- ✅ Check the MCP logs for errors

### "spawn node ENOENT" or "Command not found" Error (macOS/Linux)

**Symptoms**: Cursor can't detect MCP tools, logs show `spawn node ENOENT` or similar error

**Cause**: Cursor cannot find the `node` command in its PATH environment

**Solution**: Use the full path to Node.js instead of just `node` in your MCP configuration:

```json
{
  "mcpServers": {
    "fal-imagekit": {
      "command": "/usr/local/bin/node",  // Full path instead of "node"
      "args": [
        "/absolute/path/to/image-generator-mcp/dist/index.js"
      ],
      "env": {
        "FAL_KEY": "your_fal_api_key_here",
        "IMAGEKIT_PUBLIC_KEY": "your_imagekit_public_key_here",
        "IMAGEKIT_PRIVATE_KEY": "your_imagekit_private_key_here"
      }
    }
  }
}
```

**To find your Node.js path**:
```bash
which node
```

Common paths:
- `/usr/local/bin/node` (Homebrew on Intel Mac)
- `/opt/homebrew/bin/node` (Homebrew on Apple Silicon)
- `/usr/bin/node` (System installation)
- `~/.nvm/versions/node/vX.X.X/bin/node` (if using nvm)

After updating the config, **restart Cursor completely** (Cmd+Q then reopen)

### "Failed to generate image"
- ✅ Ensure your fal.ai account has sufficient credits ([check here](https://fal.ai/dashboard))
- ✅ Verify your fal.ai API key is valid
- ✅ Check your internet connection
- ✅ Verify the fal.ai service is operational

### "Failed to upload to ImageKit"
- ✅ Verify your ImageKit credentials are correct
- ✅ Check your ImageKit account is active
- ✅ Ensure you haven't exceeded ImageKit's storage or bandwidth limits ([check here](https://imagekit.io/dashboard))

### "Command failed" or "Server error"
- ✅ Make sure Node.js is installed: `node --version` (need v18+)
- ✅ Verify dependencies are installed: check that `node_modules/` exists
- ✅ Try rebuilding: `npm run build`
- ✅ Check MCP server logs in IDE's developer console

### Viewing Logs

MCP servers log to stderr. Check:
- **Cursor**: Developer Tools Console (Help → Toggle Developer Tools)
- **Claude Desktop**: Application logs

### Testing the Server Directly

```bash
# Using MCP Inspector (recommended)
npx @modelcontextprotocol/inspector node dist/index.js

# Or run directly
node dist/index.js
```

## Security

⚠️ **Important**: This server handles sensitive API keys. Follow these security best practices:

### Best Practices

- ✅ **Keep your MCP configuration file secure** and never commit it to version control
- ✅ **Store API keys securely** - they're only in your local IDE configuration
- ✅ **Rotate your API keys regularly** for enhanced security
- ✅ **Monitor usage** on both [fal.ai dashboard](https://fal.ai/dashboard) and [ImageKit dashboard](https://imagekit.io/dashboard)
- ✅ **Set up usage limits** on both platforms to prevent unexpected charges

### How It Works

- API keys are passed via environment variables in your MCP configuration (not hardcoded)
- Private keys are never exposed in client-side code
- ImageKit private key is used for server-side authentication only
- All requests use HTTPS encryption
- The server runs locally on your machine with your credentials

### API Quotas & Limits

#### fal.ai
- Check your credits at: [https://fal.ai/dashboard](https://fal.ai/dashboard)
- Each generation consumes credits
- 2K images cost more than 1K images
- Purchase additional credits as needed

#### ImageKit
- **Free tier**: 20GB storage, 20GB bandwidth/month
- Check limits at: [https://imagekit.io/dashboard](https://imagekit.io/dashboard)
- Upgrade plan if needed for higher limits

## Customization

Want to modify the server? Edit `src/index.ts`:

### Change Aspect Ratio

```typescript
// Around line 56 in src/index.ts
const { imageUrl, seed } = await generateImageWithFal(
  prompt,
  "16:9",  // Change from "4:3" to desired ratio
  resolution,
  negativePrompt
);
```

Available aspect ratios: `1:1`, `16:9`, `9:16`, `3:4`, `4:3`

### Add More Tools

Add new tools in the `ListToolsRequestSchema` handler and implement them in `CallToolRequestSchema`.

### Modify Resolution Options

Update the input schema to add "4K" or other options if supported by fal.ai in the future.

### After Customization

```bash
# Rebuild the project
npm run build

# Restart your IDE to pick up changes
```

## Development

### Running in Development Mode

```bash
npm run dev
```

### Building

```bash
npm run build
```

### Project Scripts

- `npm run build`: Compile TypeScript to JavaScript
- `npm run dev`: Run in development mode with tsx
- `npm start`: Run the compiled server

## API References

- **MCP Protocol**: [https://cursor.com/docs/context/mcp](https://cursor.com/docs/context/mcp)
- **fal.ai Imagen4 Ultra**: [https://fal.ai/models/fal-ai/imagen4/preview/ultra](https://fal.ai/models/fal-ai/imagen4/preview/ultra)
- **ImageKit Upload API**: [https://docs.imagekit.io/api-reference/upload-file-api/server-side-file-upload](https://docs.imagekit.io/api-reference/upload-file-api/server-side-file-upload)
- **Prompt Engineering Guide**: [https://fal.ai/models/fal-ai/imagen4/preview/ultra](https://fal.ai/models/fal-ai/imagen4/preview/ultra)

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

## License

MIT

## Support

For issues related to:
- **This MCP server**: Open an issue in this repository
- **fal.ai API**: Contact [fal.ai support](https://fal.ai)
- **ImageKit**: Contact [ImageKit support](https://imagekit.io/support)
- **MCP Protocol**: Check [MCP documentation](https://cursor.com/docs/context/mcp)

---

**Ready to start generating?** Follow the [Quick Start](#quick-start) guide above! 🎨

**Status**: ✅ Complete and ready to use  
**Version**: 1.0.0  
**Last Updated**: October 16, 2025
