import express from "express";
import start from "../../src/app.js";
import fs from "fs";
const router = express.Router();

router.get("/:image", async function (req, res) {
  const image = req.params.image;
  res.json(await start(image));
  //   res.json("hello world");
});

export default router;

router.post("/upload", async function (req, res) {
  let obj = JSON.parse(JSON.stringify(req.files));
  let data = Buffer.from(obj.file.data.data);
  fs.writeFile("./images/" + obj.file.name, data, function (err) {
    console.log(err);
  });
  res.json(await start(obj.file.name));
});
