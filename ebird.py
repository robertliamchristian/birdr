import requests
import pandas as pd

def get_bird_species_list(region_code):
    url = f"https://api.ebird.org/v2/product/spplist/{region_code}"
    headers = {
        'X-eBirdApiToken': 'up3ehvbffkft'  # Replace with your eBird API token
    }

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        return response.json()  # Returns the JSON response as a Python dictionary
    else:
        print(f"Failed to retrieve data: {response.status_code}")
        return None

# List of US state codes
us_state_codes = [
    'US-AL', 'US-AK', 'US-AZ', 'US-AR', 'US-CA', 'US-CO', 'US-CT', 'US-DE', 
    'US-FL', 'US-GA', 'US-HI', 'US-ID', 'US-IL', 'US-IN', 'US-IA', 'US-KS', 
    'US-KY', 'US-LA', 'US-ME', 'US-MD', 'US-MA', 'US-MI', 'US-MN', 'US-MS', 
    'US-MO', 'US-MT', 'US-NE', 'US-NV', 'US-NH', 'US-NJ', 'US-NM', 'US-NY', 
    'US-NC', 'US-ND', 'US-OH', 'US-OK', 'US-OR', 'US-PA', 'US-RI', 'US-SC', 
    'US-SD', 'US-TN', 'US-TX', 'US-UT', 'US-VT', 'US-VA', 'US-WA', 'US-WV', 
    'US-WI', 'US-WY'
]

# Initialize a list to collect data
data = []

# Loop over the state codes and make an API call for each state
for state_code in us_state_codes:
    bird_species_list = get_bird_species_list(state_code)
    if bird_species_list is not None:
        for bird in bird_species_list:
            data.append({'region': state_code, 'bird': bird})

# Convert the list to a DataFrame
df = pd.DataFrame(data)

# Export the DataFrame to a CSV file
df.to_csv('bird_species_by_state.csv', index=False)

print("Data exported to bird_species_by_state.csv")
