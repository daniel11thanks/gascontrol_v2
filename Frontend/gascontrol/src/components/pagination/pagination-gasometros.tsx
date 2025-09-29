'use client';

import { useMemo, useState } from 'react';
import styles from './pagination-gasometros.module.css';
import DeleteButton from '@/components/form/delete-button';

type Gasometro = {
  codigo: string;
  apartamento: number;
};

export default function PaginationGasometros({
  items,
  pageSize = 5,
  onDeleteAction,
}: {
  items: Gasometro[];
  pageSize?: number;
  onDeleteAction: (formData: FormData) => Promise<void>;
}) {
  const [page, setPage] = useState(1);

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  const placeholders = Math.max(0, pageSize - pageItems.length);

  const canPrev = page > 1;
  const canNext = page < totalPages;

  const goto = (p: number) => {
    if (p >= 1 && p <= totalPages) setPage(p);
  };

  if (total === 0) return null;

  return (
    <div className={styles.wrapper}>
      <ul className={styles.list}>
        {pageItems.map((g) => (
          <li key={g.codigo} className={styles.item}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 8,
              }}
            >
              <div>
                <div>Código: {g.codigo}</div>
                <div>Apartamento: {g.apartamento}</div>
              </div>
              <form action={onDeleteAction} style={{ alignSelf: 'flex-start' }}>
                <input type="hidden" name="codigo" value={g.codigo} />
                <DeleteButton className={styles.deleteBtn}>
                  Excluir
                </DeleteButton>
              </form>
            </div>
          </li>
        ))}

        {Array.from({ length: placeholders }).map((_, i) => (
          <li
            key={`ph-${i}`}
            className={`${styles.item} ${styles.placeholder}`}
            aria-hidden="true"
          />
        ))}
      </ul>

      <nav className={styles.pagination} aria-label="Paginação">
        <button
          className={`${styles.navBtn} ${!canPrev ? styles.disabled : ''}`}
          onClick={() => goto(page - 1)}
          disabled={!canPrev}
        >
          ←
        </button>

        <ul className={styles.pages}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <li key={p}>
              <button
                className={`${styles.pageBtn} ${
                  p === page ? styles.active : ''
                }`}
                onClick={() => goto(p)}
                aria-current={p === page ? 'page' : undefined}
              >
                {p}
              </button>
            </li>
          ))}
        </ul>

        <button
          className={`${styles.navBtn} ${!canNext ? styles.disabled : ''}`}
          onClick={() => goto(page + 1)}
          disabled={!canNext}
        >
          →
        </button>
      </nav>
    </div>
  );
}
