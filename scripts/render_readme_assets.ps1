$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$screenshots = Join-Path $root "screenshots"
New-Item -ItemType Directory -Force -Path $screenshots | Out-Null

Add-Type -AssemblyName System.Drawing

function New-Brush([int]$r, [int]$g, [int]$b, [int]$a = 255) {
    return New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb($a, $r, $g, $b))
}

function New-Pen([int]$r, [int]$g, [int]$b, [int]$a = 255, [single]$width = 1) {
    return New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb($a, $r, $g, $b), $width)
}

function New-Font([string]$name, [single]$size, [System.Drawing.FontStyle]$style = [System.Drawing.FontStyle]::Regular) {
    return New-Object System.Drawing.Font($name, $size, $style, [System.Drawing.GraphicsUnit]::Pixel)
}

function RectF([single]$x, [single]$y, [single]$w, [single]$h) {
    return New-Object System.Drawing.RectangleF($x, $y, $w, $h)
}

function Draw-Text {
    param(
        [System.Drawing.Graphics]$Graphics,
        [string]$Text,
        [System.Drawing.Font]$Font,
        [System.Drawing.Brush]$Brush,
        [single]$X,
        [single]$Y,
        [single]$W,
        [single]$H,
        [string]$Align = "Near"
    )

    $format = New-Object System.Drawing.StringFormat
    $format.Alignment = [System.Drawing.StringAlignment]::$Align
    $format.LineAlignment = [System.Drawing.StringAlignment]::Near
    $format.Trimming = [System.Drawing.StringTrimming]::EllipsisWord
    $Graphics.DrawString($Text, $Font, $Brush, (RectF $X $Y $W $H), $format)
    $format.Dispose()
}

function Draw-Panel {
    param(
        [System.Drawing.Graphics]$Graphics,
        [single]$X,
        [single]$Y,
        [single]$W,
        [single]$H,
        [System.Drawing.Brush]$Brush,
        [System.Drawing.Pen]$Pen
    )

    $Graphics.FillRectangle($Brush, $X, $Y, $W, $H)
    $Graphics.DrawRectangle($Pen, $X, $Y, $W, $H)
}

function Draw-Chip {
    param(
        [System.Drawing.Graphics]$Graphics,
        [string]$Text,
        [single]$X,
        [single]$Y,
        [single]$W,
        [System.Drawing.Font]$Font,
        [System.Drawing.Brush]$Brush,
        [System.Drawing.Brush]$Background,
        [System.Drawing.Pen]$Pen
    )

    $Graphics.FillRectangle($Background, $X, $Y, $W, 34)
    $Graphics.DrawRectangle($Pen, $X, $Y, $W, 34)
    Draw-Text $Graphics $Text $Font $Brush ($X + 14) ($Y + 9) ($W - 28) 24
}

function Draw-Metric {
    param(
        [System.Drawing.Graphics]$Graphics,
        [string]$Value,
        [string]$Label,
        [string]$Detail,
        [single]$X,
        [single]$Y,
        [single]$W,
        [System.Drawing.Font]$ValueFont,
        [System.Drawing.Font]$LabelFont,
        [System.Drawing.Font]$BodyFont,
        [System.Drawing.Brush]$AccentBrush,
        [System.Drawing.Brush]$TextBrush,
        [System.Drawing.Brush]$MutedBrush,
        [System.Drawing.Brush]$PanelBrush,
        [System.Drawing.Pen]$BorderPen
    )

    Draw-Panel $Graphics $X $Y $W 170 $PanelBrush $BorderPen
    Draw-Text $Graphics $Value $ValueFont $AccentBrush ($X + 22) ($Y + 18) ($W - 44) 44
    Draw-Text $Graphics $Label $LabelFont $TextBrush ($X + 22) ($Y + 68) ($W - 44) 22
    Draw-Text $Graphics $Detail $BodyFont $MutedBrush ($X + 22) ($Y + 96) ($W - 44) 58
}

function Draw-Bullet {
    param(
        [System.Drawing.Graphics]$Graphics,
        [string]$Text,
        [single]$X,
        [single]$Y,
        [single]$W,
        [System.Drawing.Font]$Font,
        [System.Drawing.Brush]$TextBrush,
        [System.Drawing.Brush]$DotBrush
    )

    $Graphics.FillEllipse($DotBrush, $X, ($Y + 8), 10, 10)
    Draw-Text $Graphics $Text $Font $TextBrush ($X + 24) $Y ($W - 24) 48
}

