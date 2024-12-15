const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const csv = require("csv-parser");

let window;

function createWindow() {
  window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  window.loadFile("index.html");

   (frontend)
  readCSVData();
}

function readCSVData() {
  const results = [];
  fs.createReadStream(path.join(__dirname, "utility", "games_dataset.csv"))
    .pipe(csv())
    .on("data", (data) => results.push(data)) 
    .on("end", () => {
      console.log("Data yang dibaca:", results); // Debugging log
      window.webContents.send("csv-data", results);
    });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
