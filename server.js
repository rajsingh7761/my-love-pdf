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

let quality = "/ebook";

if (req.body.level === "100") quality = "/screen";
if (req.body.level === "200") quality = "/ebook";
if (req.body.level === "500") quality = "/printer";

const cmd = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=${quality} -dNOPAUSE -dQUIET -dBATCH -sOutputFile=${output} ${input}`;

exec(cmd, (err) => {
if (err) {
console.log(err);
return res.send("Compression Error ❌");
}

```
res.download(output, () => {
  fs.unlinkSync(input);
  fs.unlinkSync(output);
});
```

});
});

// 🔥 IMPORTANT FIX (PORT)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Running on port " + PORT));
