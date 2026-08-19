import { createFileRoute, Link } from "@tanstack/react-router";

import havenEnvironment from "../assets/haven-environment.jpg";
import staffingNetworks from "../assets/staffing-networks.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Evergreen Haven Healthcare LLC — Living the Future of Care" },
      { name: "description", content: "A multi-disciplinary healthcare enterprise elevating senior wellness through innovation, compassion, and climate-conscious health technology." },
      { property: "og:title", content: "Evergreen Haven Healthcare LLC — Living the Future of Care" },
      { property: "og:description", content: "A multi-disciplinary healthcare enterprise elevating senior wellness through innovation, compassion, and climate-conscious health technology." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent/20">
      <Navigation />
      <HeroSection />
      <EcosystemSection />
      <StaffingSection />
      <Footer />
    </div>
  );
}

function Navigation() {
  return (
    <nav className="sticky top-0 z-50 w-full px-6 py-4 flex justify-between items-center bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center gap-2">
        <div className="size-8 rounded-full bg-primary flex items-center justify-center">
          <div className="size-4 rounded-full border-2 border-background" />
        </div>
        <span className="font-display font-bold text-lg tracking-tight uppercase">
          Evergreen Haven
        </span>
      </div>
      <div className="hidden md:flex gap-8 text-sm font-medium items-center">
        <a href="#ecosystem" className="hover:text-primary transition-colors">
          Care Units
        </a>
        <a href="#ecosystem" className="hover:text-primary transition-colors">
          Tech Platforms
        </a>
        <a href="#staffing" className="hover:text-primary transition-colors">
          Global Staffing
        </a>
        <Link to="/care-monitor" className="hover:text-primary transition-colors">
          Care Monitor
        </Link>

        <a
          href="#contact"
          className="px-5 py-2.5 bg-foreground text-background rounded-full font-semibold hover:bg-accent transition-all"
        >
          Contact Care
        </a>
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="relative pt-24 pb-32 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div className="animate-[reveal_0.8s_var(--ease-out-expo)_both]">
          <span className="font-mono text-[10px] uppercase tracking-widest text-accent mb-4 block">
            Est. 1985 — Northern California
          </span>
          <h1 className="text-6xl md:text-8xl font-display font-extrabold tracking-tighter leading-[0.9] text-balance mb-8">
            Living the <br />
            <span className="font-serif text-primary italic font-semibold">
              Future
            </span>{" "}
            of Care
          </h1>
          <p className="max-w-[42ch] text-lg text-muted-foreground leading-relaxed mb-10">
            Elevating senior wellness through multi-generational compassion
            and purpose-driven HealthTech.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#ecosystem"
              className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-xl shadow-primary/20 hover:shadow-2xl transition-all"
            >
              Explore the Ecosystem
            </a>
            <a
              href="#staffing"
              className="px-8 py-4 border border-border rounded-2xl font-bold hover:bg-border/5 transition-all"
            >
              Our Legacy
            </a>
          </div>
        </div>

        <div className="relative perspective-1000 animate-[reveal_1s_var(--ease-out-expo)_both] [animation-delay:200ms]">
          <div className="relative w-full aspect-square">
            <div className="absolute inset-0 bg-primary/5 rounded-[40px] rotate-3 scale-95" />
            <div className="absolute inset-0 bg-accent/5 rounded-[40px] -rotate-2 scale-98" />
            <div className="card-3d relative w-full h-full bg-white rounded-[32px] border border-border shadow-2xl overflow-hidden animate-[float_6s_ease-in-out_infinite]">
              <img
                src={havenEnvironment}
                alt="A sunlit modern healthcare facility garden with organic wood textures"
                width={1024}
                height={1024}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl">
                <p className="font-serif italic text-xl">
                  "Compassion amplified by tech."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function EcosystemSection() {
  return (
    <section id="ecosystem" className="py-24 bg-foreground text-background overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6">
              A Terraced Ecosystem of Health
            </h2>
            <p className="text-background/60 text-lg">
              Our business units operate as interconnected nodes of a single
              mission: holistic human longevity.
            </p>
          </div>
          <div className="font-mono text-xs text-accent uppercase tracking-tighter mb-2">
            Vertical Integration / 01
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="group bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all card-3d">
            <span className="font-mono text-[10px] text-accent mb-6 block uppercase tracking-widest">
              Monitoring Platform
            </span>
            <h3 className="text-2xl font-display font-bold mb-4">Addis & Flourish</h3>
            <p className="text-sm text-background/50 mb-8">
              Real-time caregiver reporting and personalized wellness
              adaptability for seniors and caregivers.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent group-hover:gap-4 transition-all">
              Platform Details <span className="text-lg">→</span>
            </div>
          </div>

          <div className="group bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all card-3d">
            <span className="font-mono text-[10px] text-accent mb-6 block uppercase tracking-widest">
              Sustainability
            </span>
            <h3 className="text-2xl font-display font-bold mb-4">Cavalop Tech</h3>
            <p className="text-sm text-background/50 mb-8">
              AI-driven climate and health tech initiatives dedicated to
              greener healthcare environments.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent group-hover:gap-4 transition-all">
              View Initiative <span className="text-lg">→</span>
            </div>
          </div>

          <div className="group bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all card-3d">
            <span className="font-mono text-[10px] text-accent mb-6 block uppercase tracking-widest">
              Asset Strategy
            </span>
            <h3 className="text-2xl font-display font-bold mb-4">California Carmel</h3>
            <p className="text-sm text-background/50 mb-8">
              Asset strategies aligned with long-term community value across
              California and Nevada.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent group-hover:gap-4 transition-all">
              Portfolio <span className="text-lg">→</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StaffingSection() {
  return (
    <section id="staffing" className="py-32 px-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20">
        <div className="relative">
          <img
            src={staffingNetworks}
            alt="A caregiver and senior sharing a warm moment in a bright modern apartment"
            width={1024}
            height={1376}
            loading="lazy"
            className="w-full aspect-[3/4] rounded-3xl object-cover bg-stone-200 outline outline-1 -outline-offset-1 outline-black/5"
          />
          <div className="absolute -right-8 top-1/2 -translate-y-1/2 bg-white p-8 rounded-2xl shadow-2xl border border-border hidden md:block max-w-[240px]">
            <div className="size-8 bg-accent rounded-full mb-4" />
            <p className="font-display font-bold leading-tight mb-2">1 Heart Services</p>
            <p className="text-xs text-muted-foreground">
              Direct caregiver management and training protocols.
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <h2 className="text-5xl font-display font-bold tracking-tight mb-8">
            Human Networks, <br />
            <span className="font-serif italic text-primary">Global Scope.</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
            Through <strong>Commodex America</strong>, we maintain a pioneering
            global staffing network, connecting specialized caregivers with
            families who demand excellence. Our family legacy in Philippine
            healthcare informs every standard we set.
          </p>
          <ul className="space-y-6 mb-12">
            <li className="flex items-start gap-4">
              <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <div className="size-2 bg-primary rounded-full" />
              </div>
              <div>
                <h4 className="font-bold text-sm uppercase tracking-wide">Medical City Roots</h4>
                <p className="text-sm text-muted-foreground">
                  Deep heritage in multi-generational medical governance.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <div className="size-2 bg-primary rounded-full" />
              </div>
              <div>
                <h4 className="font-bold text-sm uppercase tracking-wide">Riverside Excellence</h4>
                <p className="text-sm text-muted-foreground">
                  Decades of contribution to premier medical centers.
                </p>
              </div>
            </li>
          </ul>
          <a
            href="#contact"
            className="w-fit px-10 py-5 border-2 border-foreground rounded-full font-bold hover:bg-foreground hover:text-background transition-all"
          >
            Partnership Inquiries
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" className="bg-stone-100 border-t border-border pt-20 pb-10 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-2">
            <h3 className="font-display font-bold text-2xl mb-6">
              Evergreen Haven <span className="text-primary">Healthcare</span>
            </h3>
            <p className="text-muted-foreground max-w-sm">
              A multi-disciplinary healthcare enterprise dedicated to
              innovation, compassion, and the future of senior wellness.
            </p>
          </div>
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-accent mb-6">
              Units
            </h4>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <a href="#ecosystem" className="hover:text-primary transition-colors">
                  Senior Care
                </a>
              </li>
              <li>
                <a href="#ecosystem" className="hover:text-primary transition-colors">
                  HealthTech
                </a>
              </li>
              <li>
                <a href="#staffing" className="hover:text-primary transition-colors">
                  Staffing
                </a>
              </li>
              <li>
                <a href="#ecosystem" className="hover:text-primary transition-colors">
                  Real Estate
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-accent mb-6">
              Connect
            </h4>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Email Us
                </a>
              </li>
              <li>
                <span className="text-muted-foreground">San Francisco</span>
              </li>
              <li>
                <span className="text-muted-foreground">Las Vegas</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between pt-10 border-t border-border gap-4">
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
            © 2024 Evergreen Haven Healthcare LLC. All Rights Reserved.
          </p>
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
            Designed for Longevity
          </p>
        </div>
      </div>
    </footer>
  );
}
