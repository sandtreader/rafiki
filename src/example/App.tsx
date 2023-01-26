import StaticMenuProvider from '../lib/StaticMenuProvider';
import { exampleMenu, additionalMenu } from '../test/ExampleMenuStructure';
import JWTAuthenticationProvider from '../lib/JWTAuthenticationProvider';
import Framework from '../lib/Framework';

// Authentication provider
const authProvider =
  new JWTAuthenticationProvider("http://localhost:7081/login");

// Menu structure provider
const menuProvider = new StaticMenuProvider(exampleMenu);
menuProvider.add(additionalMenu);

// Top-level App
function App() {
  return (
    <div className="App">
      <Framework authProvider={authProvider} menuProvider={menuProvider}/>
    </div>
  );
}

export default App;
