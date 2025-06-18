/**
 * @param {string} hightlightJsLang 
 * @returns {Promise<import('highlight.js').Language|null>}
 */
export async function createLanguageExtension(hightlightJsLang) {
    switch (hightlightJsLang) {
        case 'c': return lang_c();
        case 'cpp': return lang_cpp();
        case 'csharp': return lang_csharp();
        case 'css': return lang_css();
        case 'd': return lang_d();
        case 'erlang': return lang_erlang();
        case 'fortran': return lang_fortran();
        case 'fsharp': return lang_fsharp();
        case 'haskell': return lang_haskell();
        case 'java': return lang_java();
        case 'javascript': return lang_javascript();
        case 'json': return lang_json();
        case 'kotlin': return lang_kotlin();
        case 'less': return lang_less();
        case 'lua': return lang_lua();
        case 'ocaml': return lang_ocaml();
        case 'pascal': return lang_pascal();
        case 'perl': return lang_perl();
        case 'php': return lang_php();
        case 'php-template': return lang_php_template();
        case 'powershell': return lang_powershell();
        case 'objectivec': return lang_objective_c();
        case 'ruby': return lang_ruby();
        case 'rust': return lang_rust();
        case 'scala': return lang_scala();
        case 'scss': return lang_scss();
        case 'shell': return lang_shell();
        case 'sql': return lang_sql();
        case 'swift': return lang_swift();
        case 'typescript': return lang_typescript();
        case 'vbnet': return lang_vbnet();
        case 'wasm': return lang_wasm();
        case 'xml': return lang_xml();
        case 'yaml': return lang_yaml();
    }

    return null;
}

async function lang_c() {
    const [{ StreamLanguage }, { c }] = await Promise.all([
        import("@codemirror/language"),
        import("@codemirror/legacy-modes/mode/clike"),
    ]);
    return StreamLanguage.define(c);
}

async function lang_cpp() {
    const { cpp } = await import("@codemirror/lang-cpp");
    return cpp();
}

async function lang_csharp() {
    const [{ StreamLanguage }, { csharp }] = await Promise.all([
        import("@codemirror/language"),
        import("@codemirror/legacy-modes/mode/clike"),
    ]);
    return StreamLanguage.define(csharp);
}

async function lang_css() {
    const { css } = await import("@codemirror/lang-css");
    return css();
}

async function lang_d() {
    const [{ StreamLanguage }, { d }] = await Promise.all([
        import("@codemirror/language"),
        import("@codemirror/legacy-modes/mode/d"),
    ]);
    return StreamLanguage.define(d);
}

async function lang_erlang() {
    const [{ StreamLanguage }, { erlang }] = await Promise.all([
        import("@codemirror/language"),
        import("@codemirror/legacy-modes/mode/erlang"),
    ]);
    return StreamLanguage.define(erlang);
}

async function lang_fortran() {
    const [{ StreamLanguage }, { fortran }] = await Promise.all([
        import("@codemirror/language"),
        import("@codemirror/legacy-modes/mode/fortran"),
    ]);
    return StreamLanguage.define(fortran);
}

async function lang_fsharp() {
    const [{ StreamLanguage }, { fSharp }] = await Promise.all([
        import("@codemirror/language"),
        import("@codemirror/legacy-modes/mode/mllike"),
    ]);
    return StreamLanguage.define(fSharp);
}

async function lang_haskell() {
    const [{ StreamLanguage }, { haskell }] = await Promise.all([
        import("@codemirror/language"),
        import("@codemirror/legacy-modes/mode/haskell"),
    ]);
    return StreamLanguage.define(haskell);
}

async function lang_java() {
    const { java } = await import("@codemirror/lang-java");
    return java();
}

async function lang_javascript() {
    const { javascript } = await import("@codemirror/lang-javascript");
    return javascript({ jsx: true });
}

async function lang_json() {
    const { json } = await import("@codemirror/lang-json");
    return json();
}

