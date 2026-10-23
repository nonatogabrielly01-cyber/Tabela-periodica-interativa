<?php
/**
 * Autenticação de Usuários com Sessões Nativas e PDO
 * Suporta Login com Gmail ou Telefone
 */

session_start();
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/bd.php';

$action = $_GET['action'] ?? $_POST['action'] ?? '';

// Leitura de payload JSON caso venha via fetch
$rawInput = file_get_contents('php://input');
$inputData = json_decode($rawInput, true) ?? [];
if (!empty($inputData['action'])) {
    $action = $inputData['action'];
}

switch ($action) {
    case 'status':
        if (!empty($_SESSION['usuario'])) {
            echo json_encode([
                'autenticado' => true,
                'usuario' => $_SESSION['usuario']
            ]);
        } else {
            echo json_encode([
                'autenticado' => false,
                'usuario' => null
            ]);
        }
        exit;

    case 'login_gmail':
        $email = trim($inputData['email'] ?? $_POST['email'] ?? '');
        $nome = trim($inputData['nome'] ?? $_POST['nome'] ?? '');

        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(['sucesso' => false, 'mensagem' => 'E-mail do Gmail inválido.']);
            exit;
        }

        if (empty($nome)) {
            $partes = explode('@', $email);
            $nome = ucfirst($partes[0]);
        }

        $avatar = "https://ui-avatars.com/api/?name=" . urlencode($nome) . "&background=0284c7&color=ffffff&bold=true";

        // Tenta salvar/atualizar no banco de dados via PDO preparado
        $pdo = Database::getConnection();
        $userId = null;

        if ($pdo) {
            try {
                $sql = "INSERT INTO usuarios (tipo_login, identificador, nome, avatar)
                        VALUES ('gmail', :email, :nome, :avatar)
                        ON DUPLICATE KEY UPDATE nome = :nome_up, avatar = :avatar_up, ultimo_acesso = CURRENT_TIMESTAMP";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([
                    ':email' => $email,
                    ':nome' => $nome,
                    ':avatar' => $avatar,
                    ':nome_up' => $nome,
                    ':avatar_up' => $avatar
                ]);

                // Busca o ID do usuário
                $stmtCheck = $pdo->prepare("SELECT id FROM usuarios WHERE identificador = :email LIMIT 1");
                $stmtCheck->execute([':email' => $email]);
                $userDb = $stmtCheck->fetch();
                if ($userDb) {
                    $userId = $userDb['id'];
                }
            } catch (Exception $e) {
                error_log("Erro ao persistir usuário gmail: " . $e->getMessage());
            }
        }

        // Armazena na sessão nativa do PHP
        $_SESSION['usuario'] = [
            'id' => $userId,
            'tipo' => 'gmail',
            'identificador' => $email,
            'nome' => $nome,
            'avatar' => $avatar,
            'login_time' => date('Y-m-d H:i:s')
        ];

        echo json_encode([
            'sucesso' => true,
            'mensagem' => "Bem-vindo(a), {$nome}!",
            'usuario' => $_SESSION['usuario']
        ]);
        exit;

    case 'login_telefone':
        $telefone = trim($inputData['telefone'] ?? $_POST['telefone'] ?? '');
        $nome = trim($inputData['nome'] ?? $_POST['nome'] ?? 'Explorador Químico');

        // Limpa caracteres especiais do telefone
        $telLimpo = preg_replace('/\D/', '', $telefone);
        if (strlen($telLimpo) < 10) {
            http_response_code(400);
            echo json_encode(['sucesso' => false, 'mensagem' => 'Número de telefone inválido. Informe com DDD.']);
            exit;
        }

        $avatar = "https://ui-avatars.com/api/?name=" . urlencode($nome) . "&background=0ea5e9&color=ffffff&bold=true";

        // Tenta salvar no banco de dados
        $pdo = Database::getConnection();
        $userId = null;

        if ($pdo) {
            try {
                $sql = "INSERT INTO usuarios (tipo_login, identificador, nome, avatar)
                        VALUES ('telefone', :telefone, :nome, :avatar)
                        ON DUPLICATE KEY UPDATE nome = :nome_up, avatar = :avatar_up, ultimo_acesso = CURRENT_TIMESTAMP";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([
                    ':telefone' => $telefone,
                    ':nome' => $nome,
                    ':avatar' => $avatar,
                    ':nome_up' => $nome,
                    ':avatar_up' => $avatar
                ]);

                $stmtCheck = $pdo->prepare("SELECT id FROM usuarios WHERE identificador = :telefone LIMIT 1");
                $stmtCheck->execute([':telefone' => $telefone]);
                $userDb = $stmtCheck->fetch();
                if ($userDb) {
                    $userId = $userDb['id'];
                }
            } catch (Exception $e) {
                error_log("Erro ao persistir usuário telefone: " . $e->getMessage());
            }
        }

        // Armazena na sessão nativa
        $_SESSION['usuario'] = [
            'id' => $userId,
            'tipo' => 'telefone',
            'identificador' => $telefone,
            'nome' => $nome,
            'avatar' => $avatar,
            'login_time' => date('Y-m-d H:i:s')
        ];

        echo json_encode([
            'sucesso' => true,
            'mensagem' => "Login efetuado com sucesso!",
            'usuario' => $_SESSION['usuario']
        ]);
        exit;

    case 'logout':
        $_SESSION['usuario'] = null;
        unset($_SESSION['usuario']);
        session_destroy();
        echo json_encode([
            'sucesso' => true,
            'mensagem' => 'Sessão encerrada com sucesso.'
        ]);
        exit;

    default:
        http_response_code(400);
        echo json_encode(['sucesso' => false, 'mensagem' => 'Ação inválida.']);
        exit;
}
?>
