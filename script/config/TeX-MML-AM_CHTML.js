///<reference path="../MathJax.js"/>
///<reference path="TeXParser.js"/>
///<reference path="MMLParser.js"/>

MathJax.Ajax.Preloading(
	"[MathJax]/jax/input/TeX/config.js",
	"[MathJax]/jax/input/MathML/config.js",
	"[MathJax]/jax/input/AsciiMath/config.js",
	"[MathJax]/jax/output/CommonHTML/config.js",
	"[MathJax]/jax/output/PreviewHTML/config.js",
	"[MathJax]/extensions/tex2jax.js",
	"[MathJax]/extensions/mml2jax.js",
	"[MathJax]/extensions/asciimath2jax.js",
	"[MathJax]/extensions/MathEvents.js",
	"[MathJax]/extensions/MathZoom.js",
	"[MathJax]/extensions/MathMenu.js",
	"[MathJax]/jax/element/mml/jax.js",
	"[MathJax]/extensions/toMathML.js",
	"[MathJax]/extensions/TeX/noErrors.js",
	"[MathJax]/extensions/TeX/noUndefined.js",
	"[MathJax]/jax/input/TeX/jax.js",
	"[MathJax]/extensions/TeX/AMSmath.js",
	"[MathJax]/extensions/TeX/AMSsymbols.js",
	"[MathJax]/jax/input/MathML/jax.js",
	"[MathJax]/jax/input/AsciiMath/jax.js",
	"[MathJax]/jax/output/PreviewHTML/jax.js",
	"[MathJax]/extensions/fast-preview.js",
	"[MathJax]/extensions/AssistiveMML.js",
	"[MathJax]/extensions/a11y/accessibility-menu.js"
);


MathJax.InputJax.TeX = MathJax.InputJax(new TeX());
MathJax.InputJax.TeX.Register("math/tex");
MathJax.InputJax.TeX.loadComplete("config.js");
TEX_PARSER(MathJax.InputJax.TeX, MathJax.Hub, MathJax.Ajax);

MathJax.ElementJax.mml = MathJax.ElementJax({ mimeType: "jax/mml" }, new MathML());
MML_PARSER(MathJax.ElementJax.mml);

MathJax.OutputJax.CommonHTML = MathJax.OutputJax(new CommonHTML());
if (!MathJax.Hub.config.delayJaxRegistration) {
	MathJax.OutputJax.CommonHTML.Register("jax/mml");
}
MathJax.OutputJax.CommonHTML.loadComplete("config.js");

MathJax.Extension.tex2jax = new Tex2Jax();
MathJax.Hub.Register.PreProcessor(["PreProcess", MathJax.Extension.tex2jax]);
MathJax.Ajax.loadComplete("[MathJax]/extensions/tex2jax.js");

MathJax.Extension.mml2jax = new MML2Jax();
MathJax.Hub.Register.PreProcessor(["PreProcess", MathJax.Extension.mml2jax], 5);
MathJax.Ajax.loadComplete("[MathJax]/extensions/mml2jax.js");

MENU(MathJax.Hub, MathJax.HTML, MathJax.Ajax, MathJax.Callback, MathJax.Localization, MathJax.OutputJax, MathJax.InputJax);

ZOOM_MENU(MathJax.Hub, MathJax.HTML, MathJax.Ajax, MathJax.OutputJax["HTML-CSS"], MathJax.OutputJax.NativeMML);

MATH_MENU(MathJax.Hub, MathJax.HTML, MathJax.Ajax, MathJax.Callback, MathJax.OutputJax);

AMSmath();

MathJax.Ajax.loadComplete("[MathJax]/config/TeX-MML-AM_CHTML.js");
