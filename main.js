const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false, // Tạo quyền truy cập microphone qua context isolation
      enableWebSecurity: false,
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
ipcMain.handle("start-recognition", async () => {
  try {
    // Đảm bảo rằng Python và file script được gọi đúng
    const pythonProcess = spawn("py", ["./speech_to_text.py"]);  // Chỉnh lại đây nếu bạn dùng python3 hoặc python trên môi trường khác

    return new Promise((resolve, reject) => {
      let data = "";

      pythonProcess.stdout.on("data", (chunk) => {
        data += chunk;  // Gom tất cả dữ liệu trả về vào biến data
      });

      pythonProcess.stderr.on("data", (err) => {
        reject(`error Python: ${err.toString()}`);
      });

      pythonProcess.on("close", (code) => {
        if (code === 0) {
          try {
            const result = JSON.parse(data);  // Chắc chắn rằng dữ liệu trả về là JSON
            resolve(result);
          } catch (e) {
            reject("Không thể phân tích dữ liệu JSON từ script Python");
          }
        } else {
          reject(`Script Python  ${code}`);
        }
      });
    });
  } catch (err) {
    console.error("erroe script Python: ", err);
    throw new Error("not excute script Python");
  }
});
