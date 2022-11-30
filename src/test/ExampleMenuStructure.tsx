import MenuStructure from '../lib/MenuStructure';

const exampleMenu = MenuStructure.fromLiteral({
  id: '',
  name: '',
  children: [
    {
      id: 'foo',
      name: 'FOO',
      icon: 'group',
      content: <h1>This is a FOO!</h1>, // Static content
      children: [
        {
          id: 'child',
          name: 'CHILD',
          icon: 'emoji_people',
          content: (item: MenuStructure) => <h2>This is the child</h2>, // Functional content

          children: [
            {
              id: 'grandchild1',
              name: 'GRANDCHILD 1',
              icon: 'man',
              content: (item: MenuStructure) => <h3>This is {item.name}</h3>, // Function using item
              requirements: [ "test" ]
            },
            {
              id: 'grandchild2',
              name: 'GRANDCHILD 2',
              icon: 'woman',
              content: (item: MenuStructure) => <h3>This is {item.name}</h3>,
              requirements: [ "wizard" ]
            },
          ],
        },
      ],
    },
    {
      id: 'bar',
      name: 'BAR',
      // Note no content
      requirements: [ "bar.admin" ]
    },
  ],
});

export default exampleMenu;

export const additionalMenu = MenuStructure.fromLiteral({
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
              id: 'grandchild3',
              name: 'GRANDCHILD 3',
              icon: 'man',
              content: (item: MenuStructure) => <h3>This is {item.name}</h3>, // Function using item
            },
          ],
        },
      ],
    },
    {
      id: 'splat',
      name: 'SPLAT',
      content: <h2>This is splat</h2>
    },
  ],
 });
