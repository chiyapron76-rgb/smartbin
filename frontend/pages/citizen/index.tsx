import Link from "next/link";
import Layout from "../../components/shared/Layout";

export default function CitizenHome() {
  return (
    <Layout>
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Citizen Portal</h1>

        <div className="flex flex-col gap-4">

          <Link href="/citizen/bins" className="p-4 bg-white rounded shadow">
            <div className="text-lg font-semibold">เลือกถังขยะ</div>
            <div className="text-gray-500 text-sm">ค้นหาถังใกล้เคียงและแจ้งปัญหา</div>
          </Link>

          <Link href="/citizen/my-reports" className="p-4 bg-white rounded shadow">
            <div className="text-lg font-semibold">ประวัติการแจ้งปัญหา</div>
            <div className="text-gray-500 text-sm">ดูสถานะการแจ้งที่คุณเคยส่ง</div>
          </Link>

          <Link href="/citizen/rate" className="p-4 bg-white rounded shadow">
            <div className="text-lg font-semibold">ให้คะแนนการใช้งาน</div>
            <div className="text-gray-500 text-sm">ประเมินความพึงพอใจต่อระบบ</div>
          </Link>

        </div>
      </div>
    </Layout>
  );
}
