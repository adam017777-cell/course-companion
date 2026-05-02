const express = require("express");
const session = require("express-session");
const path = require("path")
const mysql = require("mysql2");

const app = express();

app.use(express.static(__dirname));

const port = 3000;

app.use(
    session({
        secret: "secret-key",
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }
    })
)

app.use(express.urlencoded({ extended: false}))
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "student",
})

db.connect((err) => {
    if (err)    {
        console.error("No connection:", err);
        process.exit(1);
    }
    else
        console.log("Connection successful.")
})

app.set("view engine", "ejs");
app.set("views", path.join(__dirname));

app.get("/", (req, res) =>  {
    res.sendFile(path.join(__dirname, "\\Homepage.html"))
})

app.get("/SignIn", (req, res) => {
    res.sendFile(path.join(__dirname, "\\SignIn.html"))
})

app.post("/login", (req, res) =>  {
    const { pages, username, password } = req.body;
    
    db.connect((error) => {
        if (error) {
            console.log("Error connecting to database.")
        } else  {
            console.log("Connected to database.")
        }
    
    if (pages == "admin")
        db.query("SELECT * FROM instructors WHERE username = ? AND password = ?", [username, password], (err, results) => {
        if (err)    {
            return console.log(err);
        }

        if (results.length > 0) {
            req.session.user =  {
                id: results[0].id,
                username: results[0].username,
                password: results[0].password,
                name: results[0].name,
            }
            req.session.save((err) =>   {
                if (err)
                    res.send("Error saving session.");
            });
            res.redirect("\\admin1");
        }   else    {
            res.send("Invalid Login Credentials.");
            }
        })
    else    {
    db.query("SELECT * FROM students WHERE username = ? AND password = ?", [username, password], (err, results) => {
        if (err)    {
            return console.log(err);
        }

        if (results.length > 0) {
            req.session.user =  {
                id: results[0].id,
                username: results[0].username,
                password: results[0].password,
                name: results[0].name,
            }
            req.session.save((err) =>   {
                if (err)
                    res.send("Error saving session.");
            });
            
            res.redirect("\\student-frontend");
        }   else    {
            res.send("Invalid Login Credentials.");
            }
        })
    }
    })
})

app.post("/register", (req, res) =>    {

    const data = {
        username: req.body.username,
        password: req.body.password,
        name: req.body.name
    }

    let confirm = req.body.confirm;
    let type = req.body.type;

        db.query("SELECT name FROM students WHERE name = ? ", [data.name], (err, result) =>   {
            if (err)
                console.log(err);
            if (result.length > 0) 
                res.send("User already exists");
        })
        if (data.password.length < 8)   {
            return res.send("Invalid password! Try again.");
        }
        if (data.password !== confirm)   {
            return res.send("Passwords do not match.");
        }

        let query = "INSERT INTO students (username, password, name) VALUES (?,?,?) ";

        if (type == "teacher")
            query = "INSERT INTO instructors (username, password, name) VALUES (?,?,?) ";

        db.query(query, [data.username, data.password, data.name], (error, result) => {
            if (error)
                res.send("Could not add:", error);
            else    {
                res.sendFile(path.join(__dirname, "\\SignIn.html"));
            }
        })     
})

app.post("/updatestudent", (req, res) =>    {
   
    let newPassword = req.body.newPassword;

    let sql= `UPDATE students SET password = ? WHERE id = ?`;

    db.query(sql, [newPassword, req.session.user.id], (err, result) =>  {
        if (err)
            res.send(`Could not update ${req.session.user.id}`);
        else    {
            res.sendFile(path.join(__dirname, "\\SignIn.html"));
        }
    })
})


app.post("/deletestudent", (req, res) => {

    let userid = req.session.user.id;
    let sql = "DELETE FROM students WHERE id = ? ";

    db.query(sql, [userid], (err, result) =>  {

        if (err)
            res.send("Could not delete student user." + userid + " " + err);
        else
            res.sendFile(path.join(__dirname, "\\SignIn.html"));
    })
})

app.post("/updateadmin", (req, res) =>    {
   
    let newPassword = req.body.newPassword;

    let sql= `UPDATE instructors SET password = ? WHERE id = ?`;

    db.query(sql, [newPassword, req.session.user.id], (err, result) =>  {
        if (err)
            res.send(`Could not update ${req.session.user.id}`);
        else    {
            res.sendFile(path.join(__dirname, "\\SignIn.html"));
        }
    })
})


