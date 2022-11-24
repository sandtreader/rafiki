import MenuStructure from '../lib/MenuStructure';

const exampleMenu: MenuStructure = {
  id: '',
  name: '',
  children: [
    {
      id: 'foo',
      name: 'FOO',
      children: [
        {
          id: 'child',
          name: 'CHILD',
          children: [
            {
              id: 'grandchild1',
              name: 'GRANDCHILD 1',
            },
            {
              id: 'grandchild2',
              name: 'GRANDCHILD 2',
            },
          ],
        },
      ],
    },
    {
      id: 'bar',
      name: 'BAR',
    },
  ],
};

export default exampleMenu;
