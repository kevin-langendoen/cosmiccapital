/*All this code is copyright thisisnotkj, kj and Kevin Langendoen, 2022-2023.
    -With help from Paradox.
*/

var gameSave = null;
var purchaseAmount = 1;

var Credits = 0;

var CreditsPerSecond = 0; //total credits per second

var totalCostReduction = 100; // if 100, user pays 100% of price
var globalProductionModifier = 100; // adds extra % production if any

var ClickValue = 1; // mouse click value

var CosmicClicksDescription = "Cosmic Clicks allow you to tap into the power of the cosmos to increase ₵REDITS production";
var CosmicClicksCredsProduced = 0; //total amount of credits produced by cosmic clicks
var CosmicClicks = 0; //amount of cosmic clicks owned
var CosmicClicksValue = 0.25; //amount of credits pre second per each cosmic click
var CosmicClicksPrice = 10; // credit price of cosmic click
var CosmicClicksTotal = CosmicClicks * CosmicClicksValue; //how many credits cosmic clicks are producing in total
var CosmicClicksPriceMult = 1.151; // price goes up by 120% each purchase
var CosmicClicksTotalCostMultiplied = 0; //price * purchaseAmount

var CosmicOvensDescription = "Cosmic Ovens are advanced baking devices that use cosmic energy to cook ₵REDITS faster";
var CosmicOvensCredsProduced = 0;
var CosmicOvens = 0;
var CosmicOvensValue = 1;
var CosmicOvensPrice = 100;
var CosmicOvensTotal = CosmicOvens * CosmicOvensValue;
var CosmicOvensPriceMult = 1.151;
var CosmicOvensTotalCostMultiplied = 0;

var InterstellarMixersDescription = "A high-tech mixing machine that uses advanced algorithms to optimize ₵REDITS creation";
var InterstellarMixersCredsProduced = 0;
var InterstellarMixers = 0;
var InterstellarMixersValue = 10; // amt of creds / sec
var InterstellarMixersPrice = 1150;
var InterstellarMixersTotal = InterstellarMixers * InterstellarMixersValue;
var InterstellarMixersPriceMult = 1.151;
var InterstellarMixersTotalCostMultiplied = 0;

var AsteroidMinersDescription = "An automated mining machine that extracts valuable resources from asteroids to be used in ₵REDITS production";
var AsteroidMinersCredsProduced = 0;
var AsteroidMiners = 0;
var AsteroidMinersValue = 100;
var AsteroidMinersPrice = 4500;
var AsteroidMinersTotal = AsteroidMiners * AsteroidMinersValue;
var AsteroidMinersPriceMult = 1.151;
var AsteroidMinersTotalCostMultiplied = 0;

localStorage.clear(); //gamesave clearing for development purposes

$(document).ready(function(){
    // Get the width of the buymenuwrap element
    let buymenuwrapWidth = document.getElementById("buymenuwrap").offsetWidth;
    // Set the left property of the spaceshipwrap element based on the width of the buymenuwrap element
    document.getElementById("spaceshipwrap").style.left = `calc(63% - ${buymenuwrapWidth}px)`;

    loadSaveData(); // loads game save if any

    if(Credits > 4){ // dont display clickme text if user already played
        $("#clickme").css("display", "none");
        $("#clickme").remove();
    }

    if (/Mobi|Android/i.test(navigator.userAgent)) { //if on mobile change text
        $("#clickme").html("Tap me!");
    }

    clicksFunctions(); //initializes hover effects and onclick functions
    oneSecondLoop(); //starts 1 second loop
    tenthSecondLoop(); // starts .1 second loop
    fifteenSecondLoop(); // 15 second loop for automatic game saving

    //make into button toggle
    updateTotalCost();

}); //end doc onready

