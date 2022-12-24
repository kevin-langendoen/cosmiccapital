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
var CosmicClicksPriceMult = 1.20; // price goes up by 120% each purchase
var CosmicClicksTotalCostMultiplied = 0;

var CosmicOvensDescription = "Cosmic Ovens are advanced baking devices that use cosmic energy to cook ₵REDITS faster";
var CosmicOvensCredsProduced = 0;
var CosmicOvens = 0;
var CosmicOvensValue = 1;
var CosmicOvensPrice = 100;
var CosmicOvensTotal = CosmicOvens * CosmicOvensValue;
var CosmicOvensPriceMult = 1.225;
var CosmicOvensTotalCostMultiplied = 0;

var InterstellarMixersDescription = "A high-tech mixing machine that uses advanced algorithms to optimize ₵REDITS creation";
var InterstellarMixersCredsProduced = 0;
var InterstellarMixers = 0;
var InterstellarMixersValue = 10;
var InterstellarMixersPrice = 1000;
var InterstellarMixersTotal = InterstellarMixers * InterstellarMixersValue;
var InterstellarMixersPriceMult = 1.25;
var InterstellarMixersTotalCostMultiplied = 0;



$(document).ready(function(){
    // Get the width of the buymenuwrap element
    let buymenuwrapWidth = document.getElementById("buymenuwrap").offsetWidth;
    // Set the left property of the spaceshipwrap element based on the width of the buymenuwrap element
    document.getElementById("spaceshipwrap").style.left = `calc(63% - ${buymenuwrapWidth}px)`;

    //localStorage.clear(); //gamesave clearing
    if(localStorage.getItem("gameSave") != null || localStorage.getItem("gameSave") != undefined){
        gameSave = JSON.parse(localStorage.getItem("gameSave"))
        Credits = gameSave.credits;
        CreditsPerSecond = gameSave.creditspersecond;
        totalCostReduction = gameSave.totalcostreduction;
        globalProductionModifier = gameSave.globalproductionmodifier; //creds and modifiers save

        ClickValue = gameSave.clickvalue; //user click value save

        //cosmic clicks saving
        CosmicClicksCredsProduced = gameSave.cosmicclickscredsproduced;
        CosmicClicks =  gameSave.cosmicclicks;
        CosmicClicksValue = gameSave.cosmicclicksvalue;
        CosmicClicksPrice = gameSave.cosmicclicksprice;
        CosmicClicksTotal = CosmicClicks * CosmicClicksValue;
        CosmicClicksPriceMult = gameSave.cosmicclickspricemult;

        //cosmic oven saving
        CosmicOvensCredsProduced = gameSave.cosmicovenscredsproduced;
        CosmicOvens = gameSave.cosmicovens;
        CosmicOvensValue = gameSave.cosmicovensvalue;
        CosmicOvensPrice = gameSave.cosmicovensprice;
        CosmicOvensTotal = CosmicOvens * CosmicOvensValue;
        CosmicOvensPriceMult = gameSave.cosmicovenspricemult;

        //interstellar mixer saving
        InterstellarMixersCredsProduced = gameSave.interstellarmixerscredsproduced;
        InterstellarMixers = gameSave.interstellarmixers;
        InterstellarMixersValue = gameSave.interstellarmixersvalue;
        InterstellarMixersPrice = gameSave.interstellarmixersprice;
        InterstellarMixersTotal = InterstellarMixers * InterstellarMixersValue;
        InterstellarMixersPriceMult = gameSave.interstellarmixerspricemult;
    }

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
    }
    localStorage.setItem("gameSave",JSON.stringify(gameSave));
};

function updateCredsDisplay(){ //updates text
    $("#credits").html(Credits);
    document.title = `₵REDITS: ${Credits} | Cosmic Capital`;
}

