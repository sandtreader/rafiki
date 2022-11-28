import MenuStructure from '../lib/MenuStructure';

const exampleMenu: MenuStructure = {
  id: '',
  name: '',
  children: [
    {
      id: 'foo',
      name: 'FOO',
      icon: 'group',
      content: <h1>This is a FOO!</h1>,  // Static content
      children: [
        {
          id: 'child',
          name: 'CHILD',
          icon: 'emoji_people',
          content: item => <h2>This is the child</h2>,  // Functional content

          children: [
            {
              id: 'grandchild1',
              name: 'GRANDCHILD 1',
              icon: 'man',
              content: item => <h3>This is {item.name}</h3>  // Function using item
            },
            {
              id: 'grandchild2',
              name: 'GRANDCHILD 2',
              icon: 'woman',
              content: item => <h3>This is {item.name}</h3>
            },
          ],
        },
      ],
    },
    {
      id: 'bar',
      name: 'BAR',
      // Note no content
    },
  ],
};

export default exampleMenu;
