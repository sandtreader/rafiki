import MenuStructure from '../lib/MenuStructure';

const exampleMenu: MenuStructure = {
  id: '',
  name: '',
  children: [
    {
      id: 'foo',
      name: 'FOO',
      icon: 'group',
      children: [
        {
          id: 'child',
          name: 'CHILD',
          icon: 'emoji_people',
          children: [
            {
              id: 'grandchild1',
              name: 'GRANDCHILD 1',
              icon: 'man'
            },
            {
              id: 'grandchild2',
              name: 'GRANDCHILD 2',
              icon: 'woman'
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
