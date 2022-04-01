A
    //PANELS
    .Panel(new D.Panel(
        "Xp Valley", "xp",
        "#022", "#033", "#dff", "#0ee", function () {return true}
    ))
    .Panel(new D.Panel(
        "Gold Mine", "gold",
        "#220", "#330", "#ffd", "", function () {return G.points.gte(1e12)}
    ))
    .Panel(new D.Panel(
        "Cargo Center", "cargo",
        "#210", "#320", "#fed", "", function () {return false}
    ))
    .Panel(new D.Panel(
        "Laboratory", "lab",
        "#020", "#030", "#dfd", "", function () {return false}
    ))
    .Panel(new D.Panel(
        "Factory", "factory",
        "#200", "#300", "#fdd", "", function () {return false}
    ))
    .Panel(new D.Panel(
        "Obseravatory", "observe",
        "#102", "#203", "#edf", "", function () {return false}
    ))
    .Panel(new D.Panel(
        "Space Center", "space",
        "#111", "#222", "#ddd", "", function () {return false}
    ))
    .Panel(new D.Panel(
        "Altar", "altar",
        "#202", "#303", "#fdf", "", function () {return false}
    ))
    .Panel(new D.Panel(
        "Nexus", "nexus",
        "#002", "#003", "#ddf", "", function () {return false}
    ))
    .Panel(new D.Panel(
        "Universe", "universe",
        "#000", "#111", "#bbb", "", function () {return false}
    ))
    .Panel(new D.Panel(
        "Multiverse", "multiverse",
        "#012", "#023", "#def", "", function () {return false}
    ))
    //CURRENCIES
    .Currency(new D.Currency(
        "Gold XP", "gxp", 0, "gold", function () {return G.ascensions["lgm"].ascensions.gte(1)}, 1
    ))
    .Currency(new D.Currency(
        "Gold", "gold", 0, "gold", function () {return G.ascensions["lgm"].ascensions.gte(1)}, 1
    ))
    //XP VALLEY
    .Buyable(new D.Buyable(
        "XP Absorber I", "absorbs xp", "xp1", new Decimal(10), 1.6, 
        function () {G.gain = G.gain.add(this.inc)}, 
        "xp", function () {return true}, {"inc": new Decimal(2)}, 'p', 0
    ))
    .Buyable(new D.Buyable(
        "XP Absorber II", "absorbs more xp", "xp2", new Decimal(100), 1.6,
        function () {G.gain = G.gain.add(this.inc)}, 
        "xp", function () {return G.level.gte(5)||G.ascensions["lgm"].ascensions.gte(1)}, {"inc": new Decimal(10)}, 'p', 0
    ))
    .Buyable(new D.Buyable(
        "XP Absorber III", "absorbs even more xp", "xp3", new Decimal(1500), 1.6,
        function () {G.gain = G.gain.add(this.inc)}, 
        "xp", function () {return G.level.gte(15)||G.ascensions["lgm"].ascensions.gte(2)}, {"inc": new Decimal(50)}, 'p', 0
    ))
    .Buyable(new D.Buyable(
        "XP Absorber IV", "absorbs a lot of xp", "xp4", new Decimal(15000), 1.6,
        function () {G.gain = G.gain.add(this.inc)}, 
        "xp", function () {return G.level.gte(30)||G.ascensions["lgm"].ascensions.gte(2)}, {"inc": new Decimal(250)}, 'p', 0
    ))
    .Buyable(new D.Buyable(
        "XP Absorber V", "absorbs a ton of xp", "xp5", new Decimal(200000), 1.6,
        function () {G.gain = G.gain.add(this.inc)}, 
        "xp", function () {return G.level.gte(50)||G.ascensions["lgm"].ascensions.gte(3)}, {"inc": new Decimal(1250)}, 'p', 0
    ))
    .Buyable(new D.Buyable(
        "XP Accelerator", "increases xp absorbtion rate", "xpa", new Decimal(250), 2,
        function () {
            for (var x = 1; x <= 5; x++) {
                var old = G.buyables["xp" + x].inc;
                G.buyables["xp" + x].inc = G.buyables["xp" + x].inc.mul(1.5);
                G.gain.add((G.buyables["xp" + x].inc - old) * G.buyables["xp" + x].owned);
            }
        },
        "xp", function () {return G.level.gte(10)||G.ascensions["lgm"].ascensions.gte(1)}, {}, 'p', 0
    ))
    .Buyable(new D.Buyable(
        "XP Multiplier", "increases xp absorbtion rate", "xpm", new Decimal(1000), 10,
        function () {
            for (var x = 1; x <= 5; x++) {
                var old = G.buyables["xp" + x].inc;
                G.buyables["xp" + x].inc = G.buyables["xp" + x].inc.mul(2);
                G.gain.add((G.buyables["xp" + x].inc - old) * G.buyables["xp" + x].owned);
            }
        },
        "xp", function () {return G.level.gte(20)||G.ascensions["lgm"].ascensions.gte(2)}, {}, 'p', 0
    ))
    //GOLD MINE
    .Ascension(new D.Ascension(
        "Learn Gold Mining", "lgm", "gxp", 1e16, "p", function(amt) {return amt.log10().div(new Decimal(2.5).log10())},
        1, function() {return G.points.gte(1e12)}, "gold", 1
    ))