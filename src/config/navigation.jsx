import {
    HomeIcon,
    UsersIcon,
    BellIcon
  } from '@heroicons/react/24/outline';

export const navigation = [
    {
      idx: 0,
      name: 'Sample1',
      href: '/Sample1?this=234#',
      icon: HomeIcon,
      current: true,

    },
    {
      idx: 1,
      name: 'Sample2',
      href: '/Sample2',
      icon: UsersIcon,
      current: false,
 
    },
    {
        idx: 2,
        name: 'Sample3',
        href: '/Sample3',
        icon: BellIcon,
        current: false,
   
      },
  ];