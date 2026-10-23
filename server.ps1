# ==============================================================
# Servidor HTTP Localhost para a Tabela Periódica Interativa
# Arquivo: server.ps1
# Emula o servidor web Apache/PHP em http://localhost:8000/
# ==============================================================

$port = 8000
$root = $PSScriptRoot
if (-not $root) { $root = "C:\Users\Aluno\Desktop\tabela" }

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
} catch {
    Write-Host "Falha ao iniciar na porta $port. Tentando porta 8080..." -ForegroundColor Yellow
    $port = 8080
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$port/")
    $listener.Start()
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Servidor Localhost Ativo: http://localhost:$port/" -ForegroundColor Green
Write-Host " Pressione Ctrl+C para encerrar o servidor." -ForegroundColor Gray
Write-Host "==========================================================" -ForegroundColor Cyan

# Sessão em memória para o usuário logado
$script:currentUser = $null

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $response.Headers.Add("Access-Control-Allow-Origin", "*")
        $response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type")

        if ($request.HttpMethod -eq "OPTIONS") {
            $response.StatusCode = 200
            $response.Close()
            continue
        }

        $rawPath = [System.Uri]::UnescapeDataString($request.Url.AbsolutePath)
        if ($rawPath -eq "/" -or $rawPath -eq "/index.php") {
            $rawPath = "/index.html"
        }

        # Emulação da API de Autenticação (auth.php)
        if ($rawPath -eq "/auth.php") {
            $response.ContentType = "application/json; charset=utf-8"
            $query = $request.QueryString["action"]
            
            $body = ""
            if ($request.HasEntityBody) {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $body = $reader.ReadToEnd()
            }
            $payload = @{}
            if ($body) {
                try { $payload = $body | ConvertFrom-Json } catch {}
            }
            if (-not $query -and $payload.action) {
                $query = $payload.action
            }

            $jsonResult = @{}

            if ($query -eq "status") {
                if ($script:currentUser) {
                    $jsonResult = @{ autenticado = $true; usuario = $script:currentUser }
                } else {
                    $jsonResult = @{ autenticado = $false; usuario = $null }
                }
            }
            elseif ($query -eq "login_gmail") {
                $email = if ($payload.email) { $payload.email } else { "usuario@gmail.com" }
                $nome = if ($payload.nome) { $payload.nome } else { ($email -split "@")[0] }
                $script:currentUser = @{
                    id = 1
                    tipo = "gmail"
                    identificador = $email
                    nome = $nome
                    avatar = "https://ui-avatars.com/api/?name=$([System.Uri]::EscapeDataString($nome))&background=0284c7&color=ffffff&bold=true"
                    login_time = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
                }
                $jsonResult = @{ sucesso = $true; mensagem = "Bem-vindo(a), $nome!"; usuario = $script:currentUser }
            }
            elseif ($query -eq "login_telefone") {
                $tel = if ($payload.telefone) { $payload.telefone } else { "(11) 99999-9999" }
                $nome = if ($payload.nome) { $payload.nome } else { "Estudante de Química" }
                $script:currentUser = @{
                    id = 2
                    tipo = "telefone"
                    identificador = $tel
                    nome = $nome
                    avatar = "https://ui-avatars.com/api/?name=$([System.Uri]::EscapeDataString($nome))&background=0ea5e9&color=ffffff&bold=true"
                    login_time = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
                }
                $jsonResult = @{ sucesso = $true; mensagem = "Login efetuado com sucesso!"; usuario = $script:currentUser }
            }
            elseif ($query -eq "logout") {
                $script:currentUser = $null
                $jsonResult = @{ sucesso = $true; mensagem = "Sessão encerrada." }
            }
            else {
                $jsonResult = @{ sucesso = $true; mensagem = "Auth API Online" }
            }

            $buffer = [System.Text.Encoding]::UTF8.GetBytes(($jsonResult | ConvertTo-Json -Depth 3))
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            $response.Close()
            continue
        }

        # Emulação da API (api.php)
        if ($rawPath -eq "/api.php") {
            $response.ContentType = "application/json; charset=utf-8"
            $jsonResult = @{ sucesso = $true; mensagem = "Operação registrada com sucesso!" }
            $buffer = [System.Text.Encoding]::UTF8.GetBytes(($jsonResult | ConvertTo-Json))
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            $response.Close()
            continue
        }

        # Arquivos estáticos
        $filePath = Join-Path $root ($rawPath.TrimStart("/").Replace("/", "\"))
        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            $response.ContentType = $mime

            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 - Arquivo não encontrado")
            $response.OutputStream.Write($msg, 0, $msg.Length)
        }
        $response.Close()
    } catch {
        # Continua o loop caso ocorra interrupção de requisição individual
    }
}
