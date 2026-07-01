import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Database, Sun, Moon, Info, HardDrive } from 'lucide-react';
import useStore from '../store/useStore';

const Settings = () => {
  const theme = useStore(state => state.theme);
  const toggleTheme = useStore(state => state.toggleTheme);
  const [storageInfo, setStorageInfo] = useState(null);

  useEffect(() => {
    const checkStorage = async () => {
      if (navigator.storage && navigator.storage.estimate) {
        try {
          const estimate = await navigator.storage.estimate();
          setStorageInfo({
            usage: estimate.usage,
            quota: estimate.quota,
            percentage: ((estimate.usage / estimate.quota) * 100).toFixed(2)
          });
        } catch (error) {
          console.error("Storage estimation failed:", error);
        }
      }
    };
    checkStorage();
  }, []);

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <SettingsIcon size={32} color="var(--accent-primary)" />
        <h1 style={{ margin: 0, fontSize: '2rem', color: 'var(--text-primary)' }}>การตั้งค่า (Settings)</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Theme Settings */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
            {theme === 'dark' ? <Moon size={24} /> : <Sun size={24} />}
            ธีมแอปพลิเคชัน
          </h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: '0 0 0.5rem', color: 'var(--text-secondary)' }}>โหมดมืด / สว่าง</h3>
              <p style={{ margin: 0, color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>ปรับสีแอปให้เหมาะสมกับสภาพแวดล้อมของคุณ</p>
            </div>
            <button 
              onClick={toggleTheme}
              style={{
                background: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
            >
              {theme === 'dark' ? 'เปลี่ยนเป็นสว่าง' : 'เปลี่ยนเป็นมืด'}
            </button>
          </div>
        </div>

        {/* Storage Quota */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
            <HardDrive size={24} />
            พื้นที่เก็บข้อมูลออฟไลน์ (Storage Quota)
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ margin: '0 0 1rem', color: 'var(--text-secondary)' }}>
              แอปพลิเคชันนี้ทำงานแบบออฟไลน์ 100% ข้อมูลและรูปภาพจะถูกเก็บไว้ในอุปกรณ์ของคุณ
            </p>
            {storageInfo ? (
              <div style={{ background: 'var(--bg-tertiary)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>ใช้ไป: <strong>{formatBytes(storageInfo.usage)}</strong></span>
                  <span>ความจุทั้งหมด: <strong>{formatBytes(storageInfo.quota)}</strong></span>
                </div>
                
                {/* Progress bar */}
                <div style={{ width: '100%', height: '12px', background: 'var(--bg-primary)', borderRadius: '6px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                  <div style={{ 
                    width: `${Math.min(100, storageInfo.percentage)}%`, 
                    height: '100%', 
                    background: storageInfo.percentage > 90 ? '#ef4444' : storageInfo.percentage > 70 ? '#f59e0b' : '#10b981',
                    transition: 'width 0.5s ease'
                  }}></div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                  ใช้พื้นที่ไปแล้ว {storageInfo.percentage}%
                </div>
              </div>
            ) : (
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', color: 'var(--text-tertiary)' }}>
                กำลังคำนวณพื้นที่... หรือเบราว์เซอร์นี้ไม่รองรับการเช็คพื้นที่
              </div>
            )}
          </div>

          <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: '8px', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <Info size={20} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-tertiary)', lineHeight: '1.6' }}>
              <strong>ระบบบีบอัดรูปภาพอัตโนมัติเปิดใช้งานแล้ว:</strong> ทุกครั้งที่คุณอัปโหลดรูป ระบบจะทำการลดขนาดและแปลงเป็นรูปแบบ <code>.webp</code> ก่อนบันทึกเข้าเครื่องเสมอ ช่วยให้คุณเก็บรูปได้มากขึ้นถึง 5 เท่า!
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
