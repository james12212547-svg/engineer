import { Link } from 'react-router-dom';
import { categories } from '../data/equipment';

const Home = () => {
  return (
    <div className="animate-fade-in">
      <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>ข้อมูลอุปกรณ์ไฟฟ้า</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        แหล่งรวมข้อมูลอ้างอิงอุปกรณ์ไฟฟ้าสำหรับงานวิศวกรรม
      </p>
      
      <h2 style={{ marginTop: '3rem', marginBottom: '1.5rem', fontSize: '1.5rem' }}>หมวดหมู่อุปกรณ์</h2>
      
      <div className="grid-2">
        {categories.map(category => (
          <Link 
            to={`/category/${category.id}`} 
            key={category.id} 
            className="category-card"
          >
            {category.image && <img src={category.image} alt={category.name} />}
            <div className="category-card-content">
              <h3 className={category.id === 'air-conditioning' ? 'text-gradient-ac' : 'text-gradient-solar'} style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>
                {category.name}
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
                {category.nameEng}
              </p>
              <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem', marginTop: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {category.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
