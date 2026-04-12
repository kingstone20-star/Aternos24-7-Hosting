const { spawn } = require("child_process");
const path = require("path");

// ===== 🔧 CHỈNH TÊN FILE BOT =====
const BOT_FILE = "index.js"; // đổi thành "node.js" nếu bạn dùng tên đó

// ===== 📂 ĐƯỜNG DẪN TUYỆT ĐỐI =====
const botPath = path.join(__dirname, BOT_FILE);

console.log("📂 Bot path:", botPath);

// ===== 🚀 START BOT =====
const botProcess = spawn("node", [botPath], {
    stdio: "inherit"
});

console.log("🚀 Bot started (PID):", botProcess.pid);

// ===== 🧠 BẮT LỖI SPAWN =====
botProcess.on("error", (err) => {
    console.log("❌ Spawn error:", err);
});

// ===== 📉 BOT EXIT =====
botProcess.on("exit", (code, signal) => {
    console.log(`⚠️ Bot exited | code: ${code} | signal: ${signal}`);
});

// ===== ⏰ 30 PHÚT =====
const TIME_LIMIT = 30 * 60 * 1000;

// ===== 💀 HÀM KILL FULL =====
function forceKill() {
    console.log("⚠️ Bắt đầu shutdown toàn bộ...");

    try {
        botProcess.kill("SIGTERM");
        console.log("✔ SIGTERM");
    } catch {}

    setTimeout(() => {
        try {
            botProcess.kill("SIGINT");
            console.log("✔ SIGINT");
        } catch {}
    }, 1000);

    setTimeout(() => {
        try {
            botProcess.kill("SIGKILL");
            console.log("🔥 SIGKILL");
        } catch {}
    }, 2000);

    setTimeout(() => {
        try {
            console.log("💀 Kill main process");
            process.kill(process.pid, "SIGKILL");
        } catch {
            process.exit(1);
        }
    }, 3000);

    setTimeout(() => {
        console.log("☠️ Force exit fallback");
        process.exit(1);
    }, 5000);
}

// ===== ⏰ TRIGGER =====
setTimeout(() => {
    console.log("⏰ Hết 30 phút → kill!");
    forceKill();
}, TIME_LIMIT);

// ===== 🧠 ANTI CRASH =====
process.on("uncaughtException", (err) => {
    console.log("❌ Uncaught Exception:", err);
    forceKill();
});

process.on("unhandledRejection", (err) => {
    console.log("❌ Unhandled Rejection:", err);
    forceKill();
});