app.post("/deleteadmin", (req, res) => {

    let userid = req.session.user.id;
    let sql = "DELETE FROM instructors WHERE id = ? ";

    db.query(sql, [userid], (err, result) =>  {
        if (err)
            res.send("Could not delete admin user." + userid + " " + err);
        else
            res.sendFile(path.join(__dirname, "\\SignIn.html"));
    })
})

app.get("\\AccountDetails", (req,res) => {
    res.sendFile(path.join(__dirname, "\\AccountDetails.html"));
})

app.get("\\AccountDetailsIn", (req,res) => {
    res.sendFile(path.join(__dirname, "\\AccountDetailsIn.html"));
})

app.get("/student", (req,res) =>    {
    if (!req.session.user)  {
        return res.send("Login first")
    }

    res.sendFile("student.html");
})

app.get("/admin1", (req, res) =>    {
    if (!req.session.user)  {
        return res.send("Login first")
    }
    db.query("SELECT * FROM admins WHERE username = ?", [req.session.user.username], (err, result) =>   {
        if (err)
            res.send("Could not retrieve data!");
        else    
            res.render("admin1", {sample: result});
    })
})

app.get("/student-frontend", (req, res) =>  {
    if (!req.session.user)  {
        return res.send("Login first")
    }
    db.query("SELECT * FROM admins", (err, result) =>   {
        if (err)
            res.send("Could not retrieve data!");
        else    {
            db.query("SELECT * FROM companion WHERE username = ?", [req.session.user.username], (err, data) =>   {
                if (err)
                    res.send("Could not retrieve data!");
                else
                    res.render("student-frontend", {sample: result, sample1: data, name: req.session.user.name});
            })
        }
    })
})

app.post("/student", (req, res) =>   {
    if (!req.session.user)  {
        return res.send("Login first")
    }
    db.query("SELECT * FROM companion WHERE course = ?",[req.body.courseN], (err, result) =>   {
        if (err)
            res.send("Could not retrieve data!");
        else {
            db.query("SELECT * FROM assignments WHERE CourseId = ?", [req.body.courseN], (error, results) => {
                res.render("student.ejs", {sample: result, sample1: results, course: req.body.courseN});
            })
        }
    })
})

app.post("/assignment", (req,res) => {
    if (!req.session.user)  {
        return res.send("Login first")
    }
    db.query("SELECT * FROM assignments WHERE CourseId = ?",[req.body.newCode], (err, result) =>   {
        if (err)
            res.send("Could not retrieve data!");
        else 
            res.render("assignment.ejs", {sample: result, course: req.body.newCode});
    })
})

app.post("/addGrades", (req, res) => {
    if (!req.session.user)  {
        return res.send("Login first")
    }
    db.query("SELECT * FROM assignments WHERE CourseId = ?",[req.body.code], (err, result) =>   {
        if (err)
            res.send("Could not retrieve data!");
        else 
            res.render("addGrades.ejs", {sample: result});
    })
})

app.post("/enrollCourse", (req, res) => {
     db.query("SELECT course FROM companion WHERE course = ? ", [req.body.course], (err, results) =>   {
            if (results.length > 0) 
                res.send("Already enrolled in course");
            else    {
                db.query("INSERT INTO companion (username, course, assignment, dueDate, grade, status) VALUES (?,?,?,?,?,?)", [req.session.user.username, req.body.course, "empty", "0000-00-00", 0, 1], (err, result) =>  {
                    if (err)
                        res.send("Could not add course!");
                    else    
                        res.redirect("/student-frontend");
                })
            }
    })

})

app.post("/unenrollCourse", (req, res) => {
    db.query("DELETE FROM companion WHERE course = ?", [req.body.courseR], (err, result) =>  {
        if (err)
            res.send("Could not add course!");
        else    
            res.redirect("/student-frontend");
    })
})


app.post("/getAssignments", (req, res) =>   {
    const data = {
        code : req.body.code,
        name: req.body.name,
        instructor: req.body.instructor,
        term: req.body.term
    }

    db.query("SELECT * name FROM admins WHERE courseId = ? ", [data.code], (err, result) =>   {
            if (err)
                console.log(err);
            if (result.length > 0) 
                res.send("Course already exists");
        })
    
    db.query("INSERT INTO admins (username, courseId, title, instructor, term, enable) VALUES (?,?,?,?,?,1) ", [req.session.user.username, data.code, data.name, data.instructor, data.term], (error, result) => {
            if (error)
                res.send("Could not add:", error);
            else    {
                res.sendFile(path.join(__dirname, "\\SignIn.html"));
            }
    }) 
})

