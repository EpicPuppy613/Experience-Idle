A
//PANELS
.Panel(
    "Xp Valley", "xp",
    "#022", "#033", "#dff", "#0ee", function () {return true}
)
.Panel(
    "Gold Mine", "gold",
    "#220", "#330", "#ffd", "#ee0", function () {return G.points.gte(1e12)}
)
.Panel(
    "Cargo Center", "cargo",
    "#210", "#320", "#fed", "#fa0", function () {return C.gold.amt.gte(1e14)}
)
.Panel(
    "Laboratory", "lab",
    "#020", "#030", "#dfd", "", function () {return false}
)
.Panel(
    "Factory", "factory",
    "#200", "#300", "#fdd", "", function () {return false}
)
.Panel(
    "Observatory", "observe",
    "#102", "#203", "#edf", "", function () {return false}
)
.Panel(
    "Space Center", "space",
    "#111", "#222", "#ddd", "", function () {return false}
)
.Panel(
    "Altar", "altar",
    "#202", "#303", "#fdf", "", function () {return false}
)
.Panel(
    "Nexus", "nexus",
    "#002", "#003", "#ddf", "", function () {return false}
)
.Panel(
    "Universe", "universe",
    "#000", "#111", "#bbb", "", function () {return false}
)
.Panel(
    "Multiverse", "multiverse",
    "#012", "#023", "#def", "", function () {return false}
)
//CURRENCIES
.Currency(
    "Gold XP", "gxp", 0, "gold", function () {return G.ascensions["lgm"].ascensions.gte(1)||G.ascensions["csg"].ascensions.gte(1)}, 1
)
.Currency(
    "Gold", "gold", 0, "gold", function () {return G.ascensions["lgm"].ascensions.gte(1)||G.ascensions["csg"].ascensions.gte(1)}, 1
)
.Currency(
    "Crates", "crates", 0, "cargo", function () {return G.ascensions["csg"].ascensions.gte(1)}, 2
)
//XP VALLEY
.Buyable(
    "XP Absorber I", "absorbs xp (+1/s)", "xp1", new Decimal(10), 1.5, function () {}, 
    "xp", function () {return true}, 
    {"inc": new Decimal(1)}, 
    'p', 0, 'p', function () {return this.inc.mul(this.owned)}, function () {return 1}
)
.Buyable(
    "XP Absorber II", "absorbs more xp (+5/s)", "xp2", new Decimal(100), 1.55, function () {}, 
    "xp", function () {return G.level.gte(5)||G.ascensions["lgm"].ascensions.gte(1)||G.ascensions["csg"].ascensions.gte(1)}, 
    {"inc": new Decimal(5)}, 
    'p', 0, 'p', function () {return this.inc.mul(this.owned)}, function () {return 1}
)
.Buyable(
    "XP Absorber III", "absorbs even more xp (+25/s)", "xp3", new Decimal(1500), 1.6, function () {}, 
    "xp", function () {return G.level.gte(15)||G.ascensions["lgm"].ascensions.gte(2)||G.ascensions["csg"].ascensions.gte(1)}, 
    {"inc": new Decimal(25)}, 
    'p', 0, 'p', function () {return this.inc.mul(this.owned)}, function () {return 1}
)
.Buyable(
    "XP Absorber IV", "absorbs a lot of xp (+125/s)", "xp4", new Decimal(20000), 1.65, function () {}, 
    "xp", function () {return G.level.gte(30)||G.ascensions["lgm"].ascensions.gte(2)||G.ascensions["csg"].ascensions.gte(1)}, 
    {"inc": new Decimal(125)}, 
    'p', 0, 'p', function () {return this.inc.mul(this.owned)}, function () {return 1}
)
.Buyable(
    "XP Absorber V", "absorbs a ton of xp (+625/s)", "xp5", new Decimal(250000), 1.7, function () {G.gain = G.gain.add(this.inc)}, 
    "xp", function () {return G.level.gte(50)||G.ascensions["lgm"].ascensions.gte(3)||G.ascensions["csg"].ascensions.gte(1)}, 
    {"inc": new Decimal(625)}, 
    'p', 0, 'p', function () {return this.inc.mul(this.owned)}, function () {return 1}
)
.Buyable(
    "XP Accelerator", "increases xp absorbtion rate (+25%)", "xpa", new Decimal(500), 2, function () {},
    "xp", function () {return G.level.gte(10)||G.ascensions["lgm"].ascensions.gte(1)||G.ascensions["csg"].ascensions.gte(1)}, {}, 
    'p', 0, 'p', function () {return 0}, function () {return new Decimal(1.25).pow(this.owned)}
)
.Buyable(
    "XP Multiplier", "increases xp absorbtion rate (+100%)", "xpm", new Decimal(10000), 10, function () {},
    "xp", function () {return G.level.gte(20)||G.ascensions["lgm"].ascensions.gte(2)||G.ascensions["csg"].ascensions.gte(1)}, {}, 
    'p', 0, 'p', function () {return 0}, function () {return new Decimal(2).pow(this.owned)}
)
//GOLD MINE
.Ascension(
    "Learn Gold Mining", "lgm", "gxp", 1e16, "p", function(amt) {return amt.log10().div(new Decimal(2).log10())},
    1, function() {return G.points.gte(1e12)||G.ascensions["csg"].ascensions.gte(1)}, "gold", 1
)
.Buyable(
    "Hand Mine Gold", "hand mine some gold using your gold knowledge (1)", "hmg", 1, 1.25, function () {C.gold.amt = C.gold.amt.add(1)}, 
    "gold", function () {return G.ascensions["lgm"].ascensions.gte(1)||G.ascensions["csg"].ascensions.gte(1)}, {}, 
    "gxp", 1, "gold", function () {return 0}, function () {return 1}
)
.Buyable(
    "Gold Miner", "hire a gold miner, much less efficient than a machine (1/s)", "gmr", 1, 1.8, function () {},
    "gold", function () {return G.ascensions["lgm"].ascensions.gte(1)||G.ascensions["csg"].ascensions.gte(1)}, {},
    "gold", 1, "gold", function () {return this.owned}, function () {return 1}
)
.Buyable(
    "Gold Drill I", "a drill to drill gold (10/s)", "gd1", 100, 1.6, function () {},
    "gold", function () {return G.ascensions["lgm"].ascensions.gte(1)||G.ascensions["csg"].ascensions.gte(1)&&C.gold.amt.gt(0)}, {},
    "gold", 1, "gold", function () {return new Decimal(10).mul(this.owned)}, function () {return 1}
)
.Buyable(
    "Gold Drill II", "a drill to drill lots of gold (100/s)", "gd2", 1000, 1.65, function () {},
    "gold", function () {return G.ascensions["lgm"].ascensions.gte(2)||G.ascensions["csg"].ascensions.gte(1)&&C.gold.amt.gt(1000)}, {},
    "gold", 1, "gold", function () {return new Decimal(100).mul(this.owned)}, function () {return 1}
)
.Buyable(
    "Gold Drill III", "a drill to drill tons of gold (1000/s)", "gd3", 10000, 1.7, function () {},
    "gold", function () {return G.ascensions["lgm"].ascensions.gte(3)||G.ascensions["csg"].ascensions.gte(1)&&C.gold.amt.gt(100000)}, {},
    "gold", 1, "gold", function () {return new Decimal(1000).mul(this.owned)}, function () {return 1}
)
.Buyable(
    "Gold Mining Training", "train your workers to mine more efficiently (+50%)", "gmt", 5, 1.4, function () {},
    "gold", function () {return G.ascensions["lgm"].ascensions.gte(1)||G.ascensions["csg"].ascensions.gte(1)}, {}, 
    "gxp", 1, "gold", function () {return 0}, function () {return new Decimal(1.5).pow(this.owned)}
)
.Buyable(
    "Golden Accelerator", "accelerates xp absorption (+50%)", "gac", 250, 2, function () {},
    "gold", function () {return G.ascensions["lgm"].ascensions.gte(1)||G.ascensions["csg"].ascensions.gte(1)&&C.gold.amt.gt(100)}, {},
    "gold", 1, "p", function () {return 0}, function () {return new Decimal(1.5).pow(this.owned)}
)
.Buyable(
    "Golden Augment", "module to speed up gold mining (+75%)", "ga", 1000, 4, function () {},
    "gold", function () {return G.ascensions["lgm"].ascensions.gte(2)||G.ascensions["csg"].ascensions.gte(1)&&C.gold.amt.gt(750)}, {},
    "gold", 1, "gold", function () {return 0}, function () {return new Decimal(1.75).pow(this.owned)}
)
//Cargo Center
.Ascension(
    "Ship Goods", "csg", "crates", 1e18, "gold", function (amt) {return amt.log10().div(new Decimal(3).log10())},
    1, function() {return C.gold.amt.gte(1e14)}, "cargo", 2
)
.Milestone(
    "Small Cargo Post", "1 Crates: +25% xp", "csp1", function () {return C.gold.amt.gte(1e14)},
    function () {return C.crates.amt.gte(1)}, "cargo", 2, false, function () {}, "#110700", "#530",
    "p", function () {return 0}, function () {return new Decimal(1.25)} 
)