function New-ProofBoard {
    param(
        [string]$Path,
        [string]$Kicker,
        [string]$Title,
        [string]$Subtitle,
        [object[]]$Metrics,
        [object[]]$Cards,
        [object[]]$TableRows
    )

    $bitmap = New-Object System.Drawing.Bitmap 1800, 1080
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

    $bg = New-Brush 6 9 15
    $panel = New-Brush 12 20 34
    $panel2 = New-Brush 15 24 40
    $chipBg = New-Brush 22 32 51
    $text = New-Brush 238 246 255
    $muted = New-Brush 171 186 201
    $faint = New-Brush 104 124 143
    $green = New-Brush 55 255 139
    $cyan = New-Brush 25 199 255
    $amber = New-Brush 255 204 102
    $red = New-Brush 255 92 122
    $plum = New-Brush 184 140 255
    $border = New-Pen 54 255 170 90 2
    $softBorder = New-Pen 104 124 143 70 1
    $gridPen = New-Pen 54 255 170 18 1

    $monoSmall = New-Font "Consolas" 15 ([System.Drawing.FontStyle]::Regular)
    $eyebrow = New-Font "Consolas" 17 ([System.Drawing.FontStyle]::Bold)
    $titleFont = New-Font "Segoe UI" 64 ([System.Drawing.FontStyle]::Bold)
    $sectionFont = New-Font "Segoe UI" 30 ([System.Drawing.FontStyle]::Bold)
    $cardTitle = New-Font "Segoe UI" 24 ([System.Drawing.FontStyle]::Bold)
    $bodyFont = New-Font "Segoe UI" 22 ([System.Drawing.FontStyle]::Regular)
    $smallFont = New-Font "Segoe UI" 18 ([System.Drawing.FontStyle]::Regular)
    $metricValue = New-Font "Consolas" 44 ([System.Drawing.FontStyle]::Bold)
    $metricLabel = New-Font "Consolas" 16 ([System.Drawing.FontStyle]::Bold)

    try {
        $graphics.Clear($bg.Color)

        for ($x = 0; $x -lt 1800; $x += 60) {
            $graphics.DrawLine($gridPen, $x, 0, $x, 1080)
        }
        for ($y = 0; $y -lt 1080; $y += 60) {
            $graphics.DrawLine($gridPen, 0, $y, 1800, $y)
        }

        Draw-Panel $graphics 46 44 1708 986 $panel $border
        $graphics.FillRectangle((New-Brush 255 112 102 220), 46, 44, 470, 5)
        $graphics.FillRectangle((New-Brush 25 199 255 220), 516, 44, 1238, 5)

        Draw-Chip $graphics $Kicker 88 82 430 $monoSmall $green $chipBg $softBorder
        Draw-Text $graphics $Title $titleFont $text 88 142 940 230
        Draw-Text $graphics $Subtitle $bodyFont $muted 92 370 880 86

        Draw-Panel $graphics 1070 92 610 318 $panel2 $softBorder
        Draw-Text $graphics "BOARD-READY ENDPOINT POSTURE" $eyebrow $green 1102 124 560 28
        Draw-Bullet $graphics "Noncompliant devices surface before access and rollout windows break." 1102 176 540 $smallFont $text $cyan
        Draw-Bullet $graphics "BYOD, encryption, stale sync, and ownership risks stay attached to owners." 1102 238 540 $smallFont $text $cyan
        Draw-Bullet $graphics "Remediation packets make endpoint cleanup auditable." 1102 300 540 $smallFont $text $cyan

        $metricY = 478
        $metricW = 230
        for ($i = 0; $i -lt $Metrics.Count; $i++) {
            $mx = 88 + ($i * ($metricW + 20))
            $accent = @($cyan, $green, $plum, $red, $amber)[$i % 5]
            Draw-Metric $graphics $Metrics[$i].Value $Metrics[$i].Label $Metrics[$i].Detail $mx $metricY $metricW $metricValue $metricLabel $smallFont $accent $text $muted $panel2 $softBorder
        }

        Draw-Text $graphics "Control lanes" $sectionFont $text 88 684 420 46
        $cardY = 744
        $cardW = 300
        for ($i = 0; $i -lt $Cards.Count; $i++) {
            $cx = 88 + ($i * ($cardW + 24))
            Draw-Panel $graphics $cx $cardY $cardW 220 $panel2 $softBorder
            Draw-Text $graphics $Cards[$i].Label $monoSmall $green ($cx + 24) ($cardY + 22) ($cardW - 48) 24
            Draw-Text $graphics $Cards[$i].Title $cardTitle $text ($cx + 24) ($cardY + 58) ($cardW - 48) 56
            Draw-Text $graphics $Cards[$i].Body $smallFont $muted ($cx + 24) ($cardY + 124) ($cardW - 48) 72
        }

        Draw-Text $graphics "Fleet sample" $sectionFont $text 1080 448 420 46
        Draw-Panel $graphics 1080 512 580 438 $panel2 $softBorder
        Draw-Text $graphics "DEVICE" $monoSmall $faint 1110 538 150 26
        Draw-Text $graphics "OWNER" $monoSmall $faint 1286 538 150 26
        Draw-Text $graphics "STATE" $monoSmall $faint 1468 538 120 26
        $rowY = 590
        foreach ($row in $TableRows) {
            $stateBrush = $green
            if ($row.State -eq "RED") { $stateBrush = $red }
            if ($row.State -eq "YELLOW") { $stateBrush = $amber }
            $graphics.DrawLine($softBorder, 1110, ($rowY - 18), 1630, ($rowY - 18))
            Draw-Text $graphics $row.Device $smallFont $text 1110 $rowY 168 28
            Draw-Text $graphics $row.Owner $smallFont $muted 1286 $rowY 160 28
            Draw-Text $graphics $row.State $monoSmall $stateBrush 1468 $rowY 120 28
            $rowY += 66
        }

        Draw-Text $graphics "Synthetic data only. No tenant credentials, Graph tokens, or production device records." $monoSmall $faint 88 990 1180 28
        Draw-Text $graphics "intune.kineticgain.com" $monoSmall $cyan 1430 990 230 28 "Far"
    }
    finally {
        foreach ($resource in @($bg, $panel, $panel2, $chipBg, $text, $muted, $faint, $green, $cyan, $amber, $red, $plum, $border, $softBorder, $gridPen, $monoSmall, $eyebrow, $titleFont, $sectionFont, $cardTitle, $bodyFont, $smallFont, $metricValue, $metricLabel)) {
            if ($null -ne $resource) { $resource.Dispose() }
        }
    }

    $bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
}

