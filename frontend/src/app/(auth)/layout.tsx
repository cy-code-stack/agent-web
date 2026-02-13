import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Branding (hidden on mobile, visible on md+) */}
      <div className="hidden md:flex md:w-1/2 lg:w-2/5 bg-primary p-8 md:p-12 flex-col justify-between">
        <div className="flex items-center">
          <Image
            src="/images/marrea-dark.png"
            alt="Marrea Estates Corporation"
            width={250}
            height={65}
            className="h-12 w-auto"
            priority
          />
        </div>

        <div className="space-y-6">
          <h1 className="text-3xl lg:text-4xl font-bold text-primary-foreground leading-tight">
            Manage your real estate business with ease
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-md">
            Track clients, monitor sales, manage incentives, and schedule
            appointments all in one place.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-primary-foreground/10 rounded-lg p-4">
              <p className="text-3xl font-bold text-primary-foreground">500+</p>
              <p className="text-sm text-primary-foreground/70">Active Agents</p>
            </div>
            <div className="bg-primary-foreground/10 rounded-lg p-4">
              <p className="text-3xl font-bold text-primary-foreground">10K+</p>
              <p className="text-sm text-primary-foreground/70">Properties Sold</p>
            </div>
          </div>
          <p className="text-xs text-primary-foreground/60">
            Marrea Estates Corporation - Your trusted real estate partner
          </p>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="flex-1 flex flex-col min-h-screen md:min-h-0">
        {/* Mobile header */}
        <div className="md:hidden flex items-center p-4 border-b">
          <Image
            src="/images/marrea-light-v2.png"
            alt="Marrea Estates Corporation"
            width={180}
            height={47}
            className="h-10 w-auto"
            priority
          />
        </div>

        {/* Form container */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>

        {/* Mobile footer */}
        <div className="md:hidden p-4 border-t text-center">
          <p className="text-xs text-muted-foreground">
            Marrea Estates Corporation
          </p>
        </div>
      </div>
    </div>
  );
}
