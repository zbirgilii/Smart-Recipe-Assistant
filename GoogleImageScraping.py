import os
import time
import requests
import io
from PIL import Image
from selenium.webdriver.common.by import By
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options

# Path to the ChromeDriver executable
PATH = "/usr/bin/chromedriver"
service = Service(PATH)

# Chrome options for headless mode (if needed)
chrome_options = Options()
# chrome_options.add_argument("--headless")  # Uncomment to run without opening a browser window
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")

# Initialize the WebDriver
wd = webdriver.Chrome(service=service, options=chrome_options)


def get_images_from_google(wd, query, delay, max_images, min_width=100, min_height=100):
    def scroll_down(wd):
        wd.execute_script("window.scrollBy(0, 1000);")  # Scroll down by 1000 pixels
        time.sleep(delay)

    url = f"https://www.google.com/search?q={query}&tbm=isch"
    wd.get(url)

    image_urls = set()
    last_height = wd.execute_script("return document.body.scrollHeight")
    consecutive_scrolls = 0

    while len(image_urls) < max_images:
        scroll_down(wd)

        # Find all loaded images (whether thumbnails or expanded images)
        images = wd.find_elements(By.CSS_SELECTOR, "img")

        for image in images:
            img_src = image.get_attribute('src')
            try:
                width = int(image.get_attribute('width') or 0)
                height = int(image.get_attribute('height') or 0)
            except ValueError:
                continue  # If width/height is not a valid integer

            # Filter by minimum width and height
            if width >= min_width and height >= min_height and img_src:
                if img_src.startswith("data:image"):  # Skip base64 images
                    continue
                if 'http' in img_src and img_src not in image_urls:
                    print(f"[{query}] Found image URL: {img_src} ({width}x{height})")
                    image_urls.add(img_src)

            if len(image_urls) >= max_images:
                break

        new_height = wd.execute_script("return document.body.scrollHeight")
        if new_height == last_height:
            consecutive_scrolls += 1
            if consecutive_scrolls > 10:
                print(f"[{query}] No more new images to load.")
                break
        else:
            consecutive_scrolls = 0

        last_height = new_height

    return image_urls


from urllib.parse import urlparse  # Make sure to import urlparse


def download_image(download_path, url, file_name):
    try:
        response = requests.get(url, timeout=10)
        if response.status_code != 200:
            print(f"Failed to retrieve image from {url} - Status Code: {response.status_code}")
            return

        # Get the file extension from the URL directly
        parsed_url = urlparse(url)
        _, file_extension = os.path.splitext(parsed_url.path)

        # If no extension is found in the URL, check the Content-Type header
        if not file_extension:
            content_type = response.headers.get('Content-Type', '')
            if 'image/jpeg' in content_type:
                file_extension = '.jpg'
            elif 'image/png' in content_type:
                file_extension = '.png'
            else:
                print(f"Skipping {url} (not a .jpg or .png based on Content-Type)")
                return

        # Ensure that the file_name does not already have an extension
        file_name_without_extension = os.path.splitext(file_name)[0]

        # Check if the file extension is either .jpg, .jpeg, or .png
        if file_extension.lower() not in ['.jpg', '.jpeg', '.png']:
            print(f"Skipping {url} (not a .jpg or .png)")
            return

        image_content = response.content
        image_file = io.BytesIO(image_content)

        try:
            image = Image.open(image_file)
        except Exception as e:
            print(f"Failed to open image from {url} - Error: {e}")
            return

        # Ensure the download folder exists
        if not download_path.endswith("/"):
            download_path += "/"

        # Use the correct file extension
        file_path = os.path.join(download_path, file_name_without_extension + file_extension)

        # Save the image with the correct extension
        with open(file_path, "wb") as f:
            image.save(f, image.format)  # Use the format as per the image's format

        print(f"Success: {file_path}")
    except Exception as e:
        print('FAILED -', e)

def process_folders(parent_folder, max_images=50, delay=1):
    # List all folders in the parent directory
    folders = [name for name in os.listdir(parent_folder) if os.path.isdir(os.path.join(parent_folder, name))]

    for folder in folders:
        search_term = folder  # Use folder name as the search term
        download_folder = os.path.join(parent_folder, folder)
        os.makedirs(download_folder, exist_ok=True)

        print(f"\nStarting search for: {search_term}")

        # Fetch URLs of images for the search term
        urls = get_images_from_google(wd, search_term, delay=delay, max_images=max_images)

        # Download all the images into the corresponding folder
        for i, url in enumerate(urls):
            download_image(download_folder, url, f"{i}.jpg")


# Path to the parent directory containing folders named with search terms
parent_folder = "/home/rtd/Capstone/input/"

# Process all folders in the parent directory
process_folders(parent_folder, max_images=500, delay=1)

# Quit the WebDriver
wd.quit()
