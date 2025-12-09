SmartBin - Next + Nest + Prisma + Postgres (Docker)

How to run:
1. docker compose up --build
2. Open frontend: http://localhost:3000
3. API endpoints (backend): http://localhost:3001/api/bins , /api/sensor-record
prisma schema


รันทีละ step

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
