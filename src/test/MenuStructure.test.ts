import MenuStructure from '../lib/MenuStructure';

test('construction', () => {
  const ms = new MenuStructure('foo', 'FOO');
  expect(ms.id).toBe('foo');
  expect(ms.name).toBe('FOO');
  expect(ms.icon).toBeUndefined();
  expect(ms.children).toBeUndefined();
});
