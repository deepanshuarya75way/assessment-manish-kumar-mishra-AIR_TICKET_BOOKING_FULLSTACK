/
  -- src/
     index.js // server
     models/
     controllers/
     middlewares/
     services/
     utils/
     config/
     repository/


     ## Welcome to Flight Search Service
     # project Setup
     --colne the project on your local
     -- execute `npm install`  on the same path  as of your root directory of download project
     --Create a `.env` file in the root directory and add following environment variable
          -PORT=3003
    --inside the 'src/config' folder create a new file `config.json` and then add the following piece of json
    ```
  "development": {
    "username": "root",
    "password": "your_password",
    "database": "Flight_Search_Db_dev",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
  

  ```

  once you have added your db config as listed above, go to the src folder from your terminal and execute `npx sequlize db:create` 
  and then execute
  `npx sequelize db:migrate`
  ```


## DB Design 
  - Airplane table 
  - Flight Table
  - Airport
  - City

  - A Flight belongs to an airplane  but one airplane can be used to multiple flights
  - A city has many airports but one airport belongs to city
  - One Airport can have many flights,but a flight  belongs to one airport


## Tables
### City -> id,name, created_At, Updated_at
### Airport -> id,name,address,city_id,created_at,updated_at
    # Realationship -> City has many airports and Airports belongs to a city (One to many)
 ```
 npx sequelize model:generate --name Airport --attributes
 name:String.address:String.cityid:integer
 ```
    
 