New-ProofBoard -Path (Join-Path $screenshots "01-overview-proof.png") `
    -Kicker "INTUNE DEVICE COMPLIANCE OPS" `
    -Title "Endpoint compliance routed before access trust breaks." `
    -Subtitle "A Microsoft Intune control surface for fleet posture, stale sync drift, BYOD risk, encryption gaps, and remediation sequencing." `
    -Metrics @(
        @{ Value = "5"; Label = "DEVICES"; Detail = "Sample fleet records." },
        @{ Value = "3"; Label = "HEALTHY"; Detail = "Compliant devices." },
        @{ Value = "4"; Label = "HIGH"; Detail = "Priority findings." },
        @{ Value = "3"; Label = "PACKETS"; Detail = "Cleanup routes." }
    ) `
    -Cards @(
        @{ Label = "FLEET"; Title = "Ownership"; Body = "Device posture remains tied to owner and role." },
        @{ Label = "BYOD"; Title = "Scope risk"; Body = "Rooted or unmanaged devices stay visible." },
        @{ Label = "SYNC"; Title = "Freshness"; Body = "Stale check-ins become operator blockers." }
    ) `
    -TableRows @(
        @{ Device = "exec-win"; Owner = "Exec IT"; State = "GREEN" },
        @{ Device = "sales-ios"; Owner = "Sales Ops"; State = "RED" },
        @{ Device = "byod-and"; Owner = "BYOD Gov"; State = "RED" },
        @{ Device = "kiosk-east"; Owner = "Store Ops"; State = "YELLOW" }
    )

