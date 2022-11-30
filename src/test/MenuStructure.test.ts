import MenuStructure from '../lib/MenuStructure';

test('construction', () => {
  const ms = new MenuStructure('foo', 'FOO');
  expect(ms.id).toBe('foo');
  expect(ms.name).toBe('FOO');
  expect(ms.icon).toBeUndefined();
  expect(ms.children).toBeUndefined();
});

test('merging', () => {

  // First tree
  const ms1 = new MenuStructure('a', '1');
  ms1.children = [];
  const ms1_1 = new MenuStructure('a.a', '1.1')
  ms1_1.children = [];
  ms1_1.children.push(new MenuStructure('a.a.a', '1.1.1'));
  ms1_1.children.push(new MenuStructure('a.a.b', '1.1.2'));
  ms1.children.push(ms1_1);

  const ms1_2 = new MenuStructure('a.b', '1.2')
  ms1.children.push(ms1_2);

  // Second tree
  const ms2 = new MenuStructure('a', '2');
  ms2.children = [];
  const ms2_1 = new MenuStructure('a.a', '2.1')
  ms2_1.children = [];
  ms2_1.children.push(new MenuStructure('a.a.a', '2.1.1'));
  ms2_1.children.push(new MenuStructure('a.a.c', '2.1.3'));
  ms2.children.push(ms2_1);

  const ms2_3 = new MenuStructure('a.c', '2.3')
  ms2.children.push(ms2_3);

  // Combine into ms1
  ms1.combineWith(ms2);

  // Root doesn't change
  expect(ms1.id).toBe('a');
  expect(ms1.name).toBe('1');

  // Top level should now have 3
  expect(ms1.children.length).toBe(3);
  expect(ms1.children[0].id).toBe('a.a');
  expect(ms1.children[1].id).toBe('a.b');
  expect(ms1.children[2].id).toBe('a.c');

  // Second level should also have 3
  const aa = ms1.children[0];
  expect(aa.children!.length).toBe(3);
  expect(aa.children![0].id).toBe('a.a.a');
  expect(aa.children![0].name).toBe('1.1.1');  // Note first takes priority
  expect(aa.children![1].id).toBe('a.a.b');
  expect(aa.children![2].id).toBe('a.a.c');
});

test('capability filtering', () => {
  const ms = new MenuStructure('root', 'ROOT');
  ms.children = [];
  const ms_1 = new MenuStructure('test', 'TEST');
  ms_1.requirements = [ "test" ];
  ms_1.children = [];
  const ms_1_1 = new MenuStructure('test1', 'TEST 1');
  ms_1_1.requirements = [ "test1" ];
  ms_1.children.push(ms_1_1);

  const ms_1_2 = new MenuStructure('test2', 'TEST 2');
  ms_1_2.requirements = [ "test2", "magic" ];
  ms_1.children.push(ms_1_2);
  ms.children.push(ms_1);

  const ms_2 = new MenuStructure('admin', 'ADMIN')
  ms_2.requirements = [ "admin" ];
  ms.children.push(ms_2);

  const capabilities = [ "test.*", "useless" ];

  const msf = ms.filterWithCapabilities(capabilities);

  expect(ms.hidden).toBe(false);
  expect(ms_1.hidden).toBe(false);
  expect(ms_1_1.hidden).toBe(false);
  expect(ms_1_2.hidden).toBe(true);
  expect(ms_2.hidden).toBe(true);
});