function loadSaveData(){
    if(localStorage.getItem("gameSave") != null || localStorage.getItem("gameSave") != undefined){
        gameSave = JSON.parse(localStorage.getItem("gameSave"))
        Credits = gameSave.credits;
        CreditsPerSecond = gameSave.creditspersecond;
        totalCostReduction = gameSave.totalcostreduction;
        globalProductionModifier = gameSave.globalproductionmodifier; //creds and modifiers load

        ClickValue = gameSave.clickvalue; //user click value load

        //cosmic clicks loading
        CosmicClicksCredsProduced = gameSave.cosmicclickscredsproduced;
        CosmicClicks =  gameSave.cosmicclicks;
        CosmicClicksValue = gameSave.cosmicclicksvalue;
        CosmicClicksPrice = gameSave.cosmicclicksprice;
        CosmicClicksTotal = CosmicClicks * CosmicClicksValue;
        CosmicClicksPriceMult = gameSave.cosmicclickspricemult;

        //cosmic oven loading
        CosmicOvensCredsProduced = gameSave.cosmicovenscredsproduced;
        CosmicOvens = gameSave.cosmicovens;
        CosmicOvensValue = gameSave.cosmicovensvalue;
        CosmicOvensPrice = gameSave.cosmicovensprice;
        CosmicOvensTotal = CosmicOvens * CosmicOvensValue;
        CosmicOvensPriceMult = gameSave.cosmicovenspricemult;

        //interstellar mixer loading
        InterstellarMixersCredsProduced = gameSave.interstellarmixerscredsproduced;
        InterstellarMixers = gameSave.interstellarmixers;
        InterstellarMixersValue = gameSave.interstellarmixersvalue;
        InterstellarMixersPrice = gameSave.interstellarmixersprice;
        InterstellarMixersTotal = InterstellarMixers * InterstellarMixersValue;
        InterstellarMixersPriceMult = gameSave.interstellarmixerspricemult;

        //asteroid miners loading
        AsteroidMinersCredsProduced = gameSave.asteroidminerscredsproduced ??= 0;
        AsteroidMiners = gameSave.asteroidminers ??= 0;
        AsteroidMinersValue = gameSave.asteroidminersvalue ??= 100;
        AsteroidMinersPrice = gameSave.asteroidminersprice ??= 4500;
        AsteroidMinersTotal = AsteroidMiners * AsteroidMinersValue;
        AsteroidMinersPriceMult = gameSave.asteroidminerspricemult ??= 1.151;

    }
}

function saveGameData(){
    const gameSave = {
        credits : Credits,
        totalcostreduction: totalCostReduction,
        creditspersecond: CreditsPerSecond,
        globalproductionmodifier: globalProductionModifier, //personal save

        clickvalue : ClickValue, //user click value

        //cosmic clicks saving
        cosmicclickscredsproduced : CosmicClicksCredsProduced,
        cosmicclicks : CosmicClicks,
        cosmicclicksvalue : CosmicClicksValue,
        cosmicclicksprice : CosmicClicksPrice,
        cosmicclickspricemult : CosmicClicksPriceMult,

        //cosmic oven saving
        cosmicovenscredsproduced : CosmicOvensCredsProduced,
        cosmicovens : CosmicOvens,
        cosmicovensvalue : CosmicOvensValue,
        cosmicovensprice : CosmicOvensPrice,
        cosmicovenspricemult : CosmicOvensPriceMult,

        //interstellar mixer saving
        interstellarmixerscredsproduced : InterstellarMixersCredsProduced,
        interstellarmixers : InterstellarMixers,
        interstellarmixersvalue : InterstellarMixersValue,
        interstellarmixersprice : InterstellarMixersPrice,
        interstellarmixerspricemult : InterstellarMixersPriceMult,

        //asteroid miner saving
        asteroidminerscredsproduced : AsteroidMinersCredsProduced, 
        asteroidminers : AsteroidMiners,
        asteroidminersvalue : AsteroidMinersValue,
        asteroidminersprice : AsteroidMinersPrice,
        asteroidminerspricemult: AsteroidMinersPriceMult,
    }
    localStorage.setItem("gameSave",JSON.stringify(gameSave));
};

function updateCredsDisplay(){ //updates text
    $("#credits").html(formatNumber(Credits));
    $("#creditspersecond").html(formatNumber(CreditsPerSecond))
}

function updateCreditsPerSecond(){
    let val = 0;
    //cosmic clicks
    val += CosmicClicksTotal;
    val += CosmicOvensTotal;
    val += InterstellarMixersTotal;
    val += AsteroidMinersTotal;

    CreditsPerSecond = val;

    document.title = `₵REDITS: ${formatNumber(Credits)} | Cosmic Capital`;
}

