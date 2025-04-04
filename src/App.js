import React, { useState } from "react";
import './App.css';

// Since the GitHub Spark components are causing issues, let's create simple replacement components
const Card = ({ children, className }) => (
  <div className={`card ${className || ""}`}>{children}</div>
);

const Button = ({ children, onClick, variant, icon, className, ...props }) => (
  <button 
    onClick={onClick} 
    className={`button ${variant || ""} ${className || ""}`}
    {...props}
  >
    {icon && <span className="button-icon">{icon}</span>}
    {children}
  </button>
);

const PageContainer = ({ children, maxWidth }) => (
  <div className={`container max-${maxWidth}`}>{children}</div>
);

const Dialog = ({ children, open }) => (
  open ? <div className="dialog-overlay">
    <div className="dialog">{children}</div>
  </div> : null
);

const DialogContent = ({ children }) => (
  <div className="dialog-content">{children}</div>
);

const DialogHeader = ({ children }) => (
  <div className="dialog-header">{children}</div>
);

const DialogTitle = ({ children }) => (
  <h2 className="dialog-title">{children}</h2>
);

const DialogDescription = ({ children }) => (
  <div className="dialog-description">{children}</div>
);

// Simple icon components to replace the Phosphor icons
const IconWrapper = ({ children }) => (
  <span className="icon">{children}</span>
);

const Trophy = () => <IconWrapper>🏆</IconWrapper>;
const ArrowRight = () => <IconWrapper>→</IconWrapper>;
const BookOpen = () => <IconWrapper>📖</IconWrapper>;
const Brain = () => <IconWrapper>🧠</IconWrapper>;
const Lightning = () => <IconWrapper>⚡</IconWrapper>;
const Timer = () => <IconWrapper>⏱️</IconWrapper>;
const CaretRight = () => <IconWrapper>▶️</IconWrapper>;
const Question = () => <IconWrapper>❓</IconWrapper>;
const Play = () => <IconWrapper>▶️</IconWrapper>;
const House = () => <IconWrapper>🏠</IconWrapper>;

const GAME_PAIRS = [
  { start: "Neymar", end: "Albert_Einstein" },
  { start: "Açaí", end: "Revolução_Industrial" },
  { start: "Futebol", end: "Filosofia" },
  { start: "Carnaval", end: "Física_Quântica" },
  { start: "Samba", end: "Inteligência_Artificial" },
  { start: "Pelé", end: "Segunda_Guerra_Mundial" },
  { start: "Amazonas", end: "Teoria_da_Relatividade" },
  { start: "Bossa_Nova", end: "Napoleão_Bonaparte" },
  { start: "Feijoada", end: "Revolução_Francesa" },
  { start: "Copacabana", end: "Leonardo_da_Vinci" },
  { start: "Capoeira", end: "Revolução_Russa" },
  { start: "Ipanema", end: "Charles_Darwin" },
  { start: "Saci_Pererê", end: "William_Shakespeare" },
  { start: "Guaraná", end: "Pablo_Picasso" },
  { start: "Cristo_Redentor", end: "Stephen_Hawking" },
  { start: "São_Paulo", end: "Platão" },
  { start: "Rio_de_Janeiro", end: "Isaac_Newton" },
  { start: "Santos_Dumont", end: "Teoria_da_Evolução" },
  { start: "Pantanal", end: "Vincent_van_Gogh" }
  // Shortened the list for brevity
];

