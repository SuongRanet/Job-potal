import { LuGithub, LuArrowUpRight } from "react-icons/lu";
import { FaLinkedinIn } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa6";

const footerNavigation = {
  social: [
    {
      name: "GitHub",
      href: "https://github.com/SuongRanet",
      icon: LuGithub,
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/suong-ranet-0b03b53a5/",
      icon: FaLinkedinIn,
    },
    {
      name: "Portfolio",
      href: "https://suongranet-portfolio.vercel.app/",
      icon: FaRegUser,
    },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background pb-[calc(2rem+env(safe-area-inset-bottom))] sm:pb-0">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-12">
        {/* Main Footer */}
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          {/* Brand */}
          <div className="max-w-md">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-xl font-bold tracking-tight text-foreground transition-opacity hover:opacity-80"
              aria-label="Suong Ranet - Home"
            >
              <span>
                Suong <span className="text-primary">Ranet</span>
              </span>
            </a>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Building modern web applications with a focus on performance,
              security, and elegant user experiences.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-foreground">
              Connect with me
            </p>

            <div className="flex items-center gap-3">
              {footerNavigation.social.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit my ${item.name} profile`}
                    title={item.name}
                    className="group inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                  </a>
                );
              })}

              <a
                href="mailto:suongranet98@gmail.com"
                aria-label="Send me an email"
                title="Email me"
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-border px-3 text-sm font-medium text-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary"
              >
                Contact
                <LuArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {currentYear} Suong Ranet. All rights reserved.</p>

          <a
            href="#top"
            className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
          >
            Back to top
            <LuArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
