import Link from "next/link";

export default function Logo() {
  return (
    <Link href={'/'} className="flex gap-1">
      <img src="/logo-raywood-copy.png" width={80} className="mx-auto" />
    </Link>
  );
}