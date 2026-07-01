import { useState } from 'react';
import { ArrowLeft, Zap, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PfcCalculator = () => {
  const navigate = useNavigate();
  const [activePower, setActivePower] = useState(''); // kW
  const [currentPF, setCurrentPF] = useState('');
  const [targetPF, setTargetPF] = useState('0.95');
  const [result, setResult] = useState(null);

  const calculatePFC = (e) => {
    e.preventDefault();
    const P = parseFloat(activePower);
    const pf1 = parseFloat(currentPF);
    const pf2 = parseFloat(targetPF);

    if (isNaN(P) || isNaN(pf1) || isNaN(pf2) || pf1 <= 0 || pf1 >= 1 || pf2 <= 0 || pf2 > 1 || pf1 >= pf2) {
      alert("กรุณากรอกข้อมูลให้ถูกต้อง (PF ต้องอยู่ระหว่าง 0 - 1 และ Target PF ต้องมากกว่า Current PF)");
      return;
    }

    // Calculate required kVAr
    const acos1 = Math.acos(pf1);
    const acos2 = Math.acos(pf2);
    const tan1 = Math.tan(acos1);
    const tan2 = Math.tan(acos2);

    const requiredKvar = P * (tan1 - tan2);

    // Calculate generic penalty savings (MEA/PEA usually charge if PF < 0.85)
    // Formula: Penalty = (Max Demand kVA * 0.85 - Max Demand kW) or similar, 
    // but typically it's ~56 THB per kVAr below the standard.
    // We'll simulate a simple savings model for educational purposes.
    let oldKvar = P * tan1;
    let standardKvarAllowed = P * Math.tan(Math.acos(0.85)); // 0.85 is typical standard
    
    let oldPenalty = 0;
    if (pf1 < 0.85 && oldKvar > standardKvarAllowed) {
      oldPenalty = (oldKvar - standardKvarAllowed) * 56; // 56 THB/kVAr approx penalty rate
    }

    let newKvar = P * tan2;
    let newPenalty = 0;
    if (pf2 < 0.85 && newKvar > standardKvarAllowed) {
      newPenalty = (newKvar - standardKvarAllowed) * 56;
    }

    const monthlySavings = Math.max(0, oldPenalty - newPenalty);
    const estimatedCapCost = requiredKvar * 800; // Estimated 800 THB per kVAr installed
    const roiMonths = monthlySavings > 0 ? (estimatedCapCost / monthlySavings) : 0;

    setResult({
      kvar: requiredKvar.toFixed(2),
      savings: monthlySavings.toFixed(2),
      cost: estimatedCapCost.toFixed(2),
      roi: roiMonths > 0 ? roiMonths.toFixed(1) : 'ไม่มีจุดคุ้มทุน (ไม่โดนค่าปรับอยู่แล้ว)'
    });
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '0.5rem' }}>
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-gradient-solar" style={{ marginBottom: 0, fontSize: '2rem' }}>คำนวณปรับปรุง Power Factor (PFC)</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Capacitor Bank Sizing & ROI Calculator</p>
        </div>
      </div>

      <div className="grid-2">
        <div className="equipment-card" style={{ padding: '2rem' }}>
          <form onSubmit={calculatePFC} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>โหลดใช้งานจริง Active Power (kW)</label>
              <input type="number" step="0.1" value={activePower} onChange={(e) => setActivePower(e.target.value)} required placeholder="เช่น 500" style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Power Factor ปัจจุบัน</label>
              <input type="number" step="0.01" value={currentPF} onChange={(e) => setCurrentPF(e.target.value)} required placeholder="เช่น 0.70" style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Power Factor เป้าหมาย (Target PF)</label>
              <input type="number" step="0.01" value={targetPF} onChange={(e) => setTargetPF(e.target.value)} required placeholder="แนะนำ 0.95 - 1.0" style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
            </div>
            
            <button type="submit" style={{ background: 'linear-gradient(135deg, #FFB75E 0%, #ED8F03 100%)', color: 'white', padding: '1rem', borderRadius: '8px', border: 'none', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Zap size={20} /> คำนวณ Capacitor
            </button>
          </form>
        </div>

        {result && (
          <div className="equipment-card animate-fade-in" style={{ padding: '2rem', background: 'rgba(255, 165, 0, 0.05)', border: '1px solid rgba(255, 165, 0, 0.2)' }}>
            <h3 className="text-gradient-solar" style={{ marginBottom: '1.5rem' }}>ผลการคำนวณ</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>ขนาด Capacitor Bank ที่ต้องติดตั้งเพิ่ม</p>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-solar)' }}>
                  {result.kvar} <span style={{ fontSize: '1.2rem', fontWeight: 'normal' }}>kVAr</span>
                </p>
              </div>

              <div style={{ padding: '1.5rem', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#4CAF50' }}>
                  <TrendingUp size={20} /> <strong style={{ fontSize: '1.1rem' }}>วิเคราะห์ความคุ้มทุน (ประเมิน)</strong>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>ประหยัดค่าปรับ (ต่อเดือน)</span>
                    <strong style={{ fontSize: '1.2rem' }}>{Number(result.savings).toLocaleString()} ฿</strong>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>ระยะเวลาคืนทุน (เดือน)</span>
                    <strong style={{ fontSize: '1.2rem' }}>{result.roi}</strong>
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
              * หมายเหตุ: การคำนวณค่าปรับและระยะเวลาคืนทุนเป็นการประเมินเบื้องต้น โดยอิงจากอัตราค่าปรับ PF เฉลี่ยที่ 56 บาท/kVAr และราคาติดตั้ง Capacitor Bank เฉลี่ยที่ 800 บาท/kVAr
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PfcCalculator;
