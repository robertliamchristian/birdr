import requests
import pandas as pd
from datetime import datetime, timedelta

url = "https://api.ebird.org/v2/data/obs/US/recent"
headers = {
    'X-eBirdApiToken': 'up3ehvbffkft'  # Replace with your eBird API token
}
params = {
    'back': 30  # Number of days back from the current date
}

response = requests.get(url, headers=headers, params=params)

if response.status_code == 200:
    data = response.json()
    # Extract speciesCode and comName
    extracted_data = [{'speciesCode': obs['speciesCode'], 'comName': obs['comName']} for obs in data]

    # Create DataFrame
    df = pd.DataFrame(extracted_data)

    # Drop duplicate rows based on speciesCode
    df_unique = df.drop_duplicates(subset='speciesCode')

    # Export DataFrame to CSV
    df_unique.to_csv('ids_ebird.csv', index=False)

    print(df_unique)
else:
    print("Failed to fetch data:", response.status_code)
