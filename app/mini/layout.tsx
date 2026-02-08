import { TelegramProvider } from '@/lib/telegram/TelegramProvider';

export default function MiniAppLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return <TelegramProvider>{children}</TelegramProvider>;
}