New-ProofBoard -Path (Join-Path $screenshots "02-fleet-lane-proof.png") `
    -Kicker "FLEET LANE" `
    -Title "Fleet lanes keep owners and next actions visible." `
    -Subtitle "Company-owned, BYOD, kiosk, executive, and finance devices remain separated by business role, compliance state, and operator action." `
    -Metrics @(
        @{ Value = "5"; Label = "LANES"; Detail = "Device cohorts." },
        @{ Value = "4"; Label = "OWNERS"; Detail = "Named operators." },
        @{ Value = "14d"; Label = "STALE"; Detail = "Sync threshold." },
        @{ Value = "2"; Label = "BLOCKERS"; Detail = "Action needed." }
    ) `
    -Cards @(
        @{ Label = "EXEC"; Title = "Laptop lane"; Body = "Executive devices stay audit-ready." },
        @{ Label = "SALES"; Title = "Mobile lane"; Body = "Noncompliance routes before access drift." },
        @{ Label = "KIOSK"; Title = "Shared lane"; Body = "Unowned endpoints get explicit cleanup." }
    ) `
    -TableRows @(
        @{ Device = "exec-win"; Owner = "Exec IT"; State = "GREEN" },
        @{ Device = "sales-ios"; Owner = "Sales Ops"; State = "RED" },
        @{ Device = "finance"; Owner = "Finance"; State = "YELLOW" },
        @{ Device = "kiosk"; Owner = "Store Ops"; State = "YELLOW" }
    )

New-ProofBoard -Path (Join-Path $screenshots "03-compliance-risks-proof.png") `
    -Kicker "COMPLIANCE RISKS" `
    -Title "Risk findings map device, owner, and policy." `
    -Subtitle "Noncompliant, jailbroken, unencrypted, stale, and orphaned devices surface with severity and remediation context intact." `
    -Metrics @(
        @{ Value = "4"; Label = "HIGH"; Detail = "Priority endpoint risks." },
        @{ Value = "1"; Label = "STALE"; Detail = "Freshness finding." },
        @{ Value = "1"; Label = "BYOD"; Detail = "Scope exception." },
        @{ Value = "0"; Label = "SECRETS"; Detail = "No Graph tokens." }
    ) `
    -Cards @(
        @{ Label = "POLICY"; Title = "Noncompliant"; Body = "Policy failures get routed with owner context." },
        @{ Label = "DEVICE"; Title = "Rooted BYOD"; Body = "Jailbreak/root signals stay escalated." },
        @{ Label = "CONTROL"; Title = "Encryption"; Body = "Missing encryption becomes audit-ready evidence." }
    ) `
    -TableRows @(
        @{ Device = "sales-ios"; Owner = "Sales Ops"; State = "RED" },
        @{ Device = "byod-and"; Owner = "BYOD Gov"; State = "RED" },
        @{ Device = "finance"; Owner = "Finance"; State = "RED" },
        @{ Device = "kiosk"; Owner = "Store Ops"; State = "YELLOW" }
    )

New-ProofBoard -Path (Join-Path $screenshots "04-remediation-posture-proof.png") `
    -Kicker "REMEDIATION POSTURE" `
    -Title "Remediation packets make cleanup auditable." `
    -Subtitle "Endpoint cleanup stays tied to blocker, owner, completeness, response timing, and the next access-safe decision." `
    -Metrics @(
        @{ Value = "86%"; Label = "READY"; Detail = "Top packet score." },
        @{ Value = "3"; Label = "PACKETS"; Detail = "Need owner action." },
        @{ Value = "48h"; Label = "REVIEW"; Detail = "Next checkpoint." },
        @{ Value = "1"; Label = "CLEAR"; Detail = "Safe to archive." }
    ) `
    -Cards @(
        @{ Label = "CLEAR"; Title = "Encryption"; Body = "Finance endpoint blocker is explicit." },
        @{ Label = "CONTAIN"; Title = "BYOD scope"; Body = "Rooted device action stays owner-bound." },
        @{ Label = "ARCHIVE"; Title = "Audit proof"; Body = "Healthy controls stay package-ready." }
    ) `
    -TableRows @(
        @{ Device = "finance"; Owner = "Finance"; State = "RED" },
        @{ Device = "byod-and"; Owner = "BYOD Gov"; State = "RED" },
        @{ Device = "sales-ios"; Owner = "Sales Ops"; State = "YELLOW" },
        @{ Device = "exec-win"; Owner = "Exec IT"; State = "GREEN" }
    )
