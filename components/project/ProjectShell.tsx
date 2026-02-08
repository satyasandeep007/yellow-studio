import { ReactNode } from "react";

type ProjectShellProps = {
  header: ReactNode;
  sidebar: ReactNode;
  chat: ReactNode;
  preview: ReactNode;
  walletModal: ReactNode;
};

export function ProjectShell({
  header,
  sidebar,
  chat,
  preview,
  walletModal,
}: ProjectShellProps) {
  return (
    <div className="flex h-screen flex-col bg-white">
      {header}
      <div className="flex flex-1 overflow-hidden">
        {sidebar}
        <div className="flex-1 border-r border-gray-200">{chat}</div>
        <div className="flex-1">{preview}</div>
      </div>
      {walletModal}
    </div>
  );
}
