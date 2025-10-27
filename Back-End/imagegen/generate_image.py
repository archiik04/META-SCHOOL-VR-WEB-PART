import json
import os
import time
import requests
import openai

# Path to JSON file
script_path = "resources/scripts/script.json"
images_output_path = "resources/images/"
os.makedirs(images_output_path, exist_ok=True)

# OpenAI API credentials - Replace with your actual OpenAI API Key
OPENAI_API_KEY = os.getenv("openai_api_key")

# Initialize OpenAI client
client = openai.OpenAI(api_key=OPENAI_API_KEY)

def download_image(url, file_path):
    """
    Download an image from a URL and save it to the specified file path.
    """
    response = requests.get(url)
    if response.status_code == 200:
        with open(file_path, "wb") as f:
            f.write(response.content)
        print(f"Saved: {file_path}")
    else:
        print(f"Failed to download image from {url}")

def generate_openai_image(prompt, num_images=1):
    """
    Generate images using OpenAI DALL-E 3 API.
    """
    try:
        enhanced_prompt = f"High quality realistic image: {prompt}. Professional photography, detailed, clear focus."
        
        response = client.images.generate(
            model="dall-e-3",
            prompt=enhanced_prompt,
            size="1024x1024",
            quality="standard",
            n=num_images,
        )
        
        image_urls = [data.url for data in response.data]
        return image_urls
        
    except Exception as e:
        print(f"OpenAI DALL-E API request failed: {e}")
        return []

def main_generate_images(script_path, images_output_path):
    """
    Main function to process the JSON and generate/download images using OpenAI DALL-E.
    """
    # JSON Decoding Error Handling
    with open(script_path, "r", encoding="utf-8") as file:
        try:
            data = json.load(file)
        except json.JSONDecodeError:
            print("Error reading JSON file.")
            return

    # JSON Key Error Handling
    if "visual_script" not in data:
        print("Missing key 'visual_script' in JSON.")
        return

    # Looping Through the Scenes
    for idx, scene in enumerate(data["visual_script"]):
        try:
            prompt = scene["prompt"]
            timestamp = scene.get("timestamp_start", f"{idx:03d}")
            scene_id = timestamp.replace(":", "-")

            # Generate images using OpenAI DALL-E 3
            print(f"Generating image for prompt: {prompt}")
            image_urls = generate_openai_image(prompt, num_images=1)
            
            if not image_urls:
                print(f"No images generated for prompt: {prompt}")
                continue

            # Use the generated image
            image_url = image_urls[0]
            if not image_url:
                print(f"No suitable image generated for prompt: {prompt}")
                continue

            # Download the generated image
            file_path = os.path.join(images_output_path, f"scene_{scene_id}.jpg")
            download_image(image_url, file_path)

            time.sleep(2)  # Add a delay to avoid hitting API rate limits

        except Exception as e:
            print(f"Error processing scene {idx}: {e}")

    print("Image generation completed.")

# Run the script
if __name__ == "__main__":
    main_generate_images(script_path, images_output_path)