const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL("http://localhost:3000");
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Lắng nghe từ ReactJS và gọi script Python
const { spawn } = require("child_process");

ipcMain.handle("start-recognition", async () => {
  // Đảm bảo rằng Python và file script được gọi đúng
  const pythonProcess = spawn("python", ["speech_to_text.py"]);

  return new Promise((resolve, reject) => {
    let data = "";

    pythonProcess.stdout.on("data", (chunk) => {
      data += chunk;
    });

    pythonProcess.stderr.on("data", (err) => {
      reject(`Lỗi: ${err.toString()}`);
    });

    pythonProcess.on("close", (code) => {
      if (code === 0) {
        resolve(JSON.parse(data)); // Giả sử kết quả trả về là JSON
      } else {
        reject(`Script Python kết thúc với mã lỗi ${code}`);
      }
    });
  });
});

