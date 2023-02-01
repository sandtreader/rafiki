import { useEffect, useState } from 'react';
import { exampleMenu, additionalMenu } from '../test/ExampleMenuStructure';
import JWTAuthenticationProvider from '../lib/JWTAuthenticationProvider';
import Framework from '../lib/Framework';
import MenuProvider from '../lib/MenuProvider';
import MenuLoader from '../lib/MenuLoader';

// Authentication provider
const authProvider =
  new JWTAuthenticationProvider("http://localhost:7081/login");

// Menu loader - start with dynamic one then add static
// Top-level App
function App() {
  const [menus, setMenus] = useState<MenuProvider>();

  // Load menus at start - has to be an effect because dynamic load is async
  useEffect(() => {
    (async () => {
      const menuLoader = new MenuLoader([ "DynamicMenuModule" ]);
      const menuProvider = await menuLoader.load();
      menuProvider.add(exampleMenu);
      menuProvider.add(additionalMenu);
      setMenus(menuProvider);
    })();
  }, []);

  return (
    <div className="App">
      { menus &&
        <Framework authProvider={authProvider} menuProvider={menus}
                   title="Rafiki Administration Framework Test" />
      }
    </div>
  );
}

export default App;
