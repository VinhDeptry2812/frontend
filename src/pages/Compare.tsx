import { CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Compare() {
  const specs = [
    { label: "Chất liệu bọc", p1: "Da Bò Ý Cao Cấp", p2: "Vải Nhung Bỉ", p3: "Da Công Nghiệp Microfiber" },
    { label: "Kích thước (D x R)", p1: "280 x 170 cm", p2: "220 x 90 cm", p3: "320 x 180 cm" },
    { label: "Chất liệu khung", p1: "Gỗ Sồi 100%", p2: "Gỗ Thông ghép", p3: "Gỗ Sồi kết hợp kim loại" },
    { label: "Thời gian bảo hành", p1: "5 năm", p2: "2 năm", p3: "3 năm" },
    { label: "Phần tựa gật gù", p1: true, p2: false, p3: true },
    { label: "Đệm tựa có thể tháo rời", p1: false, p2: true, p3: false },
    { label: "Sức chứa", p1: "4 - 5 người", p2: "3 người", p3: "5 - 6 người" },
  ];

  const renderBool = (val: string | boolean) => {
    if (typeof val === 'boolean') {
      return val ? <CheckCircle className="w-5 h-5 text-green-500 mx-auto" /> : <XCircle className="w-5 h-5 text-red-500/50 mx-auto" />;
    }
    return val;
  };

  return (
    <div className="bg-white dark:bg-background-dark min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold font-serif mb-8 text-center text-amber-900 dark:text-amber-500">So sánh kiểu dáng bàn ghế</h1>
        
        <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr>
                <th className="w-1/4 p-6 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700"></th>
                
                {['Sofa Góc Da Chữ L', 'Sofa Văng Nhung Đôi', 'Sofa Modul Cao Cấp'].map((name, i) => (
                  <th key={name} className="w-1/4 p-6 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 border-l border-gray-200 dark:border-gray-800 text-center">
                    <img 
                      src={
                        i === 0 ? "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80" :
                        i === 1 ? "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=400&q=80" :
                        "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=400&q=80"
                      }
                      alt={name} 
                      className="w-48 h-32 object-cover rounded-lg mx-auto mb-4 hover:scale-105 transition-transform"
                    />
                    <h3 className="font-bold text-lg mb-2">{name}</h3>
                    <div className="text-amber-600 font-bold mb-4">{i === 0 ? '16.990.000₫' : i === 1 ? '9.500.000₫' : '22.000.000₫'}</div>
                    <Link to="/product/1" className="px-6 py-2 bg-amber-600 text-white rounded-lg text-sm font-bold hover:bg-amber-700 transition-colors inline-block w-full">
                      Xem Chi Tiết
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {specs.map((spec, index) => (
                <tr key={index} className="hover:bg-amber-50 dark:hover:bg-gray-800/20 transition-colors">
                  <td className="p-4 font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800 w-1/4">
                    {spec.label}
                  </td>
                  <td className="p-4 text-center text-gray-600 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 border-l border-gray-100 dark:border-gray-800">
                    {renderBool(spec.p1)}
                  </td>
                  <td className="p-4 text-center text-gray-600 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 border-l border-gray-100 dark:border-gray-800 bg-amber-50/50 dark:bg-amber-900/10">
                    {renderBool(spec.p2)}
                  </td>
                  <td className="p-4 text-center text-gray-600 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 border-l border-gray-100 dark:border-gray-800">
                    {renderBool(spec.p3)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
