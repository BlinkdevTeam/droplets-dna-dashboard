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
          --green-mid: #2d9c4e;
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
          --shadow-md: 0 4px 12px rgba(31,119,58,0.12), 0 8px 32px rgba(31,119,58,0.08);
        }

        body {
          font-family: var(--font);
          background: var(--gray-50);
          color: var(--gray-900);
          min-height: 100vh;
        }

        .layout {
          display: flex;
          min-height: 100vh;
        }

        /* ── Sidebar ── */
        .sidebar {
          width: 240px;
          flex-shrink: 0;
          background: var(--green);
          display: flex;
          flex-direction: column;
          padding: 0;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: hidden;
        }

        .sidebar-logo {
          padding: 28px 24px 24px;
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
          margin-bottom: 12px;
        }

        .sidebar-logo-mark svg {
          width: 20px;
          height: 20px;
        }

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
          color: rgba(255,255,255,0.55);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-top: 2px;
        }

        .sidebar-nav {
          padding: 20px 12px;
          flex: 1;
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
          color: rgba(255,255,255,0.75);
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

        .nav-icon {
          font-size: 15px;
          flex-shrink: 0;
        }

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
          padding: 16px 24px;
          border-top: 1px solid rgba(255,255,255,0.12);
        }

        .sidebar-footer-text {
          font-size: 11px;
          color: rgba(255,255,255,0.35);
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
          padding: 20px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .header-left {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .header-title {
          font-size: 20px;
          font-weight: 700;
          color: var(--gray-900);
          letter-spacing: -0.02em;
        }

        .header-crumb {
          font-size: 12.5px;
          color: var(--gray-400);
          font-weight: 400;
        }

        .header-crumb span {
          color: var(--green);
          font-weight: 500;
        }

        .header-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--green-light);
          color: var(--green);
          font-size: 12.5px;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 99px;
          border: 1px solid rgba(31,119,58,0.2);
        }

        .badge-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--green);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
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
          padding: 18px 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          transition: box-shadow 0.15s, border-color 0.15s;
          cursor: pointer;
        }

        .stat-card:hover {
          box-shadow: var(--shadow);
          border-color: var(--gray-200);
        }

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
        }

        .stat-card.active-card .stat-icon {
          background: var(--green);
        }

        .stat-info {
          min-width: 0;
        }

        .stat-count {
          font-size: 24px;
          font-weight: 700;
          color: var(--gray-900);
          font-family: var(--font-mono);
          letter-spacing: -0.03em;
          line-height: 1;
        }

        .stat-label {
          font-size: 12px;
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
        }

        .table-info {
          font-size: 13px;
          color: var(--gray-600);
          font-weight: 500;
        }

        .table-info strong {
          color: var(--gray-900);
        }

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
          padding: 12px 16px;
          text-align: left;
          font-size: 11px;
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

        tbody tr:last-child {
          border-bottom: none;
        }

        tbody tr:hover {
          background: var(--green-light);
        }

        tbody td {
          padding: 12px 16px;
          color: var(--gray-900);
          font-size: 13.5px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 240px;
        }

        tbody td:first-child {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--gray-600);
        }

        /* ── Loading ── */
        .loading-state {
          padding: 64px 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          color: var(--gray-400);
        }

        .spinner {
          width: 36px;
          height: 36px;
          border: 3px solid var(--gray-200);
          border-top-color: var(--green);
          border-radius: 50%;
          animation: spin 0.75s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading-text {
          font-size: 14px;
          font-weight: 500;
          color: var(--gray-400);
        }

        /* ── Empty State ── */
        .empty-state {
          padding: 56px 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          color: var(--gray-400);
        }

        .empty-icon {
          font-size: 36px;
          margin-bottom: 4px;
          opacity: 0.5;
        }

        .empty-title {
          font-size: 15px;
          font-weight: 600;
          color: var(--gray-600);
        }

        .empty-sub {
          font-size: 13px;
          color: var(--gray-400);
        }

        /* ── Gold accent bar at top ── */
        .gold-bar {
          height: 3px;
          background: linear-gradient(90deg, var(--gold) 0%, var(--gold-dark) 100%);
          width: 100%;
        }
      `}</style>

      <div className="layout">
        {/* Sidebar */}
        <aside className="sidebar">
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
                onClick={() => setTable(t)}
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
              <div className="header-title">{TABLE_LABELS[table]}</div>
              <div className="header-crumb">
                Dashboard / <span>{TABLE_LABELS[table]}</span>
              </div>
            </div>
            <div className="header-badge">
              <span className="badge-dot" />
              Live Data
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
    </>
  );
}
