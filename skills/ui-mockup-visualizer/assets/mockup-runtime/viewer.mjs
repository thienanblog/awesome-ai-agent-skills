const SVELTE_VERSION = "5.39.6";

const componentSource = String.raw`
<script>
  import { onMount, tick } from "svelte";

  export let data = {};
  export let initialSelectedId = "";
  export let captureMode = false;

  const DEFAULT_TEXT = {
    visualReview: "Visual Review",
    reviewSubtitle:
      "Use the options to confirm the structure quickly. The mockup stays fixed-canvas on purpose so the layout remains exact.",
    workingNotes: "Working Notes",
    recommended: "Recommended",
    selected: "Selected",
    rationale: "Rationale",
    benchmarks: "Benchmarks",
    canvas: "Canvas",
    replyShortcuts: "Reply shortcuts",
    replyOne: "Option A",
    replyMany: "Option A + C",
    replyNone: "None, I want ...",
    stageRecommendedCopy:
      "This is the recommended direction. Use it as the default unless the user clearly prefers a different tradeoff.",
    stageAlternativeCopy:
      "This is a valid alternative. Compare it against the recommended direction based on workflow cost.",
    captureLabel: "Approved mockup checkpoint",
    noMockupData: "No mockup data found.",
    zoomOut: "Zoom out",
    zoomIn: "Zoom in",
    fit: "Fit",
    actualSize: "100%",
    zoom: "Zoom"
  };

  const BLOCK_TONES = {
    default: "border-stone-300/90 bg-white/90 text-stone-700",
    muted: "border-stone-300/80 bg-stone-100/90 text-stone-500",
    accent: "border-amber-400/80 bg-amber-100/92 text-amber-900",
    strong: "border-stone-900/20 bg-stone-900 text-stone-50"
  };

  const PLATFORM_FRAME = {
    "web-desktop": {
      outerPadding: 24,
      shellClass: "rounded-[30px] border border-stone-900/10 bg-white/96 p-6 shadow-[0_28px_80px_rgba(41,37,36,0.14)]"
    },
    "mobile-app": {
      outerPadding: 24,
      shellClass:
        "rounded-[46px] border-[10px] border-stone-950 bg-stone-950 p-3 shadow-[0_30px_90px_rgba(15,23,42,0.35)]"
    },
    "desktop-app": {
      outerPadding: 24,
      shellClass:
        "rounded-[24px] border border-stone-900/12 bg-white/96 p-5 shadow-[0_28px_80px_rgba(15,23,42,0.18)]"
    }
  };

  function normalizeId(value) {
    return String(value || "").trim().toUpperCase();
  }

  function getUiText(source) {
    return { ...DEFAULT_TEXT, ...(source?.uiText || source?.localeText || {}) };
  }

  function getOptions(source) {
    return Array.isArray(source?.options) ? source.options : [];
  }

  function getPreferredId(source, options) {
    const fromQuery = normalizeId(new URLSearchParams(location.search).get("option"));
    if (fromQuery) return fromQuery;

    const fromHash = normalizeId(location.hash.replace("#", ""));
    if (fromHash) return fromHash;

    return normalizeId(initialSelectedId) || normalizeId(options.find((option) => option.recommended)?.id) || normalizeId(options[0]?.id);
  }

  function byId(options, id) {
    return options.find((option) => normalizeId(option.id) === normalizeId(id)) || options[0];
  }

  function toneClass(block) {
    return BLOCK_TONES[block?.tone || "default"] || BLOCK_TONES.default;
  }

  function platformFrame(option) {
    return PLATFORM_FRAME[option?.canvas?.device] || PLATFORM_FRAME["web-desktop"];
  }

  function captureSpec(option) {
    const frame = platformFrame(option);
    return {
      width: (option?.canvas?.width || 0) + frame.outerPadding * 2,
      height: (option?.canvas?.height || 0) + frame.outerPadding * 2
    };
  }

  function selectedPlatform(source, option) {
    return source?.platform || option?.canvas?.device || "web-desktop";
  }

  function blockInset(block) {
    const width = Number(block?.w || 0);
    const height = Number(block?.h || 0);
    return Math.max(6, Math.min(14, Math.floor(Math.min(width, height) / 10)));
  }

  const options = getOptions(data);
  const uiText = getUiText(data);

  let selectedId = getPreferredId(data, options);
  let viewportEl;
  let fitScale = 1;
  let userScale = 1;
  let liveZoom = 1;

  $: selected = byId(options, selectedId);
  $: selectedOptionId = normalizeId(selected?.id);
  $: pagePlatform = selectedPlatform(data, selected);
  $: capture = captureSpec(selected);
  $: liveZoom = Number((fitScale * userScale).toFixed(2));
  $: if (typeof window !== "undefined") {
    window.__mockupCapture = {
      width: capture.width,
      height: capture.height,
      option: selectedOptionId,
      platform: pagePlatform
    };
    document.body.classList.toggle("capture-mode", captureMode);
  }

  async function recomputeFitScale() {
    if (!viewportEl || captureMode || !selected?.canvas) return;
    await tick();
    const padX = 64;
    const padY = 64;
    const widthRatio = (viewportEl.clientWidth - padX) / capture.width;
    const heightRatio = (viewportEl.clientHeight - padY) / capture.height;
    const nextScale = Math.min(1.2, Math.max(0.3, Math.min(widthRatio, heightRatio)));
    fitScale = Number.isFinite(nextScale) ? Number(nextScale.toFixed(3)) : 1;
  }

  function selectOption(id) {
    const nextId = normalizeId(id);
    if (!nextId || captureMode) return;
    selectedId = nextId;
    userScale = 1;
    const nextUrl = new URL(location.href);
    nextUrl.hash = nextId;
    nextUrl.searchParams.delete("option");
    history.replaceState({}, "", nextUrl);
    recomputeFitScale();
  }

  function zoomIn() {
    userScale = Number(Math.min(3, userScale + 0.1).toFixed(2));
  }

  function zoomOut() {
    userScale = Number(Math.max(0.35, userScale - 0.1).toFixed(2));
  }

  function fitToViewport() {
    userScale = 1;
    recomputeFitScale();
  }

  function actualSize() {
    userScale = Number((1 / (fitScale || 1)).toFixed(2));
  }

  onMount(() => {
    if (captureMode) return;
    recomputeFitScale();
    const handleResize = () => recomputeFitScale();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  $: if (!captureMode && selectedOptionId) {
    recomputeFitScale();
  }
</script>

{#if !options.length}
  <div class="flex min-h-screen items-center justify-center bg-stone-100 px-6 text-center text-sm text-stone-500">
    {uiText.noMockupData}
  </div>
{:else if captureMode}
  <div class="flex min-h-screen items-start justify-start bg-transparent p-0">
    <section
      data-capture-root
      class="capture-stage"
      style={"width:" + capture.width + "px;height:" + capture.height + "px"}
      aria-label={uiText.captureLabel}
    >
      <div
        data-capture-target
        data-device-frame={selected.canvas.device}
        class={"capture-frame " + platformFrame(selected).shellClass}
      >
        <div
          class="mockup-canvas relative overflow-hidden border border-stone-900/10 bg-stone-50"
          style={"width:" + selected.canvas.width + "px;height:" + selected.canvas.height + "px"}
        >
          <div class="mockup-grid absolute inset-0"></div>
          {#each selected.blocks || [] as block}
            <div
              class="absolute"
              style={"left:" + block.x + "px;top:" + block.y + "px;width:" + block.w + "px;height:" + block.h + "px"}
            >
              <div
                class={"absolute shadow-sm block-inner flex flex-col items-start justify-between rounded-[18px] border p-3 " + toneClass(block)}
                style={"inset:" + blockInset(block) + "px"}
              >
                <div class="text-[13px] font-semibold leading-tight">{block.label || block.kind || "Block"}</div>
                <div class="text-[10px] uppercase tracking-[0.24em] opacity-70">{block.kind || "block"}</div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </section>
  </div>
{:else}
  <div class="h-screen w-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.14),transparent_26%),linear-gradient(180deg,#fafaf9_0%,#f5f5f4_100%)] p-4 text-stone-900">
    <div class="grid h-full w-full grid-cols-[320px_minmax(0,1fr)] gap-4">
      <aside class="flex min-h-0 flex-col gap-4 rounded-[30px] border border-white/60 bg-white/78 p-5 shadow-[0_28px_80px_rgba(41,37,36,0.12)] backdrop-blur">
        <div>
          <p class="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">{uiText.visualReview}</p>
          <h1 class="text-[27px] font-semibold leading-tight text-stone-950">{data.question || "UI Mockup"}</h1>
          <p class="mt-3 text-sm leading-6 text-stone-500">{uiText.reviewSubtitle}</p>
        </div>

        {#if Array.isArray(data.notes) && data.notes.length}
          <section class="rounded-[24px] border border-stone-200/80 bg-stone-50/90 p-5">
            <h2 class="text-sm font-semibold text-stone-900">{uiText.workingNotes}</h2>
            <ul class="mt-3 space-y-2 pl-5 text-sm leading-6 text-stone-600">
              {#each data.notes as note}
                <li class="list-disc">{note}</li>
              {/each}
            </ul>
          </section>
        {/if}

        <section class="min-h-0 space-y-3 overflow-auto pr-1">
          {#each options as option}
            <button
              type="button"
              on:click={() => selectOption(option.id)}
              class={"w-full rounded-[22px] border px-4 py-4 text-left transition hover:-translate-y-px hover:border-stone-300 hover:bg-white/95 " + (normalizeId(option.id) === selectedOptionId
                ? "border-amber-300 bg-white shadow-sm ring-1 ring-amber-100"
                : "border-stone-200/80 bg-white/70")}
            >
              <div class="flex items-center justify-between gap-3">
                <div class="text-base font-semibold text-stone-900">{option.title || "Option " + option.id}</div>
                {#if option.recommended}
                  <span class="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-800">
                    {uiText.recommended}
                  </span>
                {/if}
              </div>
              <p class="mt-3 text-sm leading-6 text-stone-500">{option.summary || ""}</p>
            </button>
          {/each}
        </section>

        <section class="rounded-[24px] border border-stone-200/80 bg-stone-50/90 p-5 text-sm leading-6 text-stone-600">
          <div class="font-semibold text-stone-900">{uiText.replyShortcuts}</div>
          <div class="mt-3 space-y-1">
            <div>{uiText.replyOne}</div>
            <div>{uiText.replyMany}</div>
            <div>{uiText.replyNone}</div>
          </div>
        </section>
      </aside>

      <main class="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-[30px] border border-white/60 bg-white/82 shadow-[0_28px_80px_rgba(41,37,36,0.12)] backdrop-blur">
        <section class="border-b border-stone-200/80 px-6 py-5">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div class="min-w-0">
              <p class="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">{uiText.selected} {selected.title || "Option " + selected.id}</p>
              <h2 class="mt-2 text-[24px] font-semibold leading-tight text-stone-950">{selected.summary || ""}</h2>
              <p class="mt-4 max-w-4xl text-[15px] leading-7 text-stone-500">
                {selected.recommended ? uiText.stageRecommendedCopy : uiText.stageAlternativeCopy}
              </p>
            </div>
            <div class="flex flex-wrap gap-2">
              <span class="inline-flex items-center rounded-full border border-stone-200 bg-white px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-stone-500">
                {pagePlatform}
              </span>
              {#each selected.benchmarks || [] as item}
                <span class="inline-flex items-center rounded-full border border-stone-200 bg-white px-3 py-1 text-xs text-stone-500">
                  {item}
                </span>
              {/each}
            </div>
          </div>
        </section>

        <section class="grid min-h-0 grid-cols-[minmax(0,1fr)_340px]">
          <div class="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] border-r border-stone-200/80">
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/70 px-6 py-4">
              <div class="text-sm font-medium text-stone-500">{uiText.canvas}: {selected.canvas.width}x{selected.canvas.height}</div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">{uiText.zoom}</span>
                <button type="button" on:click={zoomOut} class="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-600 hover:border-stone-300 hover:bg-stone-50">
                  -
                </button>
                <div class="min-w-[64px] text-center text-sm font-semibold text-stone-700">{Math.round(liveZoom * 100)}%</div>
                <button type="button" on:click={zoomIn} class="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-600 hover:border-stone-300 hover:bg-stone-50">
                  +
                </button>
                <button type="button" on:click={fitToViewport} class="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-stone-500 hover:border-stone-300 hover:bg-stone-50">
                  {uiText.fit}
                </button>
                <button type="button" on:click={actualSize} class="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-stone-500 hover:border-stone-300 hover:bg-stone-50">
                  {uiText.actualSize}
                </button>
              </div>
            </div>

            <div bind:this={viewportEl} class="canvas-viewport min-h-0 overflow-auto px-6 py-6">
              <div class="inline-flex origin-top-left transition-transform duration-150 ease-out" style={"transform: scale(" + liveZoom + ")"}>
                <div
                  data-device-frame={selected.canvas.device}
                  class={"inline-flex " + platformFrame(selected).shellClass}
                >
                  <div
                    class="mockup-canvas relative overflow-hidden border border-stone-900/10 bg-stone-50"
                    style={"width:" + selected.canvas.width + "px;height:" + selected.canvas.height + "px"}
                  >
                    <div class="mockup-grid absolute inset-0"></div>
                    {#each selected.blocks || [] as block}
                      <div
                        class="absolute"
                        style={"left:" + block.x + "px;top:" + block.y + "px;width:" + block.w + "px;height:" + block.h + "px"}
                      >
                        <div
                          class={"absolute shadow-sm block-inner flex flex-col items-start justify-between rounded-[18px] border p-3 " + toneClass(block)}
                          style={"inset:" + blockInset(block) + "px"}
                        >
                          <div class="text-[13px] font-semibold leading-tight">{block.label || block.kind || "Block"}</div>
                          <div class="text-[10px] uppercase tracking-[0.24em] opacity-70">{block.kind || "block"}</div>
                        </div>
                      </div>
                    {/each}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside class="space-y-4 overflow-auto p-5">
            <section class="rounded-[24px] border border-stone-200/80 bg-stone-50/90 p-5">
              <h3 class="text-sm font-semibold text-stone-900">{uiText.rationale}</h3>
              <ul class="mt-3 space-y-2 pl-5 text-sm leading-6 text-stone-600">
                {#each selected.rationale || [] as item}
                  <li class="list-disc">{item}</li>
                {/each}
              </ul>
            </section>

            <section class="rounded-[24px] border border-stone-200/80 bg-stone-50/90 p-5">
              <h3 class="text-sm font-semibold text-stone-900">{uiText.benchmarks}</h3>
              <ul class="mt-3 space-y-2 pl-5 text-sm leading-6 text-stone-600">
                {#each selected.benchmarks || [] as item}
                  <li class="list-disc">{item}</li>
                {/each}
              </ul>
            </section>

            <section class="rounded-[24px] border border-stone-200/80 bg-stone-50/90 p-5">
              <h3 class="text-sm font-semibold text-stone-900">{uiText.canvas}</h3>
              <p class="mt-3 text-sm leading-6 text-stone-600">
                {selected.canvas.device} {selected.canvas.width}x{selected.canvas.height}
              </p>
            </section>
          </aside>
        </section>
      </main>
    </div>
  </div>
{/if}
`;

