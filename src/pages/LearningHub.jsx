import { Link } from 'react-router-dom';
import { Calculator, HelpCircle, Activity, SplitSquareHorizontal, Zap, Thermometer, Book, Box, ShieldAlert, ListChecks } from 'lucide-react';

const LearningHub = () => {
  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>ศูนย์การเรียนรู้</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        พื้นที่สำหรับการเรียนรู้และทดสอบความรู้ทางวิศวกรรมไฟฟ้าและเครื่องกล
      </p>

      <h2 style={{ fontSize: '1.5rem', margin: '2rem 0 1rem', color: 'var(--text-primary)' }}>1. หมวดการโต้ตอบ (Interactive)</h2>
      <div className="grid-2">
        <Link to="/learning/schematic" className="category-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(0, 240, 255, 0.1)', padding: '1rem', borderRadius: '50%', color: 'var(--accent-ac)' }}>
              <Activity size={48} />
            </div>
          </div>
          <div className="category-card-content" style={{ textAlign: 'center' }}>
            <h3 className="text-gradient-ac" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>แผนภาพวัฏจักรความเย็น</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.85rem' }}>Interactive Refrigeration Cycle</p>
          </div>
        </Link>
        <Link to="/learning/compare" className="category-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(0, 240, 255, 0.1)', padding: '1rem', borderRadius: '50%', color: 'var(--accent-ac)' }}>
              <SplitSquareHorizontal size={48} />
            </div>
          </div>
          <div className="category-card-content" style={{ textAlign: 'center' }}>
            <h3 className="text-gradient-ac" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>เปรียบเทียบสเปค</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.85rem' }}>Side-by-side Compare</p>
          </div>
        </Link>
      </div>

      <h2 style={{ fontSize: '1.5rem', margin: '3rem 0 1rem', color: 'var(--text-primary)' }}>2. หมวดเครื่องมือคำนวณ (Calculators)</h2>
      <div className="grid-3">
        <Link to="/learning/btu" className="category-card" style={{ padding: '1.5rem', minHeight: '200px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <div style={{ color: 'var(--accent-ac)' }}><Thermometer size={36} /></div>
          </div>
          <div className="category-card-content" style={{ textAlign: 'center' }}>
            <h3 className="text-gradient-ac" style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>คำนวณ BTU แอร์</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem' }}>BTU Calculator</p>
          </div>
        </Link>
        <Link to="/learning/calculator" className="category-card" style={{ padding: '1.5rem', minHeight: '200px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <div style={{ color: 'var(--accent-solar)' }}><Calculator size={36} /></div>
          </div>
          <div className="category-card-content" style={{ textAlign: 'center' }}>
            <h3 className="text-gradient-solar" style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>จุดคุ้มทุนโซลาร์</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem' }}>Solar ROI Calculator</p>
          </div>
        </Link>
        <Link to="/learning/cable" className="category-card" style={{ padding: '1.5rem', minHeight: '200px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <div style={{ color: 'var(--accent-solar)' }}><Zap size={36} /></div>
          </div>
          <div className="category-card-content" style={{ textAlign: 'center' }}>
            <h3 className="text-gradient-solar" style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>คำนวณขนาดสายไฟ</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem' }}>Cable Sizing</p>
          </div>
        </Link>
        <Link to="/learning/pfc" className="category-card" style={{ padding: '1.5rem', minHeight: '200px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <div style={{ color: 'var(--accent-solar)' }}><Zap size={36} /></div>
          </div>
          <div className="category-card-content" style={{ textAlign: 'center' }}>
            <h3 className="text-gradient-solar" style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>คำนวณ PFC</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem' }}>Capacitor & ROI</p>
          </div>
        </Link>
        <Link to="/learning/voltage-drop" className="category-card" style={{ padding: '1.5rem', minHeight: '200px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <div style={{ color: 'var(--accent-solar)' }}><ShieldAlert size={36} /></div>
          </div>
          <div className="category-card-content" style={{ textAlign: 'center' }}>
            <h3 className="text-gradient-solar" style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>คำนวณแรงดันตก</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem' }}>Voltage Drop</p>
          </div>
        </Link>
        <Link to="/learning/load-schedule" className="category-card" style={{ padding: '1.5rem', minHeight: '200px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <div style={{ color: 'var(--accent-solar)' }}><ListChecks size={36} /></div>
          </div>
          <div className="category-card-content" style={{ textAlign: 'center' }}>
            <h3 className="text-gradient-solar" style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>จัดตารางโหลด</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem' }}>Phase Balancing</p>
          </div>
        </Link>
      </div>

      <h2 style={{ fontSize: '1.5rem', margin: '3rem 0 1rem', color: 'var(--text-primary)' }}>3. หมวดการทดสอบ (Assessment)</h2>
      <div className="grid-2">
        <Link to="/learning/quiz" className="category-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(0, 240, 255, 0.1)', padding: '1rem', borderRadius: '50%', color: 'var(--accent-ac)' }}>
              <HelpCircle size={48} />
            </div>
          </div>
          <div className="category-card-content" style={{ textAlign: 'center' }}>
            <h3 className="text-gradient-ac" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>แบบทดสอบความรู้</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.85rem' }}>Engineering Quizzes</p>
          </div>
        </Link>
        <Link to="/learning/simulator" className="category-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(255, 165, 0, 0.1)', padding: '1rem', borderRadius: '50%', color: 'var(--accent-solar)' }}>
              <Activity size={48} />
            </div>
          </div>
          <div className="category-card-content" style={{ textAlign: 'center' }}>
            <h3 className="text-gradient-solar" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>จำลองซ่อมบำรุง</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.85rem' }}>Troubleshooting Sim</p>
          </div>
        </Link>
      </div>

      <h2 style={{ fontSize: '1.5rem', margin: '3rem 0 1rem', color: 'var(--text-primary)' }}>4. หมวดข้อมูลเชิงลึก (Deep Dive)</h2>
      <div className="grid-2">
        <Link to="/learning/glossary" className="category-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(0, 240, 255, 0.1)', padding: '1rem', borderRadius: '50%', color: 'var(--accent-ac)' }}>
              <Book size={48} />
            </div>
          </div>
          <div className="category-card-content" style={{ textAlign: 'center' }}>
            <h3 className="text-gradient-ac" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>พจนานุกรมศัพท์</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.85rem' }}>Glossary A-Z</p>
          </div>
        </Link>
        <Link to="/learning/3d" className="category-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(255, 165, 0, 0.1)', padding: '1rem', borderRadius: '50%', color: 'var(--accent-solar)' }}>
              <Box size={48} />
            </div>
          </div>
          <div className="category-card-content" style={{ textAlign: 'center' }}>
            <h3 className="text-gradient-solar" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>โมเดลจำลอง 3 มิติ</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.85rem' }}>3D Model Viewer</p>
          </div>
        </Link>
      </div>

    </div>
  );
};

export default LearningHub;
