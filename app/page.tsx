"use client";

import { useEffect, useState } from "react";

type TableName = "quiz_users" | "seminar_feedback_responses" | "quiz_responses";

type DBRow = Record<string, string | number | boolean | null>;

const endpoints: Record<TableName, string> = {
  quiz_users: "/api/quiz-users",
  seminar_feedback_responses: "/api/seminar-feedback",
  quiz_responses: "/api/quiz-responses",
};

const TABLE_LABELS: Record<TableName, string> = {
  quiz_users: "Quiz Users",
  seminar_feedback_responses: "Seminar Feedback",
  quiz_responses: "Quiz Responses",
};

const TABLE_ICONS: Record<TableName, string> = {
  quiz_users: "👤",
  seminar_feedback_responses: "💬",
  quiz_responses: "📝",
};

export default function Home() {
  const [table, setTable] = useState<TableName>("quiz_users");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quizUsers, setQuizUsers] = useState<DBRow[]>([]);
  const [seminarFeedback, setSeminarFeedback] = useState<DBRow[]>([]);
  const [quizResponses, setQuizResponses] = useState<DBRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const fetchAll = async () => {
      setLoading(true);
      try {
        const [quizUsersRes, seminarRes, quizRes] = await Promise.all([
          fetch(endpoints.quiz_users),
          fetch(endpoints.seminar_feedback_responses),
          fetch(endpoints.quiz_responses),
        ]);

        const [quizUsersJson, seminarJson, quizJson] = await Promise.all([
          quizUsersRes.json(),
          seminarRes.json(),
          quizRes.json(),
        ]);

        if (!ignore) {
          setQuizUsers(Array.isArray(quizUsersJson) ? quizUsersJson : []);
          setSeminarFeedback(Array.isArray(seminarJson) ? seminarJson : []);
          setQuizResponses(Array.isArray(quizJson) ? quizJson : []);
        }
      } catch (err) {
        console.error(err);
        if (!ignore) {
          setQuizUsers([]);
          setSeminarFeedback([]);
          setQuizResponses([]);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchAll();
    return () => {
      ignore = true;
    };
  }, []);

  const dataMap: Record<TableName, DBRow[]> = {
    quiz_users: quizUsers,
    seminar_feedback_responses: seminarFeedback,
    quiz_responses: quizResponses,
  };

  const data = dataMap[table];
  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  const totalCounts: Record<TableName, number> = {
    quiz_users: quizUsers.length,
    seminar_feedback_responses: seminarFeedback.length,
    quiz_responses: quizResponses.length,
  };

  const handleNavClick = (t: TableName) => {
    setTable(t);
    setSidebarOpen(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        :root {
          --green: #1f773a;
          --green-dark: #155a2a;
          --green-light: #e8f5ec;
          --gold: #ffc200;
          --gold-dark: #e0aa00;
          --gold-light: #fff8e0;
          --white: #ffffff;
          --gray-50: #f8f9fa;
          --gray-100: #f0f2f0;
          --gray-200: #e2e6e2;
          --gray-400: #9ba89b;
          --gray-600: #5a6b5a;
          --gray-900: #1a201a;
          --font: 'DM Sans', sans-serif;
          --font-mono: 'DM Mono', monospace;
          --radius: 12px;
          --radius-sm: 8px;
          --shadow: 0 1px 3px rgba(31,119,58,0.08), 0 4px 16px rgba(31,119,58,0.06);
          --shadow-md: 0 4px 12px rgba(31,119,58,0.14), 0 8px 32px rgba(31,119,58,0.10);
        }

        html, body {
          font-family: var(--font);
          background: var(--gray-50);
          color: var(--gray-900);
          min-height: 100vh;
        }

        /* ── Layout ── */
        .layout {
          display: flex;
          min-height: 100vh;
        }

        /* ── Overlay ── */
        .overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.45);
          z-index: 40;
          backdrop-filter: blur(2px);
        }
        .overlay.open { display: block; }

        /* ── Sidebar ── */
        .sidebar {
          width: 240px;
          flex-shrink: 0;
          background: var(--green);
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: hidden;
          z-index: 50;
        }

        .gold-bar {
          height: 3px;
          background: linear-gradient(90deg, var(--gold), var(--gold-dark));
          flex-shrink: 0;
        }

        .sidebar-logo {
          padding: 24px 24px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.12);
        }

        .sidebar-logo-mark {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: var(--gold);
          border-radius: 8px;
          margin-bottom: 10px;
        }

        .sidebar-logo-mark svg { width: 20px; height: 20px; }

        .sidebar-title {
          font-size: 15px;
          font-weight: 700;
          color: var(--white);
          letter-spacing: -0.01em;
          line-height: 1.2;
        }

        .sidebar-subtitle {
          font-size: 11px;
          font-weight: 500;
          color: rgba(255,255,255,0.5);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-top: 2px;
        }

        .sidebar-nav {
          padding: 20px 12px;
          flex: 1;
          overflow-y: auto;
        }

        .sidebar-nav-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          padding: 0 12px;
          margin-bottom: 8px;
        }

        .nav-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 10px 12px;
          border-radius: var(--radius-sm);
          border: none;
          background: transparent;
          color: rgba(255,255,255,0.72);
          font-family: var(--font);
          font-size: 13.5px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
          text-align: left;
          margin-bottom: 2px;
        }

        .nav-btn:hover {
          background: rgba(255,255,255,0.1);
          color: var(--white);
        }

        .nav-btn.active {
          background: rgba(255,255,255,0.15);
          color: var(--white);
          font-weight: 600;
        }

        .nav-btn.active .nav-count {
          background: var(--gold);
          color: var(--green-dark);
        }

        .nav-icon { font-size: 15px; flex-shrink: 0; }

        .nav-label {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .nav-count {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 500;
          background: rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.8);
          padding: 2px 7px;
          border-radius: 99px;
          flex-shrink: 0;
          min-width: 28px;
          text-align: center;
          transition: background 0.15s, color 0.15s;
        }

        .sidebar-footer {
          padding: 14px 24px;
          border-top: 1px solid rgba(255,255,255,0.12);
        }

        .sidebar-footer-text {
          font-size: 11px;
          color: rgba(255,255,255,0.3);
        }

        /* ── Main ── */
        .main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        /* ── Header ── */
        .header {
          background: var(--white);
          border-bottom: 1px solid var(--gray-200);
          padding: 16px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        /* Hamburger — hidden on desktop */
        .hamburger {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 36px;
          height: 36px;
          padding: 7px;
          border: none;
          background: var(--green-light);
          border-radius: var(--radius-sm);
          cursor: pointer;
          flex-shrink: 0;
        }

        .hamburger span {
          display: block;
          height: 2px;
          background: var(--green);
          border-radius: 2px;
        }

        .header-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }

        .header-title {
          font-size: 19px;
          font-weight: 700;
          color: var(--gray-900);
          letter-spacing: -0.02em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .header-crumb {
          font-size: 12px;
          color: var(--gray-400);
        }

        .header-crumb span { color: var(--green); font-weight: 500; }

        .header-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--green-light);
          color: var(--green);
          font-size: 12px;
          font-weight: 600;
          padding: 6px 13px;
          border-radius: 99px;
          border: 1px solid rgba(31,119,58,0.2);
          flex-shrink: 0;
          white-space: nowrap;
        }

        .badge-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--green);
          animation: pulse 2s infinite;
          flex-shrink: 0;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }

        /* ── Stats Bar ── */
        .stats-bar {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          padding: 24px 32px 0;
        }

        .stat-card {
          background: var(--white);
          border: 1px solid var(--gray-200);
          border-radius: var(--radius);
          padding: 16px 18px;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: box-shadow 0.15s, border-color 0.15s;
          cursor: pointer;
        }

        .stat-card:hover { box-shadow: var(--shadow); }

        .stat-card.active-card {
          border-color: var(--green);
          box-shadow: 0 0 0 3px var(--green-light), var(--shadow);
        }

        .stat-icon {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: var(--green-light);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
          transition: background 0.15s;
        }

        .stat-card.active-card .stat-icon { background: var(--green); }

        .stat-info { min-width: 0; }

        .stat-count {
          font-size: 22px;
          font-weight: 700;
          color: var(--gray-900);
          font-family: var(--font-mono);
          letter-spacing: -0.03em;
          line-height: 1;
        }

        .stat-label {
          font-size: 11.5px;
          color: var(--gray-400);
          font-weight: 500;
          margin-top: 3px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ── Table Section ── */
        .table-section {
          padding: 20px 32px 32px;
          flex: 1;
        }

        .table-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
          gap: 8px;
          flex-wrap: wrap;
        }

        .table-info {
          font-size: 13px;
          color: var(--gray-600);
          font-weight: 500;
        }

        .table-info strong { color: var(--gray-900); }

        .table-tag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: var(--gold-light);
          border: 1px solid rgba(255,194,0,0.3);
          color: #7a5c00;
          font-size: 11.5px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 99px;
          white-space: nowrap;
        }

        .table-wrap {
          background: var(--white);
          border: 1px solid var(--gray-200);
          border-radius: var(--radius);
          overflow: hidden;
          box-shadow: var(--shadow);
        }

        .table-scroll {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13.5px;
        }

        thead {
          background: var(--gray-50);
          border-bottom: 1px solid var(--gray-200);
        }

        thead th {
          padding: 11px 14px;
          text-align: left;
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: var(--gray-600);
          white-space: nowrap;
          position: relative;
        }

        thead th:not(:last-child)::after {
          content: '';
          position: absolute;
          right: 0;
          top: 25%;
          height: 50%;
          width: 1px;
          background: var(--gray-200);
        }

        tbody tr {
          border-bottom: 1px solid var(--gray-100);
          transition: background 0.1s;
        }

        tbody tr:last-child { border-bottom: none; }
        tbody tr:hover { background: var(--green-light); }

        tbody td {
          padding: 11px 14px;
          color: var(--gray-900);
          font-size: 13px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 200px;
        }

        tbody td:first-child {
          font-family: var(--font-mono);
          font-size: 11.5px;
          color: var(--gray-600);
        }

        /* ── Loading ── */
        .loading-state {
          padding: 64px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .spinner {
          width: 34px;
          height: 34px;
          border: 3px solid var(--gray-200);
          border-top-color: var(--green);
          border-radius: 50%;
          animation: spin 0.75s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .loading-text {
          font-size: 14px;
          font-weight: 500;
          color: var(--gray-400);
        }

        /* ── Empty State ── */
        .empty-state {
          padding: 56px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .empty-icon { font-size: 36px; margin-bottom: 4px; opacity: 0.5; }
        .empty-title { font-size: 15px; font-weight: 600; color: var(--gray-600); }
        .empty-sub { font-size: 13px; color: var(--gray-400); }

        /* ── Bottom nav (mobile only) ── */
        .bottom-nav {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: var(--white);
          border-top: 1px solid var(--gray-200);
          z-index: 30;
          padding: 6px 4px;
          padding-bottom: max(6px, env(safe-area-inset-bottom));
        }

        .bottom-nav-inner {
          display: flex;
          justify-content: space-around;
        }

        .bottom-nav-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          flex: 1;
          padding: 6px 4px;
          border: none;
          background: transparent;
          cursor: pointer;
          border-radius: var(--radius-sm);
          transition: background 0.15s;
          position: relative;
        }

        .bottom-nav-btn:active { background: var(--green-light); }

        .bottom-nav-icon { font-size: 21px; line-height: 1; }

        .bottom-nav-label {
          font-family: var(--font);
          font-size: 10px;
          font-weight: 500;
          color: var(--gray-400);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 72px;
        }

        .bottom-nav-btn.active .bottom-nav-label {
          color: var(--green);
          font-weight: 700;
        }

        .bottom-nav-indicator {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 24px;
          height: 3px;
          background: var(--green);
          border-radius: 0 0 3px 3px;
        }

        /* ─────────────────────────────
           RESPONSIVE BREAKPOINTS
        ───────────────────────────── */

        /* Tablet (≤900px): slide-in sidebar, show hamburger */
        @media (max-width: 900px) {
          .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            height: 100%;
            transform: translateX(-100%);
            transition: transform 0.25s ease;
            box-shadow: var(--shadow-md);
          }

          .sidebar.open {
            transform: translateX(0);
          }

          .hamburger { display: flex; }

          .header { padding: 14px 20px; }

          .stats-bar { gap: 12px; padding: 16px 20px 0; }

          .table-section { padding: 16px 20px 28px; }
        }

        /* Mobile (≤600px): bottom nav, stacked stat cards */
        @media (max-width: 600px) {
          .header { padding: 12px 14px; }

          .header-title { font-size: 15px; }

          .header-crumb { display: none; }

          .badge-label { display: none; }

          .stats-bar {
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            padding: 12px 12px 0;
          }

          .stat-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
            padding: 12px 10px;
          }

          .stat-icon { width: 32px; height: 32px; font-size: 14px; border-radius: 8px; }

          .stat-count { font-size: 17px; }

          .stat-label { font-size: 10px; }

          .table-section {
            padding: 12px 12px 88px;
          }

          .bottom-nav { display: block; }
        }

        /* Very small (≤380px) */
        @media (max-width: 380px) {
          .stats-bar { gap: 6px; padding: 10px 10px 0; }

          .stat-card { padding: 10px 8px; }

          .stat-count { font-size: 15px; }

          .stat-label { display: none; }

          .stat-icon { width: 28px; height: 28px; font-size: 13px; }
        }
      `}</style>

      {/* Mobile overlay */}
      <div
        className={`overlay${sidebarOpen ? " open" : ""}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      <div className="layout">
        {/* Sidebar */}
        <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
          <div className="gold-bar" />
          <div className="sidebar-logo">
            <div className="sidebar-logo-mark">
              <svg
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 2C10 2 5 7 5 11.5C5 14.538 7.239 17 10 17C12.761 17 15 14.538 15 11.5C15 7 10 2 10 2Z"
                  fill="#1f773a"
                />
                <path
                  d="M10 8C10 8 7.5 10.5 7.5 12.25C7.5 13.769 8.619 15 10 15C11.381 15 12.5 13.769 12.5 12.25C12.5 10.5 10 8 10 8Z"
                  fill="white"
                  fillOpacity="0.9"
                />
              </svg>
            </div>
            <div className="sidebar-title">Droplets DNA</div>
            <div className="sidebar-subtitle">Admin Dashboard</div>
          </div>

          <nav className="sidebar-nav">
            <div className="sidebar-nav-label">Data Tables</div>
            {(Object.keys(endpoints) as TableName[]).map((t) => (
              <button
                key={t}
                className={`nav-btn${table === t ? " active" : ""}`}
                onClick={() => handleNavClick(t)}
              >
                <span className="nav-icon">{TABLE_ICONS[t]}</span>
                <span className="nav-label">{TABLE_LABELS[t]}</span>
                <span className="nav-count">
                  {loading ? "—" : totalCounts[t]}
                </span>
              </button>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="sidebar-footer-text">
              © {new Date().getFullYear()} Droplets DNA
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="main">
          {/* Header */}
          <header className="header">
            <div className="header-left">
              <button
                className="hamburger"
                onClick={() => setSidebarOpen((o) => !o)}
                aria-label="Toggle menu"
              >
                <span />
                <span />
                <span />
              </button>
              <div className="header-text">
                <div className="header-title">{TABLE_LABELS[table]}</div>
                <div className="header-crumb">
                  Dashboard / <span>{TABLE_LABELS[table]}</span>
                </div>
              </div>
            </div>
            <div className="header-badge">
              <span className="badge-dot" />
              <span className="badge-label">Live Data</span>
            </div>
          </header>

          {/* Stats */}
          <div className="stats-bar">
            {(Object.keys(endpoints) as TableName[]).map((t) => (
              <div
                key={t}
                className={`stat-card${table === t ? " active-card" : ""}`}
                onClick={() => setTable(t)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setTable(t)}
              >
                <div className="stat-icon">{TABLE_ICONS[t]}</div>
                <div className="stat-info">
                  <div className="stat-count">
                    {loading ? "—" : totalCounts[t]}
                  </div>
                  <div className="stat-label">{TABLE_LABELS[t]}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="table-section">
            {loading ? (
              <div className="loading-state">
                <div className="spinner" />
                <div className="loading-text">Loading data...</div>
              </div>
            ) : (
              <>
                <div className="table-toolbar">
                  <div className="table-info">
                    Showing <strong>{data.length}</strong>{" "}
                    {data.length === 1 ? "record" : "records"}
                  </div>
                  {columns.length > 0 && (
                    <div className="table-tag">
                      <span>⬡</span>
                      {columns.length} columns
                    </div>
                  )}
                </div>

                <div className="table-wrap">
                  {data.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">🗂</div>
                      <div className="empty-title">No records found</div>
                      <div className="empty-sub">
                        This table is currently empty.
                      </div>
                    </div>
                  ) : (
                    <div className="table-scroll">
                      <table>
                        <thead>
                          <tr>
                            {columns.map((col) => (
                              <th key={col}>{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {data.map((row, i) => (
                            <tr key={i}>
                              {columns.map((col) => (
                                <td key={col} title={String(row[col] ?? "")}>
                                  {String(row[col] ?? "")}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom nav — mobile only */}
      <nav className="bottom-nav" aria-label="Mobile navigation">
        <div className="bottom-nav-inner">
          {(Object.keys(endpoints) as TableName[]).map((t) => (
            <button
              key={t}
              className={`bottom-nav-btn${table === t ? " active" : ""}`}
              onClick={() => setTable(t)}
            >
              {table === t && <span className="bottom-nav-indicator" />}
              <span className="bottom-nav-icon">{TABLE_ICONS[t]}</span>
              <span className="bottom-nav-label">{TABLE_LABELS[t]}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
