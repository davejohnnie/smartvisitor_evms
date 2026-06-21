<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>SmartVisitor — Gate Management, Done Right</title>

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=fraunces:600,700,900i|inter:400,500,600,700|jetbrains-mono:400,500&display=swap" rel="stylesheet" />

    <style>
        :root {
            --gate-dark: #14241E;
            --gate-deep: #2A4034;
            --paper: #F7F4ED;
            --paper-card: #EFEAD9;
            --security-green: #3F6B4F;
            --amber: #C7752C;
            --ink: #1A1A16;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: var(--paper);
            color: var(--ink);
            line-height: 1.5;
            -webkit-font-smoothing: antialiased;
        }

        h1,
        h2,
        h3 {
            font-family: 'Fraunces', serif;
            font-weight: 700;
        }

        .mono {
            font-family: 'JetBrains Mono', monospace;
        }

        a {
            text-decoration: none;
            color: inherit;
        }

        /* ── Nav ── */
        .nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 24px 48px;
            max-width: 1200px;
            margin: 0 auto;
        }

        .nav-brand {
            display: flex;
            align-items: center;
            gap: 10px;
            font-family: 'Fraunces', serif;
            font-weight: 700;
            font-size: 1.25rem;
            color: var(--gate-dark);
        }

        .nav-links {
            display: flex;
            gap: 28px;
            align-items: center;
        }

        .nav-links a {
            font-size: 0.92rem;
            font-weight: 500;
            color: var(--gate-dark);
            opacity: 0.75;
            transition: opacity 0.2s;
        }

        .nav-links a:hover {
            opacity: 1;
        }

        .btn-nav-cta {
            background: var(--gate-dark);
            color: var(--paper) !important;
            padding: 10px 22px;
            border-radius: 6px;
            opacity: 1 !important;
            font-weight: 600;
        }

        .btn-nav-cta:hover {
            background: var(--gate-deep);
        }

        /* ── Hero ── */
        .hero {
            max-width: 1200px;
            margin: 0 auto;
            padding: 64px 48px 40px;
            display: grid;
            grid-template-columns: 1.1fr 0.9fr;
            gap: 60px;
            align-items: center;
        }

        .hero-eyebrow {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.78rem;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: var(--security-green);
            background: rgba(63, 107, 79, 0.1);
            padding: 6px 14px;
            border-radius: 100px;
            margin-bottom: 20px;
        }

        .hero-eyebrow::before {
            content: '●';
            color: var(--security-green);
            font-size: 0.6rem;
        }

        .hero h1 {
            font-size: 3.2rem;
            line-height: 1.08;
            color: var(--gate-dark);
            margin-bottom: 22px;
            letter-spacing: -0.01em;
        }

        .hero h1 em {
            font-style: italic;
            color: var(--security-green);
        }

        .hero-sub {
            font-size: 1.08rem;
            color: #4A4A42;
            max-width: 480px;
            margin-bottom: 32px;
        }

        .hero-actions {
            display: flex;
            gap: 14px;
            flex-wrap: wrap;
        }

        .btn-primary {
            background: var(--gate-dark);
            color: var(--paper);
            padding: 15px 28px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 0.95rem;
            transition: transform 0.15s, background 0.2s;
            display: inline-block;
        }

        .btn-primary:hover {
            background: var(--security-green);
            transform: translateY(-2px);
        }

        .btn-ghost {
            border: 1.5px solid rgba(20, 36, 30, 0.2);
            color: var(--gate-dark);
            padding: 15px 28px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 0.95rem;
            transition: border-color 0.2s, background 0.2s;
            display: inline-block;
        }

        .btn-ghost:hover {
            border-color: var(--gate-dark);
            background: rgba(20, 36, 30, 0.04);
        }

        /* ── Gate Log Signature Element ── */
        .gate-log {
            background: var(--gate-dark);
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 24px 60px -20px rgba(20, 36, 30, 0.45);
            position: relative;
            overflow: hidden;
        }

        .gate-log-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 18px;
            padding-bottom: 16px;
            border-bottom: 1px solid rgba(247, 244, 237, 0.12);
        }

        .gate-log-title {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.78rem;
            color: rgba(247, 244, 237, 0.6);
            text-transform: uppercase;
            letter-spacing: 0.08em;
        }

        .gate-log-live {
            display: flex;
            align-items: center;
            gap: 6px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.72rem;
            color: #7FC99A;
        }

        .gate-log-live-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #7FC99A;
            animation: pulse 1.8s ease-in-out infinite;
        }

        @keyframes pulse {

            0%,
            100% {
                opacity: 1;
            }

            50% {
                opacity: 0.3;
            }
        }

        .log-entry {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 0;
            border-bottom: 1px solid rgba(247, 244, 237, 0.07);
            opacity: 0;
            animation: fadeInUp 0.5s ease forwards;
        }

        .log-entry:last-child {
            border-bottom: none;
        }

        .log-entry:nth-child(1) {
            animation-delay: 0.1s;
        }

        .log-entry:nth-child(2) {
            animation-delay: 0.3s;
        }

        .log-entry:nth-child(3) {
            animation-delay: 0.5s;
        }

        .log-entry:nth-child(4) {
            animation-delay: 0.7s;
        }

        .log-entry:nth-child(5) {
            animation-delay: 0.9s;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(8px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .log-time {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.72rem;
            color: rgba(247, 244, 237, 0.45);
            min-width: 48px;
        }

        .log-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            flex-shrink: 0;
        }

        .log-dot.in {
            background: #7FC99A;
        }

        .log-dot.out {
            background: rgba(247, 244, 237, 0.35);
        }

        .log-dot.pending {
            background: var(--amber);
        }

        .log-text {
            font-size: 0.85rem;
            color: var(--paper);
            flex: 1;
        }

        .log-text strong {
            font-weight: 600;
        }

        .log-status {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.68rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding: 3px 9px;
            border-radius: 100px;
        }

        .log-status.in {
            background: rgba(127, 201, 154, 0.15);
            color: #7FC99A;
        }

        .log-status.out {
            background: rgba(247, 244, 237, 0.08);
            color: rgba(247, 244, 237, 0.5);
        }

        .log-status.pending {
            background: rgba(199, 117, 44, 0.18);
            color: #E0A468;
        }

        /* ── Roles Section ── */
        .roles {
            max-width: 1200px;
            margin: 100px auto 0;
            padding: 0 48px;
        }

        .section-eyebrow {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.78rem;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: var(--security-green);
            margin-bottom: 12px;
        }

        .roles h2 {
            font-size: 2.2rem;
            color: var(--gate-dark);
            max-width: 600px;
            margin-bottom: 56px;
        }

        .roles-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
        }

        .role-card {
            background: var(--paper-card);
            border-radius: 14px;
            padding: 32px 28px;
            border: 1px solid rgba(20, 36, 30, 0.06);
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .role-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 16px 32px -16px rgba(20, 36, 30, 0.2);
        }

        .role-icon {
            width: 44px;
            height: 44px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.3rem;
            margin-bottom: 20px;
        }

        .role-card.tenant .role-icon {
            background: rgba(63, 107, 79, 0.12);
        }

        .role-card.guard .role-icon {
            background: rgba(199, 117, 44, 0.12);
        }

        .role-card.admin .role-icon {
            background: rgba(20, 36, 30, 0.1);
        }

        .role-card h3 {
            font-size: 1.3rem;
            color: var(--gate-dark);
            margin-bottom: 10px;
        }

        .role-card p {
            font-size: 0.92rem;
            color: #5A5A50;
            margin-bottom: 18px;
        }

        .role-card ul {
            list-style: none;
        }

        .role-card li {
            font-size: 0.85rem;
            color: #4A4A42;
            padding: 6px 0;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .role-card li::before {
            content: '→';
            color: var(--security-green);
            font-weight: 600;
        }

        /* ── CTA Strip ── */
        .cta-strip {
            max-width: 1200px;
            margin: 100px auto 0;
            padding: 0 48px;
        }

        .cta-box {
            background: var(--gate-dark);
            border-radius: 20px;
            padding: 56px 56px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 40px;
            flex-wrap: wrap;
        }

        .cta-box h2 {
            color: var(--paper);
            font-size: 1.9rem;
            max-width: 420px;
            margin-bottom: 8px;
        }

        .cta-box p {
            color: rgba(247, 244, 237, 0.6);
            font-size: 0.95rem;
        }

        .cta-box .btn-primary {
            background: var(--paper);
            color: var(--gate-dark);
            white-space: nowrap;
        }

        .cta-box .btn-primary:hover {
            background: #7FC99A;
            color: var(--gate-dark);
        }

        /* ── Footer ── */
        footer {
            max-width: 1200px;
            margin: 80px auto 0;
            padding: 32px 48px 48px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid rgba(20, 36, 30, 0.08);
            font-size: 0.85rem;
            color: #6A6A60;
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
            .hero {
                grid-template-columns: 1fr;
                padding: 40px 24px;
            }

            .hero h1 {
                font-size: 2.3rem;
            }

            .roles-grid {
                grid-template-columns: 1fr;
            }

            .roles,
            .cta-strip {
                padding: 0 24px;
            }

            .nav {
                padding: 20px 24px;
            }

            .nav-links {
                gap: 16px;
            }

            .cta-box {
                padding: 36px 28px;
                flex-direction: column;
                text-align: center;
            }

            footer {
                padding: 32px 24px;
                flex-direction: column;
                gap: 12px;
                text-align: center;
            }
        }

        @media (prefers-reduced-motion: reduce) {
            .log-entry {
                animation: none;
                opacity: 1;
            }

            .gate-log-live-dot {
                animation: none;
            }
        }
    </style>
</head>

<body>

    <nav class="nav">
        <div class="nav-brand">
            🏢 SmartVisitor
        </div>
        <div class="nav-links">
            <a href="{{ route('login') }}">Log in</a>
            <a href="{{ route('register') }}" class="btn-nav-cta">Register as Tenant</a>
        </div>
    </nav>

    <section class="hero">
        <div>
            <div class="hero-eyebrow">Live at the gate</div>
            <h1>Every visitor, <em>logged.</em><br>Every gate, accounted for.</h1>
            <p class="hero-sub">
                SmartVisitor replaces the paper logbook at your estate gate with QR invitations,
                instant arrival alerts, and a record guards and management can actually trust.
            </p>
            <div class="hero-actions">
                <a href="{{ route('register') }}" class="btn-primary">Register as a Tenant</a>
                <a href="{{ route('login') }}" class="btn-ghost">Log in</a>
            </div>
        </div>

        <div class="gate-log">
            <div class="gate-log-header">
                <span class="gate-log-title">Gate Activity</span>
                <span class="gate-log-live">
                    <span class="gate-log-live-dot"></span> LIVE
                </span>
            </div>

            <div class="log-entry">
                <span class="log-time mono">14:02</span>
                <span class="log-dot in"></span>
                <span class="log-text"><strong>Wanjiru K.</strong> — Unit B4, Delivery</span>
                <span class="log-status in">In</span>
            </div>
            <div class="log-entry">
                <span class="log-time mono">13:48</span>
                <span class="log-dot pending"></span>
                <span class="log-text"><strong>Omondi P.</strong> — Unit A2, Plumber</span>
                <span class="log-status pending">Pending</span>
            </div>
            <div class="log-entry">
                <span class="log-time mono">13:21</span>
                <span class="log-dot out"></span>
                <span class="log-text"><strong>Achieng M.</strong> — Unit C1, Friend Visit</span>
                <span class="log-status out">Out</span>
            </div>
            <div class="log-entry">
                <span class="log-time mono">12:55</span>
                <span class="log-dot in"></span>
                <span class="log-text"><strong>Mutiso J.</strong> — Unit B1, Contractor</span>
                <span class="log-status in">In</span>
            </div>
            <div class="log-entry">
                <span class="log-time mono">12:10</span>
                <span class="log-dot out"></span>
                <span class="log-text"><strong>Njoroge S.</strong> — Unit A4, Family Visit</span>
                <span class="log-status out">Out</span>
            </div>
        </div>
    </section>

    <section class="roles">
        <div class="section-eyebrow">Three people, one gate</div>
        <h2>Built around who actually stands at the checkpoint.</h2>

        <div class="roles-grid">
            <div class="role-card tenant">
                <div class="role-icon">🏠</div>
                <h3>Tenants</h3>
                <p>Invite visitors before they arrive and know the moment they're at the gate.</p>
                <ul>
                    <li>Generate a QR invite in seconds</li>
                    <li>Get an SMS the instant your visitor checks in</li>
                    <li>Report estate incidents directly</li>
                </ul>
            </div>

            <div class="role-card guard">
                <div class="role-icon">🛡️</div>
                <h3>Guards</h3>
                <p>Verify, check in, and check out — without a paper logbook losing the trail.</p>
                <ul>
                    <li>Scan QR codes at the gate</li>
                    <li>Register walk-in visitors on the spot</li>
                    <li>See who's still inside the estate</li>
                </ul>
            </div>

            <div class="role-card admin">
                <div class="role-icon">⚙️</div>
                <h3>Management</h3>
                <p>See the whole estate's gate activity, not just today's pile of paper.</p>
                <ul>
                    <li>Daily reports, peak hours, visitor trends</li>
                    <li>Register and manage guard duty shifts</li>
                    <li>Resolve incidents reported by tenants</li>
                </ul>
            </div>
        </div>
    </section>

    <section class="cta-strip">
        <div class="cta-box">
            <div>
                <h2>Your gate deserves better than a notebook.</h2>
                <p>Tenant registration takes under two minutes.</p>
            </div>
            <a href="{{ route('register') }}" class="btn-primary">Register as a Tenant →</a>
        </div>
    </section>

    <footer>
        <span>🏢 SmartVisitor</span>
        <span>&copy; {{ date('Y') }} SmartVisitor. Built for estates that take their gate seriously.</span>
    </footer>

</body>

</html>