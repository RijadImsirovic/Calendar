const express = require("express");
const app = express();
const port = 8000;
const pool = require("./data/db");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Hello World!"));

// Authentication

app.post("/register", async function (req, res) {
  const { name, email, password } = req.body;
  const id = uuidv4();
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  try {
    const signUp = await pool.query(
      `INSERT INTO users (id, name, email, hashed_password) VALUES($1, $2, $3, $4)`,
      [id, name, email, hashedPassword]
    );

    const token = jwt.sign({ email }, "secret", { expiresIn: "1hr" });

    res.json({ name, email, token });
  } catch (err) {
    console.error(err);
    if (err) {
      res.json({ detail: err.detail });
    }
  }
});

app.post("/login", async function (req, res) {
  const { email, password } = req.body;
  try {
    const users = await pool.query("SELECT * FROM users where email = $1", [
      email,
    ]);

    if (!users.rows.length) return res.json({ detail: "User does not exist!" });

    const authCheck = await bcrypt.compare(
      password,
      users.rows[0].hashed_password
    );
    const token = jwt.sign({ email }, "secret", { expiresIn: "1hr" });

    if (authCheck) {
      res.json({ name: users.rows[0].name, email: users.rows[0].email, token });
    } else {
      res.json({ detail: "Login failed" });
    }
  } catch (err) {
    console.error(err);
  }
});

// ADD Event

app.post("/addEvent", async function (req, res) {
  const { title, description, startDate, endDate, color, email } = req.body;
  const id = uuidv4();

  try {
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    const startDatetime = parsedStartDate.toISOString();
    const endDatetime = parsedEndDate.toISOString();

    const addEvent = await pool.query(
      `INSERT INTO events (event_id, title, description, start_datetime, end_datetime, event_color) VALUES($1, $2, $3, $4, $5, $6)`,
      [id, title, description, startDatetime, endDatetime, color]
    );

    const users = await pool.query(`SELECT * FROM Users WHERE email = $1`, [
      email,
    ]);

    const addEventParticipants = await pool.query(
      `INSERT INTO event_participants (event_id, user_id, status) VALUES ($1, $2, $3)`,
      [id, users.rows[0].id, "Invited"]
    );

    res.json({ title, description, startDatetime, endDatetime, color });
  } catch (err) {
    console.error(err);
    if (err) {
      res.json({ detail: err.detail });
    }
  }
});

// GET EVENTS

app.get("/getEvents/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const users = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);

    if (users.rows.length === 0) {
      console.log(email);
      return res.json({ message: "User not found" });
    }

    const eventParticipants = await pool.query(
      `SELECT * FROM event_participants WHERE user_id = $1`,
      [users.rows[0].id]
    );

    const eventIdList = eventParticipants.rows.map((row) => row.event_id);

    const events = await pool.query(
      `SELECT * FROM events WHERE event_id =  ANY($1)`,
      [eventIdList]
    );

    console.log(events.rows);

    const modifiedEvents = events.rows.map((event) => ({
      title: event.title,
      description: event.description,
      start: event.start_datetime,
      end: event.end_datetime,
      color: event.event_color,
    }));

    res.json({ events: modifiedEvents });
  } catch (err) {
    console.error(err);
    if (err) {
      res.json({ detail: err.detail });
    }
  }
});

// Info Edit

app.post("/infoChange", async function (req, res) {
  const { currentEmail, newEmail, newName, newDescription, newToggle } =
    req.body;
  try {
    const users = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      currentEmail,
    ]);
    // UPDATE images SET image_data = $1 WHERE user_id = $2'
    const updateUser = await pool.query(
      `UPDATE users SET name = $1, email = $2 WHERE id = $3 `,
      [newName, newEmail, users.rows[0].id]
    );
    const updatSettings = await pool.query(
      `UPDATE user_profiles SET profile_description = $1, toggle_public_calendar = $2 WHERE user_id = $3 `,
      [newDescription, newToggle, users.rows[0].id]
    );
  } catch (err) {
    console.error(err);
  }
});

