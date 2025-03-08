// import { Role } from '@/types/role';

export type SiteConfig = {
  name: string;
  description: string;
  navItems: NavItem[];
  navMenuItems: NavItem[];
  portalNavItems: NavItem[];
  portalNavMenuItems: NavItem[];
  links: {
    [key: string]: string;
  };
};

export type NavItem = {
  label: string;
  href: string;
  // roles?: Role[];
};

export const siteConfig = {
  name: 'Code Your Dreams Hub',
  description: 'Teach with ease. Empower your organization with the Code Your Dreams Hub.',
  navItems: [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'About',
      href: '/about',
    },

    {
      label: 'Pricing',
      href: '/pricing',
    },
  ],
  navMenuItems: [
    // {
    // 	label: "Donate",
    // 	href: "/", // CYD Team: Add Stripe donate link here
    // },
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'About',
      href: '/about',
    },

    {
      label: 'Pricing',
      href: '/pricing',
    },
    {
      label: 'Sign Up',
      href: '/portal',
    },
    {
      label: 'Log In',
      href: '/api/auth/login',
    },
  ],
  portalNavItems: [
    {
      label: 'Organizations',
      href: '/portal/organizations',
      // roles: [Role.Superadmin],
    },
    {
      label: 'Chapters',
      href: '/portal/chapters',
      // roles: [Role.Superadmin, Role.OrgAdmin],
    },
    {
      label: 'Courses',
      href: '/portal/courses',
      // roles: [Role.Superadmin, Role.OrgAdmin, Role.ChapterAdmin, Role.ChapterMember],
    },
    {
      label: 'Users',
      href: '/portal/users',
      // roles: [Role.Superadmin, Role.OrgAdmin, Role.ChapterAdmin],
    },
    {
      label: 'Account',
      href: '/portal/account',
      // roles: [Role.Superadmin, Role.OrgAdmin, Role.ChapterAdmin, Role.ChapterMember],
    },
  ],
  portalNavMenuItems: [
    {
      label: 'Organizations',
      href: '/portal/organizations',
      // roles: [Role.Superadmin],
    },
    {
      label: 'Chapters',
      href: '/portal/chapters',
      // roles: [Role.Superadmin, Role.OrgAdmin],
    },
    {
      label: 'Courses',
      href: '/portal/courses',
      // roles: [Role.Superadmin, Role.OrgAdmin, Role.ChapterAdmin, Role.ChapterMember],
    },
    {
      label: 'Users',
      href: '/portal/users',
      // roles: [Role.Superadmin, Role.OrgAdmin, Role.ChapterAdmin],
    },
    {
      label: 'Account',
      href: '/portal/account',
      // roles: [Role.Superadmin, Role.OrgAdmin, Role.ChapterAdmin, Role.ChapterMember],
    },
    {
      label: 'Log Out',
      href: '/api/auth/logout',
      // roles: [Role.Superadmin, Role.OrgAdmin, Role.ChapterAdmin, Role.ChapterMember],
    },
  ],
  links: {
    // donate: "https://localhost:3000", // CYD Team: Add Stripe donate link here
  },
};
