import json
import os
from pathlib import Path

# Paths
current_dir = Path(__file__).parent
input_file_path = current_dir / "data" / "original" / "fibras_taxonomy.json"
output_file_path = current_dir / "data" / "labels_array.json"

# Read and process the JSON file
try:
    print("Reading taxonomy file...")
    with open(input_file_path, 'r', encoding='utf-8') as file:
        taxonomy_data = json.load(file)
    
    if "labels" not in taxonomy_data:
        print("Error: The labels object was not found in the JSON file")
        exit(1)
    
    # Extract values from the labels structure
    # Structure: labels[lang][roleLabel][conceptId] = label_properties
    labels_array = []
    
    for lang, role_labels in taxonomy_data["labels"].items():
        for role_label, concept_labels in role_labels.items():
            for concept_id, label_props in concept_labels.items():
                # Create entry with the required properties
                entry = {
                    "role": label_props.get("role", ""),
                    "lang": lang,
                    "lab": label_props.get("lab", ""),
                    "conceptId": concept_id,
                    "roleLabel": role_label
                }
                labels_array.append(entry)
    
    # Write the array to a new file
    with open(output_file_path, 'w', encoding='utf-8') as file:
        json.dump(labels_array, file, indent=2, ensure_ascii=False)
    
    print(f"Successfully extracted {len(labels_array)} labels to {output_file_path}")
except Exception as e:
    print(f"Error processing the file: {str(e)}") 