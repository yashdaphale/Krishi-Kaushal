import mysql.connector
from database import get_db_connection
from services.db_service import get_db

class UserModel:
    @staticmethod
    def create_user(fullname, email, phone, password):
        db = get_db()
        cursor = db.cursor()
        try:
            query = "INSERT INTO users (fullname, email, phone, password) VALUES (%s, %s, %s, %s)"
            cursor.execute(query, (fullname, email, phone, password))
            db.commit()
            return True
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            return False
        finally:
            cursor.close()

    @staticmethod
    def get_user_by_email(email):
        db = get_db()
        cursor = db.cursor(dictionary=True)
        query = "SELECT * FROM users WHERE email = %s"
        cursor.execute(query, (email,))
        user = cursor.fetchone()
        cursor.close()
        return user

    @staticmethod
    def get_user_by_id(user_id): 
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        try:
            query = "SELECT id, fullname, email FROM users WHERE id = %s"
            cursor.execute(query, (user_id,))
            user = cursor.fetchone()
            return user
        finally:
            cursor.close()
            connection.close()
