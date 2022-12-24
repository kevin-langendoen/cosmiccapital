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
var CosmicClicksPriceMult = 1.35; // price goes up by 135% each purchase

var CosmicOvensDescription = "Cosmic Ovens are advanced baking devices that use cosmic energy to cook ₵REDITS faster";
var CosmicOvensCredsProduced = 0;
var CosmicOvens = 0;
var CosmicOvensValue = 1;
var CosmicOvensPrice = 100;
var CosmicOvensTotal = CosmicOvens * CosmicOvensValue;
var CosmicOvensPriceMult = 1.45;

var InterstellarMixersDescription = "A high-tech mixing machine that uses advanced algorithms to optimize ₵REDITS creation";
var InterstellarMixersCredsProduced = 0;
var InterstellarMixers = 0;
var InterstellarMixersValue = 15;
var InterstellarMixersPrice = 1500;
var InterstellarMixersTotal = InterstellarMixers * InterstellarMixersValue;
var InterstellarMixersPriceMult = 1.55;



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
    if (Credits >= CosmicClicksPrice){
        $(".cosmicclicksimgwrap").css("border-color", "rgb(166, 32, 255)")
    } else{
       if($(".cosmicclicksimgwrap").css("border-color") != "rgb(56, 0, 94)"){
            $(".cosmicclicksimgwrap").css("border-color", "rgb(56, 0, 94)")
       }
    }
    if (Credits >= CosmicOvensPrice){
        $(".cosmicovensimgwrap").css("border-color", "rgb(166, 32, 255)")
    }else{
        if($(".cosmicovensimgwrap").css("border-color") != "rgb(56, 0, 94)"){
            $(".cosmicovensimgwrap").css("border-color", "rgb(56, 0, 94)")
       }
    }
    if (Credits >= InterstellarMixersPrice){
        $(".interstellarmixersimgwrap").css("border-color", "rgb(166, 32, 255)")
    }else{
        if($(".interstellarmixersimgwrap").css("border-color") != "rgb(56, 0, 94)"){
            $(".interstellarmixersimgwrap").css("border-color", "rgb(56, 0, 94)")
       }
    }
}

function isBuyable(item){
    let itemprice = eval(item)
    if(Credits > itemprice){
        return true
    } else{
        return false
    }
}


var calc = 0; //calc variable
var cctots = 0; //cosmic clicks adder until above 1.0
var cotots = 0;
function addCreds(){
    //cosmic clicks
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
        if(Credits >= CosmicClicksPrice){
            Credits -= CosmicClicksPrice;
            CosmicClicks += purchaseAmount;
            CosmicClicksPrice = ((CosmicClicksPrice * CosmicClicksPriceMult) / 100) * totalCostReduction;
            CosmicClicksPrice = Math.round(CosmicClicksPrice)
            CosmicClicksTotal = ((CosmicClicks * CosmicClicksValue) / 100) * globalProductionModifier;
            updateCredsDisplay();
            updateCreditsPerSecond();
            $(".cosmicclicksamt").html(CosmicClicks)
            $("#cosmicclicksprice").html(CosmicClicksPrice)
        }
    }) // end of on cosmicclickpurchase

    $('.cosmicovensimgwrap').click(function(ev){ //click on spaceship
        if(Credits >= CosmicOvensPrice){
            Credits -= CosmicOvensPrice;
            CosmicOvens += purchaseAmount;
            CosmicOvensPrice = ((CosmicOvensPrice * CosmicOvensPriceMult) / 100) * totalCostReduction;
            CosmicOvensPrice = Math.round(CosmicOvensPrice)
            CosmicOvensTotal = ((CosmicOvens * CosmicOvensValue) / 100) * globalProductionModifier;
            updateCredsDisplay();
            updateCreditsPerSecond();
            $(".cosmicovenamt").html(CosmicOvens)
            $("#cosmicovenprice").html(CosmicOvensPrice)
        }
    }) // end of on cosmic oven purchase

    $('.interstellarmixersimgwrap').click(function(ev){ //click on spaceship
        if(Credits >= InterstellarMixersPrice){
            Credits -= InterstellarMixersPrice;
            InterstellarMixers += purchaseAmount;
            InterstellarMixersPrice = ((InterstellarMixersPrice * InterstellarMixersPriceMult) / 100) * totalCostReduction;
            InterstellarMixersPrice = Math.round(InterstellarMixersPrice)
            InterstellarMixersTotal = ((InterstellarMixers * InterstellarMixersValue) / 100) * globalProductionModifier;
            updateCredsDisplay();
            updateCreditsPerSecond();
            $(".interstellarmixersamt").html(InterstellarMixers)
            $("#interstellarmixersprice").html(InterstellarMixersPrice)
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
