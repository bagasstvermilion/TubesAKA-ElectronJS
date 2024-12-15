const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const csv = require("csv-parser"); // Pustaka csv-parser

let window;

function createWindow() {
  window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Pastikan contextIsolation di-set ke false jika menggunakan nodeIntegration
    },
  });

  window.loadFile("index.html");

  // Mengirim data CSV ke renderer process (frontend)
  readCSVData();
}

// Fungsi untuk membaca data CSV
function readCSVData() {
  const results = [];
  fs.createReadStream(path.join(__dirname, "utility", "games_dataset.csv")) // Path ke file CSV
    .pipe(csv())
    .on("data", (data) => results.push(data)) // Simpan setiap baris data
    .on("end", () => {
      // Mengirim data ke renderer process setelah CSV selesai dibaca
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
