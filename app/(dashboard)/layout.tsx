// app/(dashboard)/layout.tsx
import { DeployButton } from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher"; // This is now used
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm">
          <div className="flex gap-5 items-center font-semibold">
            <Link href={"/dashboard"}>Nimbiiz LNS</Link>
            <div className="flex items-center gap-2">
              <DeployButton />
            </div>
          </div>
          
          {/* --- THIS IS THE FIX --- */}
          {/* We wrapped AuthButton and ThemeSwitcher in a flex div */}
          <div className="flex items-center gap-2">
            {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
            <ThemeSwitcher /> 
          </div>
          {/* --------------------- */}

        </div>
      </nav>

      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 flex flex-col p-6 max-w-5xl">
          {children}
        </main>
      </div>
    </div>
  );
}