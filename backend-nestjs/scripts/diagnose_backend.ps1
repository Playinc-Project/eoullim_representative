# Diagnose backend listener and health endpoints
$base = "C:\Eoullim\backend-nestjs"
Try {
    netstat -ano | findstr ":8081" | Out-File (Join-Path $base 'netstat_8081.txt') -Encoding utf8
} Catch { $_ | Out-File (Join-Path $base 'netstat_8081.txt') -Encoding utf8 }

# Get TCP connection info (may require admin)
Try {
    $conn = Get-NetTCPConnection -LocalPort 8081 -ErrorAction SilentlyContinue
    if ($conn) {
        $conn | Format-List * | Out-File (Join-Path $base 'GetNetTCP_8081.txt') -Encoding utf8
        $pid = $conn.OwningProcess
        Try { Get-Process -Id $pid | Select-Object Id,ProcessName,Path | Out-File (Join-Path $base 'proc_8081.txt') -Encoding utf8 } Catch { "No process info for PID $pid" | Out-File (Join-Path $base 'proc_8081.txt') -Encoding utf8 }
    } else {
        'NO_CONN' | Out-File (Join-Path $base 'GetNetTCP_8081.txt') -Encoding utf8
    }
} Catch { $_.Exception.Message | Out-File (Join-Path $base 'GetNetTCP_8081.txt') -Encoding utf8 }

# Tasklist for node processes
Try { tasklist /FI "IMAGENAME eq node.exe" | Out-File (Join-Path $base 'tasklist_node.txt') -Encoding utf8 } Catch { $_ | Out-File (Join-Path $base 'tasklist_node.txt') -Encoding utf8 }

# Check HTTP endpoints
$endpoints = @('/api/','/api/health','/api/health/ready','/api/health/live')
foreach ($ep in $endpoints) {
    $url = "http://localhost:8081" + $ep
    Try {
        $r = Invoke-WebRequest -UseBasicParsing -TimeoutSec 5 -Uri $url -ErrorAction Stop
        "$ep -> $($r.StatusCode)" | Out-File (Join-Path $base 'curl_statuses.txt') -Append -Encoding utf8
    } Catch {
        "$ep -> ERR: $($_.Exception.Message)" | Out-File (Join-Path $base 'curl_statuses.txt') -Append -Encoding utf8
    }
}

"Done" | Out-File (Join-Path $base 'diagnose_done.txt') -Encoding utf8
