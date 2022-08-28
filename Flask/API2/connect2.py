import pandas as pd
import mysql.connector as sql
from math import sqrt
import json
import mysql.connector

def get_bbva(x_me, y_me):

    x_me = float(x_me)
    y_me = float(y_me)
    connection = sql.connect(host='35.232.19.240', port= '3306', database='hackathon_db', user='spartans-bbva-2', password='1234')
    try:

        mycursor = connection.cursor()

        sql_string = """
                    select 
                    A.id as oficina_id,
                    B.oficina_nombre as oficina_nombre,
                    B.oficina_aforo as oficina_aforo,
                    B.oficina_direccion as oficina_direccion,
                    B.distrito as distrito,
                    B.departamento as departamento,
                    B.altitud as altitud,
                    B.longitud as longitud,
                    A.customers as customers,
                    A.workers as workers,
                    A.fecha as fecha
                    from aforo_test as A
                    left join oficinas as B
                    on B.oficina_id=A.id
                        """
        #mycursor.execute("SELECT * FROM oficinas")
        mycursor.execute(sql_string)
        myresult = mycursor.fetchall()


        list_data = []
        for x in myresult:
            altitud = float(x[6])
            longitud = float(x[7])
            distancia = sqrt( (altitud - x_me)**2 +  (longitud - y_me)**2 )
            lista_tupla = list(x)
            lista_tupla.append(distancia)

            list_data.append(lista_tupla)



        df = pd.DataFrame(list_data, columns =['oficina_id', 'oficina_nombre', 'oficina_aforo',
        'oficina_direccion', 'distrito', 'departamento', 'altitud', 'longitud',
        'customers', 'workers', 'fecha', 'distancia'
        ])


        df_dist = df.sort_values(by=['distancia'], ascending=True)
        df_dist = df_dist.head(3)

        df_aforo = df_dist.sort_values(by=['customers'], ascending=True)



        result = df_aforo.to_json(orient="split")
        parsed = json.loads(result)
        data_json = json.dumps(parsed, indent=4)  
        data_json = json.loads(data_json)

        print(type(data_json))


        mycursor.execute("call customer_attendance_sp")


        return data_json


    except mysql.connector.Error as error:
        print("Failed to insert record into Laptop table {}".format(error))

    finally:
        if connection.is_connected():
            connection.close()
            print("MySQL connection is closed")

