import os
import re

def delete_numbered_files(folder_path: str):
    pattern = re.compile(r'^[1-9][0-9]{0,2}(\.\w+)?$')  # Matches 1 to 499 with any file extension

    for root, _, files in os.walk(folder_path):
        for file in files:
            if pattern.match(file):
                file_number = int(re.findall(r'^\d+', file)[0])
                if 0 <= file_number <= 499:
                    file_path = os.path.join(root, file)
                    try:
                        os.remove(file_path)
                        print(f"Deleted: {file_path}")
                    except Exception as e:
                        print(f"Failed to delete {file_path}: {e}")


if __name__ == "__main__":
    target_folder = "/home/rtd/Capstone/input/"
    delete_numbered_files(target_folder)
