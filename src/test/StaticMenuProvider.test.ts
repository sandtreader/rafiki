import StaticMenuProvider from '../lib/StaticMenuProvider';
import MenuStructure from '../lib/MenuStructure';
import exampleMenu from './ExampleMenuStructure';

test('the model reflects to the result', () => {
  const provider = new StaticMenuProvider(exampleMenu);
  const ms = provider.getMenu();
  expect(ms.id).toBe('foo');
  expect(ms.name).toBe('FOO');
  expect(ms.children).not.toBeUndefined();
  expect(ms.children!.length).toBe(2);

  const child1 = ms.children![0];
  expect(child1.id).toBe('bar1');
  expect(child1.name).toBe('BAR1');
  expect(child1.children).toBeUndefined();

  const child2 = ms.children![1];
  expect(child2.id).toBe('bar2');
  expect(child2.name).toBe('BAR2');
  expect(child2.children).toBeUndefined();
});
