import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import {FaLeaf} from "react-icons/fa";

interface NavItem {
  name: string;
  href: string;
}

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Friend Compare", href: "/friendCompare" },
  { name: "Upload Data", href: "/uploadData" },
  { name: "Delete Data", href: "/deleteData" },
];

export default function Header(): JSX.Element {
  const { data: sessionData, status } = useSession();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-green-800">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/dashboard" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <FaLeaf className="h-12 w-12 text-white"/>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-indigo-300"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="-mx-3 block rounded-lg py-2.5 px-3 text-base font-semibold leading-7 text-white hover:bg-gray-100 hover:text-gray-900"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {sessionData && (
            // \display user image

            <>
              <span className="mt-3 mr-3 text-sm font-semibold leading-6 text-white">
                <img
                  src={sessionData.user.image ?? ''}
                  className="-mt-1 h-8 w-8 rounded-full"
                />
              </span>
              <span className="mt-3 mr-8 text-sm font-semibold leading-6 text-white">
                {sessionData.user.name}
              </span>
            </>
          )}
          <button
            className="-mx-3 block rounded-lg py-2.5 px-3 text-base font-semibold leading-7 text-white hover:bg-gray-50 hover:text-gray-900"
            onClick={sessionData ? () => void signOut() : () => void signIn()}
          >
            {sessionData ? "Sign out" : "Sign in"}
          </button>
        </div>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <FaLeaf className="h-12 w-12 text-white"/>
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="flex py-6">
                {sessionData && (
                  // \display user image

                  <>
                    <span className="text-sm font-semibold leading-6">
                      <img
                        src={sessionData.user.image ?? ''}
                        className="-mt-1 h-12 w-12 rounded-full"
                      />
                    </span>
                    <span className="ml-2 mt-3 mr-8 text-base font-semibold leading-6">
                      {sessionData.user.name}
                    </span>
                  </>
                )}
              </div>
              <button
                className="-mx-3 block rounded-lg py-2.5 px-3 text-base font-semibold leading-7 hover:bg-gray-100 hover:text-gray-900"
                onClick={
                  sessionData ? () => void signOut() : () => void signIn()
                }
              >
                {sessionData ? "Sign out" : "Sign in"}
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