var calc = 0; //calc variable
var cctots = 0; //cosmic clicks adder until above 1.0
var cotots = 0; //cosmic oven adders until above 1.0
function addCreds(){
    if(document.hasFocus()){ // can split into ten because loops run at
        //cosmic clicks
        calc = 0;
        calc = CosmicClicksTotal / 10;
        cctots += calc;
        if (cctots >= 1.00)  {
            cctots = Math.round(cctots);
            Credits += cctots;
            CosmicClicksCredsProduced += cctots;
            cctots = 0;
        }
        //cosmic ovens
        calc = 0;
        calc = CosmicOvensTotal / 10;
        cotots += calc;
        if (cotots >= 1.00){
            cotots = Math.round(cotots);
            Credits += cotots;
            CosmicOvensCredsProduced += cotots;
            cotots = 0;
        }
        //interstellar mixers
        calc = 0;
        calc = InterstellarMixersTotal / 10; // no need for adding as it will always be above 1
        calc = Math.round(calc)
        Credits += calc;
        InterstellarMixersCredsProduced += calc;

        // asteroid miners
        calc = 0;
        calc = AsteroidMinersTotal / 10;
        calc = Math.round(calc)
        Credits += calc;
        AsteroidMinersCredsProduced += calc;

        // new item
        calc = 0;
    } else{ //in background loop slows down to once per second so no need to divide by 10
        //cosmic clicks
        cctots += CosmicClicksTotal;
        if (cctots >= 1.00)  {
            cctots = Math.round(cctots);
            Credits += cctots;
            CosmicClicksCredsProduced += cctots;
            cctots = 0;
        }

        //cosmic ovens
        cotots += CosmicOvensTotal;
        if (cotots >= 1.00){
            cotots = Math.round(cotots);
            Credits += cotots;
            CosmicOvensCredsProduced += cotots;
            cotots = 0;
        }
        //interstellar mixers
        Credits += InterstellarMixersTotal;
        InterstellarMixersCredsProduced += calc;
        // asteroid miners
        Credits += AsteroidMinersTotal;
        AsteroidMinersCredsProduced += calc;

        // new item

    }
};

function oneSecondLoop(){ //animates the keyframes for spaceship
    var imgCount = 2;
    setInterval(() => {
        $("#spaceship").attr('src', `./img/Main-Ship/mainshipbasefullhp${imgCount}.png`);
        if(imgCount < 4){
            imgCount += 1;
        } else{
            imgCount = 2;
        }
        updateCreditsPerSecond();
    }, 1000);
}

function tenthSecondLoop(){
    setInterval(() => {
        checkBuyableBorder();
        addCreds();
        updateCredsDisplay();
    }, 100);
}

function fifteenSecondLoop(){
    setInterval(() => {
        saveGameData();// saving gamestate every 10 seconds
    }, 15000);
}

