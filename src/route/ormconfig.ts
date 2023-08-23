

 export const data =  {
    "type": "postgres",
    "host": "dpg-cj90emavvtos73fuer80-a.oregon-postgres.render.com",
    "username": "taskadmin",
    "password": "D5Ja4tbWigITPRG7DRGVdByV5uKBkOcR",
    "port": "5432",
    "database": "task_db_4k5j",
    "ssl": true,
    "extra": {
      "ssl": {
        "rejectUnauthorized": false
      }
    },
    "entities": [
        
        "dist/modules/**/*.js",
      "Users",
      "Project",
      "KanbanColumn",
      "Task",
      "UsersProject",
      "Invitation"
    ],
    "synchronize": true,
    "logging": true
  };