'use client';

import React, { useState, useRef, useEffect, useLayoutEffect, cloneElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Internal Types and Defaults ---

const DefaultHomeIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>;
const DefaultCompassIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" /></svg>;
const DefaultBellIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>;

export type NavItem = {
  id: string | number;
  icon: React.ReactElement;
  label?: string;
  onClick?: () => void;
  href?: string;
};

const defaultNavItems: NavItem[] = [
  { id: 'default-home', icon: <DefaultHomeIcon />, label: 'Home' },
  { id: 'default-explore', icon: <DefaultCompassIcon />, label: 'Explore' },
  { id: 'default-notifications', icon: <DefaultBellIcon />, label: 'Notifications' },
];

type LimelightNavProps = {
  items?: NavItem[];
  activeIndex?: number;
  defaultActiveIndex?: number;
  onTabChange?: (index: number) => void;
  className?: string;
  limelightClassName?: string;
  iconContainerClassName?: string;
  iconClassName?: string;
};

/**
 * An adaptive-width navigation bar with a "limelight" effect that highlights the active item using framer-motion for smooth spring physics.
 */
export const LimelightNav = ({
  items = defaultNavItems,
  activeIndex: controlledActiveIndex,
  defaultActiveIndex = 0,
  onTabChange,
  className,
  limelightClassName,
  iconContainerClassName,
  iconClassName,
}: LimelightNavProps) => {
  const [internalActiveIndex, setInternalActiveIndex] = useState(defaultActiveIndex);
  const activeIndex = controlledActiveIndex !== undefined ? controlledActiveIndex : internalActiveIndex;
  
  const [limelightStyle, setLimelightStyle] = useState({ left: 0, width: 44 });
  const [isMounted, setIsMounted] = useState(false);
  const navItemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (items.length === 0) return;

    const updatePosition = () => {
      const activeItem = navItemRefs.current[activeIndex];
      if (activeItem) {
        setLimelightStyle({
          left: activeItem.offsetLeft + activeItem.offsetWidth / 2 - 22,
          width: 44
        });
      }
    };

    updatePosition();
    // Re-check after a short delay for layout shifts
    const timer = setTimeout(updatePosition, 50);

    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('resize', updatePosition);
      clearTimeout(timer);
    };
  }, [activeIndex, items]);

  const handleItemClick = (index: number, itemOnClick?: () => void) => {
    setInternalActiveIndex(index);
    onTabChange?.(index);
    itemOnClick?.();
  };

  return (
    <nav className={`relative inline-flex items-center h-16 tactile-card text-ink px-2 ${className}`}>
      {items.map(({ id, icon, label, onClick }, index) => (
        <motion.a
          key={id}
          ref={el => { navItemRefs.current[index] = el; }}
          className={`relative z-20 flex h-full cursor-pointer items-center justify-center p-5 group ${iconContainerClassName}`}
          onClick={() => handleItemClick(index, onClick)}
          aria-label={label}
          whileTap={{ scale: 0.9 }}
          whileHover={{ y: -5, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          {(() => {
            const castedIcon = icon as React.ReactElement<{ className?: string }>;
            return cloneElement(castedIcon, {
              className: `w-6 h-6 transition-all duration-300 ease-in-out ${
                activeIndex === index ? 'opacity-100 scale-110 text-primary' : 'opacity-40 group-hover:opacity-100 text-muted'
              } ${castedIcon.props.className || ''} ${iconClassName || ''}`,
            });
          })()}
        </motion.a>
      ))}

      {/* The Limelight effect using framer-motion */}
      {isMounted && (
        <motion.div
          className={`absolute top-0 z-10 h-[5px] rounded-full bg-primary shadow-[0_50px_15px_var(--color-primary)] ${limelightClassName}`}
          initial={false}
          animate={{
            left: limelightStyle.left,
            width: limelightStyle.width
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
            mass: 1
          }}
        >
          <div className="absolute left-[-30%] top-[5px] w-[160%] h-14 [clip-path:polygon(5%_100%,25%_0,75%_0,95%_100%)] bg-gradient-to-b from-primary/40 to-transparent pointer-events-none" />

          {/* Subtle accent glow */}
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-primary/20 blur-sm rounded-full opacity-50" />
        </motion.div>
      )}
    </nav>
  );
};
