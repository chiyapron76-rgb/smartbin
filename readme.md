SmartBin - Next + Nest + Prisma + Postgres (Docker)

How to run:
1. docker compose up --build
2. Open frontend: http://localhost:3000
3. API endpoints (backend): http://localhost:3001/api/bins , /api/sensor-record
prisma schema


****รันทีละ step****

npm run prisma:merge

npm run prisma:generate 

npx prisma migrate dev --name init

docker compose build --no-cache

docker compose up -d

กรณี อัพเดต schema เเล้ว อยากดึง มาโชว์ใน schema.prisma

docker cp smartbin-project-backend-1:/usr/src/app/prisma/schema.prisma ./backend/prisma/schema.prisma

เปิด prisma มาดู
docker exec -it smartbin-project-backend-1 sh
npx prisma studio --hostname 0.0.0.0 --port 5555


# SmartBin Management System 🗑️♻️

ระบบบริหารจัดการขยะอัจฉริยะและแพลตฟอร์มรับแจ้งปัญหาจากประชาชน (Citizen Engagement Platform) พัฒนาด้วย Next.js NestJS Prisma  รองรับการทำงานผ่าน Docker

![Project Status](https://img.shields.io/badge/Status-Active_Development-emerald)
![Tech Stack](https://img.shields.io/badge/Stack-Next.js_|_NestJS_|_Prisma-blue)

## 🌟 ฟีเจอร์หลัก (Key Features)

### 👮 สำหรับเจ้าหน้าที่ (Admin Dashboard)
- **Dashboard Overview:** ดูภาพรวมสถานะถังขยะทั้งหมด (ปกติ, เต็ม, ชำรุด)
- **Map Visualization** ดูตำแหน่งถังขยะบนแผนที่ทั้งหมด (เพิ่มถังขยะได้ในหน้า map)
- **Task:** ระบบมอนหมายงานให้เจ้าหน้าที่เก็บขยะที่ admin เป็นผู้ควบคุมการดำเนินงาน (กดเริ่ม-เสร็จสิ้น, รีพอตถังที่เสียหายของเจ้าหน้าที่)
- **Citizen Reports Management:**
  - รับเรื่องร้องเรียนจากประชาชนแบบ Real-time
  - อัปเดตสถานะงาน (รอดำเนินการ -> กำลังทำ -> เสร็จสิ้น)
  - **Satisfaction View:** ดูคะแนนความพึงพอใจที่ประชาชนประเมินเป็นรูปแบบ Emoji (😫, 😐, 😍) พร้อม Feedback

### 🙋 สำหรับประชาชน (Citizen Portal)
- **Interactive Map:** ค้นหาจุดติดตั้งถังขยะใกล้ตัวผ่านแผนที่
- **Report Issues:** แจ้งปัญหาขยะ (ถังเต็ม, ส่งกลิ่น, ชำรุด) พร้อมระบุตำแหน่ง
- **My Reports (History):** ติดตามสถานะการแจ้งปัญหาของตัวเอง
- **Rating System (Feedback Loop):**
  - **Force Rating:** ระบบบังคับประเมินงานเก่าที่เสร็จแล้ว ก่อนที่จะแจ้งปัญหาใหม่ได้
  - **App Rating:** ให้คะแนนความพึงพอใจต่อตัวแอปพลิเคชัน
  - แสดงสถานะ "✅ ประเมินแล้ว" พร้อมหน้ายิ้มที่เลือก

---

## 🛠️ Tech Stack

**Frontend:**
- **Framework:** Next.js (Pages Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Maps:** Leaflet (React-Leaflet)
- **UI Components:** SweetAlert2, React Hot Toast, Recharts

**Backend:**
- **Framework:** NestJS
- **Database ORM:** Prisma
- **Database:** PostgreSQL
- **Containerization:** Docker & Docker Compose

---

## 🚀 การติดตั้งและเริ่มต้นใช้งาน (Installation)

### 1. Prerequisites
- Node.js (v18+)
- Docker & Docker Compose

### 2. Clone Repository
```bash
git clone [https://github.com/your-username/smartbin-project.git](https://github.com/your-username/smartbin-project.git)
cd smartbin-project


****Backend Setup (NestJS + Prisma)****
เนื่องจากโปรเจกต์นี้ใช้ระบบ Split Schema (แยกไฟล์ Prisma) ต้องทำการ Merge ก่อน
cd backend

# ติดตั้ง Dependencies
npm install

# 1. รวมไฟล์ Schema (สำคัญมาก!)
node prisma/prisma-merge.js
# หรือ (ถ้ามี script)
npm run merge-schema

# 2. สร้าง Prisma Client
npx prisma generate

# 3. เริ่มต้น Server หรือ Build Docker
cd ..
docker-compose up -d --build


****Frontend Setup (Next.js)****
cd frontend

# ติดตั้ง Dependencies
npm install

# รันโหมดผู้พัฒนา
npm run dev

เปิดใช้งานได้ที่: http://localhost:3000

****การจัดการฐานข้อมูล (Database & Prisma)****
โปรเจกต์นี้จัดการ Database ผ่าน Docker และ Prisma commands:
อัปเดต Database ให้ตรงกับ Schema: (ใช้เมื่อมีการแก้ model ใหม่ เช่น เพิ่ม field)

# รันผ่าน Docker container
docker-compose exec backend npx prisma db push

# เปิดดูข้อมูลใน Database (GUI)
npx prisma studio

****Workflow การแก้ไข Database:****

แก้ไขไฟล์ย่อยใน backend/prisma/models/*.prisma

รัน node prisma/prisma-merge.js เพื่อรวมไฟล์

รัน npx prisma generate เพื่ออัปเดต Type

รัน npx prisma db push เพื่อแก้ตารางใน DB จริง


****อัพไฟล์ขึ้น github****

git add .

git commit -m "Update: อัปเดตโค้ดล่าสุด"

git push