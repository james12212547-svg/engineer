import { useState } from 'react';
import { ArrowLeft, Wrench, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const scenarios = {
  start: {
    question: 'ลูกค้าแจ้งว่า: "แอร์ที่บ้านทำงานปกติ ลมออก แต่ลมไม่เย็นเลย" คุณจะเริ่มเช็คอะไรเป็นอันดับแรก?',
    options: [
      { text: 'เช็คฟิลเตอร์และคอยล์เย็นว่าตันหรือไม่', next: 'checkFilter' },
      { text: 'เอาเกจจ์ไปวัดน้ำยาแอร์ที่คอยล์ร้อนทันที', next: 'checkRefrigerant' },
      { text: 'เช็คว่าคอมเพรสเซอร์ทำงานหรือไม่', next: 'checkCompressor' }
    ]
  },
  checkFilter: {
    question: 'คุณเปิดฝาดูพบว่าฟิลเตอร์ฝุ่นเกาะหนามาก และคอยล์เย็นก็มีฝุ่นตัน คุณจะทำอย่างไร?',
    options: [
      { text: 'ล้างทำความสะอาดแอร์ (ล้างใหญ่)', next: 'successFilter' },
      { text: 'เติมน้ำยาแอร์เพิ่ม', next: 'failOvercharge' }
    ]
  },
  checkRefrigerant: {
    question: 'คุณเอาเกจจ์ไปวัดน้ำยา พบว่าน้ำยาปกติ (150 psi สำหรับ R32) แต่คอมเพรสเซอร์ไม่ได้ทำงาน มีแต่พัดลมหมุน คุณจะทำอย่างไร?',
    options: [
      { text: 'เช็คคาปาซิเตอร์ (Capacitor) ของคอมเพรสเซอร์', next: 'checkCapacitor' },
      { text: 'ปล่อยน้ำยาทิ้งแล้วเติมใหม่', next: 'failWaste' }
    ]
  },
  checkCompressor: {
    question: 'คุณเดินไปดูคอยล์ร้อน พบว่าพัดลมหมุน แต่ไม่ได้ยินเสียงคอมเพรสเซอร์ทำงาน (หรือดังแต๊กแล้วตัด) คุณจะเช็คอะไร?',
    options: [
      { text: 'เช็คคาปาซิเตอร์ (Capacitor) ของคอมเพรสเซอร์', next: 'checkCapacitor' },
      { text: 'สรุปว่าคอมพัง และแจ้งเปลี่ยนคอมเพรสเซอร์ใหม่', next: 'failExpensive' }
    ]
  },
  checkCapacitor: {
    question: 'คุณถอดคาปาซิเตอร์มาวัดด้วยมัลติมิเตอร์ พบว่าค่าความจุ (uF) ลดลงไปมากหรือแทบไม่มีเลย',
    options: [
      { text: 'เปลี่ยนคาปาซิเตอร์ตัวใหม่ที่มีค่า uF เท่าเดิม', next: 'successCapacitor' }
    ]
  },
  
  // Results
  successFilter: {
    result: 'success',
    title: '✅ แก้ไขสำเร็จ!',
    desc: 'เก่งมากครับ! ปัญหาลมไม่เย็นส่วนใหญ่เกิดจากแอร์ตัน ทำให้ลมผ่านคอยล์เย็นไม่ได้ การล้างแอร์เป็นวิธีแก้ปัญหาที่ถูกต้องที่สุดและประหยัดที่สุด'
  },
  successCapacitor: {
    result: 'success',
    title: '✅ แก้ไขสำเร็จ!',
    desc: 'ยอดเยี่ยม! การที่คอมเพรสเซอร์ไม่สตาร์ทมักเกิดจาก Capacitor เสีย (ค่าเสื่อม/บวม) การเปลี่ยน Cap เป็นการแก้ปัญหาที่ตรงจุดและเสียค่าใช้จ่ายน้อยที่สุด'
  },
  failOvercharge: {
    result: 'fail',
    title: '❌ แก้ไขผิดพลาด!',
    desc: 'การเติมน้ำยาโดยที่แอร์ยังตันอยู่ จะทำให้ความดันในระบบสูงเกินไป (Overcharge) คอมเพรสเซอร์จะทำงานหนักและพังได้ น้ำยาแอร์ระบบปิดจะไม่หายไปไหนถ้าไม่รั่วครับ'
  },
  failWaste: {
    result: 'fail',
    title: '❌ แก้ไขผิดพลาด!',
    desc: 'เสียเวลาและเสียเงินลูกค้าฟรีๆ! น้ำยาแอร์ไม่ได้เสื่อมสภาพ การปล่อยทิ้งไม่ได้แก้ปัญหาที่คอมเพรสเซอร์ไม่ทำงาน'
  },
  failExpensive: {
    result: 'fail',
    title: '❌ ช่างสายฟันหัวแบะ!',
    desc: 'ใจเย็นๆ ก่อน! คอมเพรสเซอร์พังยากมาก ควรเช็คอุปกรณ์ส่วนควบอย่าง Capacitor หรือ แมกเนติกคอนแทคเตอร์ ก่อนที่จะฟันธงว่าคอมพังครับ'
  }
};

const TroubleshootingSim = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('start');

  const step = scenarios[currentStep];

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '0.5rem' }}>
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-gradient-solar" style={{ marginBottom: 0, fontSize: '2rem' }}>จำลองสถานการณ์ซ่อมบำรุง</h1>
          <p style={{ color: 'var(--text-secondary)' }}>HVAC Troubleshooting Simulator</p>
        </div>
      </div>

      <div className="equipment-card" style={{ padding: '2.5rem', maxWidth: '800px', margin: '0 auto', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
        
        {step.result ? (
          <div className="animate-fade-in" style={{ textAlign: 'center', margin: 'auto' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: step.result === 'success' ? '#4CAF50' : '#F44336' }}>
              {step.title}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '3rem' }}>
              {step.desc}
            </p>
            <button 
              onClick={() => setCurrentStep('start')}
              style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', padding: '1rem 2rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '1.1rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <RefreshCcw size={20} /> ลองจำลองสถานการณ์ใหม่
            </button>
          </div>
        ) : (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', color: 'var(--accent-solar)' }}>
              <Wrench size={32} />
              <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--text-primary)' }}>สถานการณ์: แอร์ไม่เย็น</h2>
            </div>
            
            <p style={{ fontSize: '1.3rem', lineHeight: '1.6', marginBottom: '3rem', flex: 1 }}>
              {step.question}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {step.options.map((opt, i) => (
                <button 
                  key={i}
                  className="quiz-option-hover"
                  onClick={() => setCurrentStep(opt.next)}
                  style={{ padding: '1.2rem', borderRadius: '8px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '1.1rem', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TroubleshootingSim;
