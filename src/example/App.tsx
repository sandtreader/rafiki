import { useEffect, useState } from 'react';
import { exampleMenu, additionalMenu } from '../test/ExampleMenuStructure';
//import JWTAuthenticationProvider from '../lib/JWTAuthenticationProvider';
import FakeAuthenticationProvider from '../lib/FakeAuthenticationProvider';
import Framework from '../lib/Framework';
import MenuProvider from '../lib/MenuProvider';
import MenuStructure from '../lib/MenuStructure';
import StaticMenuProvider from '../lib/StaticMenuProvider';
import SessionState from '../lib/SessionState';

// Authentication provider
const authProvider = new FakeAuthenticationProvider();
//  new JWTAuthenticationProvider("http://localhost:7081/login");

const dynamicMenuModules = [ "DynamicMenuModule" ];

// Top-level App
function App() {
  const [menus, setMenus] = useState<MenuProvider>();

  // Load menus at start - has to be an effect because dynamic load is async
  useEffect(() => {
    (async () => {
      // Create root menu
      const rootMenu = new MenuStructure("root", "root");
      const menuProvider = new StaticMenuProvider(rootMenu);

      // Example of dynamic menu loading
      // Note you must do this at the App top level because WebPack
      // does tricks at compile time to work out what can be loaded
      for(const moduleName of dynamicMenuModules)
      {
        const childMenuModule = await import(`./${moduleName}`);
        // We push their top-level export down a level to merge
        const menuLiteral = { children: [childMenuModule.default] };
        const menu = MenuStructure.fromLiteral(menuLiteral);
        menuProvider.add(menu);
      }

      // Then add some static ones too
      menuProvider.add(exampleMenu);
      menuProvider.add(additionalMenu);
      setMenus(menuProvider);
    })();
  }, []);

  const onSessionChange = (session: SessionState) => {
    console.log("New session "+JSON.stringify(session));
  }

  return (
    <div className="App">
      { menus &&
        <Framework authProvider={authProvider} menuProvider={menus}
                   title="Rafiki Administration Framework Test"
                   onSessionChange={onSessionChange} />
      }
    </div>
  );
}

export default App;
