import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';

type Common = {
  variant?: 'primary' | 'secondary' | 'ghost' | 'door';
  size?: 'md' | 'lg';
  className?: string;
  children?: ReactNode;
};
type AsButton = Common & { as?: 'button' } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof Common>;
type AsAnchor = Common & {
  as: 'a';
  href: string;
  /** Use the client router for in-app paths. Hash links and external URLs stay plain anchors. */
  internal?: boolean;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof Common | 'href'>;

export type ButtonProps = AsButton | AsAnchor;

/** Renders `<a>` for navigation and `<button>` for actions, never a div (plan 3.11). */
export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', className, children } = props;
  const cls = ['btn', `btn--${variant}`, size === 'lg' ? 'btn--lg' : '', variant === 'primary' || variant === 'door' ? 'on-accent' : '', className ?? '']
    .filter(Boolean)
    .join(' ');
  if (props.as === 'a') {
    const { as: _as, variant: _v, size: _s, className: _c, children: _ch, internal, href, ...rest } = props;
    return internal ? (
      <Link className={cls} to={href} {...rest}>
        {children}
      </Link>
    ) : (
      <a className={cls} href={href} {...rest}>
        {children}
      </a>
    );
  }
  const { as: _as, variant: _v, size: _s, className: _c, children: _ch, type = 'button', ...rest } = props;
  return (
    <button className={cls} type={type} {...rest}>
      {children}
    </button>
  );
}