function cdnSpecifier(specifier) {
  if (specifier === "svelte") {
    return `https://esm.sh/svelte@${SVELTE_VERSION}`;
  }
  if (specifier.startsWith("svelte/")) {
    return `https://esm.sh/svelte@${SVELTE_VERSION}/${specifier.slice("svelte/".length)}`;
  }
  if (specifier === "esm-env") {
    return "https://esm.sh/esm-env";
  }
  return specifier;
}

function rewriteImports(code) {
  return code.replace(/(["'])(svelte(?:\/[^"']*)?|esm-env)\1/g, (match, quote, specifier) => {
    return `${quote}${cdnSpecifier(specifier)}${quote}`;
  });
}

async function compileViewer() {
  const compilerModule = await import(`https://esm.sh/svelte@${SVELTE_VERSION}/compiler`);
  const { compile } = compilerModule;
  const compiled = compile(componentSource, {
    filename: "MockupViewer.svelte",
    generate: "client"
  });
  const code = rewriteImports(compiled.js.code);
  const blob = new Blob([code], { type: "text/javascript" });
  const moduleUrl = URL.createObjectURL(blob);
  try {
    return await import(moduleUrl);
  } finally {
    URL.revokeObjectURL(moduleUrl);
  }
}

function getData() {
  return window.mockupData || {};
}

function getInitialSelectedId(data) {
  const options = Array.isArray(data.options) ? data.options : [];
  return (
    new URLSearchParams(location.search).get("option") ||
    location.hash.replace("#", "") ||
    options.find((option) => option.recommended)?.id ||
    options[0]?.id ||
    "A"
  );
}

async function main() {
  const target = document.getElementById("app");
  const captureMode = new URLSearchParams(location.search).get("capture") === "1";
  document.body.classList.toggle("capture-mode", captureMode);

  try {
    const viewerModule = await compileViewer();
    const svelteModule = await import(`https://esm.sh/svelte@${SVELTE_VERSION}`);
    svelteModule.mount(viewerModule.default, {
      target,
      props: {
        data: getData(),
        initialSelectedId: getInitialSelectedId(getData()),
        captureMode
      }
    });
  } catch (error) {
    console.error(error);
    target.innerHTML =
      '<div class="flex min-h-screen items-center justify-center bg-stone-100 px-6 text-center text-sm text-stone-600">Unable to load the Svelte mockup viewer.</div>';
  }
}

main();
