A
.StartMod(
    "Base", "base", "0.0.0"
)
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
.Table(
    "Absorbers", "absorbers", function () {return true}, "xp"
)
.Buyable(
    "XP Absorber I", "(+1/s xp)", "xp1", new Decimal(10), 1.5, function () {}, 
    "absorbers", function () {return true}, {}, 
    'p', 0, 'p', function () {return new Decimal(1).mul(this.owned)}, function () {return 1}
)
.Buyable(
    "XP Absorber II", "(+5/s xp)", "xp2", new Decimal(100), 1.55, function () {}, 
    "absorbers", function () {return G.level.gte(5)||G.ascensions["lgm"].ascensions.gte(1)||G.ascensions["csg"].ascensions.gte(1)}, {}, 
    'p', 0, 'p', function () {return new Decimal(5).mul(this.owned)}, function () {return 1}
)
.Buyable(
    "XP Absorber III", "(+25/s xp)", "xp3", new Decimal(1500), 1.6, function () {}, 
    "absorbers", function () {return G.level.gte(15)||G.ascensions["lgm"].ascensions.gte(2)||G.ascensions["csg"].ascensions.gte(1)}, {}, 
    'p', 0, 'p', function () {return new Decimal(25).mul(this.owned)}, function () {return 1}
)
.Buyable(
    "XP Absorber IV", "(+125/s xp)", "xp4", new Decimal(20000), 1.65, function () {}, 
    "absorbers", function () {return G.level.gte(30)||G.ascensions["lgm"].ascensions.gte(2)||G.ascensions["csg"].ascensions.gte(1)}, {}, 
    'p', 0, 'p', function () {return new Decimal(125).mul(this.owned)}, function () {return 1}
)
.Buyable(
    "XP Absorber V", "(+625/s xp)", "xp5", new Decimal(250000), 1.7, function () {G.gain = G.gain.add(this.inc)}, 
    "absorbers", function () {return G.level.gte(50)||G.ascensions["lgm"].ascensions.gte(3)||G.ascensions["csg"].ascensions.gte(1)}, {}, 
    'p', 0, 'p', function () {return new Decimal(625).mul(this.owned)}, function () {return 1}
)
.Buyable(
    "XP Accelerator", "(+25% xp)", "xpa", new Decimal(500), 2, function () {},
    "absorbers", function () {return G.level.gte(10)||G.ascensions["lgm"].ascensions.gte(1)||G.ascensions["csg"].ascensions.gte(1)}, {}, 
    'p', 0, 'p', function () {return 0}, function () {return new Decimal(1.25).pow(this.owned)}
)
.Buyable(
    "XP Multiplier", "(+100% xp)", "xpm", new Decimal(10000), 10, function () {},
    "absorbers", function () {return G.level.gte(20)||G.ascensions["lgm"].ascensions.gte(2)||G.ascensions["csg"].ascensions.gte(1)}, {}, 
    'p', 0, 'p', function () {return 0}, function () {return new Decimal(2).pow(this.owned)}
)
//GOLD MINE
.Table(
    "Gold Mines", "mine", function () {return G.ascensions["lgm"].ascensions.gte(1)}, "gold"
)
.Ascension(
    "Learn Gold Mining", "lgm", "gxp", 1e16, "p", function(amt) {return amt.log10().div(new Decimal(2).log10())},
    1, function() {return G.points.gte(1e12)||G.ascensions["csg"].ascensions.gte(1)}, "gold", 1
)
.Buyable(
    "Hand Mine Gold", "(+1 Gold)", "hmg", 1, 1.25, function () {C.gold.amt = C.gold.amt.add(1)}, 
    "mine", function () {return G.ascensions["lgm"].ascensions.gte(1)||G.ascensions["csg"].ascensions.gte(1)}, {}, 
    "gxp", 1, "gold", function () {return 0}, function () {return 1}
)
.Buyable(
    "Gold Miner", "(1/s Gold)", "gmr", 1, 1.8, function () {},
    "mine", function () {return G.ascensions["lgm"].ascensions.gte(1)||G.ascensions["csg"].ascensions.gte(1)}, {},
    "gold", 1, "gold", function () {return this.owned}, function () {return 1}
)
.Buyable(
    "Gold Drill I", "(10/s Gold)", "gd1", 100, 1.6, function () {},
    "mine", function () {return G.ascensions["lgm"].ascensions.gte(1)||G.ascensions["csg"].ascensions.gte(1)&&C.gold.amt.gt(0)}, {},
    "gold", 1, "gold", function () {return new Decimal(10).mul(this.owned)}, function () {return 1}
)
.Buyable(
    "Gold Drill II", "(100/s Gold)", "gd2", 1000, 1.65, function () {},
    "mine", function () {return G.ascensions["lgm"].ascensions.gte(2)&&C.gold.amt.gt(1000)||G.ascensions["csg"].ascensions.gte(1)}, {},
    "gold", 1, "gold", function () {return new Decimal(100).mul(this.owned)}, function () {return 1}
)
.Buyable(
    "Gold Drill III", "(1000/s Gold)", "gd3", 10000, 1.7, function () {},
    "mine", function () {return G.ascensions["lgm"].ascensions.gte(3)&&C.gold.amt.gt(100000)||G.ascensions["csg"].ascensions.gte(1)}, {},
    "gold", 1, "gold", function () {return new Decimal(1000).mul(this.owned)}, function () {return 1}
)
.Buyable(
    "Gold Mining Training", "(+50% Gold)", "gmt", 5, 1.4, function () {},
    "mine", function () {return G.ascensions["lgm"].ascensions.gte(1)||G.ascensions["csg"].ascensions.gte(1)}, {}, 
    "gxp", 1, "gold", function () {return 0}, function () {return new Decimal(1.5).pow(this.owned)}
)
.Buyable(
    "Golden Accelerator", "(+50% XP)", "gac", 250, 2, function () {},
    "mine", function () {return G.ascensions["lgm"].ascensions.gte(1)&&C.gold.amt.gt(100)||G.ascensions["csg"].ascensions.gte(1)}, {},
    "gold", 1, "p", function () {return 0}, function () {return new Decimal(1.5).pow(this.owned)}
)
.Buyable(
    "Golden Augment", "(+75% Gold)", "ga", 1000, 4, function () {},
    "mine", function () {return G.ascensions["lgm"].ascensions.gte(2)&&C.gold.amt.gt(750)||G.ascensions["csg"].ascensions.gte(1)}, {},
    "gold", 1, "gold", function () {return 0}, function () {return new Decimal(1.75).pow(this.owned)}
)
//Cargo Center
.Ascension(
    "Ship Goods", "csg", "crates", 1e18, "gold", function (amt) {return amt.log10().div(new Decimal(3).log10())},
    1, function() {return C.gold.amt.gte(1e14)}, "cargo", 2
)
.Milestone(
    "Small Cargo Post", "1 Crates: +20% xp", "csp1", function () {return G.panels.cargo.unlocked},
    function () {return C.crates.amt.gte(1)}, "cargo", 2, false, function () {}, "#110700", "#530",
    "p", function () {return 0}, function () {return new Decimal(1.2)} 
)
.Milestone(
    "Medium Cargo Post", "3 Crates: +40% gold", "csp2", function () {return C.crates.amt.gte(1)},
    function () {return C.crates.amt.gte(3)}, "cargo", 2, false, function () {}, "#110700", "#530",
    "gold", function () {return 0}, function () {return new Decimal(1.4)} 
)
.Milestone(
    "Large Cargo Post", "5 Crates: +60% xp", "csp3", function () {return C.crates.amt.gte(3)},
    function () {return C.crates.amt.gte(5)}, "cargo", 2, false, function () {}, "#110700", "#530",
    "p", function () {return 0}, function () {return new Decimal(1.6)} 
)
.Milestone(
    "Small Cargo Station", "10 Crates: +80% gold", "csp4", function () {return C.crates.amt.gte(5)},
    function () {return C.crates.amt.gte(10)}, "cargo", 2, false, function () {}, "#110700", "#530",
    "gold", function () {return 0}, function () {return new Decimal(1.8)} 
)
.Milestone(
    "Medium Cargo Station", "25 Crates: +100% xp", "csp5", function () {return C.crates.amt.gte(10)},
    function () {return C.crates.amt.gte(25)}, "cargo", 2, false, function () {}, "#110700", "#530",
    "p", function () {return 0}, function () {return new Decimal(2)} 
)
.Milestone(
    "Large Cargo Station", "50 Crates: +120% gold", "csp6", function () {return C.crates.amt.gte(25)},
    function () {return C.crates.amt.gte(50)}, "cargo", 2, false, function () {}, "#110700", "#530",
    "gold", function () {return 0}, function () {return new Decimal(2.2)} 
)
.Milestone(
    "Small Cargo Warehouse", "100 Crates: +140% xp", "csp7", function () {return C.crates.amt.gte(50)},
    function () {return C.crates.amt.gte(100)}, "cargo", 2, false, function () {}, "#110700", "#530",
    "p", function () {return 0}, function () {return new Decimal(2.4)} 
)
.Milestone(
    "Medium Cargo Warehouse", "250 Crates: +160% gold", "csp8", function () {return C.crates.amt.gte(100)},
    function () {return C.crates.amt.gte(250)}, "cargo", 2, false, function () {}, "#110700", "#530",
    "gold", function () {return 0}, function () {return new Decimal(2.6)} 
)
.Milestone(
    "Large Cargo Warehouse", "500 Crates: +180% xp", "csp9", function () {return C.crates.amt.gte(250)},
    function () {return C.crates.amt.gte(500)}, "cargo", 2, false, function () {}, "#110700", "#530",
    "p", function () {return 0}, function () {return new Decimal(2.8)} 
)
.Milestone(
    "Cargo Supercenter", "1000 Crates: +200% gold", "csp10", function () {return C.crates.amt.gte(500)},
    function () {return C.crates.amt.gte(1000)}, "cargo", 2, false, function () {}, "#110700", "#530",
    "gold", function () {return 0}, function () {return new Decimal(3)} 
)
.EndMod();