async function userHasImage(userId) {
  const query = "SELECT id FROM images WHERE user_id = $1";
  const result = await pool.query(query, [userId]);
  return result.rows.length > 0;
}

app.post(
  "/uploadPicture",
  upload.single("avatar"),
  async function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    console.log(req.file);
    const { email } = req.body;
    console.log(email);

    try {
      const { originalname, mimetype, destination, filename, path, size } =
        req.file;

      const users = await pool.query(`SELECT * FROM users WHERE email = $1`, [
        email,
      ]);

      const hasImage = await userHasImage(users.rows[0].id);

      // Read the image file as binary data
      const imageBuffer = require("fs").readFileSync(path);

      if (hasImage) {
        const updateQuery =
          "UPDATE images SET image_data = $1 WHERE user_id = $2 RETURNING id;";
        const result = await pool.query(updateQuery, [
          imageBuffer,
          users.rows[0].id,
        ]);

        // Remove the temporary file
        require("fs").unlinkSync(path);

        res.json({
          message: "File uploaded successfully",
          imageId: result.rows[0].id,
        });
      } else {
        const insertQuery =
          "INSERT INTO images (image_data, user_id) VALUES ($1, $2) RETURNING id;";
        const result = await pool.query(insertQuery, [
          imageBuffer,
          users.rows[0].id,
        ]);

        // Remove the temporary file
        require("fs").unlinkSync(path);

        res.json({
          message: "File uploaded successfully",
          imageId: result.rows[0].id,
        });
      }
    } catch (error) {
      console.error("Error handling file upload:", error);
      res.status(500).json({ error: "File upload failed" });
    }
  }
);

async function getImageById(userId) {
  const query = "SELECT image_data FROM images WHERE user_id = $1";
  const result = await pool.query(query, [userId]);

  if (result.rows.length === 0) {
    throw new Error("Image not found");
  }

  return result.rows[0].image_data;
}

app.get("/getImage/:user", async (req, res) => {
  try {
    const user = req.params.user;

    const users = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      user,
    ]);

    const imageData = await getImageById(users.rows[0].id);

    // Set appropriate response headers
    res.setHeader("Content-Type", "image/jpeg"); // Adjust the content type as needed

    // Send the image data as the response
    res.send(imageData);
  } catch (error) {
    console.error("Error retrieving image:", error);
    res.status(404).json({ error: "Image not found" });
  }
});

app.get("/getProfileSettings/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const users = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);

    if (users.rows.length === 0) {
      return res.json({ message: "User not found" });
    }

    const profileSettings = await pool.query(
      `Select * from user_profiles where user_id = $1`,
      [users.rows[0].id]
    );

    res.json({
      profileSettings: profileSettings.rows,
      basicSettings: users.rows,
    });
  } catch (err) {
    console.error(err);
    if (err) {
      res.json({ detail: err.detail });
    }
  }
});

// CONNECTIONS

app.get("/searchUsers/:name", async (req, res) => {
  const { name } = req.params;
  console.log(name);
  try {
    const users = await pool.query(
      `SELECT * FROM users WHERE name ILIKE '%' || $1 || '%'`,
      [name]
    );

    res.json(users.rows);
  } catch (err) {
    console.error(err);
    if (err) {
      res.json({ detail: err.detail });
    }
  }
});

app.post("/sendFriendRequest", async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    const sender = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      senderId,
    ]);

    const receiver = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      receiverId,
    ]);

    const query = await pool.query(
      `INSERT INTO friend_requests (sender_id, receiver_id) VALUES ($1, $2)`,
      [sender.rows[0].id, receiver.rows[0].id]
    );

    res.status(200).json({ message: "Friend request sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending friend request" });
  }
});

