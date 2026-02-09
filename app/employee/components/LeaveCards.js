export default function LeaveCards({ balances = [] }) {
  const getColorClass = (type) => {
    switch (type.toLowerCase()) {
      case "sick":
        return "green";
      case "casual":
        return "blue";
      case "paid":
        return "yellow";
      default:
        return "blue";
    }
  };

  return (
    <div className="leave-cards">
      {balances.map((b) => (
        <div
          key={b.type}
          className={`leave-card ${getColorClass(b.type)}`}
        >
          <h4>{b.type} Leave</h4>
          <h2>{b.total - b.used}</h2>
          <p>{b.total - b.used} remaining</p>
          <small style={{ opacity: 0.8 }}>{b.used} used / {b.total} total</small>
        </div>
      ))}
    </div>
  );
}
