const express = require("express");
const multer = require("multer");
const { exec } = require("child_process");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.static("public"));

app.post("/compress", upload.single("pdf"), (req, res) => {
const input = req.file.path;
const output = `compressed-${Date.now()}.pdf`;

const level = req.body.level;

let quality = "/ebook";

if (level === "100") quality = "/screen";
if (level === "200") quality = "/ebook";
if (level === "500") quality = "/printer";

const cmd = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=${quality} -dNOPAUSE -dQUIET -dBATCH -sOutputFile=${output} ${input}`;

exec(cmd, (err) => {
if (err) return res.send("Error");

```
res.download(output, () => {
  fs.unlinkSync(input);
  fs.unlinkSync(output);
});
```

});
});

app.listen(3000, () => console.log("Running..."));
