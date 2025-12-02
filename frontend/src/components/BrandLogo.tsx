import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  withText?: boolean;
  className?: string;
  textClassName?: string;
  size?: number;
  priority?: boolean;
  imageSrc?: string;
};

export function BrandLogo({
  withText = true,
  className,
  textClassName,
  size = 32,
  priority = false,
  imageSrc = "/reserveja.svg",
}: BrandLogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Image
        src={imageSrc}
        alt="Reserveja"
        width={size}
        height={size}
        priority={priority}
      />
      {withText && (
        <span className={cn("font-semibold", textClassName)}>Reserve Ja</span>
      )}
    </div>
  );
}
