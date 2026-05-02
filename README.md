# course-companion
Developed a web application for instructors and students to  Deployed Node.js and Express to handle routing, authentication, and user interaction. Mapped API endpoints to MySQL database to store user information and integrate CRUD operations. Built a responsive user interface using HTML, CSS, and JavaScript. 


## App Description

- Account sign up, sign in, and sign out with Express authentication
- Route-handling with Node.js
- Create, edit, delete, and view
- Dashboard summaries, recent transactions, and spending-by-category chart

## MySQL setup

For fast testing, use the following MySQL database: 

1. Open **XAMPP Control Panel** and start **Apache** and **MySQL**.
2. Go to [http://localhost/phpmyadmin/](http://localhost/phpmyadmin/).
3. Create a new database named `Companion`.
4. Click on the **Import** tab at the top.
5. Click **Choose File** and select the file located at `/database/student.sql` in this project.
6. Scroll to the bottom and click **Import**.

## Local development

```bash
npm install
node i
nodemon i
express i
express-session i
nodemon app.js
```

The server will print the local URL, typically `http://localhost:3000`.
