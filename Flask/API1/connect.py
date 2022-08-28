import pandas as pd
import mysql.connector as sql

import mysql.connector

def insertar_lugar(id, aforo, workers):
    connection = sql.connect(host='35.232.19.240', port= '3306', database='hackathon_db', user='spartans-bbva-2', password='1234')
    try:

        mySql_insert_query = f"""UPDATE aforo_test  SET 
                            ID = {id}, customers = {aforo}, fecha= SYSDATE(), workers = {workers} 
                            WHERE ID = {id} """



        cursor = connection.cursor()
        cursor.execute(mySql_insert_query)
        connection.commit()
        print(cursor.rowcount, "Record inserted successfully into aforo_test table")
        cursor.close()

    except mysql.connector.Error as error:
        print("Failed to insert record into Laptop table {}".format(error))

    finally:
        if connection.is_connected():
            connection.close()
            print("MySQL connection is closed")