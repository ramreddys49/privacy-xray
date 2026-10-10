"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AboutPanel } from "@/components/about-panel";
import { AdExperience } from "@/components/ad-experience";
import { AppHeader } from "@/components/app-header";
import { ArchitecturePanel } from "@/components/architecture-panel";
import { DataStory } from "@/components/data-story";
import { DigitalTwin } from "@/components/digital-twin";
import { EngineerConsole } from "@/components/engineer-console";
import { GuidedDemo } from "@/components/guided-demo";
import { HeroIntro } from "@/components/hero-intro";
import { TrustStrip } from "@/components/trust-strip";
import { InspectorModeHeader } from "@/components/inspector-mode-header";
import { LiveEventConsole } from "@/components/live-event-console";
import { MetricsStrip } from "@/components/metrics-strip";
import { PrinciplesPanel } from "@/components/principles-panel";
import { PrivacyContextPanel } from "@/components/privacy-context";
import { ProcessingPipeline } from "@/components/processing-pipeline";
import { ProductExplorer } from "@/components/product-explorer";
import { SiteFooter } from "@/components/site-footer";
import { StoryTimeline } from "@/components/story-timeline";
import { PRODUCT_CATEGORIES } from "@/data/catalog";
import { GUIDED_STEPS } from "@/data/guided-demo";
import { decideAd } from "@/lib/ad-decision";
import { canUpdateProfile, evaluateAllPurposes } from "@/lib/consent-policy";
import { simulateDownstreamEffects } from "@/lib/downstream";
import { createObservedEvent, prependEvent } from "@/lib/events";
import { simulatePrivacyViolation } from "@/lib/network-simulator";
import {
  applyEventToProfile,
  createEmptyProfile,
  inferCategoryFromSearch,
  profileIncrementForEvent,
  profilesDiffer,
} from "@/lib/profile-engine";
import {
  applyDoNotSellOrShare,
  DEFAULT_REGION,
  defaultConsentForRegion,
  getRegionPolicy,
  type PrivacyRegion,
} from "@/lib/region-policy";
import { prefersReducedMotion } from "@/lib/pipeline";
import { createEmptyStore } from "@/lib/storage-simulator";
import { isPolicyViolation, toViolationRecord } from "@/lib/violation-detector";
import type {
  ConsentState,
  InterestProfile,
  PipelineContext,
  PrivacyEvent,
  PrivacyEventPayload,
  ProductCategory,
  Purpose,
} from "@/types/privacy";
import type {
  AppViewMode,
  SimulatedNetworkRequest,
  SimulatedStorageRecord,
  SimulatedStore,
  ViolationRecord,
} from "@/types/simulation";

let didRecordInitialPageView = false;
const MAX_TECH_LOG = 24;

function prependLog<T>(current: T[], incoming: T[]): T[] {
  return [...incoming, ...current].slice(0, MAX_TECH_LOG);
}

function scrollToId(id: string) {
  const node = document.getElementById(id);
  if (!node) return;
  node.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block: "start",
  });
}