function checkBuyableBorder(){
    if (Credits >= CosmicClicksTotalCostMultiplied ){
        $(".cosmicclicksimgwrap").css("border-color", "rgb(166, 32, 255)")
    } else{
       if($(".cosmicclicksimgwrap").css("border-color") != "rgb(56, 0, 94)"){
            $(".cosmicclicksimgwrap").css("border-color", "rgb(56, 0, 94)")
       }
    }
    //cosmic ovens
    if (CosmicOvens < 1 && Credits < (CosmicOvensPrice / 2) && $("#buymenu2").hasClass("unlockedItem") == false)
    {
        $("#buymenu2").addClass("hidebuymenuitem")
        $("#buymenu2").children("p").html("???")
    } else if ( $("#buymenu2").hasClass("hidebuymenuitem") ){
        $("#buymenu2").removeClass("hidebuymenuitem");
        $("#buymenu2").addClass("unlockedItem");
        $("#buymenu2").children(".buymenutxt").html(`Cosmic Ovens: <var class="buymenuvartxt cosmicovenamt">${CosmicOvens}</var>`)
        $("#buymenu2").children(".buymenutxt2").html(`Cost: <var id="cosmicovensprice" class="buymenuvartxt">${formatNumber(CosmicOvensTotalCostMultiplied)}</var> ₵REDITS`)
    }
    if (Credits >= CosmicOvensTotalCostMultiplied){
        $(".cosmicovensimgwrap").css("border-color", "rgb(166, 32, 255)")
    }else{
        if($(".cosmicovensimgwrap").css("border-color") != "rgb(56, 0, 94)"){
            $(".cosmicovensimgwrap").css("border-color", "rgb(56, 0, 94)")
       }
    } 
    //interstellarmixers
    if (InterstellarMixers < 1 && Credits < (InterstellarMixersPrice / 2) && $("#buymenu3").hasClass("unlockedItem") == false)
    {
        $("#buymenu3").addClass("hidebuymenuitem")
        $("#buymenu3").children("p").html("???")
    } else if ($("#buymenu3").hasClass("hidebuymenuitem")){
        $("#buymenu3").removeClass("hidebuymenuitem");
        $("#buymenu3").addClass("unlockedItem");
        $("#buymenu3").children(".buymenutxt").html(`Interstellar Mixers: <var class="buymenuvartxt interstellarmixersamt">${InterstellarMixers}</var>`);
        $("#buymenu3").children(".buymenutxt2").html(`Cost: <var id="interstellarmixersprice" class="buymenuvartxt">${formatNumber(InterstellarMixersTotalCostMultiplied)}</var> ₵REDITS`)
    }
    if (Credits >= InterstellarMixersTotalCostMultiplied){
        $(".interstellarmixersimgwrap").css("border-color", "rgb(166, 32, 255)")
    }else{
        if($(".interstellarmixersimgwrap").css("border-color") != "rgb(56, 0, 94)"){
            $(".interstellarmixersimgwrap").css("border-color", "rgb(56, 0, 94)")
       }
    }
    //asteroid miners
    if (AsteroidMiners < 1 && Credits < (AsteroidMinersPrice / 2) && $("#buymenu4").hasClass("unlockedItem") == false)
    {
        $("#buymenu4").addClass("hidebuymenuitem");
        $("#buymenu4").children("p").html("???");
    } else if ($("#buymenu4").hasClass("hidebuymenuitem" )){
        $("#buymenu4").removeClass("hidebuymenuitem");
        $("#buymenu4").addClass("unlockedItem");
        $("#buymenu4").children(".buymenutxt").html(`Asteroid Miners: <var class="buymenuvartxt asteroidminersamt">${AsteroidMiners}</var>`)
        $("#buymenu4").children(".buymenutxt2").html(`Cost: <var id="asteroidminersprice" class="buymenuvartxt">${formatNumber(AsteroidMinersTotalCostMultiplied)}</var> ₵REDITS`)
    }
    if (Credits >= AsteroidMinersTotalCostMultiplied){
        $(".asteroidminersimgwrap").css("border-color", "rgb(166, 32, 255)")
    }else{
        if($(".asteroidminersimgwrap").css("border-color") != "rgb(56, 0, 94)"){
            $(".asteroidminersimgwrap").css("border-color", "rgb(56, 0, 94)")
       }
    }
}

function isBuyable(item){
    let itemprice = eval(item)
    if(Credits >= itemprice){
        return true
    } else{
        return false
    }
}

function highlightPurchaseAmount(btn){
    $(".purchaseAmountBtn").each(function(){
        $(this).removeClass("purchaseAmountSelected");
    })
    switch (parseInt($(btn).data("id"))){
        case 1:
            $(btn).addClass("purchaseAmountSelected");
            purchaseAmount = 1;
            updateTotalCost();
            break;
        case 5:
            $(btn).addClass("purchaseAmountSelected");
            purchaseAmount = 5;
            updateTotalCost();
            break;
        case 10:
            $(btn).addClass("purchaseAmountSelected");
            purchaseAmount = 10;
            updateTotalCost();
            break;
        case 50:
            $(btn).addClass("purchaseAmountSelected");
            purchaseAmount = 50;
            updateTotalCost();
            break;
        case 100:
            $(btn).addClass("purchaseAmountSelected");
            purchaseAmount = 100;
            updateTotalCost();
            break;
        default:
            $(btn).addClass("purchaseAmountSelected");
            purchaseAmount = 1;
            updateTotalCost();
            break;
    }
}

