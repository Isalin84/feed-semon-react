interface VictoryExportViewProps {
  playerName: string;
  score: number;
}

export const VictoryExportView: React.FC<VictoryExportViewProps> = ({ playerName, score }) => {
  return (
    <div 
      id="victory-export"
      style={{ 
        position: 'fixed', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)',
        zIndex: -1,
        opacity: 0,
        pointerEvents: 'none',
        width: '600px',
        background: 'white',
        borderRadius: '24px',
        padding: '48px',
        border: '4px solid #FCD34D',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}
    >
      {/* Content - всё в одном слое */}
      <div style={{ textAlign: 'center' }}>
        
        {/* Victory banner - СВЕРХУ */}
        <div style={{
          display: 'inline-block',
          background: 'linear-gradient(to right, #FBBF24, #F97316)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '12px',
          marginBottom: '24px',
          fontSize: '32px',
          fontWeight: 'bold',
        }}>
          🏆 ПОБЕДА! 🏆
        </div>

        {/* Hamster image */}
        <div style={{ marginBottom: '24px' }}>
          <img 
            src="/assets/images/semon_speech_win.png" 
            alt="Семён радуется"
            crossOrigin="anonymous"
            style={{
              width: '280px',
              height: 'auto',
              display: 'block',
              margin: '0 auto'
            }}
          />
        </div>

        {/* Personalized message */}
        <p style={{
          fontSize: '26px',
          fontWeight: 'bold',
          color: '#1F2937',
          marginBottom: '16px',
          marginTop: 0
        }}>
          {playerName}, Семён наелся!
        </p>

        {/* Score section - КАК НА ОСНОВНОМ ЭКРАНЕ */}
        <div style={{
          background: 'linear-gradient(to right, #FEF3C7, #FED7AA)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '16px',
          border: '2px solid #FBBF24'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '8px'
          }}>
            <span style={{ fontSize: '24px' }}>⭐</span>
            <p style={{
              fontSize: '16px',
              color: '#6B7280',
              fontWeight: '600',
              margin: 0
            }}>
              Итоговый счёт
            </p>
          </div>
          <p style={{
            fontSize: '64px',
            fontWeight: 'bold',
            color: '#EA580C',
            margin: 0,
            lineHeight: 1
          }}>
            {score}
          </p>
        </div>

        {/* Well done */}
        <p style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#16A34A',
          margin: '24px 0'
        }}>
          Молодец! 🎉
        </p>

        {/* Footer */}
        <div style={{
          color: '#6B7280',
          fontSize: '14px',
          marginTop: '24px',
          paddingTop: '16px',
          borderTop: '1px solid #E5E7EB'
        }}>
          <p style={{ fontWeight: '600', margin: '0 0 4px 0' }}>Игра "Накорми Семёна"</p>
          <p style={{ fontSize: '12px', opacity: 0.7, margin: 0 }}>Образовательная игра для детей 🐹</p>
        </div>
      </div>
    </div>
  );
};

