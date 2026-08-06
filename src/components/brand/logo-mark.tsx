import Image from "next/image";
import Link from "next/link";

export function LogoMark() {
  return (
    <Link href="/dashboard" className="inline-flex items-center gap-3">
      <Image
        src="/brand/logo-logicontrol360-horizontal.svg"
        alt="LogiControl360"
        width={168}
        height={34}
        priority
      />
    </Link>
  );
}
