(function () {
  const data = window.mockupData || {};
  const options = Array.isArray(data.options) ? data.options : [];
  if (!options.length) {
    document.getElementById("app").textContent = "No mockup data found.";
    return;
  }

  const state = {
    selectedId:
      (location.hash || "").replace("#", "").toUpperCase() ||
      (options.find((option) => option.recommended) || options[0]).id,
  };

  function byId(id) {
    return options.find((option) => option.id === id) || options[0];
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (typeof text === "string") node.textContent = text;
    return node;
  }

  function render() {
    const app = document.getElementById("app");
    app.innerHTML = "";

    const selected = byId(state.selectedId);
    location.hash = selected.id;

    const page = el("div", "page");
    page.dataset.platform = data.platform || selected.canvas.device || "web-desktop";
    page.appendChild(renderRail(selected));
    page.appendChild(renderStage(selected));
    app.appendChild(page);
  }

  function renderRail(selected) {
    const rail = el("aside", "rail");
    rail.appendChild(el("p", "eyebrow", "Visual Review"));
    rail.appendChild(el("h1", "title", data.question || "UI Mockup"));
    rail.appendChild(
      el(
        "p",
        "subtitle",
        "Use the options to confirm the structure quickly. The mockup is fixed-canvas on purpose so the layout stays exact."
      )
    );

    if (Array.isArray(data.notes) && data.notes.length) {
      const noteCard = el("section", "detail-card");
      noteCard.appendChild(el("h2", "detail-title", "Working Notes"));
      const list = el("ul", "note-list");
      data.notes.forEach((note) => list.appendChild(el("li", "", note)));
      noteCard.appendChild(list);
      rail.appendChild(noteCard);
    }

    const optionsWrap = el("section", "options");
    options.forEach((option) => {
      const card = el("button", "option-card" + (option.id === selected.id ? " active" : ""));
      card.type = "button";
      card.addEventListener("click", () => {
        state.selectedId = option.id;
        render();
      });

      const head = el("div", "option-head");
      head.appendChild(el("div", "option-name", option.title || `Option ${option.id}`));
      if (option.recommended) {
        head.appendChild(el("span", "badge badge-recommended", "Recommended"));
      }
      card.appendChild(head);
      card.appendChild(el("p", "option-summary", option.summary || ""));
      optionsWrap.appendChild(card);
    });
    rail.appendChild(optionsWrap);

    const reply = el("div", "reply-box");
    reply.innerHTML =
      "<strong>Reply shortcuts</strong><br />Option A<br />Option A + C<br />None, I want ...";
    rail.appendChild(reply);

    return rail;
  }

  function renderStage(option) {
    const stageShell = el("main", "stage-shell");

    const header = el("section", "stage-header");
    const meta = el("div", "stage-meta");
    meta.appendChild(el("p", "eyebrow", `Selected ${option.title}`));
    meta.appendChild(el("h2", "stage-title", option.summary || ""));
    meta.appendChild(
      el(
        "p",
        "stage-copy",
        option.recommended
          ? "This is the currently recommended direction. Use it as the default unless the user clearly prefers another tradeoff."
          : "This is a valid alternative. Compare it against the recommended option based on the workflow cost."
      )
    );

    const tags = el("div", "stage-tags");
    tags.appendChild(el("span", "tag", data.platform || option.canvas.device || "web-desktop"));
    (option.benchmarks || []).forEach((item) => tags.appendChild(el("span", "tag", item)));
    meta.appendChild(tags);
    header.appendChild(meta);
    stageShell.appendChild(header);

    const body = el("section", "stage-body");
    body.appendChild(renderCanvasPane(option));
    body.appendChild(renderDetailPane(option));
    stageShell.appendChild(body);
    return stageShell;
  }

  function renderCanvasPane(option) {
    const pane = el("div", "canvas-pane");
    const shell = el("div", "canvas-shell");
    shell.dataset.device = option.canvas.device;

    const canvas = el("div", "canvas");
    canvas.dataset.device = option.canvas.device;
    canvas.style.width = `${option.canvas.width}px`;
    canvas.style.height = `${option.canvas.height}px`;

    (option.blocks || []).forEach((block) => {
      const node = el("div", `block tone-${block.tone || "default"}`);
      node.style.left = `${block.x}px`;
      node.style.top = `${block.y}px`;
      node.style.width = `${block.w}px`;
      node.style.height = `${block.h}px`;

      node.appendChild(el("div", "block-label", block.label || ""));
      node.appendChild(el("div", "block-kind", block.kind || "block"));
      canvas.appendChild(node);
    });

    shell.appendChild(canvas);
    pane.appendChild(shell);
    return pane;
  }

  function renderDetailPane(option) {
    const pane = el("aside", "detail-pane");

    const rationaleCard = el("section", "detail-card");
    rationaleCard.appendChild(el("h3", "detail-title", "Rationale"));
    const rationale = el("ul", "rationale-list");
    (option.rationale || []).forEach((item) => rationale.appendChild(el("li", "", item)));
    rationaleCard.appendChild(rationale);
    pane.appendChild(rationaleCard);

    const benchmarkCard = el("section", "detail-card");
    benchmarkCard.appendChild(el("h3", "detail-title", "Benchmarks"));
    const benchmarks = el("ul", "benchmark-list");
    (option.benchmarks || []).forEach((item) => benchmarks.appendChild(el("li", "", item)));
    benchmarkCard.appendChild(benchmarks);
    pane.appendChild(benchmarkCard);

    const canvasCard = el("section", "detail-card");
    canvasCard.appendChild(el("h3", "detail-title", "Canvas"));
    const canvasList = el("ul", "benchmark-list");
    canvasList.appendChild(
      el("li", "", `${option.canvas.device} ${option.canvas.width}x${option.canvas.height}`)
    );
    canvasCard.appendChild(canvasList);
    pane.appendChild(canvasCard);

    return pane;
  }

  render();
})();
