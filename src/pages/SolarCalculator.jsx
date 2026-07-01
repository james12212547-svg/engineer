import { useState, useMemo } from 'react';
import { ArrowLeft, Calculator, Zap, BatteryCharging, TrendingUp } from 'lucide-react';
import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { calculateSolarRoi } from '../utils/engineering/solarRoi';

const InvestmentChart = ({ cost, monthlySavings }) => {
  const [returnRate, setReturnRate] = useState(5); // Default 5%
  const [years, setYears] = useState(20);

  // Generate Data
  const data = useMemo(() => {
    const arr = [];
    let compounded = 0;
    const annualSavings = monthlySavings * 12;
    const rate = returnRate / 100;
    
    for (let y = 0; y <= years; y++) {
      if (y === 0) {
        arr.push({ year: y, "เงินประหยัดสะสม": 0, "มูลค่าทบต้น": 0, "จุดคุ้มทุน (ต้นทุน)": cost });
      } else {
        compounded = (compounded + annualSavings) * (1 + rate);
        arr.push({ 
          year: y, 
          "เงินประหยัดสะสม": Math.round(annualSavings * y), 
          "มูลค่าทบต้น": Math.round(compounded),
          "จุดคุ้มทุน (ต้นทุน)": cost 
        });
      }
    }
    return arr;
  }, [cost, monthlySavings, returnRate, years]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
          <p style={{ margin: '0 0 0.5rem', fontWeight: 'bold' }}>ปีที่ {label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color, margin: '0.25rem 0', fontSize: '0.9rem' }}>
              {entry.name}: {entry.value.toLocaleString()} ฿
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ marginTop: '2rem', padding: '2rem', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={20} color="var(--accent-solar)" /> การเติบโตของการลงทุน (Investment Growth)
          </h3>
          <p style={{ margin: '0.25rem 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            เปรียบเทียบการนำเงินประหยัดค่าไฟรายเดือนไปลงทุนต่อ (Compound Interest)
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>ผลตอบแทนลงทุน (%/ปี)</label>
            <input 
              type="number" 
              value={returnRate} 
              onChange={e => setReturnRate(Number(e.target.value))}
              style={{ width: '90px', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>ระยะเวลา (ปี)</label>
            <input 
              type="number" 
              value={years} 
              onChange={e => setYears(Number(e.target.value))}
              style={{ width: '90px', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
            />
          </div>
        </div>
      </div>
      
      <div style={{ width: '100%', height: '350px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCompounded" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <XAxis dataKey="year" stroke="var(--text-tertiary)" tick={{ fill: 'var(--text-tertiary)' }} />
            <YAxis stroke="var(--text-tertiary)" tick={{ fill: 'var(--text-tertiary)' }} tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} width={60} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ paddingBottom: '1rem' }} />
            <Area type="monotone" dataKey="เงินประหยัดสะสม" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSavings)" strokeWidth={2} />
            <Area type="monotone" dataKey="มูลค่าทบต้น" stroke="#10b981" fillOpacity={1} fill="url(#colorCompounded)" strokeWidth={3} />
            <Line type="monotone" dataKey="จุดคุ้มทุน (ต้นทุน)" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div style={{ marginTop: '2rem', padding: '1.25rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '8px', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
        <div style={{ background: '#10b981', color: 'white', padding: '0.75rem', borderRadius: '50%', display: 'flex', flexShrink: 0 }}>
          <TrendingUp size={24} />
        </div>
        <div>
          <h4 style={{ margin: 0, color: '#10b981', fontSize: '1.1rem' }}>วิสัยทัศน์ทางธุรกิจและการลงทุน</h4>
          <p style={{ margin: '0.5rem 0 0', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
            การลงทุนโซลาร์เซลล์ไม่ได้เป็นเพียงแค่การลดค่าใช้จ่าย แต่หากนำเงินที่ประหยัดได้ <strong>{(monthlySavings).toLocaleString()} บาท/เดือน</strong> ไปลงทุนต่อยอดในธุรกิจหรือกองทุนรวมที่ให้ผลตอบแทนเฉลี่ย <strong>{returnRate}% ต่อปี</strong>
            <br />
            ภายในระยะเวลา <strong>{years} ปี</strong> มูลค่ารวมของผลประหยัดจะกลายเป็น <strong>{data[data.length - 1]["มูลค่าทบต้น"].toLocaleString()} บาท</strong> ซึ่งมากกว่ามูลค่าเงินต้นและให้กำไรสุทธิมหาศาล!
          </p>
        </div>
      </div>
    </div>
  );
};

const SolarCalculator = () => {
  const navigate = useNavigate();
  const [calcMode, setCalcMode] = useState('bill'); // 'bill' or 'load'
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState(null);

  const calculateROI = (e) => {
    e.preventDefault();
    const calculationResult = calculateSolarRoi(calcMode, inputValue);
    if (!calculationResult) {
      toast.error('กรุณากรอกตัวเลขให้ถูกต้อง (มากกว่า 0)');
      return;
    }
    setResult(calculationResult);
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
            
            {/* 📈 WOW Factor: Investment Chart */}
            <InvestmentChart cost={result.estimatedCost} monthlySavings={result.actualSavingsPerMonth} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SolarCalculator;