export function PrivacyXrayApp() {
  const [events, setEvents] = useState<PrivacyEvent[]>([]);
  const [region, setRegion] = useState<PrivacyRegion>(DEFAULT_REGION);
  const [consent, setConsent] = useState<ConsentState>(() =>
    defaultConsentForRegion(DEFAULT_REGION),
  );
  const [profile, setProfile] = useState<InterestProfile>(createEmptyProfile);
  const [pipelineContext, setPipelineContext] = useState<PipelineContext | null>(
    null,
  );
  const [viewMode, setViewMode] = useState<AppViewMode>("user");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [storageLog, setStorageLog] = useState<SimulatedStorageRecord[]>([]);
  const [networkLog, setNetworkLog] = useState<SimulatedNetworkRequest[]>([]);
  const [violations, setViolations] = useState<ViolationRecord[]>([]);
  const [guideActive, setGuideActive] = useState(false);
  const [guideIndex, setGuideIndex] = useState(0);
  const [guideCompleted, setGuideCompleted] = useState(false);
  const [demoPlaying, setDemoPlaying] = useState(false);
  const demoTimers = useRef<number[]>([]);
  const pipelineByEventRef = useRef<Record<string, PipelineContext>>({});

  const profileRef = useRef(profile);
  const consentRef = useRef(consent);
  const storeRef = useRef<SimulatedStore>(createEmptyStore());
  const regionRef = useRef(region);
  const regionPolicy = getRegionPolicy(region);

  const adDecision = useMemo(
    () => decideAd(consent, profile),
    [consent, profile],
  );
  const selectedEvent =
    events.find((event) => event.id === selectedEventId) ?? events[0] ?? null;
  const selectedPipeline = selectedEvent
    ? (pipelineByEventRef.current[selectedEvent.id] ?? pipelineContext)
    : pipelineContext;

  const observeEvent = useCallback(
    (
      type: PrivacyEvent["type"],
      category: string,
      payload: PrivacyEventPayload,
      consentState: ConsentState,
      regionState: PrivacyRegion,
    ) => {
      const observed = createObservedEvent(
        type,
        category,
        { ...payload, region: regionState },
        consentState,
        regionState,
      );
      const previousProfile = profileRef.current;
      const nextProfile = canUpdateProfile(observed, observed.purpose)
        ? applyEventToProfile(previousProfile, observed)
        : previousProfile;
      const previousAd = decideAd(consentRef.current, previousProfile);
      const nextAd = decideAd(consentState, nextProfile);
      const profileChanged = profilesDiffer(previousProfile, nextProfile);
      const downstream = simulateDownstreamEffects({
        event: observed,
        consent: consentState,
        profile: nextProfile,
        store: storeRef.current,
        adDecision: nextAd,
        region: regionState,
      });
      const policy = getRegionPolicy(regionState);

      consentRef.current = consentState;
      profileRef.current = nextProfile;
      storeRef.current = downstream.store;
      regionRef.current = regionState;

      setEvents((current) => prependEvent(current, observed));
      setSelectedEventId(observed.id);
      if (profileChanged) setProfile(nextProfile);
      setStorageLog((current) => prependLog(current, downstream.storageRecords));
      setNetworkLog((current) => prependLog(current, downstream.requests));
      const nextContext: PipelineContext = {
        event: observed,
        profileChanged,
        profileDelta: profileChanged ? profileIncrementForEvent(observed.type) : 0,
        adChanged:
          previousAd.mode !== nextAd.mode || previousAd.reason !== nextAd.reason,
        adMode: nextAd.mode,
        regionLabel: policy.label,
        frameworkLabel: policy.frameworkLabel,
      };
      pipelineByEventRef.current[observed.id] = nextContext;
      setPipelineContext(nextContext);

      return observed;
    },
    [],
  );

  useEffect(() => {
    const frame = window.setTimeout(() => {
      if (didRecordInitialPageView) return;
      didRecordInitialPageView = true;
      observeEvent(
        "page_view",
        "home",
        {
          path: "/",
          title: "Explore products",
          surface: "privacy_xray_demo",
        },
        defaultConsentForRegion(DEFAULT_REGION),
        DEFAULT_REGION,
      );
    }, 0);

    return () => window.clearTimeout(frame);
  }, [observeEvent]);

  function handleCategoryView(category: ProductCategory) {
    observeEvent(
      "category_view",
      category.id,
      {
        category: category.title,
        source: "category_card",
      },
      consentRef.current,
      regionRef.current,
    );
  }

  function handleProductClick(category: ProductCategory) {
    observeEvent(
      "product_click",
      category.id,
      {
        product: `${category.title} featured set`,
        productId: `demo-${category.id}-01`,
        action: "explore",
      },
      consentRef.current,
      regionRef.current,
    );
  }

  function handleSearch(query: string) {
    const inferred = inferCategoryFromSearch(query);
    observeEvent(
      "search",
      inferred ?? "catalog",
      {
        query,
        resultsHint: "simulated",
      },
      consentRef.current,
      regionRef.current,
    );
  }

  function handleConsentToggle(
    purpose: Exclude<Purpose, "essential">,
    enabled: boolean,
  ) {
    const nextConsent = { ...consentRef.current, [purpose]: enabled };
    setConsent(nextConsent);
    observeEvent(
      "consent_updated",
      "consent",
      {
        purpose,
        previous: consentRef.current[purpose] ? "ON" : "OFF",
        current: enabled ? "ON" : "OFF",
      },
      nextConsent,
      regionRef.current,
    );
  }

  function handleDoNotSellOrShare(enabled: boolean) {
    const nextConsent = applyDoNotSellOrShare(
      regionRef.current,
      consentRef.current,
      enabled,
    );
    setConsent(nextConsent);
    observeEvent(
      "consent_updated",
      "consent",
      {
        purpose: "advertising",
        control: "do_not_sell_or_share",
        previous: consentRef.current.doNotSellOrShare ? "ON" : "OFF",
        current: enabled ? "ON" : "OFF",
      },
      nextConsent,
      regionRef.current,
    );
  }

  function handleRegionChange(nextRegion: PrivacyRegion) {
    if (nextRegion === regionRef.current) return;
    const previousRegion = regionRef.current;
    const nextConsent = defaultConsentForRegion(nextRegion);
    setRegion(nextRegion);
    setConsent(nextConsent);
    observeEvent(
      "region_changed",
      "region",
      {
        from: previousRegion,
        to: nextRegion,
      },
      nextConsent,
      nextRegion,
    );
  }

  function resetDemoState(nextRegion: PrivacyRegion) {
    didRecordInitialPageView = true;
    const emptyProfile = createEmptyProfile();
    const emptyStore = createEmptyStore();
    const policy = getRegionPolicy(nextRegion);
    const regionalConsent = defaultConsentForRegion(nextRegion);
    consentRef.current = regionalConsent;
    profileRef.current = emptyProfile;
    storeRef.current = emptyStore;
    regionRef.current = nextRegion;
    setRegion(nextRegion);
    setConsent(regionalConsent);
    setProfile(emptyProfile);
    setViolations([]);
    const pageView = createObservedEvent(
      "page_view",
      "home",
      {
        path: "/",
        title: "Explore products",
        surface: "privacy_xray_demo",
        reset: true,
        region: nextRegion,
      },
      regionalConsent,
      nextRegion,
    );
    const nextAd = decideAd(regionalConsent, emptyProfile);
    const downstream = simulateDownstreamEffects({
      event: pageView,
      consent: regionalConsent,
      profile: emptyProfile,
      store: emptyStore,
      adDecision: nextAd,
      region: nextRegion,
    });
    storeRef.current = downstream.store;
    setStorageLog(downstream.storageRecords);
    setNetworkLog(downstream.requests);
    setEvents([pageView]);
    setSelectedEventId(pageView.id);
    const resetContext: PipelineContext = {
      event: pageView,
      profileChanged: false,
      profileDelta: 0,
      adChanged: false,
      adMode: nextAd.mode,
      regionLabel: policy.label,
      frameworkLabel: policy.frameworkLabel,
    };
    pipelineByEventRef.current = { [pageView.id]: resetContext };
    setPipelineContext(resetContext);
  }

  function handleReset() {
    resetDemoState(regionRef.current);
  }

  function goToGuideStep(index: number) {
    const step = GUIDED_STEPS[index];
    if (!step) return;
    if (step.apply === "eu") handleRegionChange("eu");
    if (step.apply === "engineer") handleViewModeChange("engineer");
    setGuideIndex(index);
    setGuideActive(true);
    setGuideCompleted(false);
    window.setTimeout(() => scrollToId(step.targetId), 80);
  }

  function handleViewModeChange(mode: AppViewMode) {
    setViewMode(mode);
    if (mode === "engineer") {
      window.setTimeout(() => scrollToId("engineer-view"), 80);
    }
  }

  function handleExploreUser() {
    handleViewModeChange("user");
    window.setTimeout(() => scrollToId("demo"), 0);
  }

  function handleExploreEngineer() {
    handleViewModeChange("engineer");
  }

  function stopDemo() {
    demoTimers.current.forEach((timer) => window.clearTimeout(timer));
    demoTimers.current = [];
    setDemoPlaying(false);
  }

  function handlePlayDemo() {
    stopDemo();
    setViewMode("user");
    resetDemoState("row");
    setDemoPlaying(true);
    window.setTimeout(() => scrollToId("demo"), 0);
    const technology = PRODUCT_CATEGORIES.find((item) => item.id === "technology");
    const travel = PRODUCT_CATEGORIES.find((item) => item.id === "travel");
    if (!technology || !travel) {
      setDemoPlaying(false);
      return;
    }

    const run = (fn: () => void, delay: number) => {
      const timer = window.setTimeout(fn, delay);
      demoTimers.current.push(timer);
    };

    run(() => handleProductClick(technology), 900);
    run(() => handleConsentToggle("analytics", false), 2400);
    run(() => handleProductClick(travel), 3800);
    run(() => setDemoPlaying(false), 4600);
  }

  function handleSimulateViolation() {
    const latest = events[0];
    if (!latest) return;
    const policies = evaluateAllPurposes(
      consentRef.current,
      regionRef.current,
    );
    const request = simulatePrivacyViolation({ event: latest, policies });
    const flagged = isPolicyViolation(request, policies);
    setNetworkLog((current) => prependLog(current, [request]));
    if (flagged) {
      setViolations((current) =>
        prependLog(current, [toViolationRecord(request)]),
      );
    }
  }

  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-hidden bg-[#05070d] text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_-10%,rgba(56,214,255,0.12),transparent_36%),radial-gradient(circle_at_90%_0%,rgba(37,99,235,0.12),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.12)_1px,transparent_1px)] [background-size:56px_56px]" />
      <div className="relative z-10 flex min-h-dvh flex-col">
        <a
          href="#demo"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-20 focus:rounded-lg focus:bg-[#05070d] focus:px-3 focus:py-2 focus:text-sm focus:text-cyan-100"
        >
          Skip to interactive demo
        </a>
        <AppHeader
          mode={viewMode}
          onModeChange={handleViewModeChange}
        />
        <HeroIntro
          mode={viewMode}
          onExploreUser={handleExploreUser}
          onExploreEngineer={handleExploreEngineer}
          onPlayDemo={handlePlayDemo}
          onStopDemo={stopDemo}
          demoPlaying={demoPlaying}
          pipelineContext={pipelineContext}
        />
        <TrustStrip />
        <GuidedDemo
          active={guideActive}
          stepIndex={guideIndex}
          completed={guideCompleted}
          onNext={() => {
            if (guideIndex >= GUIDED_STEPS.length - 1) {
              setGuideActive(false);
              setGuideCompleted(true);
              return;
            }
            goToGuideStep(guideIndex + 1);
          }}
          onBack={() => goToGuideStep(Math.max(0, guideIndex - 1))}
          onSkip={() => {
            setGuideActive(false);
            setGuideCompleted(false);
          }}
          onRestart={() => goToGuideStep(0)}
        />
        <div
          id="demo"
          tabIndex={-1}
          className="mx-auto grid w-full max-w-[1500px] scroll-mt-28 grid-cols-1 items-start lg:grid-cols-[minmax(280px,1.15fr)_minmax(340px,1fr)]"
        >
          <div className="border-white/8 lg:border-r">
            <ProductExplorer
              highlightedCategory={
                guideActive && guideIndex === 0 ? "technology" : undefined
              }
              onCategoryView={handleCategoryView}
              onProductClick={handleProductClick}
              onSearch={handleSearch}
            />
            <div className="px-5 pb-5 pt-4 lg:px-6">
              <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                Sponsored experience
              </p>
              <AdExperience decision={adDecision} profile={profile} />
            </div>
          </div>
          <aside
            id="engineer-view"
            className={`overflow-x-hidden border-t scroll-mt-28 lg:border-t-0 ${
              viewMode === "engineer"
                ? "border-violet-300/20 bg-[#08060f]"
                : "border-white/8 bg-black/25"
            }`}
          >
            {viewMode === "user" ? (
              <>
                <div className="space-y-3 border-b border-white/8 bg-[#070b14] px-5 py-4 lg:px-6">
                  <InspectorModeHeader mode="user" />
                  <PrivacyContextPanel
                    consent={consent}
                    regionPolicy={regionPolicy}
                    region={region}
                    onRegionChange={handleRegionChange}
                    onToggle={handleConsentToggle}
                    onDoNotSellOrShare={handleDoNotSellOrShare}
                    onReset={handleReset}
                  />
                  <MetricsStrip
                    regionPolicy={regionPolicy}
                    consent={consent}
                    profile={profile}
                    adDecision={adDecision}
                  />
                </div>
                <div className="flex flex-col gap-3 px-5 py-4 lg:px-6">
                  <DigitalTwin
                    profile={profile}
                    analyticsEnabled={consent.analytics}
                    pipelineContext={pipelineContext}
                  />
                  <DataStory context={pipelineContext} />
                  <StoryTimeline events={events} context={pipelineContext} />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-3 border-b border-violet-300/15 bg-[#0c0814] px-5 py-4 lg:px-6">
                  <InspectorModeHeader mode="engineer" />
                  <PrivacyContextPanel
                    consent={consent}
                    regionPolicy={regionPolicy}
                    region={region}
                    onRegionChange={handleRegionChange}
                    onToggle={handleConsentToggle}
                    onDoNotSellOrShare={handleDoNotSellOrShare}
                    onReset={handleReset}
                  />
                  <LiveEventConsole
                    events={events}
                    selectedEventId={selectedEvent?.id ?? null}
                    onSelect={setSelectedEventId}
                  />
                </div>
                <div className="flex flex-col gap-4 px-5 py-4 lg:px-6">
                  <ProcessingPipeline context={selectedPipeline} />
                  <EngineerConsole
                    event={selectedEvent}
                    pipelineContext={selectedPipeline}
                    storageRecords={storageLog}
                    requests={networkLog}
                    violations={violations}
                    regionPolicy={regionPolicy}
                    consent={consent}
                    onSimulateViolation={handleSimulateViolation}
                  />
                </div>
              </>
            )}
          </aside>
        </div>
        <ArchitecturePanel />
        <PrinciplesPanel />
        <AboutPanel />
        <SiteFooter />
      </div>
    </div>
  );
}
