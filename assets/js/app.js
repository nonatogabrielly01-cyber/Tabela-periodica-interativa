/**
 * Tabela Periódica Interativa - Lógica Principal da Aplicação
 * Atende a todos os requisitos do projeto e mockups do repositório
 */

document.addEventListener('DOMContentLoaded', () => {
  // Estado Global da Aplicação
  const state = {
    currentElement: null,
    currentCardIndex: 0,
    totalCards: 5, // Card 1, 2, 3, 4 + Tela Final de Downloads
    darkMode: true,
    user: null,
    elements: typeof ALL_ELEMENTS !== 'undefined' ? ALL_ELEMENTS : []
  };

  // Inicializações
  initTheme();
  initStarfield();
  initAuth();
  renderPeriodicTable();
  setupEventListeners();

  /* ==============================================================
     1. TEMA ESCURO / CLARO (MODO CLARO E NOTURNO)
     ============================================================== */
  function initTheme() {
    const savedTheme = localStorage.getItem('tabela_theme');
    if (savedTheme === 'light') {
      state.darkMode = false;
      document.documentElement.classList.remove('dark');
      document.body.className = 'cosmic-light-bg';
    } else {
      state.darkMode = true;
      document.documentElement.classList.add('dark');
      document.body.className = 'cosmic-dark-bg';
    }
    updateThemeToggleUI();
  }

  function toggleTheme() {
    state.darkMode = !state.darkMode;
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
      document.body.className = 'cosmic-dark-bg';
      localStorage.setItem('tabela_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.className = 'cosmic-light-bg';
      localStorage.setItem('tabela_theme', 'light');
    }
    updateThemeToggleUI();
  }

  function updateThemeToggleUI() {
    const btn = document.getElementById('theme-toggle-btn');
    if (!btn) return;
    if (state.darkMode) {
      btn.innerHTML = `
        <svg class="w-5 h-5 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path>
        </svg>
        <span class="text-xs font-semibold hidden sm:inline text-amber-200">Modo Claro</span>
      `;
    } else {
      btn.innerHTML = `
        <svg class="w-5 h-5 text-blue-900" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
        </svg>
        <span class="text-xs font-semibold hidden sm:inline text-blue-950">Modo Noturno</span>
      `;
    }
  }

  /* ==============================================================
     2. FUNDO CÓSMICO COM ESTRELAS (AZUL COM ESTRELAS CINTILANTES)
     ============================================================== */
  function initStarfield() {
    const canvas = document.getElementById('stars-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      createStars();
    });

    let stars = [];
    function createStars() {
      stars = [];
      const numStars = Math.floor((width * height) / 3800);
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2.2 + 0.4,
          opacity: Math.random() * 0.8 + 0.2,
          speed: Math.random() * 0.02 + 0.005,
          alphaChange: (Math.random() - 0.5) * 0.03
        });
      }
    }
    createStars();

    function render() {
      ctx.clearRect(0, 0, width, height);
      const isDark = state.darkMode;

      stars.forEach(star => {
        star.opacity += star.alphaChange;
        if (star.opacity > 1 || star.opacity < 0.15) {
          star.alphaChange = -star.alphaChange;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        if (isDark) {
          ctx.fillStyle = `rgba(224, 242, 254, ${star.opacity})`;
          ctx.shadowBlur = star.size * 3;
          ctx.shadowColor = 'rgba(56, 189, 248, 0.8)';
        } else {
          ctx.fillStyle = `rgba(14, 116, 144, ${star.opacity * 0.45})`;
          ctx.shadowBlur = 0;
        }
        ctx.fill();
      });

      requestAnimationFrame(render);
    }
    render();
  }

  /* ==============================================================
     3. RENDERIZAÇÃO DA TABELA PERIÓDICA
     REGRA: "na tabela so tera o nome e as siglas dos elementos NADA MAIS"
     ============================================================== */
  function renderPeriodicTable() {
    const grid = document.getElementById('periodic-table-grid');
    const fBlockGrid = document.getElementById('lanthanides-actinides-grid');
    if (!grid) return;

    grid.innerHTML = '';
    if (fBlockGrid) fBlockGrid.innerHTML = '';

    // Mapa de posições da tabela periódica (Linhas 1 a 7, Colunas 1 a 18)
    state.elements.forEach(el => {
      const cell = document.createElement('div');
      cell.className = `element-cell ${getCategoryClass(el.categoryKey)}`;
      cell.dataset.symbol = el.symbol;
      cell.dataset.z = el.z;

      // REGRA EXPLÍCITA: "na tabela so tera o nome e as siglas dos elementos NADA MAIS"
      cell.innerHTML = `
        <span class="element-symbol">${el.symbol}</span>
        <span class="element-name" title="${el.name}">${el.name}</span>
      `;

      // Posicionamento no CSS Grid
      if (el.period <= 7 && el.group >= 1 && el.group <= 18) {
        cell.style.gridRow = el.period;
        cell.style.gridColumn = el.group;
        grid.appendChild(cell);
      } else {
        // Lantanídeos e Actinídeos (Bloco f inferior)
        if (fBlockGrid) {
          cell.style.gridRow = el.period === 8 ? 1 : 2;
          cell.style.gridColumn = el.group - 3;
          fBlockGrid.appendChild(cell);
        }
      }

      // REGRA: "Ao clicar no elemento da tabela periodica o elemento brilha e vai diretamente para os cards"
      cell.addEventListener('click', (e) => {
        handleElementClick(el, cell);
      });
    });
  }

  function getCategoryClass(key) {
    return `cat-${key || 'nao-metal'}`;
  }

  /* ==============================================================
     4. EFEITO DE BRILHO AO CLICAR E ABERTURA DOS 4 CARDS
     ============================================================== */
  function handleElementClick(el, cellElement) {
    // Efeito sonoro suave de sintetizador web
    playCelestialChime();

    // Adiciona classe de brilho cósmico
    cellElement.classList.add('element-glowing');

    // Aguarda o brilho e transiciona diretamente para os cards
    setTimeout(() => {
      cellElement.classList.remove('element-glowing');
      openElementCards(el);
    }, 400);
  }

  function playCelestialChime() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // Tom Ré
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // Tom Lá

      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.45);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.45);
    } catch (e) {
      // Navegadores sem suporte a Web Audio API ignoram graciosamente
    }
  }

  /* ==============================================================
     5. VISUALIZADOR DOS 4 CARDS + TELA DE DOWNLOAD
     ============================================================== */
  function openElementCards(el) {
    state.currentElement = el;
    state.currentCardIndex = 0;

    const modal = document.getElementById('cards-modal');
    if (!modal) return;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';

    renderCurrentCard();
  }

  function closeElementCards() {
    const modal = document.getElementById('cards-modal');
    if (!modal) return;

    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }

  function renderCurrentCard() {
    const container = document.getElementById('cards-container');
    const el = state.currentElement;
    if (!container || !el) return;

    // Atualiza título do cabeçalho
    const headerTitle = document.getElementById('modal-element-title');
    if (headerTitle) {
      headerTitle.innerHTML = `
        <span class="text-cyan-400 font-extrabold mr-2">${el.symbol}</span>
        <span>${el.name}</span>
        <span class="text-xs px-2.5 py-1 ml-3 rounded-full bg-cyan-900/40 text-cyan-200 border border-cyan-500/30">Card ${state.currentCardIndex + 1} de 5</span>
      `;
    }

    let cardHtml = '';

    switch (state.currentCardIndex) {
      case 0:
        // CARD 1: INFORMAÇÕES GERAIS (Inspirado exatamente na imagem 17.59.38 (3).jpeg)
        cardHtml = generateCard1Html(el);
        break;
      case 1:
        // CARD 2: ESTRUTURA DO ELEMENTO (Inspirado na imagem 17.59.37.jpeg)
        cardHtml = generateCard2Html(el);
        break;
      case 2:
        // CARD 3: APLICAÇÕES DO COTIDIANO (Inspirado na imagem 17.59.38 (2).jpeg)
        cardHtml = generateCard3Html(el);
        break;
      case 3:
        // CARD 4: HISTÓRIA E CURIOSIDADES (Inspirado na imagem 17.59.38.jpeg)
        cardHtml = generateCard4Html(el);
        break;
      case 4:
        // CARD 5: TELA FINAL DE DOWNLOADS DOS CARDS
        cardHtml = generateCard5Html(el);
        break;
    }

    container.innerHTML = cardHtml;
    updatePaginationDots();

    // Se for o Card 2, inicializa a animação interativa do átomo em canvas
    if (state.currentCardIndex === 1) {
      setTimeout(() => initAtomCanvas(el), 50);
    }

    // Associa evento de download presente no final de cada card
    setupCardDownloadButtons();
  }

  /* ==============================================================
     GERADORES DE HTML DOS CARDS (FIÉIS ÀS IMAGENS FORNECIDAS)
     ============================================================== */

  // CARD 1: GERAL
  function generateCard1Html(el) {
    return `
      <div id="exportable-card" class="card-sheet p-6 relative">
        <div class="card-header-badge">GERAL</div>

        <div class="technical-box p-6 mb-5 border-2 border-slate-900 dark:border-cyan-500 rounded-xl">
          <!-- Top Row: Z e Massa -->
          <div class="flex justify-between items-start mb-4">
            <div class="flex items-center space-x-2">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-cyan-300">NÚMERO ATÔMICO (Z):</span>
              <span class="text-xl font-extrabold text-blue-700 dark:text-cyan-400">${el.z}</span>
            </div>
            <div class="text-right">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-cyan-300">NÚMERO DE MASSA (A):</span>
              <div class="text-xl font-extrabold text-blue-700 dark:text-cyan-400">${el.mass}</div>
            </div>
          </div>

          <!-- Centro: Símbolo Gigante e Nome -->
          <div class="text-center py-4 my-2 border-y border-dashed border-slate-300 dark:border-cyan-800">
            <div class="text-7xl font-black tracking-tight text-slate-900 dark:text-white drop-shadow-md">
              ${el.symbol}
            </div>
            <div class="text-xl font-bold uppercase tracking-widest text-blue-900 dark:text-cyan-200 mt-1">
              ${el.name}
            </div>
            <div class="text-xs font-semibold uppercase text-slate-500 dark:text-cyan-400/80 mt-2">
              CONFIGURAÇÃO ELETRÔNICA: <span class="font-mono text-blue-600 dark:text-white">${el.config}</span>
            </div>
          </div>

          <!-- Propriedades Técnicas com Setas Estilizadas -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mt-4">
            <div class="p-2.5 rounded-lg bg-blue-50 dark:bg-slate-800/80 border border-blue-200 dark:border-cyan-900">
              <span class="font-bold text-slate-700 dark:text-cyan-300">➔ RAIO ATÔMICO:</span>
              <span class="font-semibold text-slate-900 dark:text-white ml-1">${el.radius || '0,50 Å'}</span>
            </div>
            <div class="p-2.5 rounded-lg bg-blue-50 dark:bg-slate-800/80 border border-blue-200 dark:border-cyan-900">
              <span class="font-bold text-slate-700 dark:text-cyan-300">➔ ELETRONEGATIVIDADE:</span>
              <span class="font-semibold text-slate-900 dark:text-white ml-1">${el.electronegativity || '—'}</span>
            </div>
            <div class="p-2.5 rounded-lg bg-blue-50 dark:bg-slate-800/80 border border-blue-200 dark:border-cyan-900">
              <span class="font-bold text-slate-700 dark:text-cyan-300">➔ 1º POTENCIAL IONIZAÇÃO:</span>
              <span class="font-semibold text-slate-900 dark:text-white ml-1">${el.ionization || '—'}</span>
            </div>
            <div class="p-2.5 rounded-lg bg-blue-50 dark:bg-slate-800/80 border border-blue-200 dark:border-cyan-900">
              <span class="font-bold text-slate-700 dark:text-cyan-300">➔ NOX COMUNS:</span>
              <span class="font-semibold text-slate-900 dark:text-white ml-1">${el.oxidation || '0'}</span>
            </div>
          </div>

          <!-- Classificação e Estado Físico -->
          <div class="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 gap-2 text-xs">
            <div class="flex justify-between items-center">
              <span class="font-bold uppercase text-slate-600 dark:text-cyan-400">CLASSIFICAÇÃO:</span>
              <span class="font-bold px-3 py-1 rounded bg-blue-600 text-white dark:bg-cyan-600">${el.category}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="font-bold uppercase text-slate-600 dark:text-cyan-400">ESTADO FÍSICO:</span>
              <span class="font-medium text-slate-800 dark:text-cyan-100">${el.state}</span>
            </div>
          </div>
        </div>

        <!-- Botão de Download no final do Card (REGRA DO PROJETO) -->
        <div class="flex justify-between items-center mt-5 pt-3 border-t border-slate-300 dark:border-slate-700">
          <button class="btn-download-card flex items-center space-x-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 transition-all shadow-md active:scale-95">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            <span>Baixar Card 1 (Galeria)</span>
          </button>
          <button onclick="window.nextCard()" class="text-xs font-bold px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white transition-all">
            Próximo Card ➔
          </button>
        </div>
      </div>
    `;
  }

  // CARD 2: ESTRUTURA DO ELEMENTO (Átomo Interativo com Órbitas e Partículas)
  function generateCard2Html(el) {
    return `
      <div id="exportable-card" class="card-sheet p-6 relative">
        <div class="card-header-badge">ESTRUTURA DO ELEMENTO</div>

        <div class="technical-box p-4 mb-4 border-2 border-slate-900 dark:border-cyan-500 rounded-xl relative overflow-hidden bg-slate-950 text-white">
          <div class="text-center mb-2">
            <h3 class="text-lg font-extrabold text-cyan-300">Átomo de ${el.name} (${el.symbol})</h3>
            <p class="text-xs text-slate-400">Modelo Quântico / Orbital em Tempo Real</p>
          </div>

          <!-- Canvas do Átomo Interativo -->
          <div class="relative w-full h-64 flex items-center justify-center">
            <canvas id="atom-canvas" width="400" height="260" class="w-full h-full rounded-lg"></canvas>
          </div>

          <!-- Legenda Anatômica do Átomo (Fiel à imagem 17.59.37.jpeg) -->
          <div class="grid grid-cols-2 gap-2 text-[11px] mt-3 pt-3 border-t border-slate-800">
            <div class="flex items-center space-x-1.5">
              <span class="w-3 h-3 rounded-full bg-purple-500 inline-block shadow-sm"></span>
              <span class="text-slate-300">Núcleo: <strong>${el.protons} Prótons (+)</strong></span>
            </div>
            <div class="flex items-center space-x-1.5">
              <span class="w-3 h-3 rounded-full bg-slate-400 inline-block shadow-sm"></span>
              <span class="text-slate-300">Nêutrons: <strong>${el.neutrons} Neutros</strong></span>
            </div>
            <div class="flex items-center space-x-1.5">
              <span class="w-3 h-3 rounded-full bg-cyan-400 inline-block shadow-sm"></span>
              <span class="text-slate-300">Elétrons: <strong>${el.electrons} (Carga -1)</strong></span>
            </div>
            <div class="flex items-center space-x-1.5">
              <span class="w-3 h-1 rounded bg-cyan-300 inline-block shadow-sm"></span>
              <span class="text-slate-300">Órbitas: <strong>${el.shells ? el.shells.length : 1} Camada(s)</strong></span>
            </div>
          </div>

          <div class="mt-2 text-center text-[10px] text-cyan-400/90 font-mono">
            Distribuição por camadas eletrônicas: [${(el.shells || [el.electrons]).join(', ')}]
          </div>
        </div>

        <!-- Botão de Download no final do Card -->
        <div class="flex justify-between items-center mt-4 pt-3 border-t border-slate-300 dark:border-slate-700">
          <button class="btn-download-card flex items-center space-x-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 transition-all shadow-md active:scale-95">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            <span>Baixar Card 2 (Galeria)</span>
          </button>
          <div class="space-x-2">
            <button onclick="window.prevCard()" class="text-xs font-bold px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white">◀</button>
            <button onclick="window.nextCard()" class="text-xs font-bold px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white">▶</button>
          </div>
        </div>
      </div>
    `;
  }

  // CARD 3: APLICAÇÕES DO COTIDIANO (Fiel à imagem 17.59.38 (2).jpeg)
  function generateCard3Html(el) {
    const ondeItems = el.onde_encontramos || [
      { area: "INDÚSTRIA GERAL", desc: "Aplicações em manufatura e engenharia." }
    ];
    const cotidianoItems = el.no_cotidiano || [
      { area: "USO PESSOAL", desc: "Objetos e insumos presentes na rotina." }
    ];

    return `
      <div id="exportable-card" class="card-sheet p-6 relative">
        <div class="card-header-badge">APLICAÇÕES DO COTIDIANO</div>

        <!-- Bloco 1: ONDE ENCONTRAMOS -->
        <div class="technical-box p-5 mb-4 border-2 border-slate-900 dark:border-cyan-500 rounded-xl">
          <div class="bg-[#122144] dark:bg-[#1a3266] text-white text-center py-2 px-4 rounded-lg font-bold text-xs uppercase tracking-wider mb-4 border border-cyan-500/30">
            ONDE ENCONTRAMOS O ${el.name.toUpperCase()}
          </div>
          <div class="space-y-3">
            ${ondeItems.map(item => `
              <div class="flex items-start text-xs">
                <span class="curved-arrow">↳</span>
                <div>
                  <strong class="font-extrabold uppercase text-blue-900 dark:text-cyan-300">${item.area}:</strong>
                  <span class="text-slate-700 dark:text-slate-200 ml-1">${item.desc}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Bloco 2: NO COTIDIANO -->
        <div class="technical-box p-5 mb-4 border-2 border-slate-900 dark:border-cyan-500 rounded-xl">
          <div class="bg-[#122144] dark:bg-[#1a3266] text-white text-center py-2 px-4 rounded-lg font-bold text-xs uppercase tracking-wider mb-4 border border-cyan-500/30">
            NO COTIDIANO
          </div>
          <div class="space-y-3">
            ${cotidianoItems.map(item => `
              <div class="flex items-start text-xs">
                <span class="text-cyan-500 text-sm mr-2 font-black">•</span>
                <div>
                  <strong class="font-extrabold uppercase text-blue-900 dark:text-cyan-300">${item.area}:</strong>
                  <span class="text-slate-700 dark:text-slate-200 ml-1">${item.desc}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Botão de Download no final do Card -->
        <div class="flex justify-between items-center mt-4 pt-3 border-t border-slate-300 dark:border-slate-700">
          <button class="btn-download-card flex items-center space-x-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 transition-all shadow-md active:scale-95">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            <span>Baixar Card 3 (Galeria)</span>
          </button>
          <div class="space-x-2">
            <button onclick="window.prevCard()" class="text-xs font-bold px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white">◀</button>
            <button onclick="window.nextCard()" class="text-xs font-bold px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white">▶</button>
          </div>
        </div>
      </div>
    `;
  }

  // CARD 4: HISTÓRIA E CURIOSIDADES (Fiel à imagem 17.59.38.jpeg)
  function generateCard4Html(el) {
    const hist = el.historia || {
      descoberta: "Registrado pela química moderna.",
      quem_identificou: "Pesquisadores",
      quando: "Século XIX",
      origem_nome: "Etimologia grega/latina."
    };
    const curios = el.curiosidades || [
      { titulo: "CURIOSIDADE", desc: "Elemento de grande relevância científica e natural." }
    ];

    return `
      <div id="exportable-card" class="card-sheet p-6 relative">
        <div class="card-header-badge">HISTÓRIA & CURIOSIDADES</div>

        <!-- Seção 1: HISTÓRIA -->
        <div class="technical-box p-5 mb-4 border-2 border-slate-900 dark:border-cyan-500 rounded-xl">
          <div class="bg-[#122144] dark:bg-[#1a3266] text-white text-center py-2 px-4 rounded-lg font-bold text-xs uppercase tracking-wider mb-4 border border-cyan-500/30">
            HISTÓRIA DO ELEMENTO
          </div>
          <div class="space-y-3 text-xs">
            <div class="flex items-start">
              <span class="text-cyan-500 font-bold mr-2">•</span>
              <div>
                <strong class="font-extrabold uppercase text-blue-900 dark:text-cyan-300">DESCOBERTA:</strong>
                <span class="text-slate-700 dark:text-slate-200 ml-1">${hist.descoberta}</span>
              </div>
            </div>
            <div class="flex items-start">
              <span class="text-cyan-500 font-bold mr-2">•</span>
              <div>
                <strong class="font-extrabold uppercase text-blue-900 dark:text-cyan-300">QUEM IDENTIFICOU:</strong>
                <span class="text-slate-700 dark:text-slate-200 ml-1">${hist.quem_identificou}</span>
              </div>
            </div>
            <div class="flex items-start">
              <span class="text-cyan-500 font-bold mr-2">•</span>
              <div>
                <strong class="font-extrabold uppercase text-blue-900 dark:text-cyan-300">QUANDO:</strong>
                <span class="text-slate-700 dark:text-slate-200 ml-1">${hist.quando}</span>
              </div>
            </div>
            <div class="flex items-start">
              <span class="text-cyan-500 font-bold mr-2">•</span>
              <div>
                <strong class="font-extrabold uppercase text-blue-900 dark:text-cyan-300">ORIGEM DO NOME:</strong>
                <span class="text-slate-700 dark:text-slate-200 ml-1">${hist.origem_nome}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Seção 2: CURIOSIDADES -->
        <div class="technical-box p-5 mb-4 border-2 border-slate-900 dark:border-cyan-500 rounded-xl">
          <div class="bg-[#122144] dark:bg-[#1a3266] text-white text-center py-2 px-4 rounded-lg font-bold text-xs uppercase tracking-wider mb-4 border border-cyan-500/30">
            CURIOSIDADES
          </div>
          <div class="space-y-3 text-xs">
            ${curios.map(c => `
              <div class="flex items-start">
                <span class="text-cyan-500 font-bold mr-2">•</span>
                <div>
                  <strong class="font-extrabold uppercase text-blue-900 dark:text-cyan-300">${c.titulo}:</strong>
                  <span class="text-slate-700 dark:text-slate-200 ml-1">${c.desc}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Botão de Download no final do Card -->
        <div class="flex justify-between items-center mt-4 pt-3 border-t border-slate-300 dark:border-slate-700">
          <button class="btn-download-card flex items-center space-x-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 transition-all shadow-md active:scale-95">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            <span>Baixar Card 4 (Galeria)</span>
          </button>
          <button onclick="window.nextCard()" class="text-xs font-bold px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white transition-all">
            Ir para Downloads ➔
          </button>
        </div>
      </div>
    `;
  }

  // CARD 5: TELA FINAL PARA ABAIXAR OS CARDS (REGRA EXPLÍCITA DOS REQUISITOS)
  function generateCard5Html(el) {
    return `
      <div id="exportable-card" class="card-sheet p-6 relative">
        <div class="card-header-badge">CENTRAL DE DOWNLOAD DOS CARDS</div>

        <div class="technical-box p-6 mb-5 border-2 border-slate-900 dark:border-cyan-500 rounded-xl text-center">
          <div class="w-16 h-16 mx-auto mb-3 rounded-2xl bg-cyan-500/20 text-cyan-500 dark:text-cyan-400 flex items-center justify-center">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
          </div>

          <h3 class="text-lg font-extrabold text-slate-900 dark:text-white mb-1">
            Galeria de Cards: ${el.name} (${el.symbol})
          </h3>
          <p class="text-xs text-slate-600 dark:text-slate-300 mb-5">
            Todos os cards informativos foram gerados e estão prontos para download direto na sua galeria de fotos.
          </p>

          <div class="grid grid-cols-2 gap-2 text-xs font-semibold mb-5">
            <button onclick="window.downloadSpecificCard(0)" class="p-3 rounded-lg bg-blue-100 hover:bg-blue-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-blue-900 dark:text-cyan-200 transition-all border border-blue-300 dark:border-cyan-900">
              📥 Baixar Card 1 (Geral)
            </button>
            <button onclick="window.downloadSpecificCard(1)" class="p-3 rounded-lg bg-blue-100 hover:bg-blue-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-blue-900 dark:text-cyan-200 transition-all border border-blue-300 dark:border-cyan-900">
              📥 Baixar Card 2 (Estrutura)
            </button>
            <button onclick="window.downloadSpecificCard(2)" class="p-3 rounded-lg bg-blue-100 hover:bg-blue-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-blue-900 dark:text-cyan-200 transition-all border border-blue-300 dark:border-cyan-900">
              📥 Baixar Card 3 (Cotidiano)
            </button>
            <button onclick="window.downloadSpecificCard(3)" class="p-3 rounded-lg bg-blue-100 hover:bg-blue-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-blue-900 dark:text-cyan-200 transition-all border border-blue-300 dark:border-cyan-900">
              📥 Baixar Card 4 (História)
            </button>
          </div>

          <!-- Botão Master: Baixar Todos os Cards -->
          <button onclick="window.downloadAllCards()" class="w-full py-3.5 px-4 rounded-xl font-extrabold text-sm bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg shadow-cyan-500/25 active:scale-98 transition-all flex items-center justify-center space-x-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            <span>BAIXAR PACOTE COMPLETO (TODOS OS CARDS)</span>
          </button>
        </div>

        <div class="flex justify-between items-center mt-4 pt-3 border-t border-slate-300 dark:border-slate-700">
          <button onclick="window.prevCard()" class="text-xs font-bold px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white">
            ◀ Voltar aos Cards
          </button>
          <button onclick="window.closeCardsModal()" class="text-xs font-bold px-4 py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white">
            Voltar à Tabela Inicial ↺
          </button>
        </div>
      </div>
    `;
  }

  /* ==============================================================
     6. ANIMAÇÃO DO ÁTOMO EM CANVAS (CARD 2)
     ============================================================== */
  let atomAnimFrame = null;
  function initAtomCanvas(el) {
    if (atomAnimFrame) cancelAnimationFrame(atomAnimFrame);

    const canvas = document.getElementById('atom-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;

    const numElectrons = Math.min(el.electrons, 24);
    const numOrbits = Math.min(el.shells ? el.shells.length : 3, 5);

    let angle = 0;

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Fundo espacial sutil com brilho
      const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 120);
      grad.addColorStop(0, 'rgba(56, 189, 248, 0.25)');
      grad.addColorStop(1, 'rgba(10, 23, 56, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Desenha Órbitas Elípticas em ângulos 3D (como na foto de referência)
      for (let i = 0; i < numOrbits; i++) {
        const orbitAngle = (Math.PI / numOrbits) * i;
        const rx = 80 + i * 18;
        const ry = 35 + i * 8;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(orbitAngle);

        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
        ctx.lineWidth = 1.6;
        ctx.stroke();

        // Desenha elétrons em rotação nas órbitas
        const eAngle = angle * (1 + i * 0.3);
        const ex = Math.cos(eAngle) * rx;
        const ey = Math.sin(eAngle) * ry;

        // Brilho do elétron
        ctx.beginPath();
        ctx.arc(ex, ey, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = '#38bdf8';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#38bdf8';
        ctx.fill();

        ctx.restore();
      }

      // Nuvem Eletrônica Central (Aura do núcleo)
      ctx.beginPath();
      ctx.arc(cx, cy, 26, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(147, 197, 253, 0.35)';
      ctx.shadowBlur = 20;
      ctx.shadowColor = 'rgba(56, 189, 248, 0.8)';
      ctx.fill();

      // Próton Central (Carga Positiva - Violeta)
      ctx.beginPath();
      ctx.arc(cx - 5, cy - 4, 11, 0, Math.PI * 2);
      ctx.fillStyle = '#7c3aed';
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#a855f7';
      ctx.fill();

      // Nêutron Central (Carga Neutra - Prata/Cinza)
      ctx.beginPath();
      ctx.arc(cx + 6, cy + 4, 9, 0, Math.PI * 2);
      ctx.fillStyle = '#94a3b8';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#cbd5e1';
      ctx.fill();

      angle += 0.025;
      atomAnimFrame = requestAnimationFrame(draw);
    }
    draw();
  }

  /* ==============================================================
     7. SISTEMA DE DOWNLOAD DE CARDS PARA A GALERIA DO USUÁRIO
     REGRA: "Terá que ter em todos os finais dos cards dos elementos a opção de baixar indo para a galeria do usuario"
     ============================================================== */
  function setupCardDownloadButtons() {
    const downloadBtns = document.querySelectorAll('.btn-download-card');
    downloadBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        downloadActiveCardAsImage();
      });
    });
  }

  async function downloadActiveCardAsImage() {
    const cardEl = document.getElementById('exportable-card');
    const el = state.currentElement;
    if (!cardEl || !el) return;

    // Feedback visual no botão
    const activeBtn = cardEl.querySelector('.btn-download-card');
    const originalText = activeBtn ? activeBtn.innerHTML : '';
    if (activeBtn) {
      activeBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Renderizando Imagem...</span>
      `;
    }

    try {
      if (typeof html2canvas === 'undefined') {
        await loadHtml2Canvas();
      }

      const canvas = await html2canvas(cardEl, {
        scale: 2, // Alta resolução (2x Retina)
        useCORS: true,
        backgroundColor: state.darkMode ? '#0d1a38' : '#f1f5f9'
      });

      // Dispara o download da imagem PNG para a galeria
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Tabela-Periodica_${el.symbol}_Card_${state.currentCardIndex + 1}.png`;
      link.href = imgData;
      link.click();

      // Notifica o backend da gravação do download via PDO MySQL
      logDownloadToBackend(el.symbol, `Card ${state.currentCardIndex + 1}`);

      showToast(`Card ${state.currentCardIndex + 1} de ${el.name} baixado com sucesso!`);
    } catch (err) {
      console.error("Erro ao gerar card:", err);
      showToast("Não foi possível gerar a imagem no momento.", "erro");
    } finally {
      if (activeBtn) activeBtn.innerHTML = originalText;
    }
  }

  function loadHtml2Canvas() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function logDownloadToBackend(symbol, cardType) {
    fetch('api.php?action=log_download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol: symbol, card: cardType })
    }).catch(() => {
      // Falha silenciosa em caso de modo estático sem servidor PHP
    });
  }

  // Download de Card específico acionado pela tela final
  window.downloadSpecificCard = function(index) {
    state.currentCardIndex = index;
    renderCurrentCard();
    setTimeout(() => {
      downloadActiveCardAsImage();
    }, 150);
  };

  // Download de todos os 4 cards sequencialmente
  window.downloadAllCards = async function() {
    showToast("Gerando todos os 4 cards para a sua galeria...");
    for (let i = 0; i < 4; i++) {
      state.currentCardIndex = i;
      renderCurrentCard();
      await new Promise(r => setTimeout(r, 300));
      await downloadActiveCardAsImage();
    }
    state.currentCardIndex = 4;
    renderCurrentCard();
    showToast("Todos os 4 cards foram baixados com sucesso!");
  };

  /* ==============================================================
     8. NAVEGAÇÃO ENTRE CARDS (CARROSSEL E PONTOS DE PAGINAÇÃO)
     ============================================================== */
  window.nextCard = function() {
    if (state.currentCardIndex < state.totalCards - 1) {
      state.currentCardIndex++;
      renderCurrentCard();
    }
  };

  window.prevCard = function() {
    if (state.currentCardIndex > 0) {
      state.currentCardIndex--;
      renderCurrentCard();
    }
  };

  window.closeCardsModal = function() {
    if (atomAnimFrame) cancelAnimationFrame(atomAnimFrame);
    closeElementCards();
  };

  function updatePaginationDots() {
    const dotsContainer = document.getElementById('card-pagination-dots');
    if (!dotsContainer) return;

    dotsContainer.innerHTML = '';
    for (let i = 0; i < state.totalCards; i++) {
      const dot = document.createElement('span');
      dot.className = `pagination-dot ${i === state.currentCardIndex ? 'active' : ''}`;
      dot.title = `Ir para tela ${i + 1}`;
      dot.addEventListener('click', () => {
        state.currentCardIndex = i;
        renderCurrentCard();
      });
      dotsContainer.appendChild(dot);
    }
  }

  /* ==============================================================
     9. SISTEMA DE AUTENTICAÇÃO (GMAIL E TELEFONE)
     REGRA: "logar o site com gmail ou número de telefone"
     ============================================================== */
  function initAuth() {
    // Verifica sessão existente no PHP ou localStorage
    fetch('auth.php?action=status')
      .then(res => res.json())
      .then(data => {
        if (data.autenticado && data.usuario) {
          state.user = data.usuario;
          updateAuthUI();
        } else {
          checkLocalAuth();
        }
      })
      .catch(() => {
        checkLocalAuth();
      });
  }

  function checkLocalAuth() {
    const localUser = localStorage.getItem('tabela_user');
    if (localUser) {
      try {
        state.user = JSON.parse(localUser);
        updateAuthUI();
      } catch (e) {}
    }
  }

  function updateAuthUI() {
    const authBtn = document.getElementById('auth-btn');
    if (!authBtn) return;

    if (state.user) {
      authBtn.innerHTML = `
        <img src="${state.user.avatar || 'https://ui-avatars.com/api/?name=User'}" class="w-7 h-7 rounded-full border border-cyan-400 object-cover" alt="Avatar">
        <span class="text-xs font-bold text-cyan-200 hidden sm:inline max-w-[100px] truncate">${state.user.nome}</span>
        <button id="logout-btn" title="Sair" class="text-red-400 hover:text-red-300 ml-1 text-xs">✕</button>
      `;

      const logoutBtn = document.getElementById('logout-btn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          handleLogout();
        });
      }
    } else {
      authBtn.innerHTML = `
        <svg class="w-4 h-4 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
        <span class="text-xs font-bold text-white">Entrar / Login</span>
      `;
    }
  }

  function handleLogout() {
    fetch('auth.php?action=logout').catch(() => {});
    localStorage.removeItem('tabela_user');
    state.user = null;
    updateAuthUI();
    showToast("Você saiu da sua conta.");
  }

  /* ==============================================================
     10. EVENT LISTENERS GERAIS E MODAL DE LOGIN
     ============================================================== */
  function setupEventListeners() {
    // Alternar tema
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', toggleTheme);
    }

    // Modal de Login
    const authBtn = document.getElementById('auth-btn');
    const authModal = document.getElementById('auth-modal');
    const closeAuthBtn = document.getElementById('close-auth-modal');

    if (authBtn) {
      authBtn.addEventListener('click', () => {
        if (!state.user && authModal) {
          authModal.classList.remove('hidden');
          authModal.classList.add('flex');
        }
      });
    }

    if (closeAuthBtn && authModal) {
      closeAuthBtn.addEventListener('click', () => {
        authModal.classList.add('hidden');
        authModal.classList.remove('flex');
      });
    }

    // Abas do Modal de Login (Gmail vs Telefone)
    const tabGmail = document.getElementById('tab-gmail');
    const tabPhone = document.getElementById('tab-phone');
    const formGmail = document.getElementById('form-gmail');
    const formPhone = document.getElementById('form-phone');

    if (tabGmail && tabPhone && formGmail && formPhone) {
      tabGmail.addEventListener('click', () => {
        tabGmail.className = 'flex-1 py-2 text-xs font-bold border-b-2 border-cyan-400 text-cyan-400';
        tabPhone.className = 'flex-1 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 border-b-2 border-transparent';
        formGmail.classList.remove('hidden');
        formPhone.classList.add('hidden');
      });

      tabPhone.addEventListener('click', () => {
        tabPhone.className = 'flex-1 py-2 text-xs font-bold border-b-2 border-cyan-400 text-cyan-400';
        tabGmail.className = 'flex-1 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 border-b-2 border-transparent';
        formPhone.classList.remove('hidden');
        formGmail.classList.add('hidden');
      });
    }

    // Envio do formulário Gmail
    if (formGmail) {
      formGmail.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('gmail-input').value.trim();
        const nome = document.getElementById('gmail-name-input').value.trim();

        try {
          const res = await fetch('auth.php?action=login_gmail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, nome })
          });
          const data = await res.json();
          if (data.sucesso) {
            state.user = data.usuario;
          } else {
            fallbackLocalLogin('gmail', email, nome);
          }
        } catch (err) {
          fallbackLocalLogin('gmail', email, nome);
        }

        if (authModal) {
          authModal.classList.add('hidden');
          authModal.classList.remove('flex');
        }
        updateAuthUI();
        showToast(`Bem-vindo(a), ${state.user.nome}!`);
      });
    }

    // Envio do formulário Telefone
    if (formPhone) {
      formPhone.addEventListener('submit', async (e) => {
        e.preventDefault();
        const telefone = document.getElementById('phone-input').value.trim();
        const nome = document.getElementById('phone-name-input').value.trim() || 'Estudante de Química';

        try {
          const res = await fetch('auth.php?action=login_telefone', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ telefone, nome })
          });
          const data = await res.json();
          if (data.sucesso) {
            state.user = data.usuario;
          } else {
            fallbackLocalLogin('telefone', telefone, nome);
          }
        } catch (err) {
          fallbackLocalLogin('telefone', telefone, nome);
        }

        if (authModal) {
          authModal.classList.add('hidden');
          authModal.classList.remove('flex');
        }
        updateAuthUI();
        showToast("Login realizado com sucesso!");
      });
    }

    // Busca rápida de elementos
    const searchInput = document.getElementById('search-element');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const cells = document.querySelectorAll('.element-cell');
        cells.forEach(cell => {
          const sym = cell.dataset.symbol.toLowerCase();
          const nameEl = cell.querySelector('.element-name');
          const name = nameEl ? nameEl.textContent.toLowerCase() : '';
          if (sym.includes(query) || name.includes(query)) {
            cell.style.opacity = '1';
            cell.style.transform = '';
          } else {
            cell.style.opacity = '0.2';
          }
        });
      });
    }

    // Fechar modal de cards no botão X ou Voltar
    const closeCardsBtn = document.getElementById('close-cards-modal');
    if (closeCardsBtn) {
      closeCardsBtn.addEventListener('click', closeElementCards);
    }

    // Teclado: Navegação por setas e ESC para fechar
    window.addEventListener('keydown', (e) => {
      const modal = document.getElementById('cards-modal');
      if (modal && !modal.classList.contains('hidden')) {
        if (e.key === 'ArrowRight') window.nextCard();
        if (e.key === 'ArrowLeft') window.prevCard();
        if (e.key === 'Escape') closeElementCards();
      }
    });
  }

  function fallbackLocalLogin(tipo, identificador, nome) {
    state.user = {
      tipo,
      identificador,
      nome: nome || (tipo === 'gmail' ? identificador.split('@')[0] : 'Usuário Químico'),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(nome || identificador)}&background=0284c7&color=ffffff&bold=true`
    };
    localStorage.setItem('tabela_user', JSON.stringify(state.user));
  }

  // Notificações Toast Flutuantes
  function showToast(msg, type = 'sucesso') {
    let toast = document.getElementById('toast-notification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast-notification';
      toast.className = 'fixed bottom-5 right-5 z-[99999] px-5 py-3 rounded-xl shadow-2xl font-bold text-xs flex items-center space-x-2 transition-all duration-300 transform translate-y-10 opacity-0 pointer-events-none';
      document.body.appendChild(toast);
    }

    if (type === 'sucesso') {
      toast.className = 'fixed bottom-5 right-5 z-[99999] px-5 py-3 rounded-xl shadow-2xl font-bold text-xs flex items-center space-x-2 bg-gradient-to-r from-blue-700 to-cyan-500 text-white border border-cyan-300 transition-all duration-300 transform translate-y-0 opacity-100';
    } else {
      toast.className = 'fixed bottom-5 right-5 z-[99999] px-5 py-3 rounded-xl shadow-2xl font-bold text-xs flex items-center space-x-2 bg-red-600 text-white border border-red-400 transition-all duration-300 transform translate-y-0 opacity-100';
    }

    toast.innerHTML = `<span>✓</span><span>${msg}</span>`;

    setTimeout(() => {
      toast.classList.add('translate-y-10', 'opacity-0');
    }, 3500);
  }
});
