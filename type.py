import requests
import pandas as pd

'''url = "https://api.ebird.org/v2/ref/sppgroup/merlin"

headers = {
  'X-eBirdApiToken': 'up3ehvbffkft'
}

response = requests.request("GET", url, headers=headers)

data = response.json()

df = pd.DataFrame(data)

df.to_csv('type.csv', index=False)

print(df)'''



url = "https://api.ebird.org/v2/product/stats/US/"

payload={}
headers = {
  'X-eBirdApiToken': 'up3ehvbffkft'
}

response = requests.request("GET", url, headers=headers, data=payload)

date = response.json()

df = pd.DataFrame(date)

#df.to_csv('type1.csv', index=False)


print(df)



