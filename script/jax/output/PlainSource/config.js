MathJax.OutputJax.PlainSource = MathJax.OutputJax({
    id: "PlainSource",
    version: "2.7.2",
    directory: MathJax.OutputJax.directory + "/PlainSource",
    extensionDir: MathJax.OutputJax.extensionDir + "/PlainSource",
    config: {
        styles: {
            ".MathJax_PlainSource_Display": { "text-align": "center", margin: ".75em 0px", "white-space": "pre" },
            ".MathJax_PlainSource_Display > span": { display: "inline-block", "text-align": "left" }
        }
    }
});
if (!MathJax.Hub.config.delayJaxRegistration) {
    MathJax.OutputJax.PlainSource.Register("jax/mml");
}
MathJax.OutputJax.PlainSource.loadComplete("config.js");
