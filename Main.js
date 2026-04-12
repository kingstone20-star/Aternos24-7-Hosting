const { spawn } = require("child_process");

// 🚀 Start bot
const botProcess = spawn("index", ["index.js"], {
    stdio: "inherit"
});

console.log("🚀 Bot started (PID):", botProcess.pid);

// ⏰ 10 phút
const TIME_LIMIT = 30 * 60 * 1000;

// 🔥 Hàm kill tổng hợp
function forceKill() {
    console.log("⚠️ Bắt đầu shutdown toàn bộ...");

    try {
        // 1. Kill nhẹ (cho bot tự cleanup nếu có)
        botProcess.kill("SIGTERM");
        console.log("✔ SIGTERM sent");
    } catch (e) {}

    setTimeout(() => {
        try {
            // 2. Kill trung bình
            botProcess.kill("SIGINT");
            console.log("✔ SIGINT sent");
        } catch (e) {}
    }, 1000);

    setTimeout(() => {
        try {
            // 3. Kill mạnh
            botProcess.kill("SIGKILL");
            console.log("🔥 SIGKILL sent");
        } catch (e) {}
    }, 2000);

    setTimeout(() => {
        try {
            // 4. Kill luôn process chính (main.js)
            console.log("💀 Kill main process");
            process.kill(process.pid, "SIGKILL");
        } catch (e) {
            process.exit(1);
        }
    }, 3000);

    // 5. Fallback cuối
    setTimeout(() => {
        console.log("☠️ Force exit fallback");
        process.exit(1);
    }, 5000);
}

// ⏰ Trigger sau 10 phút
setTimeout(() => {
    console.log("⏰ Hết 10 phút → tiến hành kill!");
    forceKill();
}, TIME_LIMIT);

// 🛑 Nếu bot tự tắt trước
botProcess.on("exit", (code, signal) => {
    console.log(`Bot exited | code: ${code} | signal: ${signal}`);
});

// 🧠 Anti crash main
process.on("uncaughtException", (err) => {
    console.log("❌ Uncaught Exception:", err);
    forceKill();
});

process.on("unhandledRejection", (err) => {
    console.log("❌ Unhandled Rejection:", err);
    forceKill();
});
