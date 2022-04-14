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
    return this;
}
/**
 * End initialization of the mod
 * This will trigger the loading of the mod save data
 */
A.EndMod = function () {
    G.log("INIT/MOD: Finished initialization of " + G.modloader, "#afc");
    G.log("INFO/SAVE: Checking for saved game... (modid: " + G.modloader + ")", "#5fc");
    const save = window.localStorage.getItem(G.modloader);
    if (save == null) G.log("WARN/SAVE: No save data found (modid: " + G.modloader + ")", "#cf5");
    G.modloader = null;
}