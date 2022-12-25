var gameSave = null;
var purchaseAmount = 1;

var Credits = 0;

var CreditsPerSecond = 0; //total credits per second

var totalCostReduction = 100; // total % of price of items
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
var InterstellarMixersPrice = 1100;
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

//localStorage.clear(); //gamesave clearing for development purposes

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
    $("#credits").html(Credits.toLocaleString());
    document.title = `₵REDITS: ${Credits.toLocaleString()} | Cosmic Capital`;
}

function updateCreditsPerSecond(){
    CreditsPerSecond = 0;
    //cosmic clicks
    CreditsPerSecond += CosmicClicksTotal;
    CreditsPerSecond += CosmicOvensTotal;
    CreditsPerSecond += InterstellarMixersTotal;
    CreditsPerSecond += AsteroidMinersTotal;
}

var calc = 0; //calc variable
var cctots = 0; //cosmic clicks adder until above 1.0
var cotots = 0; //cosmic oven adders until above 1.0
function addCreds(){
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
    if (CosmicOvens < 1 && Credits < (CosmicOvensPrice / 2))
    {
        $("#buymenu2").addClass("hidebuymenuitem")
        $("#buymenu2").children("p").html("???")
    } else if ($("#buymenu2").hasClass("hidebuymenuitem")){
        $("#buymenu2").removeClass("hidebuymenuitem")
        $("#buymenu2").children(".buymenutxt").html(`Cosmic Ovens: <var class="buymenuvartxt cosmicovenamt">${CosmicOvens}</var>`)
        $("#buymenu2").children(".buymenutxt2").html(`Cost: <var id="cosmicovensprice" class="buymenuvartxt">${CosmicOvensTotalCostMultiplied.toLocaleString()}</var> ₵REDITS`)
    }
    if (Credits >= CosmicOvensTotalCostMultiplied){
        $(".cosmicovensimgwrap").css("border-color", "rgb(166, 32, 255)")
    }else{
        if($(".cosmicovensimgwrap").css("border-color") != "rgb(56, 0, 94)"){
            $(".cosmicovensimgwrap").css("border-color", "rgb(56, 0, 94)")
       }
    } 
    //interstellarmixers
    if (InterstellarMixers < 1 && Credits < (InterstellarMixersPrice / 2))
    {
        $("#buymenu3").addClass("hidebuymenuitem")
        $("#buymenu3").children("p").html("???")
    } else if ($("#buymenu3").hasClass("hidebuymenuitem")){
        $("#buymenu3").removeClass("hidebuymenuitem")
        $("#buymenu3").children(".buymenutxt").html(`Interstellar Mixers: <var class="buymenuvartxt interstellarmixersamt">${InterstellarMixers}</var>`)
        $("#buymenu3").children(".buymenutxt2").html(`Cost: <var id="interstellarmixersprice" class="buymenuvartxt">${InterstellarMixersTotalCostMultiplied.toLocaleString()}</var> ₵REDITS`)
    }
    if (Credits >= InterstellarMixersTotalCostMultiplied){
        $(".interstellarmixersimgwrap").css("border-color", "rgb(166, 32, 255)")
    }else{
        if($(".interstellarmixersimgwrap").css("border-color") != "rgb(56, 0, 94)"){
            $(".interstellarmixersimgwrap").css("border-color", "rgb(56, 0, 94)")
       }
    }
    //asteroid miners
    if (AsteroidMiners < 1 && Credits < (AsteroidMinersPrice / 2))
    {
        $("#buymenu4").addClass("hidebuymenuitem")
        $("#buymenu4").children("p").html("???")
    } else if ($("#buymenu4").hasClass("hidebuymenuitem")){
        $("#buymenu4").removeClass("hidebuymenuitem")
        $("#buymenu4").children(".buymenutxt").html(`Asteroid Miners: <var class="buymenuvartxt asteroidminersamt">${AsteroidMiners}</var>`)
        $("#buymenu4").children(".buymenutxt2").html(`Cost: <var id="asteroidminersprice" class="buymenuvartxt">${AsteroidMinersTotalCostMultiplied.toLocaleString()}</var> ₵REDITS`)
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

function updateTotalCost(name){
    let price = 0;
    let totalcost = 0;
    switch(name){
        case "cosmicclicks":
            //cosmic click
            price = CosmicClicksPrice;
            for (let i = 0; i < purchaseAmount; i++){
                price = ((price * CosmicClicksPriceMult) / 100) * totalCostReduction;
                totalcost += price;
            }
            totalcost = Math.round(totalcost);
            price = Math.round(price);
            CosmicClicksTotalCostMultiplied = totalcost;
            $("#cosmicclicksprice").html(CosmicClicksTotalCostMultiplied.toLocaleString());
            break;
        
        case "cosmicovens":
            //cosmic oven
            price = CosmicOvensPrice;
            for (let i = 0; i < purchaseAmount; i++){
                price = ((price * CosmicOvensPriceMult) / 100) * totalCostReduction;
                totalcost += price;
            }
            totalcost = Math.round(totalcost);
            price = Math.round(price);
            CosmicOvensTotalCostMultiplied = totalcost;
            $("#cosmicovensprice").html(CosmicOvensTotalCostMultiplied.toLocaleString());
            break;

        case "interstellarmixers":
            //interstellar mixer
            price = InterstellarMixersPrice;
            for (let i = 0; i < purchaseAmount; i++){
                price = ((price * InterstellarMixersPriceMult) / 100) * totalCostReduction;
                totalcost += price;
            }
            totalcost = Math.round(totalcost);
            price = Math.round(price);
            InterstellarMixersTotalCostMultiplied = totalcost;
            $("#interstellarmixersprice").html(InterstellarMixersTotalCostMultiplied.toLocaleString());
            break;

        case "asteroidminers":
            //asteroid miner
            price = AsteroidMinersPrice;
            for (let i = 0; i < purchaseAmount; i++){
                price = ((price * AsteroidMinersPriceMult) / 100) * totalCostReduction;
                totalcost += price;
            }
            totalcost = Math.round(totalcost);
            price = Math.round(price);
            AsteroidMinersTotalCostMultiplied = totalcost;
            $("#asteroidminersprice").html(AsteroidMinersTotalCostMultiplied.toLocaleString());
            break;

        default:
            //cosmic click
            price = CosmicClicksPrice;
            for (let i = 0; i < purchaseAmount; i++){
                price = ((price * CosmicClicksPriceMult) / 100) * totalCostReduction;
                totalcost += price;
            }
            totalcost = Math.round(totalcost);
            price = Math.round(price);
            CosmicClicksTotalCostMultiplied = totalcost;
            $("#cosmicclicksprice").html(CosmicClicksTotalCostMultiplied.toLocaleString());
            $(".cosmicclicksamt").html(CosmicClicks)

            //cosmic oven
            price = CosmicOvensPrice;
            totalcost = 0; //important
            for (let i = 0; i < purchaseAmount; i++){
                price = ((price * CosmicOvensPriceMult) / 100) * totalCostReduction;
                totalcost += price;
            }
            totalcost = Math.round(totalcost);
            price = Math.round(price);
            CosmicOvensTotalCostMultiplied = totalcost;
            $("#cosmicovensprice").html(CosmicOvensTotalCostMultiplied.toLocaleString());
            $(".cosmicovenamt").html(CosmicOvens)

            //interstellar mixer
            price = InterstellarMixersPrice;
            totalcost = 0 //important
            for (let i = 0; i < purchaseAmount; i++){
                price = ((price * InterstellarMixersPriceMult) / 100) * totalCostReduction;
                totalcost += price;
            }
            totalcost = Math.round(totalcost);
            price = Math.round(price);
            InterstellarMixersTotalCostMultiplied = totalcost;
            $("#interstellarmixersprice").html(InterstellarMixersTotalCostMultiplied.toLocaleString());
            $(".interstellarmixersamt").html(InterstellarMixers)

            //asteroid miner
            price = AsteroidMinersPrice;
            totalcost = 0; //important
            for (let i = 0; i < purchaseAmount; i++){
                price = ((price * AsteroidMinersPriceMult) / 100) * totalCostReduction;
                totalcost += price;
            }
            totalcost = Math.round(totalcost);
            price = Math.round(price);
            AsteroidMinersTotalCostMultiplied = totalcost;
            $("#asteroidminersprice").html(AsteroidMinersTotalCostMultiplied.toLocaleString());
            $(".asteroidminersamt").html(AsteroidMiners)
    }
    //interstellarmixer

};

function clicksFunctions(){ //initializes most of the onclicks and hovers
    $('#spaceship').click(function(ev){ //click on spaceship
        $(this).addClass("spaceship2");
        setTimeout(() => {
            $(this).removeClass("spaceship2");
        }, 50);
        if($("#clickme").css("display") == "block" && Credits >= 4){
            $("#clickme").css("opacity", "0");
            setTimeout(() => {
                $("#clickme").css("display", "none");
                $("#clickme").remove();
                $("#spaceshipwrap").css('top', "58.5%");
            }, 1000);
        }
    
        Credits += ClickValue; //adds creds probably need to account for multipliers too
        updateCredsDisplay();
    }) // end of on spaceshipclick

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
            let newpriceval = CosmicClicksPrice;
            for (let i =0;i < purchaseAmount;i++){
                newpriceval = ((newpriceval * CosmicClicksPriceMult)/100) * globalProductionModifier;
            }
            CosmicClicksPrice =  newpriceval;
            updateCredsDisplay();
            updateCreditsPerSecond();
            $(".cosmicclicksamt").html(CosmicClicks.toLocaleString())
            updateTotalCost("cosmicclicks");
        }
    }) // end of on cosmicclickpurchase

    $('.cosmicovensimgwrap').click(function(ev){ //click on spaceship
        if(Credits >= CosmicOvensTotalCostMultiplied){
            Credits -= CosmicOvensTotalCostMultiplied;
            CosmicOvens += purchaseAmount;
            CosmicOvensTotal = ((CosmicOvens * CosmicOvensValue) / 100) * globalProductionModifier;
            let newpriceval = CosmicOvensPrice;
            for (let i =0;i < purchaseAmount;i++){
                newpriceval = ((newpriceval * CosmicOvensPriceMult)/100) * globalProductionModifier;
            }
            CosmicOvensPrice =  newpriceval;
            updateCredsDisplay();
            updateCreditsPerSecond();
            $(".cosmicovenamt").html(CosmicOvens.toLocaleString())
            updateTotalCost("cosmicovens");
        }
    }) // end of on cosmic oven purchase

    $('.interstellarmixersimgwrap').click(function(ev){ //click on spaceship
        if(Credits >= InterstellarMixersTotalCostMultiplied){
            Credits -= InterstellarMixersTotalCostMultiplied;
            InterstellarMixers += purchaseAmount;
            InterstellarMixersTotal = ((InterstellarMixers * InterstellarMixersValue) / 100) * globalProductionModifier;
            let newpriceval = InterstellarMixersPrice;
            for (let i =0;i < purchaseAmount;i++){
                newpriceval = ((newpriceval * InterstellarMixersPriceMult)/100) * globalProductionModifier;
            }
            InterstellarMixersPrice =  newpriceval;
            updateCredsDisplay();
            updateCreditsPerSecond();
            $(".interstellarmixersamt").html(InterstellarMixers.toLocaleString())
            updateTotalCost("interstellarmixers")
        }
    }) // end of on interstellar mixer purchase

    $('.asteroidminersimgwrap').click(function(ev){ //click on spaceship
        if(Credits >= AsteroidMinersTotalCostMultiplied){
            Credits -= AsteroidMinersTotalCostMultiplied;
            AsteroidMiners += purchaseAmount;
            AsteroidMinersTotal = ((AsteroidMiners * AsteroidMinersValue) / 100) * globalProductionModifier;
            let newpriceval = AsteroidMinersPrice;
            for (let i =0;i < purchaseAmount;i++){
                newpriceval = ((newpriceval * AsteroidMinersPriceMult)/100) * globalProductionModifier;
            }
            AsteroidMinersPrice =  newpriceval;
            updateCredsDisplay();
            updateCreditsPerSecond();
            $(".asteroidminersamt").html(AsteroidMiners.toLocaleString())
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
                if (varamt >= 1 || Credits >= (varprice / 2)){
                    description = eval($(this).data("description"));
                    varval = eval($(this).data('varval'));
                    vartotal = eval($(this).data("vartotal"));
                    varpercent = 100 * (vartotal / CreditsPerSecond);
                    varpercent = varpercent.toFixed(1);
                    totalprod = eval($(this).data("vartotalproduction"));
                    if ($("#itemproducingamt").hasClass("hidestatstxt") != false ){
                        $("#itemproducingamt").removeClass("hidestatstxt");
                        $("#itemproducingamt").show();
                    }
                    if ($("#itemproducingpercent").hasClass("hidestatstxt") != false ){
                        $("#itemproducingpercent").removeClass("hidestatstxt");
                        $("#itemproducingpercent").show();
                    }
                    if ($("#itemproducingtotal").hasClass("hidestatstxt") != false ){
                        $("#itemproducingtotal").removeClass("hidestatstxt");
                        $("#itemproducingtotal").show();
                    }
                    $("#itemdescription").html(`${description}`)
                    $("#itemproducingamt").html(`Each ${$(this).data("name")} Produces ${varval.toLocaleString()} ₵REDITS per second`);
                    $("#itemproducingpercent").html(`${varamt.toLocaleString()} ${$(this).data("name2")} producing ${vartotal.toLocaleString({minimumFractionDigits: 2,maximumFractionDigits: 2})} ₵REDITS per second, which is ${varpercent}% of total ₵REDITS production`);
                    $("#itemproducingtotal").html(`Total ₵REDITS produced by ${$(this).data("name2")}: ${totalprod.toLocaleString()}`)
                } else {
                    $("#itemdescription").html(`An unknown item, perhaps gaining more ₵REDITS will give new information`);
                    if ($("#itemproducingamt").hasClass("hidestatstxt") != true ){
                        $("#itemproducingamt").addClass("hidestatstxt")
                        $("#itemproducingamt").hide();
                    }
                    if ($("#itemproducingpercent").hasClass("hidestatstxt") != true ){
                        $("#itemproducingpercent").addClass("hidestatstxt")
                        $("#itemproducingpercent").hide();
                    }
                    if ($("#itemproducingtotal").hasClass("hidestatstxt") != true ){
                        $("#itemproducingtotal").addClass("hidestatstxt")
                        $("#itemproducingtotal").hide();
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
