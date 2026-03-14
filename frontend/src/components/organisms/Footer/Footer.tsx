import { getImage } from "@/assets/images";

const navColumns = [
  {
    title: "Lorem ipsum",
    links: ["Lorem ipsum", "Lorem ipsum", "Lorem ipsum"],
  },
  {
    title: "Lorem ipsum",
    links: ["Lorem ipsum", "Lorem ipsum", "Lorem ipsum"],
  },
  {
    title: "Lorem ipsum",
    links: ["Lorem ipsum", "Lorem ipsum", "Lorem ipsum"],
  },
  {
    title: "Lorem ipsum",
    links: ["Lorem ipsum", "Lorem ipsum", "Lorem ipsum"],
  },
];

const socials = [
  {
    label: "Facebook",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M17 2H14C12.674 2 11.402 2.527 10.464 3.464C9.527 4.402 9 5.674 9 7V10H6V14H9V22H13V14H16L17 10H13V7C13 6.735 13.105 6.48 13.293 6.293C13.48 6.105 13.735 6 14 6H17V2Z"
          stroke="#293960"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Instagram",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect
          x="2"
          y="2"
          width="20"
          height="20"
          rx="5"
          stroke="#293960"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="4" stroke="#293960" strokeWidth="2" />
        <circle cx="17.5" cy="6.5" r="1" fill="#293960" />
      </svg>
    ),
  },
  {
    label: "Google",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M21.805 10.041H21V10H12V14H17.651C16.827 16.328 14.612 18 12 18C8.686 18 6 15.314 6 12C6 8.686 8.686 6 12 6C13.53 6 14.921 6.577 15.98 7.52L18.809 4.691C17.023 3.026 14.634 2 12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 11.329 21.931 10.675 21.805 10.041Z"
          stroke="#293960"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
  {
    label: "X",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M18.244 2.25H21.552L14.325 10.51L22.827 21.75H16.17L10.956 14.933L4.99 21.75H1.68L9.41 12.915L1.254 2.25H8.08L12.793 8.481L18.244 2.25ZM17.083 19.77H18.916L7.084 4.126H5.117L17.083 19.77Z"
          fill="#293960"
        />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M16 8C17.591 8 19.117 8.632 20.243 9.757C21.368 10.883 22 12.409 22 14V21H18V14C18 13.47 17.789 12.961 17.414 12.586C17.039 12.211 16.53 12 16 12C15.47 12 14.961 12.211 14.586 12.586C14.211 12.961 14 13.47 14 14V21H10V14C10 12.409 10.632 10.883 11.757 9.757C12.883 8.632 14.409 8 16 8Z"
          stroke="#293960"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 9H2V21H6V9Z"
          stroke="#293960"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="4" cy="4" r="2" stroke="#293960" strokeWidth="2" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <div className="relative w-full">
      <div className="relative z-10 mx-auto max-w-[860px] px-4 sm:px-6 lg:px-0">
        <div className="relative flex min-h-[240px] flex-col items-center justify-center overflow-visible rounded-2xl bg-[#24242A] px-6 py-8 sm:min-h-[286px] sm:rounded-3xl sm:px-10 md:flex-row md:items-center md:px-16">
          <div className="absolute -top-16 left-0 hidden md:block pointer-events-none select-none">
            <img
              width={350}
              height={350}
              alt="Caixa de correio"
              className="object-contain"
              src={getImage("mail_box").src}
            />
          </div>

          <div className="ml-auto flex w-full flex-col gap-6 md:max-w-[471px]">
            <h2 className="text-xl font-bold leading-tight tracking-[-1.92px] text-white sm:text-2xl md:text-[32px] md:leading-[42px]">
              Inscreva-se para receber atualizações de nossa newsletter.
            </h2>

            <div className="flex items-center justify-between gap-2 rounded-xl bg-[#1E62EC] px-3 py-3">
              <input
                type="email"
                placeholder="digiteseuemail@gmail.com"
                className="flex-1 bg-transparent text-base font-normal leading-[22px] tracking-[-0.32px] text-white placeholder:text-white/70 outline-none"
              />
              <button className="flex h-[31px] w-[31px] shrink-0 items-center justify-center rounded-full bg-white">
                <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                  <path
                    d="M1 9L11 1M11 1H3M11 1V8"
                    stroke="#202026"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <p className="text-sm font-normal leading-5 text-[#FAFAFA] opacity-80">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            </p>
          </div>
        </div>
      </div>

      <footer className="relative -mt-24 w-full rounded-t-3xl border border-[rgba(114,123,142,0.1)] bg-white pt-32 sm:-mt-[100px] sm:pt-36 md:-mt-[143px] md:pt-[175px]">
        <div className="mx-auto flex max-w-[1270px] flex-col items-start justify-between gap-10 px-4 py-12 sm:px-6 sm:py-16 md:flex-row md:items-center lg:px-10">
          <div className="flex w-full max-w-[387px] flex-col gap-8">
            <div className="flex flex-col gap-4">
              <img
                src={getImage("logo_footer").src}
                alt="AuZap.IA logo"
                width={177}
                height={34}
              />
              <p className="text-sm font-normal leading-5 text-[#727B8E]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>

            <div className="flex items-center gap-[15px]">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="shrink-0"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="hidden gap-7 md:flex">
            {navColumns.map((col, colIndex) => (
              <div key={colIndex} className="flex w-[101px] flex-col gap-[9px]">
                <span className="text-base font-bold leading-6 text-[#282828]">
                  {col.title}
                </span>
                <div className="flex flex-col gap-1">
                  {col.links.map((link, i) => (
                    <a
                      key={i}
                      href="#"
                      className="text-base font-normal leading-6 text-[#282828] transition-colors hover:text-[#1E62EC]"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-[rgba(114,123,142,0.1)] px-4 py-5 sm:px-6 sm:py-7 lg:px-10">
          <div className="mx-auto flex max-w-[1402px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="font-['Plus_Jakarta_Sans'] text-sm font-light leading-6 text-[#3A3A3A]">
              © {new Date().getFullYear()} AuZap.IA - Todos os direitos
              reservados.
            </span>
            <div className="flex items-center gap-[14px]">
              <a
                href="#"
                className="font-['Plus_Jakarta_Sans'] text-sm font-light leading-6 text-[#3A3A3A] transition-colors hover:text-[#1E62EC]"
              >
                Politica de Privacidade
              </a>
              <span className="h-1 w-1 rounded-full bg-[rgba(114,123,142,0.3)]" />
              <a
                href="#"
                className="font-['Plus_Jakarta_Sans'] text-sm font-light leading-6 text-[#3A3A3A] transition-colors hover:text-[#1E62EC]"
              >
                Termos de Uso
              </a>
              <span className="h-1 w-1 rounded-full bg-[rgba(114,123,142,0.3)]" />
              <a
                href="#"
                className="font-['Plus_Jakarta_Sans'] text-sm font-light leading-6 text-[#3A3A3A] transition-colors hover:text-[#1E62EC]"
              >
                Contato
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
