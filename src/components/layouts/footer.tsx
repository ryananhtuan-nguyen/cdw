import { routes } from '@/config/routes'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { SiInstagram, SiMeta, SiX } from '@icons-pack/react-simple-icons'
import { navLinks } from '@/config/constants'

const socialLinks = [
  {
    id: 'facebook',
    url: 'https://www.facebook.com',
    icon: (
      <SiMeta className="w-5 h-5 text-gray-600 hover:text-primary transition-colors" />
    ),
  },
  {
    id: 'twitter',
    url: 'https://www.twitter.com',
    icon: (
      <SiX className="w-5 h-5 text-gray-600 hover:text-primary transition-colors" />
    ),
  },
  {
    id: 'instagram',
    url: 'https://www.instagram.com',
    icon: (
      <SiInstagram className="w-5 h-5 text-gray-600 hover:text-primary transition-colors" />
    ),
  },
]

const PublicFooter = () => {
  return (
    <footer className="bg-gray-100 px-8 lg:px-0 py-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Link className="flex items-center" href={routes.home}>
              <Image
                height={100}
                alt="logo"
                className="h-8 relative"
                src="/logo.svg"
                width={300}
              />
            </Link>
          </div>
        </div>
        <div className="flex space-x-4">
          {socialLinks.map((link) => (
            <Link href={link.url} key={`${link.id}-${link.url}`}>
              {link.icon}
            </Link>
          ))}
        </div>

        <div className="space-y-2">
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.id}>
                <Link
                  className="text-gray-600 hover:text-primary transition-colors"
                  href={link.href}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default PublicFooter
