import Card from "./components/Card";

function App() {
  return (
    <div className="space-y-6">
      <Card title="Lightest Card" color="lightest">
        <p>This card uses the lightest color as the background.</p>
      </Card>
      <Card title="Primary Card" color="primary">
        <p>This card uses the primary color (#FF69B4) as the background.</p>
      </Card>
      <Card title="Darkest Card" color="darkest">
        <p>This card uses the darkest color (#CF3E8A) as the background.</p>
      </Card>
    </div>
  );
}

export default App;
