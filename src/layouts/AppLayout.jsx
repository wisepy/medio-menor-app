import BottomNav from "../components/BottomNav";

function AppLayout({ children }) {
  return (
    <div className="app-shell">
      <main className="app-content">
        {children}
      </main>

      <BottomNav />
    </div>
  );
}

export default AppLayout;