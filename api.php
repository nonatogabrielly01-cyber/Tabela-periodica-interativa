<?php
/**
 * API REST para a Tabela Periódica Interativa
 * Comunicação com MySQL via PDO
 */

session_start();
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/bd.php';

$action = $_GET['action'] ?? $_POST['action'] ?? '';
$rawInput = file_get_contents('php://input');
$inputData = json_decode($rawInput, true) ?? [];
if (!empty($inputData['action'])) {
    $action = $inputData['action'];
}

switch ($action) {
    case 'element':
        $symbol = $_GET['symbol'] ?? $inputData['symbol'] ?? '';
        $z = (int)($_GET['z'] ?? $inputData['z'] ?? 0);

        $pdo = Database::getConnection();
        if (!$pdo) {
            echo json_encode(['sucesso' => false, 'origem' => 'fallback', 'mensagem' => 'Banco de dados não disponível.']);
            exit;
        }

        try {
            if (!empty($symbol)) {
                $stmt = $pdo->prepare("SELECT * FROM elementos WHERE LOWER(simbolo) = LOWER(:simbolo) LIMIT 1");
                $stmt->execute([':simbolo' => $symbol]);
            } else {
                $stmt = $pdo->prepare("SELECT * FROM elementos WHERE numero_atomico = :z LIMIT 1");
                $stmt->execute([':z' => $z]);
            }

            $element = $stmt->fetch();
            if ($element) {
                // Decodifica JSONs
                $element['aplicacoes_onde'] = json_decode($element['aplicacoes_onde'], true) ?: [];
                $element['aplicacoes_cotidiano'] = json_decode($element['aplicacoes_cotidiano'], true) ?: [];
                echo json_encode(['sucesso' => true, 'dados' => $element]);
            } else {
                echo json_encode(['sucesso' => false, 'mensagem' => 'Elemento não encontrado no banco.']);
            }
        } catch (Exception $e) {
            echo json_encode(['sucesso' => false, 'erro' => $e->getMessage()]);
        }
        exit;

    case 'log_download':
        $symbol = $inputData['symbol'] ?? $_POST['symbol'] ?? '';
        $cardType = $inputData['card'] ?? $_POST['card'] ?? 'Card Geral';
        $userId = $_SESSION['usuario']['id'] ?? null;

        $pdo = Database::getConnection();
        if ($pdo && !empty($symbol)) {
            try {
                $stmt = $pdo->prepare("INSERT INTO downloads (usuario_id, simbolo_elemento, card_baixado) VALUES (:uid, :sym, :card)");
                $stmt->execute([
                    ':uid' => $userId,
                    ':sym' => $symbol,
                    ':card' => $cardType
                ]);
                echo json_encode(['sucesso' => true, 'mensagem' => 'Download registrado.']);
                exit;
            } catch (Exception $e) {
                error_log("Erro ao registrar download: " . $e->getMessage());
            }
        }
        echo json_encode(['sucesso' => true, 'mensagem' => 'Download registrado localmente.']);
        exit;

    default:
        echo json_encode(['sucesso' => true, 'mensagem' => 'API Tabela Periódica Interativa Ativa']);
        exit;
}
?>
