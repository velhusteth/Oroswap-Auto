Testnet: Oroswap Ví:  Keplr Network 

Bot tự động để thực hiện swap và cung cấp thanh khoản trên mạng testnet Zigchain (ZIG ↔️ ORO) sử dụng ví Keplr hoặc Leap.

🚀 Tính năng

- Swap ZIG → ORO và ngược lại (5 lần mỗi loại)
- Cung cấp thanh khoản ORO/ZIG tổng cộng 10 lần
- Tự động chờ giữa các giao dịch
- Đọc mnemonic từ file phrase.txt

📁 Cài đặt

# Tải repo về giải nén mở bằng VSC hoặc Cursor

# Cài đặt các thư viện cần thiết
```npm install```

⚙️ Chuẩn bị

Tạo file tên là phrase.txt ở thư mục gốc

Dán mnemonic ví Keplr hoặc Leap của bạn vào file này

Ví dụ:

easy galaxy window xxxxxxxxxxx  
Hãy dùng ví testnet!!!

▶️ Chạy Bot

```node menu.js```

Bot sẽ thực hiện:

- 5 lần swap ZIG → ORO
- 5 lần swap ORO → ZIG
- 10 lần cung cấp thanh khoản

Lặp lại 10 chu kỳ với delay 15 giây

Ví dụ kết quả:

✅ Swap ZIG → ORO thành công! TX: XXXXX  
🔍 https://zigscan.org/tx/XXXXX  
✅ Cung cấp thanh khoản cặp ORO/ZIG thành công! TX: YYYYY  
🔍 https://zigscan.org/tx/YYYYY  

## ỦNG HỘ MÌNH CỐC CF NẾU BẠN THÍCH SCRIPT NÀY

- **EVM:** 0x70A5a4ede89ED613307d255659a1dD837D9418a1
- **SOL:** AwXQn61FFabdV4iDjzCNTHtx2yanGDiEEh7KY4MKVZS2
- **SUI:** 0xc99395ead375fe240f0edd28acb12e3360ffe1e83bbd1d782b3208fc57fe338c

Cho mình xin một follow và một star nhé, cảm ơn bạn đã ủng hộ mình, chúc bạn cày Airdrop vui vẻ và nhớ bảo vệ tải sản của mình một cách cẩn thận nhé!

**</velhust/>**
