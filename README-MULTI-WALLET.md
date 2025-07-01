# OROSWAP BOT - MENU TƯƠNG TÁC

## 🚀 Cách sử dụng

### 1. Chạy menu chính
```bash
npm start
```

Menu sẽ hiển thị các tùy chọn:
- **1️⃣** Chạy 1 ví (từ phrase.txt)
- **2️⃣** Chạy nhiều ví tuần tự (từ phrases.txt)
- **3️⃣** Chạy nhiều ví đa luồng (3 ví cùng lúc)
- **4️⃣** Chạy nhiều ví đa luồng (5 ví cùng lúc)
- **5️⃣** Chạy nhiều ví đa luồng (tất cả cùng lúc)
- **6️⃣** Tạo file phrases.txt mẫu
- **7️⃣** Kiểm tra cấu hình
- **8️⃣** Xem hướng dẫn
- **0️⃣** Thoát

### 2. Chuẩn bị file ví

**Cho 1 ví:**
- Tạo file `phrase.txt` với mnemonic

**Cho nhiều ví:**
- Tạo file `phrases.txt` với mỗi dòng chứa một mnemonic
- Hoặc chọn option 6 để tạo file mẫu

### 3. Chạy trực tiếp (nếu cần)
```bash
npm run single              # 1 ví
npm run multi-sequential    # Nhiều ví tuần tự
npm run multi-limit         # 3 ví cùng lúc
npm run multi-limit-5       # 5 ví cùng lúc
npm run multi-parallel      # Tất cả cùng lúc
```

## 📊 So sánh chế độ

| Chế độ | Tốc độ | Ổn định | Khuyến nghị |
|--------|--------|---------|-------------|
| Sequential | ⭐⭐ | ⭐⭐⭐⭐⭐ | Cho ít ví (<5) |
| Limited Parallel | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | **Khuyến nghị** |
| Full Parallel | ⭐⭐⭐⭐⭐ | ⭐⭐ | Cho nhiều ví (>10) |

## ⚠️ Lưu ý
- Backup mnemonic trước khi chạy
- Kiểm tra balance đủ ZIG/ORO
- Chế độ parallel có thể bị rate limit 