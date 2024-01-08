"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import classNames from "classnames";
import styles from "./Navbar.module.css";

const menuLinks = [
  { label: "Exercise 1", route: "/exercise1" },
  { label: "Exercise 2", route: "/exercise2" },
  { label: "Extra", route: "/extraExercise" }
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav>
      <ul className={styles.linkList}>
        {menuLinks.map(({ label, route }) => (
          <li key={route}>
            <Link
              className={classNames(styles.link, { [styles.active]: pathname === route })}
              href={route}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
