import { NavLink } from 'react-router-dom';
import { Home, List, BookOpen, Settings as SettingsIcon, ClipboardList, Heart } from 'lucide-react';
import useStore from '../store/useStore';

const Navigation = () => {
  const favorites = useStore(state => state.favorites);
  return (
    <nav className="nav-bar">
      <NavLink 
        to="/" 
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        end
      >
        <Home size={24} />
        <span>หน้าแรก</span>
      </NavLink>
      <NavLink 
        to="/learning" 
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <BookOpen size={24} />
        <span>ความรู้</span>
      </NavLink>

      <NavLink to="/work-log" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <ClipboardList size={24} />
        <span>จดงาน</span>
      </NavLink>

      <NavLink to="/favorites" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} style={{ position: 'relative' }}>
        <Heart size={24} color={favorites.length > 0 ? 'var(--accent-primary)' : 'var(--text-secondary)'} fill={favorites.length > 0 ? 'var(--accent-primary)' : 'none'} />
        <span>โปรด ({favorites.length})</span>
      </NavLink>
      
      <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <SettingsIcon size={24} />
        <span>ตั้งค่า</span>
      </NavLink>
    </nav>
  );
};

export default Navigation;
