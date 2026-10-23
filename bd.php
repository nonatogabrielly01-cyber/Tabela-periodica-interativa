<?php
/**
 * Conexão com o Banco de Dados MySQL via PDO
 * Tabela Periódica Interativa
 * 
 * Regra Global: Use sempre o mesmo PDO para conexão e queries para evitar SQL Injections
 */

class Database {
    private static ?PDO $instance = null;

    private const DB_HOST = 'localhost';
    private const DB_NAME = 'tabela_periodica';
    private const DB_USER = 'root';
    private const DB_PASS = '';
    private const DB_PORT = '3306';

    /**
     * Retorna a instância única do PDO (Singleton)
     */
    public static function getConnection(): ?PDO {
        if (self::$instance === null) {
            try {
                $dsn = "mysql:host=" . self::DB_HOST . ";port=" . self::DB_PORT . ";dbname=" . self::DB_NAME . ";charset=utf8mb4";
                $options = [
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES   => false,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
                ];

                self::$instance = new PDO($dsn, self::DB_USER, self::DB_PASS, $options);
            } catch (PDOException $e) {
                // Em caso de falha de conexão com o MySQL, armazena o erro para fallback gracioso
                error_log("Erro de conexão com o banco de dados: " . $e->getMessage());
                return null;
            }
        }
        return self::$instance;
    }

    /**
     * Executa query preparada de forma segura evitando SQL Injection
     */
    public static function executeQuery(string $sql, array $params = []): array {
        $pdo = self::getConnection();
        if (!$pdo) {
            return [];
        }

        try {
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            error_log("Erro na execução da query: " . $e->getMessage());
            return [];
        }
    }
}
?>
