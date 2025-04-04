import * as React from "react";
import { createRoot } from "react-dom/client";
import { SparkApp, PageContainer, Card, Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@github/spark/components";
import { Trophy, ArrowRight, BookOpen, Brain, Lightning, Timer, CaretRight, Question, Play, House } from "@phosphor-icons/react";

const GAME_PAIRS = [
  { start: "Neymar", end: "Albert_Einstein" },
  { start: "Açaí", end: "Revolução_Industrial" },
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
  { start: "Pantanal", end: "Vincent_van_Gogh" },
  { start: "Maracanaã", end: "Marie_Curie" },
  { start: "Carmen_Miranda", end: "Sigmund_Freud" },
  { start: "Tom_Jobim", end: "Galileu_Galilei" },
  { start: "Anitta", end: "Aristóteles" },
  { start: "Machado_de_Assis", end: "Revolução_Chinesa" },
  { start: "Cachaça", end: "Guerra_Fria" },
  { start: "Brigadeiro", end: "Revolução_Industrial" },
  { start: "Índios", end: "Primeira_Guerra_Mundial" },
  { start: "Xuxa", end: "Nikola_Tesla" },
  { start: "Roberto_Carlos", end: "Ludwig_van_Beethoven" },
  { start: "Chico_Buarque", end: "Karl_Marx" },
  { start: "Zico", end: "Thomas_Edison" },
  { start: "Ayrton_Senna", end: "René_Descartes" },
  { start: "Oscar_Niemeyer", end: "Michelangelo" },
  { start: "Tarsila_do_Amaral", end: "Salvador_Dalí" },
  { start: "Garrincha", end: "Johannes_Gutenberg" },
  { start: "Embraer", end: "Revolução_Digital" },
  { start: "Petrobras", end: "Bill_Gates" },
  { start: "Vale", end: "Steve_Jobs" },
  { start: "Banco_do_Brasil", end: "Mark_Zuckerberg" },
  { start: "Itaú", end: "Jeff_Bezos" },
  { start: "Bradesco", end: "Elon_Musk" },
  { start: "Casas_Bahia", end: "Tim_Berners-Lee" },
  { start: "Magazine_Luiza", end: "Ada_Lovelace" },
  { start: "Natura", end: "Charles_Babbage" },
  { start: "O_Boticário", end: "Alan_Turing" },
  { start: "Havaianas", end: "Revolução_Industrial" },
  { start: "Globo", end: "Guerra_do_Vietnã" },
  { start: "Record", end: "Guerra_da_Coreia" },
  { start: "SBT", end: "Guerra_Fria" },
  { start: "Silvio_Santos", end: "Winston_Churchill" },
  { start: "Faustão", end: "Franklin_D._Roosevelt" },
  { start: "Gugu", end: "John_F._Kennedy" },
  { start: "Ana_Maria_Braga", end: "Margaret_Thatcher" },
  { start: "Hebe_Camargo", end: "Rainha_Elizabeth_II" },
  { start: "Chacrinha", end: "Mahatma_Gandhi" },
  { start: "Jô_Soares", end: "Nelson_Mandela" },
  { start: "Paulo_Coelho", end: "Jorge_Luis_Borges" },
  { start: "Clarice_Lispector", end: "Virginia_Woolf" },
  { start: "Jorge_Amado", end: "Gabriel_García_Márquez" },
  { start: "Graciliano_Ramos", end: "Ernest_Hemingway" },
  { start: "Carlos_Drummond_de_Andrade", end: "Pablo_Neruda" },
  { start: "Vinícius_de_Moraes", end: "Federico_García_Lorca" },
  { start: "Cecília_Meireles", end: "Emily_Dickinson" },
  { start: "Manuel_Bandeira", end: "Fernando_Pessoa" },
  { start: "João_Cabral_de_Melo_Neto", end: "T._S._Eliot" },
  { start: "Mário_de_Andrade", end: "James_Joyce" },
  { start: "Oswald_de_Andrade", end: "Marcel_Proust" },
  { start: "Lima_Barreto", end: "Charles_Dickens" },
  { start: "Euclides_da_Cunha", end: "Victor_Hugo" },
  { start: "Guimarães_Rosa", end: "Fiódor_Dostoiévski" },
  { start: "José_de_Alencar", end: "Miguel_de_Cervantes" },
  { start: "Joaquim_Nabuco", end: "Jean-Jacques_Rousseau" },
  { start: "Rui_Barbosa", end: "Voltaire" },
  { start: "Dom_Pedro_II", end: "Napoleão_Bonaparte" }
  // ... previous pairs remain the same ...
];

function App() {
  const [showMenu, setShowMenu] = React.useState(true);
  const [showTutorial, setShowTutorial] = React.useState(false);
  const [currentArticle, setCurrentArticle] = React.useState("");
  const [gameState, setGameState] = React.useState({
    startArticle: "",
    endArticle: "",
    clicksLeft: 5,
    path: [],
    isComplete: false
  });
  const [loading, setLoading] = React.useState(false);

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
      <SparkApp>
        <PageContainer maxWidth="small">
          <Card className="p-8">
            <div className="flex flex-col items-center gap-8 text-center">
              <h1 className="text-4xl font-bold text-accent-12">De cá pra lá</h1>
              <p className="text-lg text-neutral-11">
                Conecte dois artigos da Wikipedia em 5 cliques ou menos!
              </p>
              <div className="flex flex-col gap-4 w-full max-w-sm">
                <Button
                  variant="primary"
                  icon={<Play />}
                  onClick={startGame}
                  className="w-full"
                >
                  Jogar
                </Button>
                <Button
                  icon={<Question />}
                  onClick={() => setShowTutorial(true)}
                  className="w-full"
                >
                  Como Jogar
                </Button>
              </div>
            </div>
          </Card>
        </PageContainer>

        <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Como Jogar</DialogTitle>
              <DialogDescription>
                <div className="space-y-4">
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
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </SparkApp>
    );
  }

  return (
    <SparkApp>
      <PageContainer maxWidth="large">
        <div className="flex flex-col gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="plain"
                  icon={<House />}
                  onClick={resetGame}
                  aria-label="Voltar ao menu"
                />
                <h1 className="text-2xl font-bold">De cá pra lá</h1>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  <Timer className="inline mr-2" />
                  Cliques restantes: {gameState.clicksLeft}
                </span>
              </div>
            </div>
            
            {/* Path visualization */}
            <div className="mb-6 p-4 bg-neutral-2 rounded-lg overflow-x-auto">
              <div className="flex items-center gap-2 flex-nowrap min-w-max">
                {gameState.path.map((article, index) => (
                  <React.Fragment key={index}>
                    <span className="px-3 py-1 bg-accent-3 text-accent-11 rounded-lg whitespace-nowrap">
                      {article.replace(/_/g, ' ')}
                    </span>
                    {index < gameState.path.length - 1 && (
                      <CaretRight className="text-neutral-11" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="text-accent-11" />
                <span>De: {gameState.startArticle.replace(/_/g, ' ')}</span>
              </div>
              <ArrowRight className="text-neutral-11" />
              <div className="flex items-center gap-2">
                <Brain className="text-accent-secondary-11" />
                <span>Para: {gameState.endArticle.replace(/_/g, ' ')}</span>
              </div>
            </div>

            {gameState.isComplete && (
              <div className="bg-accent-3 p-4 rounded-lg mb-4 flex items-center gap-2">
                <Trophy className="text-accent-11 text-xl" />
                <span className="text-accent-11">
                  Parabéns! Você conseguiu chegar ao destino em {5 - gameState.clicksLeft} cliques!
                </span>
              </div>
            )}

            {gameState.clicksLeft === 0 && !gameState.isComplete && (
              <div className="bg-neutral-3 p-4 rounded-lg mb-4">
                <span className="text-neutral-11">
                  Acabaram seus cliques! Tente novamente com um novo par de artigos.
                </span>
              </div>
            )}

            <div className="flex justify-end mb-4">
              <Button 
                variant="primary"
                icon={<Lightning />}
                onClick={startGame}
              >
                Novo Jogo
              </Button>
            </div>

            <Card className="wiki-content p-4" onClick={handleLinkClick}>
              {loading ? (
                <div className="flex justify-center p-8">
                  <span className="text-neutral-11">Carregando artigo...</span>
                </div>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: currentArticle }} />
              )}
            </Card>
          </Card>
        </div>
      </PageContainer>
    </SparkApp>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);