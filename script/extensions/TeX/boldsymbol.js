MathJax.Extension["TeX/boldsymbol"] = {
    version: "2.7.0"
};
MathJax.Hub.Register.StartupHook("TeX Jax Ready", function() {
    var a = MathJax.ElementJax.mml;
    var d = MathJax.InputJax.TeX;
    var b = d.Definitions;
    var c = {};
    c[a.VARIANT.NORMAL] = a.VARIANT.BOLD;
    c[a.VARIANT.ITALIC] = a.VARIANT.BOLDITALIC;
    c[a.VARIANT.FRAKTUR] = a.VARIANT.BOLDFRAKTUR;
    c[a.VARIANT.SCRIPT] = a.VARIANT.BOLDSCRIPT;
    c[a.VARIANT.SANSSERIF] = a.VARIANT.BOLDSANSSERIF;
    c["-tex-caligraphic"] = "-tex-caligraphic-bold";
    c["-tex-oldstyle"] = "-tex-oldstyle-bold";
    b.Add({
        macros: {
            boldsymbol: "Boldsymbol"
        }
    }, null, true);
    d.Parse.__Augment({
        mmlToken: function(f) {
            if (this.stack.env.boldsymbol) {
                var e = f.Get("mathvariant");
                if (e == null) {
                    f.mathvariant = a.VARIANT.BOLD
                } else {
                    f.mathvariant = (c[e] || e)
                }
            }
            return f
        },
        Boldsymbol: function(h) {
            var e = this.stack.env.boldsymbol
              , f = this.stack.env.font;
            this.stack.env.boldsymbol = true;
            this.stack.env.font = null;
            var g = this.ParseArg(h);
            this.stack.env.font = f;
            this.stack.env.boldsymbol = e;
            this.Push(g)
        }
    });
    MathJax.Hub.Startup.signal.Post("TeX boldsymbol Ready")
});
MathJax.Ajax.loadComplete("[MathJax]/extensions/TeX/boldsymbol.js");
