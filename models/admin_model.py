import mysql.connector

def get_admin(username):
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password='',
            database='krishi_kaushal',
            port=3307
        )
        cursor = connection.cursor(dictionary=True)
        query = "SELECT * FROM admin WHERE username = %s"
        cursor.execute(query, (username,))
        admin = cursor.fetchone()
        cursor.close()
        connection.close()
        return admin
    except Exception as e:
        print(f"Database error: {e}")
        return None
