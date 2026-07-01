import { useState } from 'react';
import { ArrowLeft, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CableSizing = () => {
  const navigate = useNavigate();
  const [ampere, setAmpere] = useState('');
  const [result, setResult] = useState(null);

  const calculateCable = (e) => {
    e.preventDefault();
    const amp = parseFloat(ampere);
    if (isNaN(amp) || amp <= 0) return;

    // Very simplified standard mapping (similar to Thai EIT standard for THW/VAF in PVC pipe)
    let cableSize = "0";
    let breakerSize = 0;

    if (amp <= 11) { cableSize = "1.5"; breakerSize = 10; }
    else if (amp <= 15) { cableSize = "2.5"; breakerSize = 16; }
    else if (amp <= 21) { cableSize = "4"; breakerSize = 20; }
    else if (amp <= 28) { cableSize = "6"; breakerSize = 32; }
    else if (amp <= 38) { cableSize = "10"; breakerSize = 40; }
    else if (amp <= 50) { cableSize = "16"; breakerSize = 50; }
    else if (amp <= 65) { cableSize = "25"; breakerSize = 63; }
    else if (amp <= 81) { cableSize = "35"; breakerSize = 80; }
    else if (amp <= 99) { cableSize = "50"; breakerSize = 100; }
    else { cableSize = "ปรึกษาวิศวกรออกแบบ"; breakerSize = "Over 100"; }

    setResult({
      load: amp,
      cableSize,
      breakerSize
    });
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '0.5rem' }}>
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-gradient-solar" style={{ marginBottom: 0, fontSize: '2rem' }}>โปรแกรมคำนวณขนาดสายไฟ</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Simplified Cable Sizing (EIT Guidelines)</p>
        </div>
      </div>

      <div className="grid-2">
        <div className="equipment-card" style={{ padding: '2rem' }}>
          <form onSubmit={calculateCable} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>กระแสไฟฟ้าของโหลด (Ampere)</label>
              <input 
                type="number" 
                step="0.1" 
                value={ampere} 
                onChange={(e) => setAmpere(e.target.value)} 
                placeholder="เช่น 18"
                required 
                style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '1.2rem' }} 
              />
            </div>
            
            <button type="submit" style={{ background: 'linear-gradient(135deg, #FFB75E 0%, #ED8F03 100%)', color: 'white', padding: '1rem', borderRadius: '8px', border: 'none', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Zap size={20} /> คำนวณขนาดสายไฟ
            </button>
          </form>
        </div>

        {result && (
          <div className="equipment-card animate-fade-in" style={{ padding: '2rem', background: 'rgba(255, 165, 0, 0.05)', border: '1px solid rgba(255, 165, 0, 0.2)' }}>
            <h3 className="text-gradient-solar" style={{ marginBottom: '1.5rem' }}>ผลการคำนวณเบื้องต้น</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>ขนาดสายไฟที่แนะนำ (THW / VAF เดินในท่อ)</p>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-solar)' }}>
                  {result.cableSize} <span style={{ fontSize: '1rem', fontWeight: 'normal' }}>ตร.มม. (sq.mm)</span>
                </p>
              </div>

              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>ขนาดเบรกเกอร์ (CB) ที่เหมาะสม</p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                  {result.breakerSize} <span style={{ fontSize: '1rem', fontWeight: 'normal' }}>AT</span>
                </p>
              </div>
            </div>
            
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
              <strong>⚠️ คำเตือน:</strong><br />
              การคำนวณนี้เป็นแบบง่าย (Simplified) อ้างอิงจากตารางเดินสายในท่อ PVC สำหรับ 1 วงจร ในการออกแบบหน้างานจริง ต้องคำนึงถึงอุณหภูมิแวดล้อม จำนวนสายในท่อ และแรงดันตก (Voltage Drop) ด้วย
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CableSizing;
