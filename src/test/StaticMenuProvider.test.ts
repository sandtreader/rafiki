import StaticMenuProvider from '../lib/StaticMenuProvider';
import MenuStructure from '../lib/MenuStructure';
import exampleMenu from './ExampleMenuStructure';

test('the model reflects to the result', () => {
  const provider = new StaticMenuProvider(exampleMenu);
  const root = provider.getMenu();
  expect(root.id).toBe('');
  expect(root.name).toBe('');
  expect(root.children).not.toBeUndefined();
  expect(root.children!.length).toBe(2);

  const foo = root.children![0];
  expect(foo.id).toBe('foo');
  expect(foo.name).toBe('FOO');
  expect(foo.children).not.toBeUndefined();
  expect(foo.children!.length).toBe(1);

  const child = foo.children![0];
  expect(child.id).toBe('child');
  expect(child.name).toBe('CHILD');
  expect(child.children).not.toBeUndefined();
  expect(child.children!.length).toBe(2);

  const grandchild1 = child.children![0];
  expect(grandchild1.id).toBe('grandchild1');
  expect(grandchild1.name).toBe('GRANDCHILD 1');
  expect(grandchild1.children).toBeUndefined();

  const grandchild2 = child.children![1];
  expect(grandchild2.id).toBe('grandchild2');
  expect(grandchild2.name).toBe('GRANDCHILD 2');
  expect(grandchild2.children).toBeUndefined();

  const bar = root.children![1];
  expect(bar.id).toBe('bar');
  expect(bar.name).toBe('BAR');
  expect(bar.children).toBeUndefined();
});
