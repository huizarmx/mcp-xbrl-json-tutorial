import json
import re
import os
from pathlib import Path

def extract_report_info(filename):
    """Extract report ID, year and quarter from filename."""
    # Remove file extension
    base_name = os.path.splitext(filename)[0]
    
    # Try to extract year and quarter using regex
    # Expected format might be something like "FIBRA_MTY_2023_Q3" or similar
    year_quarter_match = re.search(r'(\d{4})(?:[-_]Q?)?(\d)', base_name)
    
    report_id = base_name
    year = ""
    quarter = ""
    
    if year_quarter_match:
        year = year_quarter_match.group(1)
        quarter = year_quarter_match.group(2)
    
    return report_id, year, quarter

def clean_html_facts(input_file, output_file):
    # Get filename without path
    filename = os.path.basename(input_file)
    report_id, year, quarter = extract_report_info(filename)
    
    # Read the JSON file
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Regular expression to detect HTML content
    html_pattern = re.compile(r'<[^>]+>')
    
    # Create an array for facts without HTML
    cleaned_facts = []
    
    # Iterate through facts and filter out those with HTML or without value property
    for fact_id, fact_data in data.get('facts', {}).items():
        # Check if fact has value property and doesn't contain HTML
        if 'value' in fact_data and not html_pattern.search(str(fact_data.get('value', ''))):
            # Add the fact ID to the fact data
            fact_data['factId'] = fact_id
            
            # Add report information
            fact_data['reportId'] = report_id
            fact_data['year'] = year
            fact_data['quarter'] = quarter
            
            # Check if dimensions.concept exists and contains ":"
            if 'dimensions' in fact_data and 'concept' in fact_data['dimensions']:
                # Replace ":" with "_" in dimensions.concept
                fact_data['dimensions']['concept'] = fact_data['dimensions']['concept'].replace(":", "_")
            
            # Add to the array
            cleaned_facts.append(fact_data)
    
    # Write the array of cleaned facts to a new file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(cleaned_facts, f, ensure_ascii=False, indent=4)
    
    return len(cleaned_facts)

def process_directory(input_dir, output_dir):
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Track total facts processed
    total_facts = 0
    all_facts = []
    
    # Process all JSON files in the input directory
    for filename in os.listdir(input_dir):
        if filename.endswith('.json'):
            input_path = os.path.join(input_dir, filename)
            output_path = os.path.join(output_dir, f'cleaned_{filename}')
            
            print(f'Processing {filename}...')
            fact_count = clean_html_facts(input_path, output_path)
            total_facts += fact_count
            
            # Optionally, we can also create a combined file with all facts
            with open(output_path, 'r', encoding='utf-8') as f:
                file_facts = json.load(f)
                all_facts.extend(file_facts)
            
            print(f'Extracted {fact_count} facts from {filename}')
    
    # Create a combined file with all facts from all reports
    if all_facts:
        combined_output_path = os.path.join(output_dir, 'all_facts.json')
        with open(combined_output_path, 'w', encoding='utf-8') as f:
            json.dump(all_facts, f, ensure_ascii=False, indent=4)
        
        print(f'Created combined file with {total_facts} facts at {combined_output_path}')

if __name__ == '__main__':
    # Process all files in the data/original directory
    process_directory('data/original', 'data') 