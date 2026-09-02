import { Link } from "react-router-dom";
import { AlertCircle, Clock, GitFork, Pause, Play, Star } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import LiquidGlass from "liquid-glass-react";

import homeData from "../../data/home.json";
import publicationsData from "../../data/publications.json";
import ScrollHint from "../../components/ScrollHint/ScrollHint.jsx";
import ResearchProject from "../../schemas/ResearchProject";
import { useTranslations } from "../../lib/translations";
import { LIQUID_PARAMS } from "../../lib/liquidGlassParams";
import TextGenerateEffect from "../../components/TextGenerateEffect/TextGenerateEffect.jsx";
import WritingText from "../../components/WritingText/WritingText.jsx";
import SkeletonImage from "../../components/SkeletonImage/SkeletonImage.jsx";
import HoverArrow from "../../components/HoverArrow/HoverArrow.jsx";
import EntryRow, { EntryRowBody, EntryRowTitle } from "../../components/EntryRow/EntryRow.jsx";
import { fetchRepoStats, formatRelativeTime } from "../../lib/github";

const profileImage = "/images/team/martin-vallieres/avatar.jpg";

function extractMuxPlaybackId(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname !== "player.mux.com") return null;
    const id = u.pathname.replace("/", "").trim();
    return id || null;
  } catch {
    return null;
  }
}

