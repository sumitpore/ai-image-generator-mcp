#!/usr/bin/env node

/**
 * MCP Server for Image Generation with fal.ai and ImageKit Upload
 * 
 * This server provides a tool to generate images using fal.ai's Imagen4 model
 * and automatically upload them to ImageKit for hosting.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import fetch from "node-fetch";
import FormData from "form-data";

// Environment variables
const FAL_KEY = process.env.FAL_KEY;
const IMAGEKIT_PUBLIC_KEY = process.env.IMAGEKIT_PUBLIC_KEY;
const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;

// API endpoints
const FAL_API_URL = "https://fal.run/fal-ai/imagen4/preview/ultra";
const IMAGEKIT_UPLOAD_URL = "https://upload.imagekit.io/api/v1/files/upload";

/**
 * Generates an image using fal.ai's Imagen4 model
 */
async function generateImageWithFal(
  prompt: string,
  aspectRatio: string = "4:3",
  resolution: string = "1K",
  negativePrompt?: string
): Promise<{ imageUrl: string; seed: number }> {
  if (!FAL_KEY) {
    throw new McpError(
      ErrorCode.InvalidRequest,
      "FAL_KEY environment variable is not set"
    );
  }

  const requestBody = {
    prompt,
    aspect_ratio: aspectRatio,
    resolution,
    num_images: 1,
    ...(negativePrompt && { negative_prompt: negativePrompt }),
  };

  try {
    const response = await fetch(FAL_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Key ${FAL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `fal.ai API request failed: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const result = await response.json() as { images: Array<{ url: string }>; seed: number };
    
    if (!result.images || result.images.length === 0) {
      throw new Error("No images returned from fal.ai");
    }

    return {
      imageUrl: result.images[0].url,
      seed: result.seed,
    };
  } catch (error) {
    console.error("Error generating image with fal.ai:", error);
    throw new McpError(
      ErrorCode.InternalError,
      `Failed to generate image: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Downloads an image from a URL and returns it as a Buffer
 */
async function downloadImage(url: string): Promise<Buffer> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error("Error downloading image:", error);
    throw new McpError(
      ErrorCode.InternalError,
      `Failed to download image: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Uploads an image buffer to ImageKit
 */
async function uploadToImageKit(
  imageBuffer: Buffer,
  fileName: string
): Promise<string> {
  if (!IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_PRIVATE_KEY) {
    throw new McpError(
      ErrorCode.InvalidRequest,
      "ImageKit credentials are not set in environment variables"
    );
  }

  const formData = new FormData();
  formData.append("file", imageBuffer, {
    filename: fileName,
    contentType: "image/png",
  });
  formData.append("fileName", fileName);
  formData.append("publicKey", IMAGEKIT_PUBLIC_KEY);
  formData.append("useUniqueFileName", "true");

  try {
    const response = await fetch(IMAGEKIT_UPLOAD_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(IMAGEKIT_PRIVATE_KEY + ":").toString("base64")}`,
        ...formData.getHeaders(),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json() as { message?: string };
      throw new Error(
        `ImageKit upload failed: ${errorData.message || response.statusText}`
      );
    }

    const result = await response.json() as { url: string };
    return result.url;
  } catch (error) {
    console.error("Error uploading to ImageKit:", error);
    throw new McpError(
      ErrorCode.InternalError,
      `Failed to upload to ImageKit: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Main function to generate and upload an image
 */
async function generateAndUploadImage(
  prompt: string,
  negativePrompt?: string,
  resolution?: string
): Promise<{
  imagekitUrl: string;
  falImageUrl: string;
  seed: number;
}> {
  // Step 1: Generate image with fal.ai
  console.error("Generating image with fal.ai...");
  const { imageUrl, seed } = await generateImageWithFal(
    prompt,
    "4:3",
    resolution,
    negativePrompt
  );

  // Step 2: Download the generated image
  console.error("Downloading generated image...");
  const imageBuffer = await downloadImage(imageUrl);

  // Step 3: Upload to ImageKit
  console.error("Uploading to ImageKit...");
  const fileName = `generated-${Date.now()}.png`;
  const imagekitUrl = await uploadToImageKit(imageBuffer, fileName);

  return {
    imagekitUrl,
    falImageUrl: imageUrl,
    seed,
  };
}

// Create and configure the MCP server
const server = new Server(
  {
    name: "image-generator-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "generate_and_upload_image",
        description:
          "Generates an image using fal.ai's Imagen4 model with a 4:3 aspect ratio and uploads it to ImageKit. Returns the ImageKit URL, original fal.ai URL, and the seed used for generation.",
        inputSchema: {
          type: "object",
          properties: {
            prompt: {
              type: "string",
              description: "The text prompt describing the image you want to generate",
            },
            negative_prompt: {
              type: "string",
              description:
                "Optional: Description of what to discourage in the generated image",
            },
            resolution: {
              type: "string",
              description: "Image resolution: '1K' or '2K' (default: '1K')",
              enum: ["1K", "2K"],
            },
          },
          required: ["prompt"],
        },
      },
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name !== "generate_and_upload_image") {
    throw new McpError(
      ErrorCode.MethodNotFound,
      `Unknown tool: ${request.params.name}`
    );
  }

  const { prompt, negative_prompt, resolution } = request.params.arguments as {
    prompt?: string;
    negative_prompt?: string;
    resolution?: string;
  };

  if (!prompt || typeof prompt !== "string") {
    throw new McpError(
      ErrorCode.InvalidParams,
      "Invalid or missing 'prompt' parameter"
    );
  }

  try {
    const result = await generateAndUploadImage(
      prompt,
      negative_prompt,
      resolution || "1K"
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: true,
              imagekitUrl: result.imagekitUrl,
              falImageUrl: result.falImageUrl,
              seed: result.seed,
              message: "Image generated and uploaded successfully!",
            },
            null,
            2
          ),
        },
      ],
    };
  } catch (error) {
    if (error instanceof McpError) {
      throw error;
    }
    throw new McpError(
      ErrorCode.InternalError,
      `Error generating and uploading image: ${error instanceof Error ? error.message : String(error)}`
    );
  }
});

// Start the server
async function main() {
  console.error("Starting Image Generator MCP Server...");
  
  // Validate environment variables
  if (!FAL_KEY) {
    console.error("WARNING: FAL_KEY environment variable is not set");
  }
  if (!IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_PRIVATE_KEY) {
    console.error("WARNING: ImageKit credentials are not set");
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Image Generator MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});

