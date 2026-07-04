import { AnimalesProvider } from "@/components/animales/animales-provider";

export default function AnimalesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AnimalesProvider>{children}</AnimalesProvider>;
}