function updateCreditsPerSecond(){
    CreditsPerSecond = 0;
    //cosmic clicks
    CreditsPerSecond += CosmicClicksTotal;
    CreditsPerSecond += CosmicOvensTotal;
    CreditsPerSecond += InterstellarMixersTotal;
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
        $("#buymenu2").children(".buymenutxt").html(`Cosmic Ovens: <var class="buymenuvartxt cosmicovenamt">0</var>`)
        $("#buymenu2").children(".buymenutxt2").html(`Cost: <var id="cosmicovensprice" class="buymenuvartxt">${CosmicOvensTotalCostMultiplied}</var> ₵REDITS`)
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
        $("#buymenu3").children(".buymenutxt").html(`Interstellar Mixers: <var class="buymenuvartxt interstellarmixersamt">0</var>`)
        $("#buymenu3").children(".buymenutxt2").html(`Cost: <var id="interstellarmixersprice" class="buymenuvartxt">${InterstellarMixersTotalCostMultiplied}</var> ₵REDITS`)
    }
    if (Credits >= InterstellarMixersTotalCostMultiplied){
        $(".interstellarmixersimgwrap").css("border-color", "rgb(166, 32, 255)")
    }else{
        if($(".interstellarmixersimgwrap").css("border-color") != "rgb(56, 0, 94)"){
            $(".interstellarmixersimgwrap").css("border-color", "rgb(56, 0, 94)")
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
            CosmicClicksPrice = price;
            $("#cosmicclicksprice").html(CosmicClicksTotalCostMultiplied);
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
            CosmicOvensPrice = price;
            $("#cosmicovensprice").html(CosmicOvensTotalCostMultiplied);
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
            InterstellarMixersPrice = price;
            $("#interstellarmixersprice").html(InterstellarMixersTotalCostMultiplied);
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
            CosmicClicksPrice = price;
            $("#cosmicclicksprice").html(CosmicClicksTotalCostMultiplied);

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
            CosmicOvensPrice = price;
            $("#cosmicovensprice").html(CosmicOvensTotalCostMultiplied);

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
            InterstellarMixersPrice = price;
            $("#interstellarmixersprice").html(InterstellarMixersTotalCostMultiplied);
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
            updateCredsDisplay();
            updateCreditsPerSecond();
            $(".cosmicclicksamt").html(CosmicClicks)
            updateTotalCost("cosmicclicks");
        }
    }) // end of on cosmicclickpurchase

    $('.cosmicovensimgwrap').click(function(ev){ //click on spaceship
        if(Credits >= CosmicOvensTotalCostMultiplied){
            Credits -= CosmicOvensTotalCostMultiplied;
            CosmicOvens += purchaseAmount;
            CosmicOvensTotal = ((CosmicOvens * CosmicOvensValue) / 100) * globalProductionModifier;
            updateCredsDisplay();
            updateCreditsPerSecond();
            $(".cosmicovenamt").html(CosmicOvens)
            updateTotalCost("cosmicovens");
        }
    }) // end of on cosmic oven purchase

    $('.interstellarmixersimgwrap').click(function(ev){ //click on spaceship
        if(Credits >= InterstellarMixersTotalCostMultiplied){
            Credits -= InterstellarMixersTotalCostMultiplied;
            InterstellarMixers += purchaseAmount;
            InterstellarMixersTotal = ((InterstellarMixers * InterstellarMixersValue) / 100) * globalProductionModifier;
            updateCredsDisplay();
            updateCreditsPerSecond();
            $(".interstellarmixersamt").html(InterstellarMixers)
            updateTotalCost("interstellarmixers")
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
                description = eval($(this).data("description"))
                varval = eval($(this).data('varval'));
                varamt = eval($(this).data("varamt"));
                vartotal = eval($(this).data("vartotal"));
                vartotal = vartotal.toFixed(2)
                varpercent = 100 * (vartotal / CreditsPerSecond);
                varpercent = varpercent.toFixed(1)
                totalprod = eval($(this).data("vartotalproduction"))
                $("#itemdescription").html(`${description}`)
                $("#itemproducingamt").html(`Each ${$(this).data("name")} Produces ${varval} ₵REDITS per second`);
                $("#itemproducingpercent").html(`${varamt} ${$(this).data("name2")} producing ${vartotal} ₵REDITS per second, which is ${varpercent}% of total ₵REDITS production`);
                $("#itemproducingtotal").html(`Total ₵REDITS produced by ${$(this).data("name2")}: ${totalprod}`)
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
