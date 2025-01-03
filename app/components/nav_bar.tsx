'use client';
import { useState } from 'react';

import { Charm } from 'next/font/google';
import Link from 'next/link';
import { HomeIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@nextui-org/button';
const charm = Charm({
  weight: ['400', '700'],
  style: 'normal',
  subsets: ['latin'],
});

function GithubLogo({ size, height, width }: { size?: number; width?: number; height?: number }) {
  return (
    <svg
      width={size || width || 98}
      height={size || height || 96}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 98 96"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
        fill="#24292f"
      />
    </svg>
  );
}

export default function NavBar() {
  const [toggle, setToggle] = useState(false);
  return (
    <>
      <div className="sticky top-0 z-30 backdrop-blur">
        <div className="dark container flex-col justify-between px-9 mx-auto lg:items-center">
          <div className="flex flex-row items-center justify-between w-full h-auto lg:h-[76px]">
            <div className={`flex flex-row items-end gap-2`}>
              <Link href="/">
                <div className="my-2 ">
                  <HomeIcon className="w-7 lg:w-9" />
                </div>
              </Link>

              <div className="my-2">
                <span className={`${charm.className} lg:text-2xl font-bold inline-block align-middle`}> Xavier.Z</span>
              </div>
            </div>
            <div className="flex-row hidden lg:flex">
              <Link href="https://github.com/xavierchow">
                <Button
                  endContent={<GithubLogo size={24} />}
                  size="md"
                  className="data-[hover=true]:opacity-100 border border-[#1c1c1c] text-black bg-cyan hover:bg-[#a1e6fc] hover:opacity-100 rounded-[10px]"
                >
                  Start me on
                </Button>
              </Link>
            </div>
            <div
              className="lg:hidden"
              onClick={() => {
                setToggle(!toggle);
              }}
            >
              <Bars3Icon className="w-7" />
            </div>
          </div>
        </div>
      </div>
      {toggle && (
        <div className="fixed top-0 left-0 z-40 no-doc-scroll backdrop-blur w-full h-screen">
          <div
            className="absolute right-4 top-4"
            onClick={() => {
              setToggle(!toggle);
            }}
          >
            <XMarkIcon className="w-7" />
          </div>
          <ul
            className="container mx-auto h-full text-lg underline decoration-solid flex flex-col justify-center gap-6 px-16"
            onClick={() => {
              setToggle(!toggle);
            }}
          >
            <li>
              <Link href="/">Home</Link>
            </li>

            <li>
              <Link href="https://github.com/xavierchow">Star me on Github</Link>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
