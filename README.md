# Tabela Periódica Interativa 🌌🧪

Projeto desenvolvido com base nas diretrizes e mockups de `requisitos.md` e inspirado no site **zperiod**.

---

## 🌟 Funcionalidades Principais

1. **Tabela Periódica com Sigla e Nome Exclusivamente**:
   - Conforme a regra de negócio do projeto: na tabela só aparecem o **símbolo** e o **nome** dos elementos (nada mais).
2. **Efeito de Brilho Cósmico**:
   - Ao clicar em qualquer elemento químico da tabela, ele brilha intensamente com efeito neon cósmico e transiciona diretamente para a visualização dos 4 cards.
3. **Os 4 Cards por Elemento**:
   - **Card 1 (Geral)**: Diagrama técnico com Número Atômico (Z), Massa Atômica (A), Raio Atômico, Potencial de Ionização, Eletronegatividade, NOX Comuns, Classificação, Estado Físico e Configuração Eletrônica.
   - **Card 2 (Estrutura do Elemento)**: Simulação orbital do átomo animada em tempo real com Canvas, exibindo núcleo (prótons e nêutrons), órbitas elípticas tridimensionais, elétrons em movimento contínuo e camadas eletrônicas.
   - **Card 3 (Aplicações do Cotidiano)**: Seções "Onde encontramos" (indústria, engenharia, infraestrutura) e "No cotidiano" (alimentos, tecnologia, utensílios).
   - **Card 4 (História & Curiosidades)**: Contexto de descoberta, cientistas responsáveis, data, origem etimológica do nome e curiosidades surpreendentes.
4. **Tela Final & Download dos Cards para a Galeria**:
   - Cada card possui botão no rodapé para download direto como imagem PNG de alta resolução (`html2canvas`).
   - Tela final com central de downloads individuais e botão de download em lote do pacote completo de cards.
5. **Autenticação com Gmail ou Telefone**:
   - Login flexível com Google / Gmail ou Número de Telefone com DDD.
   - Backend seguro em PHP estruturado em **sessões nativas** (`session_start()`) e persistência no MySQL via **PDO preparado** contra SQL Injection.
6. **Design Predominantemente Azul com Estrelas & Modo Claro/Noturno**:
   - Fundo cósmico azul marinho com estrelas cintilantes animadas.
   - Botão para alternar entre **Modo Noturno** e **Modo Claro**.
   - Design Mobile-First totalmente responsivo com Tailwind CSS.

---

## 📂 Estrutura de Arquivos

```text
├── index.php             # View principal em PHP com sessões nativas e Tailwind CSS
├── index.html            # Versão estática completa para teste instantâneo em navegadores
├── bd.php                # Conexão singleton com MySQL via PDO seguro
├── schema.sql            # Script de criação do banco de dados e dados iniciais
├── auth.php              # Backend de autenticação (Gmail e Telefone com sessões nativas)
├── api.php               # API REST para consulta de elementos e registro de downloads
├── requisitos.md         # Documento original de requisitos do projeto
├── assets/
│   ├── css/
│   │   └── style.css     # Estilos de fundo cósmico, brilho neon, estrelas e cards
│   ├── js/
│   │   ├── app.js        # Lógica dos cards, canvas orbital, html2canvas e navegação
│   │   └── elements-data.js # Banco de dados com os 118 elementos químicos em PT-BR
│   └── images/           # Mockups e imagens de referência do repositório
```

---

## 🚀 Como Executar o Projeto

### Opção 1: Visualização Imediata no Navegador
Dê um duplo clique no arquivo `index.html` ou abra-o em qualquer navegador moderno (Chrome, Edge, Firefox). Todos os recursos visuais, animações em canvas, brilho cósmico e exportação de cards para a galeria funcionam imediatamente!

### Opção 2: Servidor PHP + MySQL (XAMPP / Laragon / WampServer)
1. Importe o arquivo `schema.sql` no phpMyAdmin ou cliente MySQL.
2. Configure as credenciais no arquivo `bd.php` (o padrão já é `localhost`, usuário `root` e senha vazia).
3. Mova os arquivos para a pasta `htdocs` ou `www` do seu servidor web local.
4. Acesse no navegador: `http://localhost/tabela/`
