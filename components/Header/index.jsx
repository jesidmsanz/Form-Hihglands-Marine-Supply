'use client';

import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Fragment, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

const Header = () => {
  const pathnameFromRouter = usePathname();
  const [pathname, setPathname] = useState('/');
  const [visible, setVisible] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  /* -----------------------------
    Sync pathname (SSR safe)
  ------------------------------ */
  useEffect(() => {
    setPathname(pathnameFromRouter || '/');
  }, [pathnameFromRouter]);

  /* -----------------------------
    Scroll behavior (hide/show)
  ------------------------------ */
  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;

      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const delta = currentY - lastScrollY.current;
          if (Math.abs(delta) > 10) {
            setVisible(delta < 0 || currentY < 100);
            lastScrollY.current = currentY;
          }
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* -----------------------------
    Helpers
  ------------------------------ */
  const isActive = (href) => {
    const clean = pathname.split('?')[0];
    return clean === href || clean.startsWith(href + '/');
  };

  const navigation = [
    {
      label: 'Our Office',
      children: [
        { label: 'Our Office', href: '/dental-office-pasadena' },
        { label: 'Our Team', href: '/dental-team-pasadena' },
        { label: 'Testimonials', href: '/testimonials' },
      ],
    },
    { label: 'Dental Care', href: '/dental-care-pasadena' },
    { label: 'Smile Gallery', href: '/smile-gallery' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <header
        className={`grid-area-header py-3 sticky top-0 w-full z-[1000] transition-all duration-250 ease-in-out ${
          visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
        {/* Top bar */}
        <div className="container">
          <div className="flex items-center justify-between">
            <Link href="/" className="no-underline font-semibold">
              Logo
            </Link>

            {/* Desktop navigation */}
            <nav className="hidden lg:flex gap-6">
              {navigation.map((item) =>
                item.children ? (
                  <Menu key={item.label} as="div" className="relative">
                    <Menu.Button className="inline-flex items-center gap-1 no-underline cursor-pointer hover:text-main-color focus:text-main-color">
                      {item.label}
                      <ChevronDownIcon className="w-4 h-4" />
                    </Menu.Button>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute top-full right-0 min-w-[200px] bg-white shadow-lg rounded-md mt-1">
                        {item.children.map((sub) => (
                          <Menu.Item key={sub.href}>
                            <Link
                              href={sub.href}
                              className={`block px-4 py-2 no-underline ${
                                isActive(sub.href) ? 'font-semibold' : ''
                              }`}
                            >
                              {sub.label}
                            </Link>
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center gap-1 no-underline cursor-pointer hover:text-main-color focus:text-main-color ${
                      isActive(item.href) ? 'font-semibold' : ''
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </nav>

            {/* Mobile toggle */}
            <button
              className="inline-flex lg:hidden bg-transparent border-none"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>
      <Transition show={mobileOpen} as={Fragment}>
        <div className="fixed inset-0 z-[1000]">
          {/* Overlay */}
          <Transition
            as={Fragment}
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <button
              aria-label="Close menu"
              className="absolute inset-0 bg-black/50 backdrop-blur-sm border-none"
              onClick={() => setMobileOpen(false)}
            />
          </Transition>

          {/* Drawer */}
          <Transition
            as={Fragment}
            enter="transition-transform transition-opacity duration-300 ease-out"
            enterFrom="translate-x-full opacity-0"
            enterTo="translate-x-0 opacity-100"
            leave="transition-transform transition-opacity duration-200 ease-in"
            leaveFrom="translate-x-0 opacity-100"
            leaveTo="translate-x-full opacity-0"
          >
            <div className="absolute top-0 right-0 w-4/5 max-w-[360px] h-full bg-black text-white flex flex-col">
              <div className="flex justify-end p-4">
                <button onClick={() => setMobileOpen(false)}>
                  <XMarkIcon className="h-6 w-6 text-white cursor-pointer" />
                </button>
              </div>

              <nav className="bg-black text-white p-6">
                {navigation.map((item) =>
                  item.children ? (
                    <Disclosure key={item.label}>
                      {({ open }) => (
                        <>
                          <Disclosure.Button className="grid w-full grid-cols-[1fr_20px] text-left items-center py-3 text-white no-underline font-medium">
                            {item.label}
                            <ChevronDownIcon
                              className={`text-white transition-transform duration-200 ${
                                open ? 'rotate-180' : ''
                              }`}
                            />
                          </Disclosure.Button>

                          <Disclosure.Panel className="mt-2 pl-4 bg-white/5">
                            {item.children.map((sub) => (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                className="block py-2 text-white no-underline font-normal opacity-85 hover:opacity-100"
                                onClick={() => setMobileOpen(false)}
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="grid w-full grid-cols-[1fr_20px] text-left items-center py-3 text-white no-underline font-medium hover:opacity-100"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </nav>
            </div>
          </Transition>
        </div>
      </Transition>
    </>
  );
};

export default Header;
