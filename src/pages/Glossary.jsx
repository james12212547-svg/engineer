import { useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const glossaryData = [
  { term: 'AC', full: 'Alternating Current', th: 'ไฟฟ้ากระแสสลับ', desc: 'กระแสไฟฟ้าที่มีทิศทางการไหลกลับไปกลับมา มักใช้ในบ้านเรือนทั่วไป' },
  { term: 'AHU', full: 'Air Handling Unit', th: 'เครื่องจ่ายลมเย็น', desc: 'อุปกรณ์ขนาดใหญ่ในระบบปรับอากาศศูนย์กลาง ทำหน้าที่ดึงอากาศมาผสมกับอากาศภายนอก กรองความฝุ่น และเป่าผ่านคอยล์เย็นเพื่อจ่ายไปตามท่อลม' },
  { term: 'BTU', full: 'British Thermal Unit', th: 'บีทียู (หน่วยความร้อน)', desc: 'หน่วยวัดปริมาณความร้อน นิยมใช้บอกขนาดทำความเย็นของแอร์ 1 ตันความเย็น = 12,000 BTU/hr' },
  { term: 'Compressor', full: 'Compressor', th: 'คอมเพรสเซอร์', desc: 'อุปกรณ์ที่ทำหน้าที่ดูดและอัดความดันสารทำความเย็นในสถานะแก๊สให้มีความดันและอุณหภูมิสูงขึ้น เปรียบเสมือนหัวใจของระบบแอร์' },
  { term: 'DC', full: 'Direct Current', th: 'ไฟฟ้ากระแสตรง', desc: 'กระแสไฟฟ้าที่มีทิศทางการไหลทางเดียว เช่น ไฟฟ้าจากแบตเตอรี่ หรือจากแผงโซลาร์เซลล์' },
  { term: 'FCU', full: 'Fan Coil Unit', th: 'คอยล์เย็น', desc: 'ส่วนของแอร์ที่ติดตั้งอยู่ภายในห้อง ทำหน้าที่ดูดอากาศร้อนในห้องผ่านแผงคอยล์เพื่อสร้างลมเย็น' },
  { term: 'Inverter', full: 'Inverter', th: 'อินเวอร์เตอร์', desc: 'อุปกรณ์แปลงไฟ DC เป็น AC (ในงานโซลาร์เซลล์) หรือวงจรปรับความถี่ไฟฟ้าเพื่อควบคุมความเร็วรอบของคอมเพรสเซอร์ (ในแอร์)' },
  { term: 'MDB', full: 'Main Distribution Board', th: 'ตู้จ่ายไฟหลัก', desc: 'ตู้ควบคุมระบบไฟฟ้าหลักของอาคาร รับไฟจากการไฟฟ้าก่อนกระจายไปยังแผงย่อย' },
  { term: 'SPD', full: 'Surge Protective Device', th: 'อุปกรณ์ป้องกันไฟกระชาก', desc: 'อุปกรณ์ที่ช่วยเบี่ยงเบนกระแสไฟฟ้าระดับสูงชั่วขณะ (เช่น ฟ้าผ่า) ทิ้งลงกราวด์ เพื่อป้องกันอุปกรณ์ไฟฟ้าพัง' },
  { term: 'VFD', full: 'Variable Frequency Drive', th: 'อุปกรณ์ปรับความถี่', desc: 'อุปกรณ์ควบคุมความเร็วรอบของมอเตอร์ (เช่น มอเตอร์พัดลม หรือ ปั๊มน้ำ) โดยการปรับเปลี่ยนความถี่และแรงดันไฟฟ้า' },
].sort((a, b) => a.term.localeCompare(b.term));

const Glossary = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = glossaryData.filter(item => 
    item.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.full.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.th.includes(searchTerm)
  );

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '0.5rem' }}>
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-gradient-ac" style={{ marginBottom: 0, fontSize: '2rem' }}>พจนานุกรมศัพท์วิศวกรรม</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Engineering Glossary A-Z</p>
        </div>
      </div>

      <div className="equipment-card" style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
        
        <div style={{ position: 'relative', marginBottom: '2rem' }}>
          <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <input 
            type="text" 
            placeholder="ค้นหาคำศัพท์, คำย่อ, หรือความหมายภาษาไทย..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '1.1rem' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.length > 0 ? filtered.map((item, index) => (
            <div key={index} style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderLeft: '4px solid var(--accent-ac)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--accent-ac)', margin: 0 }}>{item.term}</h3>
                <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>({item.full})</span>
              </div>
              <p style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{item.th}</p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>{item.desc}</p>
            </div>
          )) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-tertiary)' }}>
              ไม่พบคำศัพท์ที่ค้นหา
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Glossary;
