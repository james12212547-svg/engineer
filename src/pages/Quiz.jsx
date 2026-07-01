import { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const quizData = [
  {
    id: 1,
    question: 'หากต้องการป้องกันไฟกระชากที่ "ตู้ MDB" ควรเลือกใช้ SPD ประเภทใด?',
    options: ['Type 1', 'Type 2', 'Type 3', 'Type 4'],
    correct: 1, // index of option 'Type 2'
    explanation: 'ถูกต้อง! SPD Type 2 คือระบบป้องกันหลักที่ติดตั้งบริเวณแผงจ่ายไฟหลัก (MDB) หรือแผงย่อย เพื่อจัดการแรงดันกระชากจากการสวิตชิ่งภายในอาคาร'
  },
  {
    id: 2,
    question: 'คอมเพรสเซอร์ชนิดใดที่นิยมใช้ในแอร์บ้านทั่วไปมากที่สุดเนื่องจากมีขนาดเล็กและประหยัดไฟ?',
    options: ['ลูกสูบ (Reciprocating)', 'สกรู (Screw)', 'โรตารี่ (Rotary)', 'หอยโข่ง (Centrifugal)'],
    correct: 2,
    explanation: 'คอมเพรสเซอร์แบบโรตารี่ (Rotary) เป็นที่นิยมมากที่สุดในแอร์บ้านขนาดเล็ก (ไม่เกิน 3 ตันความเย็น) เพราะทำงานได้เงียบ กินไฟน้อย และประสิทธิภาพสูง'
  },
  {
    id: 3,
    question: 'ระบบโซลาร์เซลล์แบบใดที่เมื่อการไฟฟ้าไฟดับ ระบบจะดับตามไปด้วย?',
    options: ['Off-Grid', 'On-Grid', 'Hybrid', 'Micro-Grid'],
    correct: 1,
    explanation: 'ระบบ On-Grid จะตัดการทำงานทันทีเมื่อไฟการไฟฟ้าดับ (ระบบ Anti-Islanding) เพื่อป้องกันไม่ให้ไฟย้อนกลับไปทำอันตรายช่างการไฟฟ้าที่กำลังซ่อมบำรุงสายไฟอยู่'
  },
  {
    id: 4,
    question: 'ในการติดตั้งโซลาร์เซลล์บนหลังคากระเบื้องลอนคู่ ข้อควรระวังที่สุดคือเรื่องใด?',
    options: ['การเลือกยี่ห้อแผง', 'การยิงสกรูที่ท้องลอนแทนสันลอน', 'การใช้สายไฟ AC ผิดขนาด', 'การติดตั้งอินเวอร์เตอร์ตากแดด'],
    correct: 1,
    explanation: 'กฎเหล็กของการติดตั้งบนกระเบื้องลอนคู่คือ "ห้ามยิงที่ท้องลอนเด็ดขาด" เพราะเป็นทางน้ำไหล หากยิงที่ท้องลอนจะทำให้น้ำรั่วเข้าบ้านแน่นอน 100%'
  },
  {
    id: 5,
    question: 'อุปกรณ์ใดทำหน้าที่ "ลดความดันและอุณหภูมิ" ของสารทำความเย็นให้กลายเป็นของเหลวอุณหภูมิต่ำก่อนเข้าคอยล์เย็น?',
    options: ['คอมเพรสเซอร์', 'คอนเดนเซอร์', 'เอ็กซ์แพนชันวาล์ว (Expansion Valve)', 'อีวาพอเรเตอร์'],
    correct: 2,
    explanation: 'Expansion Valve ทำหน้าที่ฉีดน้ำยาแอร์และลดความดัน ทำให้น้ำยาเปลี่ยนสถานะและมีอุณหภูมิลดลงอย่างรวดเร็วเพื่อเตรียมไปดูดความร้อนในห้องผ่านคอยล์เย็น'
  }
];

const Quiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleAnswerClick = (index) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);

    if (index === quizData[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    
    if (currentQuestion + 1 < quizData.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizFinished(false);
  };

  const question = quizData[currentQuestion];

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '0.5rem' }}
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-gradient-ac" style={{ marginBottom: 0, fontSize: '2rem' }}>แบบทดสอบความรู้วิศวกรรม</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Engineering Quizzes</p>
        </div>
      </div>

      <div className="equipment-card" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        {!quizFinished ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
              <span>คำถามที่ {currentQuestion + 1} จาก {quizData.length}</span>
              <span>คะแนนปัจจุบัน: {score}</span>
            </div>

            <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', lineHeight: '1.5' }}>
              {question.question}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {question.options.map((option, index) => {
                let btnStyle = {
                  padding: '1rem 1.5rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '1.1rem',
                  textAlign: 'left',
                  cursor: showResult ? 'default' : 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.2s'
                };

                if (showResult) {
                  if (index === question.correct) {
                    btnStyle.background = 'rgba(76, 175, 80, 0.2)';
                    btnStyle.border = '1px solid #4CAF50';
                  } else if (index === selectedAnswer && index !== question.correct) {
                    btnStyle.background = 'rgba(244, 67, 54, 0.2)';
                    btnStyle.border = '1px solid #F44336';
                  }
                }

                return (
                  <button 
                    key={index} 
                    onClick={() => handleAnswerClick(index)}
                    style={btnStyle}
                    className={!showResult ? 'quiz-option-hover' : ''}
                    disabled={showResult}
                  >
                    {option}
                    {showResult && index === question.correct && <CheckCircle color="#4CAF50" />}
                    {showResult && index === selectedAnswer && index !== question.correct && <XCircle color="#F44336" />}
                  </button>
                );
              })}
            </div>

            {showResult && (
              <div className="animate-fade-in" style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                <h4 style={{ color: selectedAnswer === question.correct ? '#4CAF50' : '#F44336', marginBottom: '0.5rem' }}>
                  {selectedAnswer === question.correct ? 'ยอดเยี่ยม! คำตอบถูกต้อง' : 'ผิดพลาด! ลองอ่านคำอธิบายด้านล่างดูนะ'}
                </h4>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {question.explanation}
                </p>
                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <button 
                    onClick={handleNextQuestion}
                    style={{ 
                      padding: '0.75rem 1.5rem', 
                      background: 'var(--accent-ac)', 
                      color: '#000', 
                      border: 'none', 
                      borderRadius: '4px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    {currentQuestion + 1 === quizData.length ? 'ดูผลคะแนนสรุป' : 'ไปข้อถัดไป'}
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="animate-fade-in" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>ทำแบบทดสอบเสร็จสิ้น!</h2>
            <div style={{ 
              width: '150px', 
              height: '150px', 
              borderRadius: '50%', 
              background: 'var(--bg-secondary)', 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center', 
              alignItems: 'center', 
              margin: '0 auto 2rem',
              border: `4px solid ${score >= 3 ? '#4CAF50' : '#FF9800'}`
            }}>
              <span style={{ fontSize: '3rem', fontWeight: 'bold' }}>{score}</span>
              <span style={{ color: 'var(--text-tertiary)' }}>จาก {quizData.length}</span>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '2rem' }}>
              {score === quizData.length ? 'สุดยอดไปเลย! คุณคือปรมาจารย์วิศวกรรมตัวจริง 🏆' : 
               score >= 3 ? 'เก่งมากครับ! มีพื้นฐานวิศวกรรมที่ดีเยี่ยม 👏' : 
               'ไม่เป็นไรครับ ลองกลับไปทบทวนเนื้อหาในแอปแล้วมาสอบใหม่ได้เสมอ! 📚'}
            </p>
            
            <button 
              onClick={resetQuiz}
              style={{ 
                padding: '1rem 2rem', 
                background: 'linear-gradient(135deg, #00F0FF 0%, #0080FF 100%)', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                cursor: 'pointer'
              }}
            >
              ทำแบบทดสอบอีกครั้ง
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