app.post("/addcourse", (req, res) =>    {
    const data = {
        code : req.body.code,
        name: req.body.name,
        instructor: req.body.instructor,
        term: req.body.term
    }
    
    db.query("INSERT INTO admins (username, courseId, title, instructor, term, enable) VALUES (?,?,?,?,?,1) ", [req.session.user.username, data.code, data.name, data.instructor, data.term], (error, result) => {
            if (error)
                res.send("Could not add:", error);
            else    {
                res.redirect("/admin1");
            }
        }) 
})

// deleting course
app.post("/deleteCourse", (req, res) => {

  const id = req.body.courseid;

  db.query("DELETE FROM admins WHERE courseId=?",[id],(err, result) => {
      if (err) {
        console.log(err);
      } else {
        db.query("DELETE FROM assignments WHERE CourseId=?",[id],(error, result) => {
         if (error)
            console.log(error);
         else
            res.redirect("/admin1")   
        });
      }
    });
});

app.post("/disableCourse", (req, res) =>    {
    let id = req.body.codecourse;
    let sql= `UPDATE admins SET enable = 0 WHERE courseId = ?`;

    db.query(sql, [id], (err, result) =>  {
        if (err)
            res.send(`Could not update ${id}`);
        else    {
            res.redirect("/admin1");
        }
    })
})

app.post("/enableCourse", (req, res) =>    {
    let id = req.body.coursecode;
    let sql= `UPDATE admins SET enable = 1 WHERE courseId = ?`;

     db.query(sql, [id], (err, result) =>  {
        if (err)
            res.send(`Could not update ${id}`);
        else    {
            res.redirect("/admin1");
        }
    })
})

// Creating an assignemnt 
app.post("/createAssignment", (req, res) => {

  const data = {
    courseId: req.body.courseId,
    name: req.body.title,
    dueDate: req.body.dueDate,
    weight: req.body.weight
  };

  db.query("INSERT INTO assignments (courseId, name, dueDate, weight) VALUES (?,?,?,?)",[data.courseId, data.name, data.dueDate, data.weight],(err, result) => {
      if (err) {
        console.log(err);
      } else {
        db.query("SELECT * FROM assignments WHERE CourseId = ?",[data.courseId], (error, results) =>   {
        if (error)
            res.send("Could not load data!");
        else 
            res.render("assignment.ejs", {sample: results, course: data.courseId});
        })
      }
    });
});

app.post("/saveAssignment", (req, res) =>    {
    let newGrade = req.body.newGrade;
    //let newStatus = req.body.status
    let nameAssignment = req.body.assignment;
    let dueDate = req.body.duedate;



    let sql= `UPDATE companion SET grade = ? WHERE assignment = ?`;

    db.query("SELECT * FROM companion WHERE assignment = ?", [nameAssignment], (err, results) => {
        if (err)    {
            return console.log(err);
        }

        if (results.length > 0) {
            db.query(sql, [newGrade, nameAssignment], (err, result) =>  {
                if (err)
                    res.send(`Could not update ${nameAssignment}`);
                else    {
                    db.query("SELECT * FROM assignments WHERE CourseId = ?", [req.body.courseID], (errr, results) =>   {
                        if (errr)
                            res.send("Could not retrieve data!");
                        else 
                            res.render("addGrades.ejs", {sample: results});
                    })
                }
            }) 
        }
        else    {
            db.query("INSERT INTO companion (username, course, assignment, dueDate, grade, status) VALUES (?,?,?,?,?,1)", [req.session.user.username, req.body.courseID, nameAssignment, dueDate, newGrade], (error, results) =>    {
                if (error)
                    return console.log(error);
                else    {
                    db.query("SELECT * FROM assignments WHERE CourseId = ?",[req.body.courseID], (errr, result) =>   {
                        if (errr)
                            res.send("Could not retrieve data!");
                        else 
                            res.render("addGrades.ejs", {sample: result});
                    })
                }
            })
        }
    })
})

app.post("/deleteAssignment", (req, res) => {

  let assignment = req.body.assignment;
  let code = req.body.courseCode;

  db.query("DELETE FROM assignments WHERE name = ?",[assignment],(err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/admin1");
      }
    });
});

app.get("/admin3", (req, res) =>    {
    db.query("SELECT * FROM admins WHERE username = ?", [req.session.user.username], (err, result) =>   {
        if (err)
            res.send("Could not retrieve data!");
        else    {
            db.query("SELECT * FROM companion", (err, data) =>   {
                if (err)
                    res.send("Could not retrieve data!");
                else
                    res.render("admin3.ejs", {sample: result, sample1: data, name: req.session.user.name});
            })
        }
    })
})

app.listen(port, () =>  {
    console.log("Server: https://localhost:3000")
})