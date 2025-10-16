# Quick Start Guide

## 1. Get Your API Keys

### fal.ai API Key
1. Go to [https://fal.ai](https://fal.ai) and sign up/login
2. Navigate to [https://fal.ai/dashboard/keys](https://fal.ai/dashboard/keys)
3. Copy your API key

### ImageKit Credentials
1. Go to [https://imagekit.io](https://imagekit.io) and sign up/login
2. Navigate to your [Dashboard](https://imagekit.io/dashboard)
3. Find and copy your:
   - Public Key
   - Private Key

## 2. Configure the MCP Server

### For Cursor

1. Open your Cursor MCP configuration file:
   - **MacOS/Linux**: `~/.config/cursor/mcp.json` or `~/Library/Application Support/Cursor/User/globalStorage/settings/mcp.json`
   - **Windows**: `%APPDATA%\Cursor\User\globalStorage\settings\mcp.json`

2. Add this configuration (replace the placeholder values):

```json
{
  "mcpServers": {
    "image-generator": {
      "command": "node",
      "args": [
        "/Users/sumitpore/Documents/Cursor/image-generator-mcp/dist/index.js"
      ],
      "env": {
        "FAL_KEY": "YOUR_ACTUAL_FAL_API_KEY",
        "IMAGEKIT_PUBLIC_KEY": "YOUR_ACTUAL_IMAGEKIT_PUBLIC_KEY",
        "IMAGEKIT_PRIVATE_KEY": "YOUR_ACTUAL_IMAGEKIT_PRIVATE_KEY"
      }
    }
  }
}
```

3. **Important**: Update the path in `args` if you installed the project in a different location

4. Restart Cursor

### For Claude Desktop

1. Open your Claude Desktop configuration file:
   - **MacOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

2. Add the same configuration as above

3. Restart Claude Desktop

## 3. Test It Out!

Once configured, try these prompts in Cursor or Claude:

### Simple Example
```
Generate an image of a beautiful sunset over the ocean
```

### With Details
```
Generate an image with these details:
- Prompt: A cozy coffee shop interior with warm lighting, wooden furniture, and plants
- Resolution: 2K
```

### With Negative Prompt
```
Generate an image:
- Prompt: A futuristic spaceship interior with advanced technology
- Negative prompt: blurry, low quality, distorted
```

## 4. Understanding the Response

You'll get a JSON response like this:

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
- **`seed`**: Use this to regenerate the same image later

## Troubleshooting

### Server not showing up in Cursor/Claude
1. Check that the path in the config file is correct
2. Verify the file exists: `/Users/sumitpore/Documents/Cursor/image-generator-mcp/dist/index.js`
3. Restart Cursor/Claude completely
4. Check the MCP logs for errors

### Authentication errors
1. Double-check your API keys are correct
2. Ensure there are no extra spaces in the keys
3. Verify your fal.ai account has credits
4. Check your ImageKit account is active

### "Command failed" or "Server error"
1. Make sure Node.js is installed: `node --version`
2. Verify the dependencies are installed: check that `node_modules/` exists
3. Try rebuilding: `cd /Users/sumitpore/Documents/Cursor/image-generator-mcp && npm run build`

## Tips

- **Resolution**: Use "1K" for faster generation, "2K" for higher quality
- **Negative prompts**: Use words like "blurry, low quality, distorted, ugly" to improve results
- **Seed**: Save the seed value if you want to regenerate a similar image
- **Aspect ratio**: All images are generated in 4:3 format

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check out the [fal.ai documentation](https://fal.ai/models/fal-ai/imagen4/preview/ultra) for prompt tips
- Explore [ImageKit features](https://docs.imagekit.io) for image transformations

## Support

If you run into issues:
1. Check the Cursor/Claude MCP logs
2. Verify your API keys and quotas
3. Ensure Node.js version is 18 or higher
4. Review the full README.md for detailed troubleshooting

