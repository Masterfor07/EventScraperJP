import requests

url = "https://graphql.zaiko.io/graphql"

headers = {
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0",
    "x-zaiko-apikey": "BzDDiXGPc1YQWeW9sJ8VvMxHSxs+e2lmT+iLwGQzN5o="
}

query = """
query ItemGroupScreen($itemGroupId: ID!, $displayType: EncoreItemDisplayType, $after: String) {
  encoreItemGroup(id: $itemGroupId, displayType: $displayType) {
    id
    title
    ... on EncoreListItemGroup {
      itemImageAspect
      encoreListItems(first: 30, after: $after) {
        edges {
          cursor
          node {
            id
            title
            imageUrl
            action {
              url
            }
            details {
                content
                iconUrl
            }
          }
        }
        pageInfo {
          hasNextPage
          nextCursor
        }
      }
    }
  }
}
"""

after = None  # Initialize after variable for pagination

print("🎟️ Popular Events:\n")
#print(json.dumps(data, indent=2)) #debugging output
while True:
  variables = {
      "itemGroupId": "popular_events",
      "displayType": "LIST",
      "after": after #Starts from the "second" page
  }

  payload = {
      "operationName": "ItemGroupScreen",
      "variables": variables,
      "query": query
  }

  response = requests.post(url, headers=headers, json=payload)
  data = response.json()

  #print(json.dumps(data, indent=2)) #debugging output

  events = data["data"]["encoreItemGroup"]["encoreListItems"]["edges"]
  page_info = data["data"]["encoreItemGroup"]["encoreListItems"]["pageInfo"]
  after = page_info["nextCursor"]
  
  for event_edge in events:
    node = event_edge["node"]
    event = event_edge["node"]
    link = node["action"].get("url")
    title = event.get("title", "No Title")
    details = node.get("details", [])
    location = None
    date = None
    
    for detail in details:
        icon_url = detail.get("iconUrl", "")
        content = detail.get("content", "")
        if "offline-icon.svg" in icon_url:
          location = content
        elif "online-icon.svg" in icon_url and location is None:
          location = content
        elif "calendar-icon.svg" in icon_url:
            date = content
            
    print("Title:", title)
    print("Date:", date)
    print("Location:", location)
    print("Image:", node.get("imageUrl"))
    print("Link:", link)
    print("---")
    
  if not page_info["hasNextPage"]:
        break