function updateTotalCost(name){
    let price = 0;
    let totalcost = 0;
    switch(name){
        case "cosmicclicks":
            CosmicClicksTotalCostMultiplied = calculateTotalCostFromPurchaseAmount(CosmicClicksPrice,CosmicClicksPriceMult);
            $("#cosmicclicksprice").html(formatNumber(CosmicClicksTotalCostMultiplied));
            break;
        
        case "cosmicovens":
            CosmicOvensTotalCostMultiplied = calculateTotalCostFromPurchaseAmount(CosmicOvensPrice,CosmicOvensPriceMult);
            $("#cosmicovensprice").html(formatNumber(CosmicOvensTotalCostMultiplied));
            break;

        case "interstellarmixers":
            InterstellarMixersTotalCostMultiplied = calculateTotalCostFromPurchaseAmount(InterstellarMixersPrice,InterstellarMixersPriceMult);
            $("#interstellarmixersprice").html(formatNumber(InterstellarMixersTotalCostMultiplied));
            break;

        case "asteroidminers":
            AsteroidMinersTotalCostMultiplied = calculateTotalCostFromPurchaseAmount(AsteroidMinersPrice,AsteroidMinersPriceMult);
            $("#asteroidminersprice").html(formatNumber(AsteroidMinersTotalCostMultiplied));
            break;

        default:
            CosmicClicksTotalCostMultiplied = calculateTotalCostFromPurchaseAmount(CosmicClicksPrice,CosmicClicksPriceMult);
            $("#cosmicclicksprice").html(formatNumber(CosmicClicksTotalCostMultiplied));
            $(".cosmicclicksamt").html(formatNumber(CosmicClicks))

            //cosmic oven
            CosmicOvensTotalCostMultiplied = calculateTotalCostFromPurchaseAmount(CosmicOvensPrice,CosmicOvensPriceMult);
            $("#cosmicovensprice").html(formatNumber(CosmicOvensTotalCostMultiplied));
            $(".cosmicovenamt").html(formatNumber(CosmicOvens))

            //interstellar mixer
            InterstellarMixersTotalCostMultiplied = calculateTotalCostFromPurchaseAmount(InterstellarMixersPrice,InterstellarMixersPriceMult);
            $("#interstellarmixersprice").html(formatNumber(InterstellarMixersTotalCostMultiplied));
            $(".interstellarmixersamt").html(formatNumber(InterstellarMixers))

            //asteroid miner
            AsteroidMinersTotalCostMultiplied = calculateTotalCostFromPurchaseAmount(AsteroidMinersPrice,AsteroidMinersPriceMult);
            $("#asteroidminersprice").html(formatNumber(AsteroidMinersTotalCostMultiplied));
            $(".asteroidminersamt").html(formatNumber(AsteroidMiners))
    }

};

function calculateTotalCostFromPurchaseAmount(itemPrice,itemPriceMult){
    let price = itemPrice;
    let totalcost = 0;
    for (let i=0;i< purchaseAmount;i++){
        if(i==0){
            price = itemPrice;
            totalcost += price;
        } else {
            price = ((price * itemPriceMult)/100) * totalCostReduction;
            totalcost += price;
        }
    };
    totalcost = Math.round(totalcost);
    return totalcost;
}

function calculateNewItemPrice(itemPrice,itemPriceMult){
    let price = itemPrice;
    let totalcost = 0;
    for (let i=0;i< purchaseAmount;i++){
            price = ((price * itemPriceMult)/100) * totalCostReduction;
            totalcost += price;
    };
    price = Math.round(price);
    return price;
}

function formatNumber(number) {
    // list of number suffixes
    const suffixes = ['', ' Thousand',' Million', ' Billion', ' Trillion', ' Quadrillion', ' Quintillion',
    ' Sextillion', ' Septillion', ' Octillion', ' Nonillion', ' Decillion', ' Undecillion', ' Duodecillion',
    ' Tredecillion', ' Quattuordecillion', ' Quindecillion', ' Sexdecillion', ' Septendecillion', ' Octodecillion',
    ' Novemdecillion', ' Vigintillion', ' Unvigintillion', ' Duovigintillion', ' Tresvigintillion', ' Quattuorvigintillion',
    ' Quinvigintillion', ' Sexvigintillion', ' Septenvigintillion', ' Octovigintillion', ' Nonvigintillion', ' Trigintillion',
    ' Untrigintillion', ' Duotrigintillion', ' Googol', " Skewer's Number", ' Centillion', ' Googolplex', " Skewe's Number"];

    if(number < 1000000){
        number = number.toLocaleString();
        return number;
    }

    /// loop through the suffixes and divide the number by 1000 until it is less than 1000
    for (let i = 0; i < suffixes.length; i++) {
        const suffix = suffixes[i];
        if (number >= 1000) {
        number = number / 1000;
        } else {
        // return the number with the suffix
        return `${number.toFixed(3)}${suffix}`;
        }
    }

    // if the number is larger than the largest suffix, return it as is
    return number;
}