function App() {
  const [showMenu, setShowMenu] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentArticle, setCurrentArticle] = useState("");
  const [gameState, setGameState] = useState({
    startArticle: "",
    endArticle: "",
    clicksLeft: 5,
    path: [],
    isComplete: false
  });
  const [loading, setLoading] = useState(false);

  // Initialize game with random pair
  const startGame = () => {
    const randomPair = GAME_PAIRS[Math.floor(Math.random() * GAME_PAIRS.length)];
    setGameState({
      startArticle: randomPair.start,
      endArticle: randomPair.end,
      clicksLeft: 5,
      path: [randomPair.start],
      isComplete: false
    });
    loadArticle(randomPair.start);
    setShowMenu(false);
  };

  // Function to load Wikipedia article content
  const loadArticle = async (title) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://pt.wikipedia.org/w/api.php?action=parse&page=${title}&format=json&origin=*&prop=text|categories|sections`
      );
      const data = await response.json();
      if (data.parse && data.parse.text) {
        const content = data.parse.text["*"];
        setCurrentArticle(processWikiContent(content));
      }
    } catch (error) {
      console.error("Error loading article:", error);
    }
    setLoading(false);
  };

  // Process Wikipedia content to make links clickable and improve layout
  const processWikiContent = (content) => {
    const div = document.createElement("div");
    div.innerHTML = content;
    
    // Remove unwanted elements
    const unwanted = div.querySelectorAll('.mw-editsection, .reference, .noprint, .mw-empty-elt');
    unwanted.forEach(el => el.remove());
    
    // Convert relative links to absolute and add click handlers
    div.querySelectorAll('a').forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('/wiki/')) {
        const title = href.replace('/wiki/', '');
        // Skip files and special pages
        if (!title.includes('File:') && !title.includes('Special:')) {
          link.setAttribute('data-wiki-link', title);
          link.href = '#';
        } else {
          // Remove links to files and special pages
          link.replaceWith(...link.childNodes);
        }
      } else {
        // Remove external links
        link.replaceWith(...link.childNodes);
      }
    });
    
    return div.innerHTML;
  };

  // Handle link clicks in the article
  const handleLinkClick = (event) => {
    const link = event.target.closest('a[data-wiki-link]');
    if (!link) return;
    
    event.preventDefault();
    const title = link.getAttribute('data-wiki-link');
    
    if (gameState.clicksLeft > 0 && !gameState.isComplete) {
      const newPath = [...gameState.path, title];
      const isComplete = title === gameState.endArticle;
      
      setGameState(prev => ({
        ...prev,
        clicksLeft: prev.clicksLeft - 1,
        path: newPath,
        isComplete
      }));
      
      loadArticle(title);
    }
  };

  // Reset game with a new random pair
  const resetGame = () => {
    setShowMenu(true);
  };

  if (showMenu) {
    return (
      <div className="app-container">
        <PageContainer maxWidth="small">
          <Card className="main-card">
            <div className="menu-content">
              <h1 className="title">De cá pra lá</h1>
              <p className="subtitle">
                Conecte dois artigos da Wikipedia em 5 cliques ou menos!
              </p>
              <div className="button-container">
                <Button
                  variant="primary"
                  icon={<Play />}
                  onClick={startGame}
                  className="full-width"
                >
                  Jogar
                </Button>
                <Button
                  icon={<Question />}
                  onClick={() => setShowTutorial(true)}
                  className="full-width"
                >
                  Como Jogar
                </Button>
              </div>
            </div>
          </Card>
        </PageContainer>

        <Dialog open={showTutorial}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Como Jogar</DialogTitle>
              <DialogDescription>
                <div className="tutorial">
                  <p>
                    1. Você receberá dois artigos da Wikipedia: um inicial e um final
                  </p>
                  <p>
                    2. Navegue pelos links dentro dos artigos para chegar ao artigo final
                  </p>
                  <p>
                    3. Você tem apenas 5 cliques para completar o desafio
                  </p>
                  <p>
                    4. Escolha seus cliques com sabedoria para criar um caminho entre os artigos!
                  </p>
                </div>
                <Button onClick={() => setShowTutorial(false)}>Fechar</Button>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="app-container">
      <PageContainer maxWidth="large">
        <div className="game-container">
          <Card className="game-card">
            <div className="header">
              <div className="header-left">
                <Button
                  variant="plain"
                  icon={<House />}
                  onClick={resetGame}
                  aria-label="Voltar ao menu"
                />
                <h1 className="game-title">De cá pra lá</h1>
              </div>
              <div className="header-right">
                <span className="clicks-counter">
                  <Timer /> Cliques restantes: {gameState.clicksLeft}
                </span>
              </div>
            </div>
            
            {/* Path visualization */}
            <div className="path-container">
              <div className="path">
                {gameState.path.map((article, index) => (
                  <React.Fragment key={index}>
                    <span className="path-item">
                      {article.replace(/_/g, ' ')}
                    </span>
                    {index < gameState.path.length - 1 && (
                      <CaretRight />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="game-info">
              <div className="game-from">
                <BookOpen />
                <span>De: {gameState.startArticle.replace(/_/g, ' ')}</span>
              </div>
              <ArrowRight />
              <div className="game-to">
                <Brain />
                <span>Para: {gameState.endArticle.replace(/_/g, ' ')}</span>
              </div>
            </div>

            {gameState.isComplete && (
              <div className="success-message">
                <Trophy />
                <span>
                  Parabéns! Você conseguiu chegar ao destino em {5 - gameState.clicksLeft} cliques!
                </span>
              </div>
            )}

            {gameState.clicksLeft === 0 && !gameState.isComplete && (
              <div className="failure-message">
                <span>
                  Acabaram seus cliques! Tente novamente com um novo par de artigos.
                </span>
              </div>
            )}

            <div className="game-actions">
              <Button 
                variant="primary"
                icon={<Lightning />}
                onClick={startGame}
              >
                Novo Jogo
              </Button>
            </div>

            <div className="wiki-content" onClick={handleLinkClick}>
              {loading ? (
                <div className="loading">
                  <span>Carregando artigo...</span>
                </div>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: currentArticle }} />
              )}
            </div>
          </Card>
        </div>
      </PageContainer>
    </div>
  );
}

export default App;