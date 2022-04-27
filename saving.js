G.log("SAVE/CORE: Loading core save data...", "#5fc");
const core = JSON.parse(window.localStorage.getItem("core"));
if (core == null) G.log("WARN/SAVE: No core save data found", "#cf5");
else {
    G.xp = new Decimal(core.xp);
    G.points = new Decimal(core.points);
    G.need = new Decimal(500).mul(new Decimal(S.level).pow(core.level));
    G.level = new Decimal(core.level);
    G.tiers = core.tiers;
    G.log("SAVE/CORE: Successfully loaded data!", "#5f6");
}

A.InitMod = function (id, file, dependencies) {
    G.loading[id] = setInterval(function () {
        for (const d of dependencies) if (!G.modlist.includes(d)) return;
        const e = document.createElement('script');
        e.src = file;
        document.body.appendChild(e);
        clearInterval(G.loading[id]);
    }, 100);
    for (const d of dependencies) if (!G.modlist.includes(d)) return;
    const e = document.createElement('script');
    e.src = file;
    document.body.appendChild(e);
    clearInterval(G.loading[id]);
}
/**
 * Start initialization of a mod
 * Mod declaration is extremely important when it comes to save and data packaging
 * @param {String} name - the display name of the mod
 * @param {String} id - unique id of the mod
 * @param {String} version - mod SemVer
 */
A.StartMod = function (name, id, version) {
    G.log("INIT/MOD: Started initialization of " + name + "(" + id + ") v" + version, "#aff");
    G.modloader = id;
    G.modlist[id] = new D.Mod(name, id, version);
    return this;
}
/**
 * End initialization of the mod
 * This will trigger the loading of the mod save data
 */
A.EndMod = function () {
    try {
        G.log("INIT/MOD: Finished initialization of " + G.modloader, "#afc");
        G.log("SAVE/" + G.modloader.toUpperCase() + ": Checking for saved game...", "#5fc");
        const save = JSON.parse(window.localStorage.getItem(G.modloader));
        if (save == null) {
            G.log("WARN/SAVE: No save data found (modid: " + G.modloader + ")", "#cf5");
            return this;
        }
        for (const b in save.b) for (const v in save.b[b]) {
            if (['cost','owned'].includes(v)) G.buyables[b][v] = new Decimal(save.b[b][v]);
            else G.buyables[b][v] = save.b[b][v];
        }
        for (const c in save.c) for (const v in save.c[c]) C[c][v] = new Decimal(save.c[c][v]);
        for (const a in save.a) for (const v in save.a[a]) {
            if (['ascensions'].includes(v)) G.ascensions[a][v] = new Decimal(save.a[a][v]);
            else G.ascensions[a][v] = save.a[a][v];
        }
        for (const m in save.m) for (const v in save.m[m]) G.milestones[m][v] = save.m[m][v];
        G.log("SAVE/" + G.modloader.toUpperCase() + ": Successfully loaded data!", "#5f6");
        G.modloader = null;
        return this;
    } catch (err) {
        G.log("ERROR/" + G.modloader.toUpperCase() + ": " + err.stack, "#faa");
    }
}

G.Save = function () {
    try {
    window.localStorage.setItem('core', JSON.stringify({
        xp: G.xp,
        points: G.points,
        level: G.level,
        tiers: G.tiers
    }));
    allmods = JSON.parse(window.localStorage.getItem('modlist'));
    if (allmods == null) {
        allmods = [];
    }
    for (const mod in G.modlist) {
        if (!allmods.includes(mod)) {
            allmods.push(mod);
        }
    }
    window.localStorage.setItem('modlist', JSON.stringify(allmods));
    for (const mod in G.modlist) {
        const package = {
            b: {},
            c: {},
            a: {},
            m: {}
        };
        for (const b of G.modlist[mod].buyables) package.b[b] = G.buyables[b].Save();
        for (const c of G.modlist[mod].currencies) package.c[c] = C[c].Save();
        for (const a of G.modlist[mod].ascensions) package.a[a] = G.ascensions[a].Save();
        for (const m of G.modlist[mod].milestones) package.m[m] = G.milestones[m].Save();
        window.localStorage.setItem(mod, JSON.stringify(package));
    }
    //G.log("INFO/SAVE: Successfully saved data!", "#5f8");
    } catch (err) {
        G.log("ERROR/SAVE: " + err.stack, "#faa");
    } 
}

D.Mod = class Mod {
    constructor (name, id, version) {
        this.name = name;
        this.id = id;
        this.version = version;
        this.buyables = [];
        this.currencies = [];
        this.ascensions = [];
        this.milestones = [];
    }
}

G.saveloop = setInterval(function () {
    try {G.Save()} catch (err) {
        G.log("ERROR/SAVE: " + err.stack, "#faa");
        G.errors++;
        if (G.errors >= G.limit) {
            G.log("ERROR/SAVE: ERROR LIMIT EXCEDED, TERMINATING", "#f55");
            clearInterval(G.loop);
            clearInterval(G.saveloop);
        }
    }
}, 30000);

G.Export = function () {
    try {
        G.Save();
        const data = {
            core: JSON.parse(window.localStorage.getItem('core'))
        }
        const modlist = JSON.parse(window.localStorage.getItem('modlist'));
        for (const mod of modlist) {
            data[mod] = JSON.parse(window.localStorage.getItem(mod));
        }
        return btoa(JSON.stringify(data));
    } catch (err) {
        G.log("ERROR/EXPORT: " + err.stack, "#faa");
        return "";
    }
}

G.Import = function (raw) {
    try {
        data = JSON.parse(atob(raw));
        if (data == null || data == '') {
            return;
        }
        window.localStorage.setItem('modlist', JSON.stringify(Object.keys(data)));
        for (const mod in data) {
            window.localStorage.setItem(mod, JSON.stringify(data[mod]));
        }
        alert("Imported Save! Reload the page to take effect.\n(Or wait at least 30 seconds to undo)")
    } catch (err) {
        G.log("ERROR/IMPORT: " + err.stack, "#faa");
    }
}