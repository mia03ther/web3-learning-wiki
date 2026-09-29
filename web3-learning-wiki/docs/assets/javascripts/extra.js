// MkDocs Material 中渲染 Mermaid 图表
// 官方文档：https://squidfunk.github.io/mkdocs-material/reference/diagrams/
document$.subscribe(function () {
  var diagrams = document.querySelectorAll(".mermaid");
  if (diagrams.length === 0) return;

  // 根据当前明暗模式选择图表主题
  var palette = __md_get("__palette");
  var theme = "default";
  if (palette && palette.color && palette.color.scheme === "slate") {
    theme = "dark";
  }

  mermaid.initialize({ startOnLoad: false, theme: theme });
  mermaid.run({ querySelector: ".mermaid" });
});
