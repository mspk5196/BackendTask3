const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const app = express();
const db = require('./src/config/db');
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
  console.log(req.body);
  // res.send(req.body);
});

app.post("/add-data", (req, res) => {
  const { email, subject1, subject2, subject3, subject4, subject5, total } = req.body;

  const query = `INSERT INTO  mark2(EMail,Subject1,Subject2,Subject3,Subject4,Subject5,Total)
                  VALUES(?,?,?,?,?,?,?)`

  db.query(query, [email, subject1, subject2, subject3, subject4, subject5, total], (err) => {

    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Failed to add marks" });
    }
    res.status(200).json({ message: "Marks inserted successfully" });

  })
})

app.get('/fetch-marks/', (req, res) => {
  const query = `SELECT * FROM mark2`

  db.query(query, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Failed to fetch marks" });
    }
    res.status(200).json({ marks: results });
  })
})

app.delete("/delete-marks/:id", (req, res) => {
  const id = req.params.id;


  const query = `DELETE FROM mark2 WHERE ID=?`

  db.query(query, [id], (err) => {


    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Failed to delete marks" });
    }
    if (res.affectedRows === 0) {
      return res.status(404).json({ error: "No record found with this ID" });
    }
    res.status(200).json({ message: "Marks deleted successfully" });

  })
})
app.put("/edit-marks/:id", (req, res) => {
  const id = req.params.id;
  const { email, subject1, subject2, subject3, subject4, subject5, total } = req.body;

  const query = `UPDATE mark2
SET EMail = ?, Subject1 = ?, Subject2 = ?, Subject3 = ?, Subject4 = ?, Subject5 = ?, Total = ?
WHERE ID = ?;`



  db.query(query, [email, subject1, subject2, subject3, subject4, subject5, total, id], (err) => {

    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Failed to edit marks" });
    }
    if (res.affectedRows === 0) {
      return res.status(404).json({ error: "No record found with this ID" });
    }
    res.status(200).json({ message: "Marks edited successfully" });

  })
})

app.get("/fetch-edit-marks/:id", (req, res) => {
  const id = req.params.id;
  const query = `SELECT * FROM mark2 WHERE ID = ?`;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Failed to fetch marks" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "No record found with this ID" });
    }
    res.status(200).json({ marks: results[0] });
  });
})


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});
