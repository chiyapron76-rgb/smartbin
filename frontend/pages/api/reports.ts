import type { NextApiRequest, NextApiResponse } from 'next';

// 🗄️ ตัวแปรเก็บข้อมูล (Database จำลอง)
// ข้อมูลจะอยู่จนกว่าจะ Restart Server (ปิดแล้วเปิดใหม่)
let reportsDatabase: any[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  
  // 📥 1. รับข้อมูลจาก Citizen (POST)
  if (req.method === 'POST') {
    const newReport = {
      ...req.body,
      id: Date.now(), // สร้าง ID
      created_at: new Date().toISOString(),
      status: 'pending' // สถานะเริ่มต้น
    };
    
    // บันทึกข้อมูล
    reportsDatabase.unshift(newReport); 
    console.log("✅ ได้รับข้อมูลใหม่:", newReport);

    return res.status(200).json(newReport);
  } 
  
  // 📤 2. ส่งข้อมูลให้ Admin/Citizen ดู (GET)
  else if (req.method === 'GET') {
    const { device_uuid } = req.query;

    if (device_uuid) {
      // Citizen ดูของตัวเอง
      const myReports = reportsDatabase.filter(r => r.device_uuid === device_uuid);
      return res.status(200).json(myReports);
    } else {
      // Admin ดูทั้งหมด
      return res.status(200).json(reportsDatabase);
    }
  }

  // 🔄 3. Admin กดจบงาน (PATCH)
  else if (req.method === 'PATCH') {
     const { id, status } = req.body;
     const index = reportsDatabase.findIndex(r => String(r.id) === String(id));
     
     if (index > -1) {
       reportsDatabase[index].status = status;
       return res.status(200).json(reportsDatabase[index]);
     } else {
       return res.status(404).json({ message: "Not found" });
     }
  }
  
  return res.status(405).end();
}