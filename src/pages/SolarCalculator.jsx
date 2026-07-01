import { useState } from 'react';
import { ArrowLeft, Calculator, Zap, BatteryCharging } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const SolarCalculator = () => {
  const navigate = useNavigate();
  const [calcMode, setCalcMode] = useState('bill'); // 'bill' or 'load'
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState(null);

  const calculateROI = (e) => {
    e.preventDefault();
    const value = parseFloat(inputValue);
    if (isNaN(value) || value <= 0) {
      toast.error('กรุณากรอกตัวเลขให้ถูกต้อง (มากกว่า 0)');
      return;
    }

    let recommendedKW = 0;
    let actualSavingsPerMonth = 0;
    const PSH = 4; // Peak Sun Hours for Thailand (avg 4-4.5 hrs)
    const panelWattage = 550; // Standard 550W panel
    const costPerKW = 25000; // Estimated cost per kW in Baht

    if (calcMode === 'bill') {
      // Mode: Calculate from Monthly Bill
      // Assumptions: 1 kW solar generates ~4 units/day = 120 units/month = 600 Baht/month savings (at 5 Baht/unit)
      const targetSavings = value * 0.7; // Aim to cover 70% of bill
      recommendedKW = targetSavings / 600;
      
      // Round to standard sizes (3kW, 5kW, 10kW)
      if (recommendedKW <= 3) recommendedKW = 3;
      else if (recommendedKW <= 5) recommendedKW = 5;
      else if (recommendedKW <= 10) recommendedKW = 10;
      else recommendedKW = Math.ceil(recommendedKW);

      actualSavingsPerMonth = recommendedKW * 600;

    } else {
      // Mode: Calculate from Daily Load (kWh/day)
      // If user needs 53.92 kWh/day, the system size should be Daily Load / PSH
      recommendedKW = value / PSH;
      // We don't snap to 3/5/10 here to give exact sizing for engineering purposes
      recommendedKW = Number(recommendedKW.toFixed(2));
      
      // Savings = kWh * 5 Baht * 30 days
      actualSavingsPerMonth = (recommendedKW * PSH) * 5 * 30;
    }

    // Common calculations based on recommendedKW
    const totalWatts = recommendedKW * 1000;
    const numberOfPanels = Math.ceil(totalWatts / panelWattage);
    const inverterSize = Math.ceil(recommendedKW); // Round up to next whole kW for inverter
    
    const actualSavingsPerYear = actualSavingsPerMonth * 12;
    const estimatedCost = recommendedKW * costPerKW;
    const paybackYears = (estimatedCost / actualSavingsPerYear).toFixed(1);
    const requiredArea = numberOfPanels * 2.6; // ~2.6 sqm per 550W panel

    setResult({
      recommendedKW,
      numberOfPanels,
      panelWattage,
      inverterSize,
      actualSavingsPerMonth,
      actualSavingsPerYear,
      estimatedCost,
      paybackYears,
      requiredArea: requiredArea.toFixed(1)
    });
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '0.5rem' }}
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-gradient-solar" style={{ marginBottom: 0, fontSize: '2rem' }}>ประเมินจุดคุ้มทุนโซลาร์เซลล์</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Solar ROI & System Sizing Calculator</p>
        </div>
      </div>

      <div className="grid-2">
        <div className="equipment-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <button 
              onClick={() => { setCalcMode('bill'); setResult(null); setInputValue(''); }}
              style={{ flex: 1, padding: '1rem', borderRadius: '8px', border: calcMode === 'bill' ? '2px solid var(--accent-solar)' : '1px solid var(--border-color)', background: calcMode === 'bill' ? 'rgba(255,165,0,0.1)' : 'var(--bg-tertiary)', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
            >
              <Zap size={24} color={calcMode === 'bill' ? 'var(--accent-solar)' : 'var(--text-secondary)'} />
              คำนวณจากค่าไฟ (บาท/เดือน)
            </button>
            <button 
              onClick={() => { setCalcMode('load'); setResult(null); setInputValue(''); }}
              style={{ flex: 1, padding: '1rem', borderRadius: '8px', border: calcMode === 'load' ? '2px solid var(--accent-solar)' : '1px solid var(--border-color)', background: calcMode === 'load' ? 'rgba(255,165,0,0.1)' : 'var(--bg-tertiary)', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
            >
              <BatteryCharging size={24} color={calcMode === 'load' ? 'var(--accent-solar)' : 'var(--text-secondary)'} />
              คำนวณจากโหลด (kWh/วัน)
            </button>
          </div>
          
          <form onSubmit={calculateROI} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                {calcMode === 'bill' ? 'ค่าไฟเฉลี่ยต่อเดือน (บาท)' : 'การใช้พลังงานเป้าหมาย (kWh/วัน)'}
              </label>
              <input 
                type="number" 
                step={calcMode === 'load' ? '0.01' : '1'}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={calcMode === 'bill' ? 'เช่น 3500' : 'เช่น 53.92'}
                style={{ 
                  width: '100%', 
                  padding: '1rem', 
                  borderRadius: '8px', 
                  border: '1px solid var(--border-color)', 
                  background: 'var(--bg-primary)', 
                  color: 'var(--text-primary)',
                  fontSize: '1.1rem'
                }}
                required
              />
            </div>
            
            <button 
              type="submit" 
              style={{ 
                background: 'linear-gradient(135deg, #FFB75E 0%, #ED8F03 100%)', 
                color: 'white', 
                padding: '1rem', 
                borderRadius: '8px', 
                border: 'none', 
                fontSize: '1.1rem', 
                fontWeight: 'bold', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <Calculator size={20} /> ประเมินระบบ & คำนวณความคุ้มค่า
            </button>
          </form>
        </div>

        {result && (
          <div className="equipment-card animate-fade-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'rgba(255, 165, 0, 0.05)', border: '1px solid rgba(255, 165, 0, 0.2)' }}>
            <h3 className="text-gradient-solar">ผลการประเมินออกแบบระบบ</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '8px' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>ขนาดระบบที่แนะนำ</p>
                <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--accent-solar)' }}>{result.recommendedKW} <span style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>kW</span></p>
              </div>
              <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '8px' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>ขนาดอินเวอร์เตอร์ (ขั้นต่ำ)</p>
                <p style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{result.inverterSize} <span style={{ fontSize: '1rem' }}>kW</span></p>
              </div>

              <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '8px' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>จำนวนแผงโซลาร์ ({result.panelWattage}W)</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{result.numberOfPanels} <span style={{ fontSize: '1rem' }}>แผง</span></p>
              </div>
              <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '8px' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>พื้นที่หลังคาที่ต้องใช้</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{result.requiredArea} <span style={{ fontSize: '1rem' }}>ตร.ม.</span></p>
              </div>
              
              <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '8px', gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', textAlign: 'center' }}>
                <div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>งบประมาณเบื้องต้น</p>
                  <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{(result.estimatedCost).toLocaleString()} <span style={{ fontSize: '0.9rem' }}>บาท</span></p>
                </div>
                <div style={{ borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)' }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>ประหยัดไฟได้</p>
                  <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#4CAF50' }}>{(result.actualSavingsPerMonth).toLocaleString()} <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>บาท/เดือน</span></p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>ระยะเวลาคืนทุน</p>
                  <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{result.paybackYears} <span style={{ fontSize: '0.9rem' }}>ปี</span></p>
                </div>
              </div>
            </div>
            
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
              * หมายเหตุ: อ้างอิงชั่วโมงแดดเฉลี่ย (Peak Sun Hours) 4 ชั่วโมง/วัน และแผงโซลาร์เซลล์ขนาด 550W. ราคาติดตั้งอาจเปลี่ยนแปลงตามหน้างานและยี่ห้ออุปกรณ์
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SolarCalculator;
