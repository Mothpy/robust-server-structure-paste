const express = require("express");
const app = express();
const pastes = require("./data/pastes-data");

// TODO: Follow instructions in the checkpoint to implement ths API.
app.use(express.json());

app.use("/pastes/:pasteId", (req, res, next) => {
  const { pasteId } = req.params;
  const foundPaste = pastes.find((paste) => paste.id === Number(pasteId));

  if (foundPaste) {
    res.json({ data: foundPaste });
  } else {
    next(`Paste id not found: ${pasteId}`);
  }
});

// handler will only be called if incoming request is GET. 
app.get("/pastes", (req, res) => {
  res.json({ data: pastes });
});

// Variable to hold the next ID  
// Because some IDs may already be used, find the largest assigned ID 
let lastPasteId = pastes.reduce((maxId, paste) => Math.max(maxId, paste.id), 0);

app.post("/pastes", (req, res, next) => {
  const {data: { name, syntax, exposure, expiration, text, user_id } = {} } = req.body;
  if (text) {
  const newPaste = {
    id: ++lastPasteId, // Increment last ID, then assign it as current ID
    name, 
    syntax,
    exposure,
    expiration,
    text,
    user_id,
  };
  pastes.push(newPaste);
  // status 201 for new post created successfully 
  res.status(201).json({ data: newPaste });
  } else {
    // else status 400 for missing or empty "text" property 
  res.sendStatus(400);
}
});

// Not found handler
app.use((request, response, next) => {
  next(`Not found: ${request.originalUrl}`);
});

// Error handler
app.use((error, request, response, next) => {
  console.error(error);
  response.send(error);
});

module.exports = app;