async function lang_kotlin() {
    const [{ StreamLanguage }, { kotlin }] = await Promise.all([
        import("@codemirror/language"),
        import("@codemirror/legacy-modes/mode/clike"),
    ]);
    return StreamLanguage.define(kotlin);
}

async function lang_less() {
    const { less } = await import("@codemirror/lang-less");
    return less();
}

async function lang_lua() {
    const [{ StreamLanguage }, { lua }] = await Promise.all([
        import("@codemirror/language"),
        import("@codemirror/legacy-modes/mode/lua"),
    ]);
    return StreamLanguage.define(lua);
}

async function lang_ocaml() {
    const [{ StreamLanguage }, { oCaml }] = await Promise.all([
        import("@codemirror/language"),
        import("@codemirror/legacy-modes/mode/mllike"),
    ]);
    return StreamLanguage.define(oCaml);
}

async function lang_pascal() {
    const [{ StreamLanguage }, { pascal }] = await Promise.all([
        import("@codemirror/language"),
        import("@codemirror/legacy-modes/mode/pascal"),
    ]);
    return StreamLanguage.define(pascal);
}

async function lang_perl() {
    const [{ StreamLanguage }, { perl }] = await Promise.all([
        import("@codemirror/language"),
        import("@codemirror/legacy-modes/mode/perl"),
    ]);
    return StreamLanguage.define(perl);
}

async function lang_php() {
    const { php } = await import("@codemirror/lang-php");
    return php({ plain: true });
}

async function lang_php_template() {
    const { php } = await import("@codemirror/lang-php");
    return php({ plain: false });
}

async function lang_powershell() {
    const [{ StreamLanguage }, { powerShell }] = await Promise.all([
        import("@codemirror/language"),
        import("@codemirror/legacy-modes/mode/powershell"),
    ]);
    return StreamLanguage.define(powerShell);
}

async function lang_objective_c() {
    const [{ StreamLanguage }, { objectiveC }] = await Promise.all([
        import("@codemirror/language"),
        import("@codemirror/legacy-modes/mode/clike"),
    ]);
    return StreamLanguage.define(objectiveC);
}

async function lang_ruby() {
    const [{ StreamLanguage }, { ruby }] = await Promise.all([
        import("@codemirror/language"),
        import("@codemirror/legacy-modes/mode/ruby"),
    ]);
    return StreamLanguage.define(ruby);
}

async function lang_rust() {
    const { rust } = await import("@codemirror/lang-rust");
    return rust();
}

async function lang_scala() {
    const [{ StreamLanguage }, { scala }] = await Promise.all([
        import("@codemirror/language"),
        import("@codemirror/legacy-modes/mode/clike"),
    ]);
    return StreamLanguage.define(scala);
}

async function lang_scss() {
    const { sass } = await import("@codemirror/lang-sass");
    return sass({ indented: false });
}

async function lang_shell() {
    const [{ StreamLanguage }, { shell }] = await Promise.all([
        import("@codemirror/language"),
        import("@codemirror/legacy-modes/mode/shell"),
    ]);
    return StreamLanguage.define(shell);
}

async function lang_sql() {
    const { sql } = await import("@codemirror/lang-sql");
    return sql();
}

async function lang_swift() {
    const [{ StreamLanguage }, { swift }] = await Promise.all([
        import("@codemirror/language"),
        import("@codemirror/legacy-modes/mode/swift"),
    ]);
    return StreamLanguage.define(swift);
}

async function lang_typescript() {
    const { javascript } = await import("@codemirror/lang-javascript");
    return javascript({ jsx: true, typescript: true });
}

async function lang_vbnet() {
    const [{ StreamLanguage }, { vb }] = await Promise.all([
        import("@codemirror/language"),
        import("@codemirror/legacy-modes/mode/vb"),
    ]);
    return StreamLanguage.define(vb);
}

async function lang_wasm() {
    const { wast } = await import("@codemirror/lang-wast");
    return wast();
}

async function lang_xml() {
    const { xml } = await import("@codemirror/lang-xml");
    return xml();
}

async function lang_yaml() {
    const { yaml } = await import("@codemirror/lang-yaml");
    return yaml();
}
