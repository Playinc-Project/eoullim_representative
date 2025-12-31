Param(
  [int]$Total = 1000,
  [int]$Concurrency = 50,
  [string]$Uri = 'http://localhost:8081/api/'
)
$jobs = @()
for ($i = 1; $i -le $Total; $i++) {
  while ((Get-Job -State Running).Count -ge $Concurrency) { Start-Sleep -Milliseconds 50 }
  $jobs += Start-Job -ScriptBlock {
    param($u, $idx)
    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    try {
      $r = Invoke-WebRequest -Uri $u -UseBasicParsing -TimeoutSec 30
      $status = $r.StatusCode
    } catch {
      $status = $_.Exception.Message
    }
    $sw.Stop()
    [PSCustomObject]@{Index=$idx; DurationMs=$sw.ElapsedMilliseconds; Status=$status}
  } -ArgumentList $Uri, $i
}
$all = Receive-Job -Wait -AutoRemoveJob -Job $jobs
$all | ConvertTo-Json -Depth 5 | Out-File loadtest_backend_ps.json -Encoding utf8
$dur = $all | Select-Object -ExpandProperty DurationMs | Sort-Object
$count = $dur.Count
if ($count -gt 0) {
  $p50 = $dur[[int]([math]::Floor(0.5 * $count))]
  $p95 = $dur[[int]([math]::Ceiling(0.95 * $count) - 1)]
  $p99 = $dur[[int]([math]::Ceiling(0.99 * $count) - 1)]
} else {
  $p50 = 0; $p95 = 0; $p99 = 0
}
"Requests:$count;P50:$p50;P95:$p95;P99:$p99" | Out-File loadtest_backend_ps_summary.txt -Encoding utf8
