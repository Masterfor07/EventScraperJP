import requests
import json

# 1. API Endpoint
url = "https://graphql.zaiko.io/graphql"

# 2. Headers to mimic a browser
headers = {
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0",
    "x-zaiko-apikey": "BzDDiXGPc1YQWeW9sJ8VvMxHSxs+e2lmT+iLwGQzN5o="
}

# 3. GraphQL query (paste exactly as it appeared in DevTools)
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

# 4. Your variables from DevTools
variables = {
    "itemGroupId": "popular_events",
    "displayType": "LIST",
    "after": None  # set to None or "" for the first page
}

# 5. Build the payload
payload = {
    "operationName": "ItemGroupScreen",
    "variables": variables,
    "query": query
}

# 6. Send the request
response = requests.post(url, headers=headers, json=payload)
data = response.json()

# 7. Optional: Print raw JSON for debugging
print(json.dumps(data, indent=2))

# 8. Extract event info
events = data["data"]["encoreItemGroup"]["encoreListItems"]["edges"]
print("🎟️ Popular Events:\n")

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
        elif "calendar-icon.svg" in icon_url:
            date = content


    print("🟢 Title:", title)
    print("🟢 Date:", date)
    print("🟢 Location:", location)
    print("🖼️ Image:", node.get("imageUrl"))
    print("🔗 Link:", link)
    print("---")
