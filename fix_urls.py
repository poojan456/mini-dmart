import mysql.connector

# Connect to the database
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Pooja@N25",
    database="mini_dmart"
)
cursor = conn.cursor()

# Get all products
cursor.execute("SELECT id, image_url FROM products")
products = cursor.fetchall()

# Clean URLs
for (id, url) in products:
    if url and "wikimedia.org" in url and "/thumb/" in url:
        # Example: https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Red_Apple.jpg/320px-Red_Apple.jpg
        # We want: https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg
        parts = url.split('/')
        # Remove "thumb"
        new_parts = [p for p in parts if p != "thumb"]
        # Remove the last part (the 320px-... part)
        new_url = "/".join(new_parts[:-1])
        
        cursor.execute("UPDATE products SET image_url = %s WHERE id = %s", (new_url, id))

conn.commit()
print("Successfully fixed database URLs!")
