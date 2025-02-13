import Link from 'next/link'
import { FOOTER_DATA } from '@/constants'

export const Footer = () => {
  return (
    <div className="flex flex-row items-center gap-[20px] justify-center flex-wrap py-[20px]">
      {FOOTER_DATA.map(column =>
        column.data.map(({ icon: Icon, name, link }) => (
          <Link
            key={`${column.title}-${name}`}
            href={link}
            target="_blank"
            rel="noreferrer noopener"
            className="flex flex-row items-center"
          >
            {Icon && <Icon />}
            <span className="text-[15px] ml-[6px]">{name}</span>
          </Link>
        ))
      )}
      &copy; Er. Mohammad Hamza {new Date().getFullYear()} Inc. All rights reserved.
    </div>
  )
}