app.get("/getFriendRequestInfo/:sender/:receiver", async (req, res) => {
  const { sender, receiver } = req.params;

  try {
    const senderId = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      sender,
    ]);

    const receiverId = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [receiver]
    );

    const friendship = await pool.query(
      `SELECT * FROM friendships WHERE user_id1 = $1 and user_id2 = $2`,
      [senderId.rows[0].id, receiverId.rows[0].id]
    );

    const request = await pool.query(
      `SELECT * FROM friend_requests WHERE sender_id = $1 and receiver_id = $2`,
      [senderId.rows[0].id, receiverId.rows[0].id]
    );

    res.json({ friendship: friendship.rows, request: request.rows });
  } catch (err) {
    console.error(err);
    if (err) {
      res.json({ detail: err.detail });
    }
  }
});

app.post("/rejectFriendRequest", async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    console.log(senderId);
    console.log(receiverId);

    const sender = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      senderId,
    ]);

    const receiver = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      receiverId,
    ]);

    const query = await pool.query(
      `INSERT INTO friend_requests (sender_id, receiver_id) VALUES ($1, $2)`,
      [sender.rows[0].id, receiver.rows[0].id]
    );

    res.status(200).json({ message: "Friend request sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending friend request" });
  }
});

app.post("/cancelFriendRequest", async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    const sender = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      senderId,
    ]);

    const receiver = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      receiverId,
    ]);

    const query = await pool.query(
      `DELETE FROM friend_requests WHERE sender_id = $1 AND receiver_id = $2`,
      [sender.rows[0].id, receiver.rows[0].id]
    );

    res.status(200).json({ message: "Friend request canceled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error canceling friend request" });
  }
});

app.post("/acceptFriendRequest", async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    const sender = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      senderId,
    ]);

    const receiver = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      receiverId,
    ]);

    const query = await pool.query(
      `INSERT INTO friendships (user_id1, user_id2) VALUES ($1, $2)`,
      [sender.rows[0].id, receiver.rows[0].id]
    );

    const cancelQuery = await pool.query(
      `DELETE FROM friend_requests WHERE sender_id = $1 AND receiver_id = $2`,
      [sender.rows[0].id, receiver.rows[0].id]
    );


    res.status(200).json({ message: "Friend request was accepted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error accepting friend request" });
  }
});

app.get("/getPersonalFriendRequestInfo/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const userId = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);

    const sentRequests = await pool.query(
      `SELECT
    fr.id AS request_id,
    fr.sender_id,
    sender.name AS sender_username,
    sender.email AS sender_mail,
    fr.receiver_id,
    receiver.name AS receiver_username,
    receiver.email AS receiver_mail,
    fr.status
    FROM
        friend_requests AS fr
    INNER JOIN
        users AS sender ON fr.sender_id = sender.id
    INNER JOIN
        users AS receiver ON fr.receiver_id = receiver.id
    WHERE
    fr.sender_id = $1;`,
      [userId.rows[0].id]
    );

    const receivedRequests = await pool.query(
      `SELECT
    fr.id AS request_id,
    fr.sender_id,
    sender.name AS sender_username,
    sender.email AS sender_mail,
    fr.receiver_id,
    receiver.name AS receiver_username,
    receiver.email AS receiver_mail,
    fr.status
    FROM
        friend_requests AS fr
    INNER JOIN
        users AS sender ON fr.sender_id = sender.id
    INNER JOIN
        users AS receiver ON fr.receiver_id = receiver.id
    WHERE
    fr.receiver_id = $1;`,
      [userId.rows[0].id]
    );

    const friendships = await pool.query(
      `SELECT
      CASE
          WHEN user_id1 = $1 THEN user_id2
          ELSE user_id1
      END AS friend_id,
      u.name AS friend_username
      FROM
          friendships AS f
      INNER JOIN
          users AS u ON (user_id1 = u.id OR user_id2 = u.id)
      WHERE
      (user_id1 = $1 OR user_id2 = $1)`,
      [userId.rows[0].id]
    );

    res.json({ friendships: friendships.rows, sentRequests: sentRequests.rows, receivedRequests: receivedRequests.rows });
  } catch (err) {
    console.error(err);
    if (err) {
      res.json({ detail: err.detail });
    }
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
