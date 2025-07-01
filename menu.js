const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { spawn } = require("child_process");

console.clear();
console.log("\x1b[35m%s\x1b[0m", "============================================");
console.log("\x1b[36m%s\x1b[0m", "      OROSWAP BOT - MENU CHÍNH           ");
console.log("\x1b[36m%s\x1b[0m", "               VELHUST                   ");
console.log("\x1b[35m%s\x1b[0m", "============================================\n");

// Kiểm tra file phrase.txt
const checkPhraseFile = () => {
    try {
        const phrase = fs.readFileSync(path.join(__dirname, "phrase.txt"), "utf8").trim();
        return phrase.length > 0;
    } catch (error) {
        return false;
    }
};

// Hiển thị menu
const showMenu = () => {
    const hasPhrase = checkPhraseFile();
    
    console.log("\x1b[33m%s\x1b[0m", "📋 CHỌN CHẾ ĐỘ CHẠY BOT:");
    console.log("");
    
    if (hasPhrase) {
        console.log("\x1b[32m%s\x1b[0m", "1️⃣  Chạy 1 ví");
        console.log("\x1b[32m%s\x1b[0m", "2️⃣  Chạy nhiều ví (tuần tự)");
        console.log("\x1b[32m%s\x1b[0m", "3️⃣  Chạy đa luồng (cùng lúc)");
    } else {
        console.log("\x1b[31m%s\x1b[0m", "1️⃣  Chạy 1 ví (phrase.txt không tồn tại)");
        console.log("\x1b[31m%s\x1b[0m", "2️⃣  Chạy nhiều ví (phrase.txt không tồn tại)");
        console.log("\x1b[31m%s\x1b[0m", "3️⃣  Chạy đa luồng (phrase.txt không tồn tại)");
    }
    
    console.log("\x1b[36m%s\x1b[0m", "4️⃣  Kiểm tra cấu hình");
    console.log("\x1b[31m%s\x1b[0m", "0️⃣  Thoát");
    console.log("");
};

// Kiểm tra cấu hình
const checkConfiguration = () => {
    console.log("\x1b[33m%s\x1b[0m", "🔍 KIỂM TRA CẤU HÌNH:");
    console.log("");
    
    // Kiểm tra phrase.txt
    const hasPhrase = checkPhraseFile();
    console.log(`📄 phrase.txt: ${hasPhrase ? '✅ Tồn tại' : '❌ Không tồn tại'}`);
    
    // Kiểm tra package.json
    try {
        const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, "package.json"), "utf8"));
        console.log(`📦 package.json: ✅ Tồn tại (${packageJson.dependencies ? Object.keys(packageJson.dependencies).length : 0} dependencies)`);
    } catch (error) {
        console.log(`📦 package.json: ❌ Lỗi: ${error.message}`);
    }
    
    // Kiểm tra node_modules
    const hasNodeModules = fs.existsSync(path.join(__dirname, "node_modules"));
    console.log(`📁 node_modules: ${hasNodeModules ? '✅ Tồn tại' : '❌ Không tồn tại (chạy npm install)'}`);
    
    console.log("");
};

// Chạy script
const runScript = (scriptPath, args = []) => {
    console.log(`\x1b[33m%s\x1b[0m`, `🚀 Đang chạy: ${scriptPath} ${args.join(' ')}`);
    console.log("");
    
    const child = spawn('node', [scriptPath, ...args], {
        stdio: 'inherit',
        cwd: __dirname
    });
    
    child.on('close', (code) => {
        console.log(`\n\x1b[33m%s\x1b[0m`, `✅ Script hoàn thành với mã thoát: ${code}`);
        console.log("\x1b[36m%s\x1b[0m", "Nhấn Enter để quay lại menu...");
    });
    
    child.on('error', (error) => {
        console.log(`\n\x1b[31m%s\x1b[0m`, `❌ Lỗi chạy script: ${error.message}`);
        console.log("\x1b[36m%s\x1b[0m", "Nhấn Enter để quay lại menu...");
    });
};

// Xử lý lựa chọn
const handleChoice = async (choice) => {
    switch (choice) {
        case '1':
            if (checkPhraseFile()) {
                runScript('main.js');
            } else {
                console.log("\x1b[31m%s\x1b[0m", "❌ File phrase.txt không tồn tại hoặc rỗng!");
                console.log("\x1b[33m%s\x1b[0m", "💡 Tạo file phrase.txt với mnemonic của bạn.");
            }
            break;
            
        case '2':
            if (checkPhraseFile()) {
                runScript('multi-wallet-sequential.js');
            } else {
                console.log("\x1b[31m%s\x1b[0m", "❌ File phrase.txt không tồn tại hoặc rỗng!");
                console.log("\x1b[33m%s\x1b[0m", "💡 Tạo file phrase.txt với mnemonic của bạn.");
            }
            break;
            
        case '3':
            if (checkPhraseFile()) {
                runScript('multi-wallet-parallel.js', ['parallel']);
            } else {
                console.log("\x1b[31m%s\x1b[0m", "❌ File phrase.txt không tồn tại hoặc rỗng!");
                console.log("\x1b[33m%s\x1b[0m", "💡 Tạo file phrase.txt với mnemonic của bạn.");
            }
            break;
            
        case '4':
            checkConfiguration();
            break;
            
        case '0':
            console.log("\x1b[33m%s\x1b[0m", "👋 Tạm biệt!");
            process.exit(0);
            break;
            
        default:
            console.log("\x1b[31m%s\x1b[0m", "❌ Lựa chọn không hợp lệ!");
            break;
    }
    
    if (choice !== '0') {
        console.log("\x1b[36m%s\x1b[0m", "Nhấn Enter để quay lại menu...");
    }
};

// Main function
const main = async () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    const askQuestion = () => {
        showMenu();
        rl.question('\x1b[32m%s\x1b[0m', 'Nhập lựa chọn (0-4): ', async (answer) => {
            await handleChoice(answer.trim());
            rl.question('', () => {
                console.clear();
                askQuestion();
            });
        });
    };
    
    askQuestion();
};

// Chạy menu
main(); 