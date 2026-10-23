# Tabela Periódica Interativa  

## OBJETIVOS 
crie um site com uma tabela periódica onde usuario entra no site e estuda sobre a tabela periódica interativa,na tabela so tera o  nome e as siglas dos elementos NADA MAIS, onde ao clicar em algum elemento da tabela aparece 4 cards.No primeiro card são informações gerais do elemento, o 2 card é a estrutura do elemento, 3 card é sobre as aplicações do cotidiano e o ultimo card é sobre o elemento(história, descoberta,quem identificou e quando) e no final irá aparecer uma tela onde o usuario poderá abaixar os cards. Ele será inspirado no site zperiod
### STACK TECNÓLOGICO
- Backend: PHP estruturado em sessões nativas
- Banco de dados: MySQL (PDO para segurança)
- Frontend: HTML5, PHP, CSS, Tailwind CSS

#### Regras de negocio (CORE) 
logar o site com gmail ou número de telefone;
O site terá a cor predominantemente azul com estrelas;
Terá que ter em todos os finais dos cards dos elementos a opção de baixar indo para a galeria do usuario;
Ao clicar no elemento da tabela periodica o elemento brilha e vai diretamente para os cards;
Nos cards tem a opção de voltar a tela inicial;
Modo claro e noturno;


##### Regras globais
- Use sempre o mesmo PDO para conexão e queries no MySQL para evitar SQL Injections
- Mantenha o código limpo e comente apenas lógicas complexas.
- Separe os arquivos de forma lógica: um arquivo para conexão com a base (bd.php) e scripts de backend isolados em views em HTML5/PHP
- Estilize as telas em tailwind de forma responsiva priorizando o MobileFirst.