export default function HomePage() {
  const { t } = useTranslations();
  const { data: projects, isLoading } = ResearchProject.useGet();
  const liquid = LIQUID_PARAMS;

  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isVideoIconAnimating, setIsVideoIconAnimating] = useState(false);

  const muxRef = useRef(null);
  const pauseRafRef = useRef(null);
  const videoIconAnimationTimeoutRef = useRef(null);

  const [showScrollPrompt, setShowScrollPrompt] = useState(false);
  const [repoStats, setRepoStats] = useState({});

  useEffect(() => {
    const repos = homeData.sections.openSource.repositories ?? [];
    let cancelled = false;
    Promise.all(
      repos.map(async (repo) => {
        try {
          const stats = await fetchRepoStats(repo.url);
          return [repo.url, stats];
        } catch {
          return [repo.url, null];
        }
      })
    ).then((entries) => {
      if (cancelled) return;
      setRepoStats(Object.fromEntries(entries.filter(([, v]) => v)));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const recentPubs = useMemo(() => {
    const flat = publicationsData.flatMap((group) =>
      (group.items || []).map((item) => ({
        ...item,
        year: group.year,
        id: item.slug,
      }))
    );
    flat.sort((a, b) => {
      if (a.date && b.date) return b.date.localeCompare(a.date);
      return (b.year || 0) - (a.year || 0);
    });
    return flat.slice(0, 3);
  }, []);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.2]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0.35]);
  const heroBlur = useTransform(scrollYProgress, [0, 0.25], ["0px", "6px"]);
  const textY = useTransform(scrollYProgress, [0, 0.2], ["0%", "50%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const scrollPromptOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.scrollY === 0) {
        setShowScrollPrompt(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    return () => {
      if (videoIconAnimationTimeoutRef.current) {
        clearTimeout(videoIconAnimationTimeoutRef.current);
      }
    };
  }, []);

  const muxPlaybackId = useMemo(() => {
    return homeData?.hero?.muxPlaybackId || extractMuxPlaybackId(homeData?.hero?.videoUrl) || null;
  }, []);

  const usingMux = Boolean(muxPlaybackId);
  const usingNativeVideo = Boolean(!usingMux && homeData?.hero?.videoUrl);

  useEffect(() => {
    if (!usingMux) return;

    const nativeVideo = muxRef.current?.media?.nativeEl;
    if (!nativeVideo) return;

    nativeVideo.style.width = "100%";
    nativeVideo.style.height = "100%";
    nativeVideo.style.objectFit = "cover";
  }, [usingMux]);

  const handleVideoProgress = () => {
    if (usingMux) {
      const player = muxRef.current;
      if (!player || !player.duration) return;
      setVideoProgress(player.currentTime / player.duration);
      return;
    }

    const nativeVideo = muxRef.current;
    void nativeVideo;
  };

  const handleToggleVideo = () => {
    if (videoIconAnimationTimeoutRef.current) {
      clearTimeout(videoIconAnimationTimeoutRef.current);
    }
    setIsVideoIconAnimating(true);
    videoIconAnimationTimeoutRef.current = setTimeout(() => {
      setIsVideoIconAnimating(false);
      videoIconAnimationTimeoutRef.current = null;
    }, 140);

    if (usingMux) {
      const player = muxRef.current;
      const video = muxRef.current?.media?.nativeEl;

      if (!player || !video) return;

      if (player.paused) {
        if (pauseRafRef.current) {
          cancelAnimationFrame(pauseRafRef.current);
          pauseRafRef.current = null;
        }
        video.playbackRate = 1;
        player.play();
        setIsVideoPaused(false);
        return;
      }

      if (pauseRafRef.current) cancelAnimationFrame(pauseRafRef.current);

      const startRate = video.playbackRate || 1;
      const startTime = performance.now();
      const zipDuration = 2000;
      const slowDuration = 1000;
      const duration = zipDuration + slowDuration;
      const peakRate = 8;
      const slowRate = 0.5;

      const decelerate = (time) => {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        let nextRate;
        if (elapsed < zipDuration) {
          const p = elapsed / zipDuration;
          const eased = p * p * p;
          nextRate = startRate + (peakRate - startRate) * eased;
        } else {
          const p = Math.min((elapsed - zipDuration) / slowDuration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          nextRate = peakRate - (peakRate - slowRate) * eased;
        }
        try {
          video.playbackRate = nextRate;
        } catch {
          void 0;
        }

        if (progress < 1) {
          pauseRafRef.current = requestAnimationFrame(decelerate);
          return;
        }

        player.pause();
        video.playbackRate = 1;
        setIsVideoPaused(true);
        pauseRafRef.current = null;
      };

      pauseRafRef.current = requestAnimationFrame(decelerate);
      return;
    }

    const video = document.getElementById("hero-native-video");
    if (!(video instanceof HTMLVideoElement)) return;

    if (video.paused) {
      if (pauseRafRef.current) {
        cancelAnimationFrame(pauseRafRef.current);
        pauseRafRef.current = null;
      }
      video.playbackRate = 1;
      video.play();
      setIsVideoPaused(false);
      return;
    }

    if (pauseRafRef.current) cancelAnimationFrame(pauseRafRef.current);

    const startRate = video.playbackRate || 1;
    const startTime = performance.now();
    const zipDuration = 2000;
    const slowDuration = 1000;
    const duration = zipDuration + slowDuration;
    const peakRate = 8;
    const slowRate = 0.5;

    const decelerate = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      let nextRate;
      if (elapsed < zipDuration) {
        const p = elapsed / zipDuration;
        const eased = p * p * p;
        nextRate = startRate + (peakRate - startRate) * eased;
      } else {
        const p = Math.min((elapsed - zipDuration) / slowDuration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        nextRate = peakRate - (peakRate - slowRate) * eased;
      }
      try {
        video.playbackRate = nextRate;
      } catch {
        void 0;
      }

      if (progress < 1) {
        pauseRafRef.current = requestAnimationFrame(decelerate);
        return;
      }

      video.pause();
      video.playbackRate = 1;
      setIsVideoPaused(true);
      pauseRafRef.current = null;
    };

    pauseRafRef.current = requestAnimationFrame(decelerate);
  };

  const handleMuxTimeUpdate = () => {
    const player = muxRef.current;
    if (!player || !player.duration) return;
    setVideoProgress(player.currentTime / player.duration);
  };

  const handleMuxLoadedMetadata = () => {
    const player = muxRef.current;
    if (!player || !player.duration) return;
    setVideoProgress(player.currentTime / player.duration);
  };

  const handleNativeTimeUpdate = () => {
    const video = document.getElementById("hero-native-video");
    if (!(video instanceof HTMLVideoElement) || !video.duration) return;
    setVideoProgress(video.currentTime / video.duration);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xs uppercase tracking-widest">
        {t("common.loading", "Initializing System...")}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex flex-col relative bg-black">
      <div className="sticky top-0 h-[110vh] w-full overflow-hidden z-0">
        <motion.div
          style={{
            scale: heroScale,
            opacity: heroOpacity,
            filter: `blur(${heroBlur})`,
          }}
          className="absolute inset-0 z-0"
        >
          {usingMux ? (
            <MuxPlayer
              ref={muxRef}
              className="hero-video h-full w-full"
              playbackId={muxPlaybackId}
              poster={homeData.hero.imageUrl}
              autoPlay="muted"
              loop
              muted
              playsInline
              controls={false}
              onTimeUpdate={handleMuxTimeUpdate}
              onLoadedMetadata={handleMuxLoadedMetadata}
              videoTitle={homeData?.hero?.videoTitle || "Hero video"}
              metadata={{
                video_title: homeData?.hero?.videoTitle || "Hero video",
              }}
            />
          ) : usingNativeVideo ? (
            <video
              id="hero-native-video"
              className="h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              poster={homeData.hero.imageUrl}
              src={homeData.hero.videoUrl}
              onTimeUpdate={handleNativeTimeUpdate}
              onLoadedMetadata={handleNativeTimeUpdate}
            />
          ) : (
            <div
              className="absolute inset-0 bg-center bg-cover"
              style={{ backgroundImage: `url(${homeData.hero.imageUrl})` }}
            />
          )}
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
        <div className="absolute inset-0 bg-[url('/images/noise.svg')] opacity-30" />

        {(usingMux || usingNativeVideo) && (
          <div
            role="button"
            tabIndex={0}
            onClick={handleToggleVideo}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleToggleVideo();
              }
            }}
            aria-label={isVideoPaused ? "Play hero video" : "Pause hero video"}
            title={isVideoPaused ? "Play" : "Pause"}
            className="absolute bottom-40 left-1/2 z-20 h-12 w-12 -translate-x-1/2 cursor-pointer md:bottom-auto md:left-auto md:top-1/2 md:right-8 md:-translate-x-0 md:-translate-y-1/2"
          >
            <LiquidGlass
              displacementScale={liquid.playButton.displacementScale}
              blurAmount={liquid.playButton.blurAmount}
              saturation={liquid.playButton.saturation}
              aberrationIntensity={liquid.playButton.aberrationIntensity}
              elasticity={liquid.playButton.elasticity}
              cornerRadius={liquid.playButton.cornerRadius}
              mode={liquid.playButton.mode}
              overLight={liquid.playButton.overLight}
              padding="0"
              style={{ position: "absolute", top: "50%", left: "50%" }}
            >
              <div className="relative flex h-12 w-12 items-center justify-center text-white/90">
                <svg className="absolute inset-0 h-12 w-12 -rotate-90" viewBox="0 0 48 48">
                  <circle
                    cx="24"
                    cy="24"
                    r="21"
                    className="fill-none stroke-white/20"
                    strokeWidth="2"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="21"
                    className="fill-none stroke-primary transition-[stroke-dashoffset] duration-200"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 21}
                    strokeDashoffset={(1 - videoProgress) * 2 * Math.PI * 21}
                  />
                </svg>
                <motion.span
                  animate={{ scale: isVideoIconAnimating ? 1.35 : 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 600,
                    damping: 14,
                    mass: 0.4,
                  }}
                  className="relative flex items-center justify-center"
                >
                  {isVideoPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                </motion.span>
              </div>
            </LiquidGlass>
          </div>
        )}

        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className="relative z-10 h-full flex flex-col justify-center px-4 md:px-8 max-w-5xl"
        >
          {homeData.brand?.logoUrl && (
            <SkeletonImage
              src={homeData.brand.logoUrl}
              alt="MEDomicsLab logo"
              className="h-32 w-32 mb-6"
              imgClassName="h-full w-full object-contain"
              skeletonClassName="rounded-lg"
              sizes="128px"
              variantSizes={[128, 160, 256]}
              fallbackSrc={homeData.brand.logoUrl}
              formats={[]}
            />
          )}

          <h1 className="text-5xl md:text-8xl lg:text-9xl font-bold tracking-tighter uppercase leading-[0.9] mb-6 mix-blend-exclusion text-white pointer-events-auto">
            <span className="tracking-tight">
              <span className="uppercase">MED</span>
              <span className="lowercase">omics</span>
              <span className="uppercase ml-1">L</span>
              <span className="lowercase">ab</span>
            </span>
          </h1>

          <p className="text-lg md:text-2xl text-white/90 max-w-2xl leading-relaxed mix-blend-difference font-roobert font-semibold">
            <WritingText
              text={t("home.hero.subtitle", homeData.hero.subtitle)}
              inView
              inViewOnce
              spacing={6}
              transition={{ type: "spring", bounce: 0, duration: 2, delay: 0.2 }}
            />
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs uppercase tracking-widest font-bold text-primary">
            <a
              href={homeData.hero.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center hover:text-white transition-colors"
            >
              {t("home.hero.github", homeData.hero.githubLabel)}
              <HoverArrow className="ml-2 h-4 w-4" />
            </a>
            <Link
              to={homeData.hero.visionsUrl}
              className="group inline-flex items-center hover:text-white transition-colors"
            >
              {t("home.hero.visions", homeData.hero.visionsLabel)}
              <HoverArrow className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 bg-background min-h-screen rounded-t-[3rem] -mt-[16vh]">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-1 bg-white/20 rounded-full" />

        <motion.div
          style={{ opacity: scrollPromptOpacity }}
          className="absolute -top-6 left-1/2 -translate-x-1/2"
        >
          <ScrollHint label={homeData.hero.scrollLabel} bounce={showScrollPrompt} />
        </motion.div>

        <section className="py-32 px-4 md:px-8 border-b border-border bg-background rounded-t-[3rem]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-4 space-y-6 flex flex-col items-center">
              <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4 self-start">
                {t("home.mission.label", homeData.mission.label)}
              </h2>
              <div className="flex flex-col items-center gap-3 text-center">
                <SkeletonImage
                  src={profileImage}
                  alt="Martin Vallières"
                  className="w-44 h-44 md:w-56 md:h-56 rounded-full border border-border/60"
                  imgClassName="w-full h-full object-cover rounded-full"
                  skeletonClassName="rounded-full"
                  sizes="(min-width: 768px) 224px, 176px"
                  variantSizes={[160, 256]}
                  fallbackSrc="/images/team/martin-vallieres/avatar-160.jpg"
                />
                <div className="text-xs md:text-sm text-muted-foreground leading-relaxed space-y-3">
                  <p className="font-semibold text-foreground">Martin Vallières, PhD</p>
                  <div className="flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1">
                    <span>Associate Professor,</span>
                    <a
                      href="https://www.mcgill.ca/oncology/"
                      target="_blank"
                      rel="noreferrer"
                      className="text-muted-foreground font-semibold hover:text-white transition-colors"
                    >
                      Dept. of Oncology, McGill University.
                    </a>
                  </div>
                  <div className="h-px w-10 bg-border/60 mx-auto" />
                  <Link
                    to="/team/martin-vallieres"
                    className="group inline-flex items-center text-[0.7rem] uppercase tracking-widest text-primary hover:text-white transition-colors"
                  >
                    {t("home.mission.linkTertiary", homeData.mission.linkTextTertiary)}
                    <HoverArrow variant="slide" className="ml-2" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="md:col-span-8">
              <TextGenerateEffect
                words={`❝ ${t("home.mission.text", homeData.mission.text)}`}
                className="text-3xl md:text-5xl font-semibold leading-tight tracking-[-0.02em] normal-case font-roobert"
                filter
                duration={0.6}
                staggerDelay={0.08}
                inViewOnce
                inViewMargin="-15% 0px"
              />

              <div className="mt-12 flex flex-col gap-3 text-xs md:text-sm tracking-widest">
                <Link
                  to="/visions"
                  className="flex flex-wrap items-center hover:text-primary transition-colors group"
                >
                  {t("home.mission.linkPrimary", homeData.mission.linkTextPrimary)}
                  <HoverArrow variant="slide" className="ml-2" />
                </Link>

                <Link
                  to="/research"
                  className="flex flex-wrap items-center hover:text-primary transition-colors group"
                >
                  {t("home.mission.linkSecondary", homeData.mission.linkTextSecondary)}
                  <HoverArrow variant="slide" className="ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 px-4 md:px-8 border-b border-border bg-card/20">
          <div className="flex items-end justify-between mb-12">
            <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">
              {t("home.projects.title", homeData.sections.focusAreas.title)}
            </h2>
            <Link
              to="/research"
              className="hidden md:block text-xs uppercase tracking-widest hover:text-primary transition-colors"
            >
              {t("common.viewAll", homeData.sections.focusAreas.viewAll)}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects?.slice(0, 3).map((project) => (
              <Link
                key={project.slug}
                to={`/research/${project.slug}`}
                className="group block space-y-4"
              >
                <div className="aspect-[4/3] overflow-hidden bg-secondary border border-border/50 relative rounded-2xl">
                  {project.coverImage && (
                    <img
                      src={project.coverImage.url}
                      alt="Non-Available"
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105"
                      data-fimo-source={`ResearchProject.${project.slug}.coverImage`}
                    />
                  )}
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity mix-blend-overlay" />
                </div>

                <div className="space-y-2">
                  <div className="inline-flex items-center text-[10px] uppercase tracking-widest px-2 py-1 border border-border text-muted-foreground">
                    {project.status}
                  </div>
                  <h3
                    className="text-xl font-bold uppercase tracking-tight group-hover:text-primary transition-colors"
                    data-fimo-source={`ResearchProject.${project.slug}.title`}
                  >
                    {project.title}
                  </h3>
                  <p
                    className="text-sm text-muted-foreground line-clamp-2"
                    data-fimo-source={`ResearchProject.${project.slug}.summary`}
                  >
                    {project.summary}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="py-24 px-4 md:px-8 bg-background">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <h2 className="text-4xl font-bold uppercase tracking-tighter mb-8">
                {t("home.recent.title", homeData.sections.recentOutput.title)}
              </h2>
              <Link
                to="/publications"
                className="inline-flex items-center text-xs uppercase tracking-widest hover:text-primary transition-colors group"
              >
                {t("home.recent.link", homeData.sections.recentOutput.viewAll)}
                <HoverArrow variant="slide" className="ml-2" />
              </Link>
            </div>

            <div className="md:col-span-8 space-y-0">
              {recentPubs?.map((pub) => (
                <EntryRow key={pub.id} href={pub.link}>
                  <EntryRowBody>
                    <EntryRowTitle data-fimo-source={`Publication.${pub.id}.title`}>
                      {pub.title}
                    </EntryRowTitle>
                    <p className="text-xs text-muted-foreground font-mono">
                      {pub.journal} — {pub.year}
                    </p>
                  </EntryRowBody>
                </EntryRow>
              ))}
              <div className="border-t border-border" />
            </div>
          </div>
        </section>

        <section className="py-24 px-4 md:px-8 border-t border-border bg-background">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <h2 className="text-4xl font-bold uppercase tracking-tighter mb-8">
                {t("home.opensource.title", homeData.sections.openSource.title)}
              </h2>
              <a
                href="https://github.com/MEDomicsLab"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center text-xs uppercase tracking-widest hover:text-primary transition-colors group"
              >
                {t("home.opensource.link", homeData.sections.openSource.viewAll)}
                <HoverArrow variant="slide" className="ml-2" />
              </a>
            </div>

            <div className="md:col-span-8 space-y-0">
              {homeData.sections.openSource.repositories.slice(0, 3).map((repo) => {
                const stats = repoStats[repo.url];
                const lastUpdated = formatRelativeTime(stats?.pushedAt);
                return (
                  <EntryRow key={repo.name} href={repo.url}>
                    <EntryRowBody>
                      <EntryRowTitle>{repo.name}</EntryRowTitle>
                      <p className="text-xs text-muted-foreground font-mono flex flex-wrap items-center gap-2">
                        <span>{repo.status}</span>
                        {stats && (
                          <>
                            <span aria-hidden="true">/</span>
                            <span className="inline-flex items-center gap-1">
                              <Star className="h-3 w-3" aria-hidden="true" />
                              {stats.stars} stars
                            </span>
                            <span aria-hidden="true">/</span>
                            <span className="inline-flex items-center gap-1">
                              <GitFork className="h-3 w-3" aria-hidden="true" />
                              {stats.forks} forks
                            </span>
                            <span aria-hidden="true">/</span>
                            <span className="inline-flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" aria-hidden="true" />
                              {stats.openIssues} open issues
                            </span>
                            {lastUpdated && (
                              <>
                                <span aria-hidden="true">/</span>
                                <span className="inline-flex items-center gap-1">
                                  <Clock className="h-3 w-3" aria-hidden="true" />
                                  updated {lastUpdated}
                                </span>
                              </>
                            )}
                          </>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">{repo.description}</p>
                    </EntryRowBody>
                  </EntryRow>
                );
              })}
              <div className="border-t border-border" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
