A
    //PANELS
    .Panel(new D.Panel(
        "Xp Valley", "xp",
        "#022", "#033", "#dff", "#0ee", false
    ))
    .Panel(new D.Panel(
        "Gold Mine", "gold",
        "#220", "#330", "#ffd", "", false
    ))
    .Panel(new D.Panel(
        "Cargo Center", "cargo",
        "#210", "#320", "#fed", "", true
    ))
    .Panel(new D.Panel(
        "Laboratory", "lab",
        "#020", "#030", "#dfd", "", true
    ))
    .Panel(new D.Panel(
        "Factory", "factory",
        "#200", "#300", "#fdd", "", true
    ))
    .Panel(new D.Panel(
        "Obseravatory", "observe",
        "#102", "#203", "#edf", "", true
    ))
    .Panel(new D.Panel(
        "Space Center", "space",
        "#111", "#222", "#ddd", "", true
    ))
    .Panel(new D.Panel(
        "Altar", "altar",
        "#202", "#303", "#fdf", "", true
    ))
    .Panel(new D.Panel(
        "Nexus", "nexus",
        "#002", "#003", "#ddf", "", true
    ))
    .Panel(new D.Panel(
        "Universe", "universe",
        "#000", "#111", "#bbb", "", true
    ))
    .Panel(new D.Panel(
        "Multiverse", "multiverse",
        "#012", "#023", "#def", "", true
    ))
    //XP VALLEY
    .Buyable(new D.Buyable(
        "XP Absorber I", "absorbs xp", "xp1", new Decimal(10), 1.5, 
        function () {G.gain = G.gain.add(this.inc)}, 
        "xp", function () {return true}, {"inc": new Decimal(2)}, 'p'
    ), "xp1")
    .Buyable(new D.Buyable(
        "XP Absorber II", "absorbs more xp", "xp2", new Decimal(100), 1.5, 
        function () {G.gain = G.gain.add(this.inc)}, 
        "xp", function () {return G.level.gte(5)}, {"inc": new Decimal(20)}, 'p'
    ), "xp2")
    .Buyable(new D.Buyable(
        "XP Absorber III", "absorbs even more xp", "xp3", new Decimal(1500), 1.5,
        function () {G.gain = G.gain.add(this.inc)}, 
        "xp", function () {return G.level.gte(15)}, {"inc": new Decimal(200)}, 'p'
    ), "xp3")
    .Buyable(new D.Buyable(
        "XP Absorber IV", "absorbs a lot of xp", "xp4", new Decimal(15000), 1.5,
        function () {G.gain = G.gain.add(this.inc)}, 
        "xp", function () {return G.level.gte(30)}, {"inc": new Decimal(2000)}, 'p'
    ), "xp4")
    .Buyable(new D.Buyable(
        "XP Absorber V", "absorbs a ton of xp", "xp5", new Decimal(200000), 1.5,
        function () {G.gain = G.gain.add(this.inc)}, 
        "xp", function () {return G.level.gte(50)}, {"inc": new Decimal(20000)}, 'p'
    ), "xp5")
    .Buyable(new D.Buyable(
        "XP Accelerator", "increases xp absorbtion rate", "xpa", new Decimal(250), 2,
        function () {
            for (var x = 1; x <= 5; x++) {
                var old = G.buyables["xp" + x].inc;
                G.buyables["xp" + x].inc = G.buyables["xp" + x].inc.mul(1.5);
                G.gain.add((G.buyables["xp" + x].inc - old) * G.buyables["xp" + x].owned);
            }
        },
        "xp", function () {return G.level.gte(10)}, {}, 'p'
    ), "xpa")
    .Buyable(new D.Buyable(
        "XP Multiplier", "increases xp absorbtion rate", "xpm", new Decimal(1000), 10,
        function () {
            for (var x = 1; x <= 5; x++) {
                var old = G.buyables["xp" + x].inc;
                G.buyables["xp" + x].inc = G.buyables["xp" + x].inc.mul(2);
                G.gain.add((G.buyables["xp" + x].inc - old) * G.buyables["xp" + x].owned);
            }
        },
        "xp", function () {return G.level.gte(20)}, {}, 'p'
    ), "xpm")