function spaceShipClickEffect(item,event){
    $(item).addClass("spaceship2");
        setTimeout(() => {
            $(item).removeClass("spaceship2");
        }, 50);

        // remove click me text after hitting 5 credits
        if($("#clickme").css("display") == "block" && Credits >= 4){
            $("#clickme").css("opacity", "0");
            setTimeout(() => {
                $("#clickme").css("display", "none");
                $("#clickme").remove();
                $("#spaceshipwrap").css('top', "58.5%");
            }, 1000);
        }

    // Create the floating div
    const floatingDiv = $('<div>').attr('id', 'floating-div').html(`<p>+${formatNumber(ClickValue)} ₵REDITS</p>`);
    floatingDiv.addClass("txt")
    // Position the floating div at the location of the mouse click
    $('body').append(floatingDiv);

    // Position the floating div at the location of the mouse click
    floatingDiv.css({
        left: event.pageX,
        top: event.pageY,
    });

    // Animate the floating div
    floatingDiv.animate({
        top: '20%',
        opacity: 0
    }, 2000, function() {
        // Remove the element when the animation is complete
        floatingDiv.remove();
    });
}

function clicksFunctions(){ //initializes most of the onclicks and hovers
    $('#spaceship').click(function(ev){ //click on spaceship

        spaceShipClickEffect(this,ev);

        //add credits
        Credits += ClickValue; //adds creds probably need to account for multipliers too
        updateCredsDisplay();
    }) // end of on spaceshipclick

    $(".purchaseAmountBtn").click(function(ev){
        highlightPurchaseAmount(this)
    })

    $(".buymenuiconwrap").click(function(ev){
        let item = $(this).find('img').attr('id')
        if(isBuyable(item)){
            $(this).find('img').addClass("buymenuimg2");
            setTimeout(() => {
                $(this).find('img').removeClass("buymenuimg2");
            }, 500);
        }
    })

    $('.cosmicclicksimgwrap').click(function(ev){ //click on spaceship
        if(Credits >= CosmicClicksTotalCostMultiplied ){
            Credits -= CosmicClicksTotalCostMultiplied;
            CosmicClicks += purchaseAmount;
            CosmicClicksTotal = ((CosmicClicks * CosmicClicksValue) / 100) * globalProductionModifier;
            CosmicClicksPrice = calculateNewItemPrice(CosmicClicksPrice,CosmicClicksPriceMult);
            updateCredsDisplay();
            updateCreditsPerSecond();
            $(".cosmicclicksamt").html(formatNumber(CosmicClicks))
            updateTotalCost("cosmicclicks");
        }
    }) // end of on cosmicclickpurchase

    $('.cosmicovensimgwrap').click(function(ev){ //click on spaceship
        if(Credits >= CosmicOvensTotalCostMultiplied){
            Credits -= CosmicOvensTotalCostMultiplied;
            CosmicOvens += purchaseAmount;
            CosmicOvensTotal = ((CosmicOvens * CosmicOvensValue) / 100) * globalProductionModifier;
            CosmicOvensPrice =  calculateNewItemPrice(CosmicOvensPrice,CosmicOvensPriceMult);
            updateCredsDisplay();
            updateCreditsPerSecond();
            $(".cosmicovenamt").html(formatNumber(CosmicOvens))
            updateTotalCost("cosmicovens");
        }
    }) // end of on cosmic oven purchase

    $('.interstellarmixersimgwrap').click(function(ev){ //click on spaceship
        if(Credits >= InterstellarMixersTotalCostMultiplied){
            Credits -= InterstellarMixersTotalCostMultiplied;
            InterstellarMixers += purchaseAmount;
            InterstellarMixersTotal = ((InterstellarMixers * InterstellarMixersValue) / 100) * globalProductionModifier;
            InterstellarMixersPrice =  calculateNewItemPrice(InterstellarMixersPrice,InterstellarMixersPriceMult);
            updateCredsDisplay();
            updateCreditsPerSecond();
            $(".interstellarmixersamt").html(formatNumber(InterstellarMixers))
            updateTotalCost("interstellarmixers")
        }
    }) // end of on interstellar mixer purchase

    $('.asteroidminersimgwrap').click(function(ev){ //click on spaceship
        if(Credits >= AsteroidMinersTotalCostMultiplied){
            Credits -= AsteroidMinersTotalCostMultiplied;
            AsteroidMiners += purchaseAmount;
            AsteroidMinersTotal = ((AsteroidMiners * AsteroidMinersValue) / 100) * globalProductionModifier;
            AsteroidMinersPrice =  calculateNewItemPrice(AsteroidMinersPrice,AsteroidMinersPriceMult);
            updateCredsDisplay();
            updateCreditsPerSecond();
            $(".asteroidminersamt").html(formatNumber(AsteroidMiners))
            updateTotalCost("asteroidminers")
        }
    }) // end of on cosmic oven purchase



    //intervals and values for hovering and showing stats
    var BUYMENUITEMHOVERINTERVAL;
    var varval;
    var varamt;
    var vartotal;
    var varpercent;
    var totalprod;
    var description;
    $('.buymenuitem').on('mouseenter', function() {
            BUYMENUITEMHOVERINTERVAL = setInterval(() => {
                varamt = eval($(this).data("varamt"));
                varprice = eval($(this).data("price"));
                if (varamt >= 1 || $(this).hasClass("unlockedItem")){
                    description = eval($(this).data("description"));
                    varval = eval($(this).data('varval'));
                    vartotal = eval($(this).data("vartotal"));
                    varpercent = 100 * (vartotal / CreditsPerSecond);
                    varpercent = varpercent.toFixed(1);
                    totalprod = eval($(this).data("vartotalproduction"));
                    if ($("#itemproducingamt").hasClass("hidestatstxt") != false ){
                        $("#itemproducingamt").removeClass("hidestatstxt");
                    }
                    if ($("#itemproducingpercent").hasClass("hidestatstxt") != false ){
                        $("#itemproducingpercent").removeClass("hidestatstxt");
                    }
                    if ($("#itemproducingtotal").hasClass("hidestatstxt") != false ){
                        $("#itemproducingtotal").removeClass("hidestatstxt");
                    }
                    $("#itemdescription").html(`${description}`)
                    $("#itemproducingamt").html(`Each ${$(this).data("name")} Produces ${formatNumber(varval)} ₵REDITS per second`);
                    $("#itemproducingpercent").html(`${formatNumber(varamt)} ${$(this).data("name2")} producing ${formatNumber(vartotal)} ₵REDITS per second, which is ${varpercent}% of total ₵REDITS production`);
                    $("#itemproducingtotal").html(`Total ₵REDITS produced by ${$(this).data("name2")}: ${formatNumber(totalprod)}`)
                } else {
                    $("#itemdescription").html(`An unknown item, perhaps gaining more ₵REDITS will give new information`);
                    if ($("#itemproducingamt").hasClass("hidestatstxt") != true ){
                        $("#itemproducingamt").addClass("hidestatstxt")
                    }
                    if ($("#itemproducingpercent").hasClass("hidestatstxt") != true ){
                        $("#itemproducingpercent").addClass("hidestatstxt")
                    }
                    if ($("#itemproducingtotal").hasClass("hidestatstxt") != true ){
                        $("#itemproducingtotal").addClass("hidestatstxt")
                    }
                }
        }, 100);
        $('.stats').css('display', 'block');
      });
      
    $('.buymenuitem').on("mousemove",function(event){
        var yPos = event.pageY;
        yPos -= 154
        $('.stats').css("top",yPos + "px");
    })

    $('.buymenuitem').on('mouseleave', function() {
        $(".stats").css("display","none");
        clearInterval(BUYMENUITEMHOVERINTERVAL);
      });
      
}

function getRandomInt(min, max) { //gets random integer
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
  };
