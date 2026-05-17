# ──────────────────────────────────────────────────────────────
#  PennyWise — Auto Sync Script
#  Polls GitHub every 60 seconds and pulls new changes.
#  Run once: .\scripts\auto-sync.ps1
#  Run on startup: See README or use Task Scheduler
# ──────────────────────────────────────────────────────────────

$RepoPath    = "d:\Projects\pennywise"
$Branch      = "main"
$PollSeconds = 60
$LogFile     = "$RepoPath\scripts\sync.log"

function Write-Log($message) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $entry = "[$timestamp] $message"
    Write-Host $entry
    Add-Content -Path $LogFile -Value $entry
}

function Sync-Repo {
    Set-Location $RepoPath

    # Check for uncommitted local changes
    $localChanges = git status --porcelain
    if ($localChanges) {
        Write-Log "⚠️  Local uncommitted changes detected — skipping pull to avoid conflicts."
        return
    }

    # Fetch latest from remote
    git fetch origin $Branch 2>&1 | Out-Null

    # Check if remote is ahead of local
    $behind = git rev-list HEAD..origin/$Branch --count
    if ($behind -gt 0) {
        Write-Log "🔄 $behind new commit(s) found on origin/$Branch — pulling..."
        $result = git pull origin $Branch 2>&1
        Write-Log "✅ Pull complete: $result"
    } else {
        Write-Log "✔  Already up to date."
    }
}

# ── Main Loop ──────────────────────────────────────────────────
Write-Log "🚀 PennyWise Auto-Sync started. Watching origin/$Branch every $PollSeconds seconds."
Write-Log "   Press Ctrl+C to stop."
Write-Log "────────────────────────────────────────────────────"

while ($true) {
    try {
        Sync-Repo
    } catch {
        Write-Log "❌ Error during sync: $_"
    }
    Start-Sleep -Seconds $PollSeconds
}
