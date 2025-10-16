# Image Generator MCP Server

An MCP (Model Context Protocol) server that generates images using [fal.ai's Imagen4 Ultra model](https://fal.ai/models/fal-ai/imagen4/preview/ultra) and automatically uploads them to [ImageKit](https://imagekit.io) for hosting.

## Features

- 🎨 Generate high-quality images using Google's Imagen4 Ultra model
- 📤 Automatic upload to ImageKit for reliable hosting
- 🖼️ Fixed 4:3 aspect ratio for consistent output
- ⚙️ Configurable resolution (1K or 2K)
- 🚫 Optional negative prompts for better control
- 🌱 Seed tracking for reproducibility

## Prerequisites

Before using this MCP server, you need:

1. **fal.ai API Key**
   - Sign up at [fal.ai](https://fal.ai)
   - Get your API key from the [dashboard](https://fal.ai/dashboard/keys)

2. **ImageKit Account**
   - Sign up at [imagekit.io](https://imagekit.io)
   - Get your public and private keys from the [dashboard](https://imagekit.io/dashboard)

## Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` and add your credentials:
   ```env
   FAL_KEY=your_fal_api_key_here
   IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   ```

5. Build the project:
   ```bash
   npm run build
   ```

## Configuration

### Adding to Cursor

Add this server to your Cursor MCP configuration file:

**MacOS/Linux**: `~/.config/cursor/mcp.json` or `~/Library/Application Support/Cursor/User/globalStorage/settings/mcp.json`

**Windows**: `%APPDATA%\Cursor\User\globalStorage\settings\mcp.json`

```json
{
  "mcpServers": {
    "image-generator": {
      "command": "node",
      "args": ["/absolute/path/to/image-generator-mcp/dist/index.js"],
      "env": {
        "FAL_KEY": "your_fal_api_key",
        "IMAGEKIT_PUBLIC_KEY": "your_imagekit_public_key",
        "IMAGEKIT_PRIVATE_KEY": "your_imagekit_private_key"
      }
    }
  }
}
```

Replace `/absolute/path/to/image-generator-mcp` with the actual path to this project.

### Adding to Claude Desktop

Edit your Claude Desktop configuration file:

**MacOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "image-generator": {
      "command": "node",
      "args": ["/absolute/path/to/image-generator-mcp/dist/index.js"],
      "env": {
        "FAL_KEY": "your_fal_api_key",
        "IMAGEKIT_PUBLIC_KEY": "your_imagekit_public_key",
        "IMAGEKIT_PRIVATE_KEY": "your_imagekit_private_key"
      }
    }
  }
}
```

## Usage

Once configured, you can use the `generate_and_upload_image` tool in Cursor or Claude Desktop:

### Example Prompts

**Basic usage:**
```
Generate an image of a serene mountain landscape at sunset
```

**With negative prompt:**
```
Generate an image of a futuristic city with the following specs:
- Prompt: A bustling futuristic city with flying cars and neon lights
- Negative prompt: blur, low quality, distorted, ugly
```

**With specific resolution:**
```
Generate a 2K image of a cute robot playing with a kitten
```

### Tool Parameters

The `generate_and_upload_image` tool accepts:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `prompt` | string | Yes | The text description of the image you want to generate |
| `negative_prompt` | string | No | Description of what to avoid in the generated image |
| `resolution` | string | No | Image resolution: "1K" or "2K" (default: "1K") |

### Response

The tool returns a JSON object containing:

```json
{
  "success": true,
  "imagekitUrl": "https://ik.imagekit.io/your-id/generated-1234567890.png",
  "falImageUrl": "https://v3.fal.media/files/...",
  "seed": 42,
  "message": "Image generated and uploaded successfully!"
}
```

- `imagekitUrl`: The permanent URL where your image is hosted on ImageKit
- `falImageUrl`: The original URL from fal.ai (temporary)
- `seed`: The seed used for generation (useful for reproducing the same image)

## Development

### Running in Development Mode

```bash
npm run dev
```

### Building

```bash
npm run build
```

### Testing the Server

You can test the server using the MCP Inspector tool:

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

## Technical Details

### Image Generation Flow

1. **Generate**: The server calls fal.ai's Imagen4 Ultra API with your prompt
2. **Download**: The generated image is downloaded from fal.ai's temporary storage
3. **Upload**: The image is uploaded to ImageKit for permanent hosting
4. **Return**: Both URLs are returned (ImageKit for production use, fal.ai for reference)

### Aspect Ratio

All images are generated with a **4:3 aspect ratio** as specified in the requirements. This provides a classic, balanced composition suitable for most use cases.

### Resolution Options

- **1K**: Faster generation, lower file size
- **2K**: Higher quality, larger file size, takes longer to generate

## Troubleshooting

### "FAL_KEY environment variable is not set"

Make sure you've:
1. Created a `.env` file with your API key
2. Added the `FAL_KEY` to your MCP configuration's `env` section

### "ImageKit credentials are not set"

Ensure both `IMAGEKIT_PUBLIC_KEY` and `IMAGEKIT_PRIVATE_KEY` are properly configured in your environment variables.

### "Failed to generate image"

Check that:
- Your fal.ai API key is valid and has credits
- Your internet connection is working
- The fal.ai service is operational

### "Failed to upload to ImageKit"

Verify that:
- Your ImageKit credentials are correct
- Your ImageKit account is active
- You haven't exceeded ImageKit's storage or bandwidth limits

## Security Notes

⚠️ **Important**: This server handles API keys via environment variables. Make sure to:
- Never commit your `.env` file to version control
- Use environment variables in production
- Rotate your API keys regularly
- Monitor your usage on both fal.ai and ImageKit dashboards

## API References

- [fal.ai Imagen4 Ultra Documentation](https://fal.ai/models/fal-ai/imagen4/preview/ultra)
- [ImageKit Upload API Documentation](https://docs.imagekit.io/api-reference/upload-file-api/server-side-file-upload)
- [MCP Documentation](https://cursor.com/docs/context/mcp)

## License

MIT

## Support

For issues related to:
- **This MCP server**: Open an issue in this repository
- **fal.ai API**: Contact [fal.ai support](https://fal.ai)
- **ImageKit**: Contact [ImageKit support](https://imagekit.io/support)
- **MCP Protocol**: Check [MCP documentation](https://cursor.com/docs/context/mcp)

