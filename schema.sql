-- ==============================================================
-- Schema do Banco de Dados: Tabela Periódica Interativa
-- Arquivo: schema.sql
-- ==============================================================

CREATE DATABASE IF NOT EXISTS `tabela_periodica`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `tabela_periodica`;

-- Tabela de Usuários (Login via Gmail ou Telefone)
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `tipo_login` ENUM('gmail', 'telefone') NOT NULL,
  `identificador` VARCHAR(191) NOT NULL UNIQUE, -- Email Gmail ou Número de Telefone
  `nome` VARCHAR(100) NOT NULL,
  `avatar` VARCHAR(255) NULL,
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `ultimo_acesso` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Elementos Químicos
CREATE TABLE IF NOT EXISTS `elementos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `numero_atomico` INT NOT NULL UNIQUE,
  `simbolo` VARCHAR(4) NOT NULL UNIQUE,
  `nome` VARCHAR(60) NOT NULL,
  `massa_atomica` VARCHAR(20) NOT NULL,
  `raio_atomico` VARCHAR(20) NULL,
  `potencial_ionizacao` VARCHAR(30) NULL,
  `eletronegatividade` VARCHAR(20) NULL,
  `numeros_oxidacao` VARCHAR(30) NULL,
  `classificacao` VARCHAR(50) NOT NULL,
  `estado_fisico` VARCHAR(80) NOT NULL,
  `configuracao_eletronica` VARCHAR(60) NOT NULL,
  `camadas_eletronicas` VARCHAR(50) NOT NULL, -- Ex: 2,8,14,2
  `protons` INT NOT NULL,
  `neutrons` INT NOT NULL,
  `eletrons` INT NOT NULL,
  `periodo` INT NOT NULL,
  `grupo` INT NOT NULL,
  -- Aplicações do Cotidiano (JSON estruturado)
  `aplicacoes_onde` TEXT NOT NULL,
  `aplicacoes_cotidiano` TEXT NOT NULL,
  -- História e Curiosidades
  `historia_descoberta` TEXT NOT NULL,
  `historia_identificador` VARCHAR(150) NOT NULL,
  `historia_quando` VARCHAR(80) NOT NULL,
  `historia_origem_nome` TEXT NOT NULL,
  `curiosidades` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Histórico de Downloads de Cards
CREATE TABLE IF NOT EXISTS `downloads` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT NULL,
  `simbolo_elemento` VARCHAR(4) NOT NULL,
  `card_baixado` VARCHAR(50) NOT NULL, -- 'Card 1 Geral', 'Card 2 Estrutura', 'Todos os Cards'
  `baixado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserção de Dados Primários (Exemplos fiéis aos Requisitos e Mockups)
