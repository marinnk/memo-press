/** 文章チェックの指摘を表示する欄。チェックの中身は今後追加する */
export function CheckPanel() {
  return (
    <aside className="panel panel--narrow" aria-labelledby="check-heading">
      <div className="panel__header">
        <h2 id="check-heading" className="panel__title">
          チェック
        </h2>
      </div>
      <div className="panel__body">
        <p className="empty-message">文章チェックは準備中です。</p>
      </div>
    </aside>
  )
}
