import json
import os
from pathlib import Path

# Paths
current_dir = Path(__file__).parent
input_file_path = current_dir / "data" / "original" / "fibras_taxonomy.json"
output_file_path = current_dir / "data" / "concepts_array.json"

# Read and process the JSON file
try:
    print("Reading taxonomy file...")
    with open(input_file_path, 'r', encoding='utf-8') as file:
        taxonomy_data = json.load(file)
    
    if "concepts" not in taxonomy_data:
        print("Error: The concepts object was not found in the JSON file")
        exit(1)
    
    # Extract values from the concepts object into an array
    concepts_array = list(taxonomy_data["concepts"].values())
    
    # Write the array to a new file
    with open(output_file_path, 'w', encoding='utf-8') as file:
        json.dump(concepts_array, file, indent=2, ensure_ascii=False)
    
    print(f"Successfully extracted {len(concepts_array)} concepts to {output_file_path}")
except Exception as e:
    print(f"Error processing the file: {str(e)}") 