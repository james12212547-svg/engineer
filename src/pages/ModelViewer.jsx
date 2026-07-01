import { useState, useEffect } from 'react';
import { ArrowLeft, Maximize2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ModelViewer = () => {
  const navigate = useNavigate();
  const [rotation, setRotation] = useState({ x: -20, y: 45 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  // Handle CSS 3D Rotation dragging
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;
    
    setRotation(prev => ({
      x: prev.x - deltaY * 0.5,
      y: prev.y + deltaX * 0.5
    }));
    
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  return (
    <div className="animate-fade-in" style={{ height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '0.5rem' }}>
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-gradient-solar" style={{ marginBottom: 0, fontSize: '2rem' }}>โมเดลจำลอง 3 มิติ (Demo)</h1>
          <p style={{ color: 'var(--text-secondary)' }}>CSS 3D Placeholder for Future WebGL Models</p>
        </div>
      </div>

      <div className="equipment-card" style={{ padding: '0', maxWidth: '900px', margin: '0 auto', overflow: 'hidden' }}>
        
        <div style={{ padding: '1.5rem', background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>จำลองคอมเพรสเซอร์ (Placeholder)</h3>
          <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <Maximize2 size={20} />
          </button>
        </div>

        {/* 3D Viewport using pure CSS */}
        <div 
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          style={{ 
            height: '500px', 
            background: '#1a1a1a', 
            perspective: '1000px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isDragging ? 'grabbing' : 'grab',
            position: 'relative'
          }}
        >
          <div style={{ position: 'absolute', top: '1rem', left: '1rem', color: 'var(--text-tertiary)', fontSize: '0.9rem', pointerEvents: 'none' }}>
            คลิกค้างแล้วลากเพื่อหมุน (Drag to rotate)
          </div>

          <div 
            style={{
              width: '150px',
              height: '200px',
              position: 'relative',
              transformStyle: 'preserve-3d',
              transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
              transition: isDragging ? 'none' : 'transform 0.1s'
            }}
          >
            {/* Front */}
            <div style={{ position: 'absolute', width: '150px', height: '200px', background: 'rgba(255, 165, 0, 0.8)', border: '2px solid #ED8F03', transform: 'translateZ(75px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black', fontWeight: 'bold' }}>Front</div>
            {/* Back */}
            <div style={{ position: 'absolute', width: '150px', height: '200px', background: 'rgba(255, 165, 0, 0.6)', border: '2px solid #ED8F03', transform: 'rotateY(180deg) translateZ(75px)' }}></div>
            {/* Right */}
            <div style={{ position: 'absolute', width: '150px', height: '200px', background: 'rgba(255, 165, 0, 0.7)', border: '2px solid #ED8F03', transform: 'rotateY(90deg) translateZ(75px)' }}></div>
            {/* Left */}
            <div style={{ position: 'absolute', width: '150px', height: '200px', background: 'rgba(255, 165, 0, 0.7)', border: '2px solid #ED8F03', transform: 'rotateY(-90deg) translateZ(75px)' }}></div>
            {/* Top */}
            <div style={{ position: 'absolute', width: '150px', height: '150px', background: 'rgba(255, 165, 0, 0.9)', border: '2px solid #ED8F03', transform: 'rotateX(90deg) translateZ(75px)' }}></div>
            {/* Bottom */}
            <div style={{ position: 'absolute', width: '150px', height: '150px', background: 'rgba(255, 165, 0, 0.5)', border: '2px solid #ED8F03', transform: 'rotateX(-90deg) translateZ(125px)' }}></div>
          </div>
        </div>

        <div style={{ padding: '1.5rem', background: 'var(--bg-tertiary)' }}>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            <strong>หมายเหตุ:</strong> นี่คือตัวอย่างการแสดงผลโมเดล 3 มิติโดยใช้ CSS 3D Transformation สำหรับการนำไปใช้งานจริง (Production) ควรใช้ไลบรารีอย่าง <code>Three.js</code> หรือ <code>React Three Fiber</code> ร่วมกับไฟล์โมเดลจริง (เช่น .gltf) เพื่อความสมจริงและสามารถดูรายละเอียดชิ้นส่วนภายใน (Exploded View) ได้
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModelViewer;
