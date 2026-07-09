import { usePortfolioData } from "../hooks/usePortfolioData";
import ProfileHeader from "../components/ProfileHeader";
import DegreeBanner from "../components/DegreeBanner";
import About from "../components/About";
import TechStack from "../components/TechStack";
import ExperienceTimeline from "../components/ExperienceTimeline";
import Projects from "../components/Projects";
import Certifications from "../components/Certifications";
import Gallery from "../components/Gallery";
import Footer from "../components/Footer";
import { useDarkMode } from "../hooks/useDarkMode";

export default function PublicSite() {
  const { isDark, toggle } = useDarkMode();
  const { data: profile, loading, error } = usePortfolioData();

  return (
    <div className="min-h-screen bg-paper dark:bg-surface-dark">
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10">
        {error && (
          <div className="mb-5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
            Couldn't load live content ({error}). Showing placeholder content instead.
          </div>
        )}

        <div className={`grid lg:grid-cols-[1fr_320px] gap-5 transition-opacity ${loading ? "opacity-60" : "opacity-100"}`}>
          {/* Left / main column */}
          <div className="space-y-5 min-w-0">
            <ProfileHeader profile={profile} isDark={isDark} onToggleTheme={toggle} />
            <About paragraphs={profile.about} />
            <TechStack categories={profile.techStack} />
            <Projects projects={profile.projects} />
            <Certifications items={profile.certifications} />
            <Gallery images={profile.gallery} />
            <Footer profile={profile} />
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">
            <DegreeBanner degree={profile.degree} />
            <ExperienceTimeline items={profile.experience} />
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-ink-500 dark:text-neutral-500">
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
      </main>
    </div>
  );
}