INSERT INTO `elementos` 
(`numero_atomico`, `simbolo`, `nome`, `massa_atomica`, `raio_atomico`, `potencial_ionizacao`, `eletronegatividade`, `numeros_oxidacao`, `classificacao`, `estado_fisico`, `configuracao_eletronica`, `camadas_eletronicas`, `protons`, `neutrons`, `eletrons`, `periodo`, `grupo`, `aplicacoes_onde`, `aplicacoes_cotidiano`, `historia_descoberta`, `historia_identificador`, `historia_quando`, `historia_origem_nome`, `curiosidades`)
VALUES
(
  1, 'H', 'Hidrogênio', '1.008', '0,37 Å', '313 kcal/mol', '2,1', '±1', 'Não Metal', 'Gás Diatômico (H₂) em condições naturais ambientais', '1s¹', '1', 1, 0, 1, 1, 1,
  '[{"area":"Indústria Aeroespacial","desc":"Combustível líquido para foguetes e sondas espaciais."},{"area":"Refino de Petróleo","desc":"Hidrotratamento para remoção de enxofre de combustíveis fósseis."},{"area":"Energia Limpa","desc":"Células de combustível de hidrogênio verde gerando eletricidade sem poluição."}]',
  '[{"area":"Água Potável","desc":"Compõe a molécula de água (H₂O) essencial a toda vida."},{"area":"Alimentos","desc":"Hidrogenação de óleos vegetais para fabricação de margarinas."},{"area":"Cosméticos","desc":"Presente na água oxigenada e hidratantes corporais."}]',
  'Identificado formalmente como gás distinto inflamável em experimentos científicos na Inglaterra.',
  'Henry Cavendish',
  '1766',
  'Derivado do grego "hydro" (água) e "genes" (gerador), significando literalmente "gerador de água" por Antoine Lavoisier.',
  'É o elemento químico mais abundante de todo o Universo observável, constituindo aproximadamente 75% da massa bariônica cósmica. O Sol e a maioria das estrelas são compostos essencialmente por hidrogênio.'
),
(
  26, 'Fe', 'Ferro', '55.845', '1,26 Å', '182 kcal/mol', '1,83', '+2, +3', 'Metal de Transição', 'Sólido Metálico em condições naturais ambientais', '[Ar] 3d⁶ 4s²', '2,8,14,2', 26, 30, 26, 4, 8,
  '[{"area":"CONSTRUÇÃO CIVIL","desc":"Estruturas metálicas, vergalhões de sustentação, pontes e viadutos."},{"area":"INDÚSTRIA AUTOMOTIVA","desc":"Carrocerias resistentes, blocos de motores, peças mecânicas e eixos."},{"area":"INFRAESTRUTURA","desc":"Trilhos de trem, postes de transmissão de energia, tubulações industriais e saneamento."}]',
  '[{"area":"ALIMENTOS","desc":"Presente no feijão, carnes vermelhas, lentilhas e espinafre, vital na hemoglobina sanguínea."},{"area":"UTENSÍLIOS DOMÉSTICOS","desc":"Facas, panelas de ferro fundido, talheres de aço inoxidável."},{"area":"OBJETOS PESSOAIS","desc":"Ferramentas manuais, chaves, parafusos, dobradiças e móveis de metal."}]',
  'Conhecido e fundido desde a Antiguidade pelas primeiras civilizações durante a Idade do Ferro.',
  'Povos do Oriente Médio (Hititas e civilizações mesopotâmicas)',
  'Aproximadamente 1200 a.C.',
  'Derivado do vocábulo latino "ferrum", que deu origem às palavras ferreiro e ferrovia.',
  'Embora raro no estado metálico nativo na crosta terrestre devido à fácil oxidação, o ferro nativo é abundante em meteoritos metálicos, tendo sido a primeira fonte de ferro puro trabalhada pela humanidade antes da invenção dos fornos de fundição.'
),
(
  79, 'Au', 'Ouro', '196.97', '1,44 Å', '213 kcal/mol', '2,54', '+1, +3', 'Metal de Transição', 'Sólido Metálico Brilhante', '[Xe] 4f¹⁴ 5d¹⁰ 6s¹', '2,8,18,32,18,1', 79, 118, 79, 6, 11,
  '[{"area":"ELETRÔNICA DE PONTA","desc":"Conectores banhados a ouro em placas-mãe, microprocessadores e cabos HDMI."},{"area":"EXPLORAÇÃO ESPACIAL","desc":"Visores de capacetes de astronautas e satélites para refletir radiação infravermelha."},{"area":"MEDICINA","desc":"Tratamentos com nanopartículas e restaurações dentárias biocompatíveis."}]',
  '[{"area":"JOALHERIA","desc":"Alianças, colares, relógios de luxo devido à inalterabilidade e beleza."},{"area":"INVESTIMENTO","desc":"Barras de ouro como reserva monetária internacional e lastro econômico."},{"area":"CULINÁRIA GOURMET","desc":"Folhas de ouro comestíveis utilizadas na alta gastronomia."}]',
  'Utilizado desde os primórdios da humanidade no Antigo Egito e Mesopotâmia.',
  'Civilizações Antigas da Mesopotâmia e Egito',
  'Antes de 3000 a.C.',
  'Do latim "aurum", que significa "brilhante", "aurora" ou "raio de luz dourado".',
  'O ouro é tão maleável que uma única grama pode ser moldada em uma lâmina de um metro quadrado tão fina que a luz solar consegue atravessá-la!'
),
(
  8, 'O', 'Oxigênio', '15.999', '0,73 Å', '314 kcal/mol', '3,44', '-2', 'Não Metal', 'Gás Diatômico (O₂) Incolor e Inodoro', '[He] 2s² 2p⁴', '2,6', 8, 8, 8, 2, 16,
  '[{"area":"HOSPITALAR & SAÚDE","desc":"Cilindros de oxigênio medicinal para pacientes e suporte respiratório."},{"area":"SIDERURGIA","desc":"Injeção em altos-fornos para fabricação de aço em altíssimas temperaturas."},{"area":"TRATAMENTO DE ÁGUA","desc":"Geração de ozônio (O₃) para purificação microbiológica da água potável."}]',
  '[{"area":"RESPIRAÇÃO","desc":"Indispensável para o metabolismo celular e respiração dos seres vivos."},{"area":"COMBUSTÃO","desc":"Comburente natural presente no ar que permite o fogo em fogões e motores."},{"area":"OXIDAÇÃO","desc":"Envolvido no amadurecimento natural de frutas e vegetais."}]',
  'Descoberto de forma independente por Carl Wilhelm Scheele e Joseph Priestley.',
  'Joseph Priestley e Carl Wilhelm Scheele',
  '1774',
  'Do grego "oxys" (ácido) e "genes" (gerador), pois Lavoisier acreditava erroneamente que todo ácido continha oxigênio.',
  'O oxigênio representa cerca de 21% da atmosfera terrestre e quase metade da massa da crosta da Terra ligado a outros elementos como silício e alumínio.'
);
