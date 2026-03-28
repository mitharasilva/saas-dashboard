import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getInsights } from "../../api/metrics";
import Sidebar from "../../components/Sidebar/Sidebar";
import type { Insight } from "../../types";
import styles from "./Insights.module.css";

type Category = "all" | "trend" | "anomaly" | "forecast" | "recommendation";
const CATEGORIES: Category[] = ["all", "trend", "anomaly", "forecast", "recommendation"];
const PAGE_SIZE = 6;

const categoryClass: Record<string, string> = {
  trend:          styles.trend,
  anomaly:        styles.anomaly,
  forecast:       styles.forecast,
  recommendation: styles.recommendation,
};

export default function Insights() {
  const [filter, setFilter]       = useState<Category>("all");
  const [unreadPage, setUnreadPage] = useState(1);
  const [readPage, setReadPage]   = useState(1);
  const queryClient = useQueryClient();

  const { data: insights, isLoading } = useQuery({
    queryKey: ["insights"],
    queryFn: getInsights,
    staleTime: 1000 * 60 * 5,
  });

  const filtered = insights?.filter(
    i => filter === "all" || i.category === filter
  ) ?? [];

  const unread = filtered.filter(i => !i.isRead);
  const read   = filtered.filter(i => i.isRead);

  const unreadTotalPages = Math.ceil(unread.length / PAGE_SIZE);
  const unreadStart      = (unreadPage - 1) * PAGE_SIZE;
  const unreadItems      = unread.slice(unreadStart, unreadStart + PAGE_SIZE);

  const readTotalPages = Math.ceil(read.length / PAGE_SIZE);
  const readStart      = (readPage - 1) * PAGE_SIZE;
  const readItems      = read.slice(readStart, readStart + PAGE_SIZE);

  const counts = insights?.reduce<Record<string, number>>((acc, i) => {
    acc[i.category] = (acc[i.category] ?? 0) + 1;
    return acc;
  }, {}) ?? {};

  function handleFilterChange(cat: Category) {
    setFilter(cat);
    setUnreadPage(1);
    setReadPage(1);
  }

  function setRead(id: number, isRead: boolean) {
    queryClient.setQueryData<Insight[]>(["insights"], old =>
      old?.map(i => i.id === id ? { ...i, isRead } : i)
    );
  }

  function markAllRead() {
    const ids = new Set(filtered.map(i => i.id));
    queryClient.setQueryData<Insight[]>(["insights"], old =>
      old?.map(i => ids.has(i.id) ? { ...i, isRead: true } : i)
    );
  }

  function markAllUnread() {
    const ids = new Set(filtered.map(i => i.id));
    queryClient.setQueryData<Insight[]>(["insights"], old =>
      old?.map(i => ids.has(i.id) ? { ...i, isRead: false } : i)
    );
  }

  return (
    <div className={styles.page}>
      <Sidebar />
      <main className={styles.main}>

        {/* Header */}
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Insights</h1>
            <p className={styles.pageSubtitle}>
              {insights ? `${insights.length} total` : "—"}
              {unread.length > 0 && (
                <span className={styles.unreadBadge}>{unread.length} unread</span>
              )}
            </p>
          </div>
        </div>

        {/* Filter bar */}
        <div className={styles.filterBar}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => handleFilterChange(cat)}
              className={filter === cat ? styles.filterActive : styles.filterBtn}
            >
              <span className={styles.capitalize}>{cat}</span>
              {cat !== "all" && counts[cat] != null && (
                <span className={styles.filterCount}>{counts[cat]}</span>
              )}
            </button>
          ))}
        </div>

        {/* Bulk actions */}
        {!isLoading && filtered.length > 0 && (
          <div className={styles.bulkBar}>
            <span className={styles.bulkLabel}>
              {filtered.length} {filter === "all" ? "insights" : filter}
            </span>
            <div className={styles.bulkActions}>
              <button onClick={markAllRead} className={styles.bulkBtn}>
                Mark all as read
              </button>
              <span className={styles.bulkDivider} />
              <button onClick={markAllUnread} className={styles.bulkBtn}>
                Mark all as unread
              </button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className={styles.loadingGrid}>
            {[...Array(6)].map((_, i) => <div key={i} className={styles.skeleton} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>No insights in this category.</div>
        ) : (
          <>
            {/* Unread tier */}
            <div className={styles.tier}>
              <div className={styles.tierHeader}>
                <span className={styles.tierLabel}>Unread</span>
                <span className={styles.tierCount}>{unread.length}</span>
              </div>
              {unread.length === 0 ? (
                <p className={styles.tierEmpty}>All caught up.</p>
              ) : (
                <>
                  <div className={styles.grid}>
                    {unreadItems.map(insight => (
                      <InsightRow
                        key={insight.id}
                        insight={insight}
                        onSetRead={isRead => setRead(insight.id, isRead)}
                      />
                    ))}
                  </div>
                  <Pagination
                    page={unreadPage}
                    totalPages={unreadTotalPages}
                    start={unreadStart}
                    total={unread.length}
                    onPrev={() => setUnreadPage(p => p - 1)}
                    onNext={() => setUnreadPage(p => p + 1)}
                  />
                </>
              )}
            </div>

            {/* Read tier */}
            {read.length > 0 && (
              <div className={styles.tier}>
                <div className={styles.tierHeader}>
                  <span className={styles.tierLabel}>Read</span>
                  <span className={styles.tierCount}>{read.length}</span>
                </div>
                <div className={styles.grid}>
                  {readItems.map(insight => (
                    <InsightRow
                      key={insight.id}
                      insight={insight}
                      onSetRead={isRead => setRead(insight.id, isRead)}
                    />
                  ))}
                </div>
                <Pagination
                  page={readPage}
                  totalPages={readTotalPages}
                  start={readStart}
                  total={read.length}
                  onPrev={() => setReadPage(p => p - 1)}
                  onNext={() => setReadPage(p => p + 1)}
                />
              </div>
            )}
          </>
        )}

      </main>
    </div>
  );
}

function Pagination({
  page, totalPages, start, total, onPrev, onNext,
}: {
  page: number;
  totalPages: number;
  start: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className={styles.pagination}>
      <span className={styles.pageInfo}>
        {start + 1}–{Math.min(start + PAGE_SIZE, total)} of {total}
      </span>
      <div className={styles.pageButtons}>
        <button onClick={onPrev} disabled={page === 1} className={styles.pageBtn}>
          ‹ Prev
        </button>
        <span className={styles.pageCount}>{page} / {totalPages}</span>
        <button onClick={onNext} disabled={page === totalPages} className={styles.pageBtn}>
          Next ›
        </button>
      </div>
    </div>
  );
}

function InsightRow({
  insight,
  onSetRead,
}: {
  insight: Insight;
  onSetRead: (isRead: boolean) => void;
}) {
  const colourClass = categoryClass[insight.category] ?? styles.defaultCategory;
  return (
    <div className={`${styles.card} ${colourClass} ${insight.isRead ? styles.read : ""}`}>
      <div className={styles.cardHeader}>
        <span className={`${styles.badge} ${colourClass}`}>{insight.category}</span>
        <button
          onClick={() => onSetRead(!insight.isRead)}
          className={styles.markReadBtn}
        >
          {insight.isRead ? "Mark as unread" : "Mark as read"}
        </button>
      </div>
      <p className={styles.cardTitle}>{insight.title}</p>
      {insight.body && <p className={styles.cardBody}>{insight.body}</p>}
      <p className={styles.cardDate}>
        {new Date(insight.generatedAt).toLocaleDateString(undefined, {
          month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
        })}
      </p>
    </div>
  );
}
