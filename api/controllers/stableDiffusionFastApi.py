# # Install FastAPI and Uvicorn for API server and running the app
# !pip install fastapi uvicorn

# # Install Pydantic for data validation
# !pip install pydantic

# # Install Diffusers library for Stable Diffusion model
# !pip install diffusers

# # Install Hugging Face transformers library (for models)
# !pip install transformers

# # Install PyTorch (install CUDA version if you're using GPU)
# # !pip install torch torchvision
# !pip install --upgrade torch torchvision

# # Install Pillow for image manipulation (saving images, etc.)
# !pip install pillow

# # Install Pyngrok to expose FastAPI server publicly
# !pip install pyngrok

# # Install Hugging Face CLI for model access
# !pip install huggingface_hub

# # Log in to Hugging Face to authenticate
# !huggingface-cli login


# # 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
# !ngrok authtoken 2pCs6qwVYoFRtYq4VRKGRMhNFbe_52Dr7imPCD1yMfdL7pd4U


# from pydantic import BaseModel
# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from diffusers import DiffusionPipeline
# import os
# import base64
# import uvicorn
# import nest_asyncio
# from io import BytesIO
# from pyngrok import ngrok
# import torch
# import logging

# # Set up logging for better error tracing
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# nest_asyncio.apply()
# app = FastAPI()

# # Add CORS middleware to allow your frontend to make requests to this API
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Allows requests from all origins (you can restrict this later)
#     allow_credentials=True,
#     allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
#     allow_headers=["*"],  # Allows all HTTP headers
# )

# # Load the Stable Diffusion XL pipeline and move it to GPU if available
# device = "cuda" if torch.cuda.is_available() else "cpu"
# logger.info(f"Using device: {device}")

# # Load the model from Hugging Face
# try:
#     pipe = DiffusionPipeline.from_pretrained("stabilityai/stable-diffusion-xl-base-1.0")
#     pipe.to(device)
# except Exception as e:
#     logger.error(f"Error loading model: {e}")
#     raise HTTPException(status_code=500, detail="Error loading model")

# # Ensure the directory for saving images exists
# output_dir = "generated_images"
# os.makedirs(output_dir, exist_ok=True)

# # Define the input data model
# class PromptRequest(BaseModel):
#     prompt: str

# @app.post("/generate-image")
# async def generate_image(request: PromptRequest):
#     try:
#         logger.info(f"Received prompt: {request.prompt}")

#         # Generate the image using the Stable Diffusion model
#         generated_images = pipe(request.prompt).images
#         if not generated_images:
#             logger.error("No images were generated")
#             raise HTTPException(status_code=500, detail="Image generation failed, no images produced.")

#         image = generated_images[0]

#         # Save the image locally
#         file_name = f"{request.prompt.replace(' ', '_')[:50]}.png"  # Use a safe filename
#         file_path = os.path.join(output_dir, file_name)
#         image.save(file_path, format="PNG")
#         logger.info(f"Image saved to: {file_path}")

#         # Convert the image to Base64 to send as a response
#         buffered = BytesIO()
#         image.save(buffered, format="PNG")
#         base64_image = base64.b64encode(buffered.getvalue()).decode("utf-8")
#         logger.info("Image converted to Base64 successfully")

#         # Return the Base64 encoded image in the response
#         return {
#             "message": "Image generated successfully",
#             "image": base64_image,  # Base64-encoded image
#         }

#     except Exception as e:
#         logger.error(f"Error occurred during image generation: {str(e)}")
#         raise HTTPException(status_code=500, detail=str(e))

# # Set up ngrok to expose the app
# public_url = ngrok.connect(8000)
# logger.info(f"FastAPI server is running at: {public_url}")
# print(f"FastAPI server is running at: {public_url}")

# # Run the FastAPI app using uvicorn
# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=8000)
