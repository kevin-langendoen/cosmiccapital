/*All this code is copyright thisisnotkj, kj and Kevin Langendoen, 2022-2023.
    - With help from Paradox.
*/

var gameSave = null;
var purchaseAmount = 1;

var gameObj = {
    Credits:250,

    CreditsPerSecond: 0, //total credits per second

    totalCostReduction: 1, // if 1, user pays 100% of price, lower = user pays less, higher user pays more
    globalProductionModifier: 1, // if 1, items produce 100% of their cps amount, higher = more, lower = less
    
    ClickValue: 1, // mouse click value
    CreditsFromClicks: 0,

    Items:[],

    _itemID: 0,
    _itemPrice:10,
    _itemCPS: 0.25,
    _itemPriceMult: 1.151,

};

//localStorage.clear(); //gamesave clearing for development purposes

var itemsToCreate = [
    function(){createItem("cosmicclicks","Cosmic Clicks allow you to tap into the power of the cosmos to increase ₵REDITS production","Cosmic Click", "Cosmic Clicks");},
    function(){createItem("cosmicovens","Cosmic Ovens are advanced baking devices that use cosmic energy to cook ₵REDITS faster","Cosmic Oven", "Cosmic Ovens");},
    function(){createItem("interstellarmixers","A high-tech mixing machine that uses advanced algorithms to optimize ₵REDITS creation","Interstellar Mixer", "Interstellar Mixers");},
    function(){createItem("cosmicconveyorbelts","A futuristic conveyor belt system that uses Warp Drive technology to transport ₵REDITS faster","Cosmic Conveyor Belt", "Cosmic Conveyor Belts");},
    function(){createItem("asteroidminers","An automated mining machine that extracts valuable resources from asteroids to be used in ₵REDITS production","Asteroid Miner", "Asteroid Miners");},
    function(){createItem("quantumsprinklers","A cutting-edge sprinkler system that uses quantum entanglement to evenly distribute ₵REDITS","Quantum Sprinkler", "Quantum Sprinklers");},
    function(){createItem("gravitywellgenerators","A powerful device that uses artificial gravity wells to accelerate ₵REDITS production","Gravity Well Generator", "Gravity Well Generators");},
    function(){createItem("plasmareactors","A highly efficient energy source that uses plasma reactions to power ₵REDITS production","Plasma Reactor", "Plasma Reactors");},
] 

$(document).ready(function(){
    // Get the width of the buymenuwrap element
    let buymenuwrapWidth = document.getElementById("buymenuwrap").offsetWidth;
    // Set the left property of the spaceshipwrap element based on the width of the buymenuwrap element
    document.getElementById("spaceshipwrap").style.left = `calc(63% - ${buymenuwrapWidth}px)`;

    if(loadSaveData() != true){ // create game items if no game save exists using default values;
        for (let i = 0; i < itemsToCreate.length; i++) { //create buyitems
            itemsToCreate[i]();
        }
        if(localStorage.getItem("gameSave") != null || localStorage.getItem("gameSave") != undefined){
            gameSave = JSON.parse(localStorage.getItem("gameSave"));
            console.log("=== WELCOME BACK PARADOX, YOUR SAVE WAS SAVED :D ===");

            gameObj.Credits = gameSave.credits;
            gameObj.CreditsPerSecond = gameSave.creditspersecond;
            gameObj.ClickValue = gameSave.clickvalue;

            gameObj.Items[0].Amount = gameSave.cosmicclicks;
            gameObj.Items[0].Price = gameSave.cosmicclicksprice;
            gameObj.Items[0].TotalCreditsProduced = gameSave.cosmicclickscredsproduced;
            gameObj.Items[1].Amount = gameSave.cosmicovens;
            gameObj.Items[1].Price = gameSave.cosmicovensprice;
            gameObj.Items[1].TotalCreditsProduced = gameSave.cosmicovenscredsproduced;
            gameObj.Items[2].Price = gameSave.interstellarmixersprice;
            gameObj.Items[2].Amount = gameSave.interstellarmixers;
            gameObj.Items[2].TotalCreditsProduced = gameSave.interstellarmixerscredsproduced;
            gameObj.Items[3].Price = gameSave.cosmicconveyorbeltsprice;
            gameObj.Items[3].Amount = gameSave.cosmicconveyorbelts;
            gameObj.Items[3].TotalCreditsProduced = gameSave.cosmicconveyorbeltscredsproduced;
            gameObj.Items[4].Price = gameSave.asteroidminersprice;
            gameObj.Items[4].Amount = gameSave.asteroidminers;
            gameObj.Items[4].TotalCreditsProduced = gameSave.asteroidminerscredsproduced;

            gameObj.Items.forEach(function(item){
                updateTotalCost(item);
                updateTotalCPS(item);
            })
            addItemsToBuyMenu();
        } else{ //player had no old save
            console.log("=== STARTED GAME ASSUMING PLAYER HAD NO PREVIOUS SAVE ===")
            addItemsToBuyMenu();
        }
    } else{ //succesfully loaded
        console.log("=== SUCCESSFULLY LOADED GAME SAVE! ===")
        addItemsToBuyMenu();
    }

    if(gameObj.Credits > 4){ // dont display clickme text if user already played
        $("#clickme").css("display", "none");
        $("#clickme").remove();
    }

    if (/Mobi|Android/i.test(navigator.userAgent)) { //if on mobile change text
        $("#clickme").html("Tap me!");
    }

    clicksFunctions(); //initializes hover effects and onclick functions
    startLoops();
    console.log("=== CHEATING IS NOT FUN, WHAT FUN IS THERE LEFT IF ALL IS ALREADY DONE? ===")

}); //end doc onready

function loadSaveData(){
    if(localStorage.getItem("gameObj") != null || localStorage.getItem("gameObj") != undefined){
        gameObj = JSON.parse(localStorage.getItem("gameObj"))
        gameObj.Items.forEach(function(item){
            updateTotalCost(item);
            updateTotalCPS(item);
        });
        return true
    }else{
        console.log("=== ERROR DURING LOADING OF SAVE GAME DATA, YOUR BROWSER MAY HAVE CLEARED LOCALSTORAGE OR YOU DID NOT HAVE A SAVE! ===");
        return false
    }
}

function saveGameData(){
    const json = JSON.stringify(gameObj, (key, value) => {
        if (typeof value === "function") {
          return value.toString();
        }
        return value;
      });
    localStorage.setItem("gameObj",json);
};

function addItemsToBuyMenu() { 
    if (gameObj.Items.length < itemsToCreate.length){
        console.log("=== OLD SAVE DETECTED, ADDING NEW ITEMS! ==");
        if (gameObj.Items.length == 8){
            console.log("VERSION 1.2.5")
        }
        console.log(gameObj.Items.length)
        console.log(itemsToCreate.length)

    }
    for(let i = 0; i< gameObj.Items.length;i++){
        let item = gameObj.Items[i];

        let buymenuitemdiv = $('<div>');
        let buymenuiconwrap = $('<div>');
        let img = $('<img>').attr('src',`./img/items/${item.Name}.png`)
        let buymenutxt = $('<p>');
        let buymenutxt2 = $('<p>');

        buymenutxt.addClass('buymenutxt');
        buymenutxt2.addClass('buymenutxt2');

        buymenutxt.html(`${item.MultipleName}: ${formatNumber(item.Amount)}`)
        buymenutxt2.html(`Price: ${formatNumber(item.TotalCostMultiplied)} ₵REDITS`)

        if(i==0){
            buymenuitemdiv.addClass("unlockedItem");
        }
        buymenuitemdiv.addClass('buymenuitem')
        buymenuitemdiv.attr('id', item.Name);

        if(item.Amount < 1 && gameObj.Credits < (item.Price / 2) && i != 0){
            buymenuitemdiv.addClass('hidebuymenuitem')
            buymenutxt.html('???')
            buymenutxt2.html('???')
        }

        buymenuiconwrap.addClass("buymenuiconwrap");
        buymenuiconwrap.addClass(`${item.Name + "imgwrap"}`);

        img.attr('draggable',false);
        img.addClass('buymenuimg');
        img.addClass(`${item.Name}`);


        buymenuitemdiv.append(buymenuiconwrap);
        buymenuiconwrap.append(img);
        buymenuitemdiv.append(buymenutxt);
        buymenuitemdiv.append(buymenutxt2);


        $("#buymenuwrap").append(buymenuitemdiv);
    }
};

function createItem(name,description,singularname,multiplename){
    if(gameObj._itemID != 0){
        let mult = getRandomInt(5,20)
        gameObj._itemPrice *= mult;
        gameObj._itemCPS *=mult;
        gameObj._itemPriceMult = getRandomFloat(1.14,1.18);
    }
    const item = {
        "Name": name,
        "Description": description, //description of said item
        "TotalCreditsProduced": 0, //total amount of credits produced by said item
        "Amount": 0, //amount of said item
        "CPS": gameObj._itemCPS, //credits per second per item
        "Price": gameObj._itemPrice, //price of item
        "TotalCPS": 0, // total credits per second combined (amount * cps)
        "CPSMult": 1, // if 1, produces 100% of item CPS
        "PriceMult": gameObj._itemPriceMult, // amount to increase price of item after each purchase
        "PriceReduction": 1, //if 1 user pays 100% of item value
        "TotalCostMultiplied": 0, //price multiplied by purchaseAmount variable
        "SingularName": singularname,
        "MultipleName": multiplename,
    }
    updateTotalCPS(item);

    updateTotalCost(item);

    gameObj.Items.push(item);
    gameObj._itemID += 1;
}

function updateTotalCPS(item){
    item.TotalCPS = item.Amount * (item.CPS * item.CPSMult) * gameObj.globalProductionModifier;
}

function updateTotalCost(item){
    let totalCost = 0;
    let price = item['Price'];
    for(let i=0;i<purchaseAmount;i++){
        totalCost += price;
        price *= item['PriceMult'];
        price *= item['PriceReduction']
        price *= gameObj.totalCostReduction;
    }
    //item['Price'] = Math.round(item['Price'])
    item['TotalCostMultiplied'] = Math.round(totalCost);
}

function updatePrice(item){
    let price = item['Price'];
    for (let i=0;i < purchaseAmount;i++){
        price *= item["PriceMult"];
        price *= item['PriceReduction'];
        price *= gameObj.totalCostReduction
    };
    item['Price'] = Math.round(price);
    return price;
}

function updateCredsDisplay(){ //updates text
    $("#credits").html(formatNumber(gameObj.Credits));
    $("#creditspersecond").html(formatNumber(gameObj.CreditsPerSecond))
}

function updateCreditsPerSecond(){
    let val = 0;
    for(let i = 0; i< gameObj.Items.length;i++){
        let item = gameObj.Items[i];
        val += item.TotalCPS;
    }
    gameObj.CreditsPerSecond = val;

    document.title = `₵REDITS: ${formatNumber(gameObj.Credits)} | Cosmic Capital`;
}

function addCreds() {
    for (let i = 0; i < gameObj.Items.length; i++) {
        let item = gameObj.Items[i];
        let totalCPS = item.TotalCPS / 10;
        if (totalCPS < 1.0){
            if (!gameObj.hasOwnProperty(`${item.Name}Remainder`)) {
                gameObj[`${item.Name}Remainder`] = 0;
            }
            gameObj[`${item.Name}Remainder`] += totalCPS;

            if(gameObj[`${item.Name}Remainder`] >= 1.0){
                let val = Math.round(gameObj[`${item.Name}Remainder`]);
                item.TotalCreditsProduced += val;
                gameObj.Credits += val;
                gameObj[`${item.Name}Remainder`] -= val;
            }
        } else{
            if (isFinite(totalCPS)){
                item.TotalCreditsProduced += Math.round(totalCPS)
                gameObj.Credits += Math.round(totalCPS)
            }

        }
    }
}

function startLoops(){
    var imgCount = 2;
    // 1 second
    setInterval(() => {
        $("#spaceship").attr('src', `./img/Main-Ship/mainshipbasefullhp${imgCount}.png`);
        if(imgCount < 4){
            imgCount += 1;
        } else{
            imgCount = 2;
        }
        updateCreditsPerSecond(); //txt updates
    }, 1000);
    // 0.1 of a second
    setInterval(() => {
        checkBuyableBorder();
        addCreds();
        updateCredsDisplay();
    }, 100);
    //15 seconds
    setInterval(() => {
        saveGameData();// saving gamestate every 10 seconds
    }, 15000);
}

function checkBuyableBorder(){
    for(let i = 0; i< gameObj.Items.length;i++){
        let item = gameObj.Items[i];
        if(i == 0){
            if(gameObj.Credits >= item.TotalCostMultiplied){
                $(`.${item.Name}imgwrap`).css("border-color", "rgb(166, 32, 255)")
            } else{
                if($(`.${item.Name}imgwrap`).css("border-color") != "rgb(56, 0, 94)"){
                    $(`.${item.Name}imgwrap`).css("border-color", "rgb(56, 0, 94)")
               }
            }
        } else{ //if i higher than 0 since we dont want to hide cosmic clicks ever
            if(gameObj.Credits >= item.TotalCostMultiplied){
                $(`.${item.Name}imgwrap`).css("border-color", "rgb(166, 32, 255)")
            } else{
                if($(`.${item.Name}imgwrap`).css("border-color") != "rgb(56, 0, 94)"){
                    $(`.${item.Name}imgwrap`).css("border-color", "rgb(56, 0, 94)")
               }
            }
            if( item.Amount < 1 && gameObj.Credits < (item.Price / 2) && !$(`#${item.Name}`).hasClass("unlockedItem")){
                $(`#${item.Name}`).addClass("hidebuymenuitem");
                $(`#${item.Name}`).children("p").html("???");
            } else{
                if (!$(`#${item.Name}`).hasClass("unlockedItem")){
                    $(`#${item.Name}`).removeClass("hidebuymenuitem");
                    $(`#${item.Name}`).addClass("unlockedItem");
                    $(`#${item.Name}`).children(".buymenutxt").html(`${item.MultipleName}: ${formatNumber(item.Amount)}`);
                    $(`#${item.Name}`).children(".buymenutxt2").html(`Price: ${formatNumber(item.TotalCostMultiplied)} ₵REDITS`);
                }

            }
        }
    };
}

function highlightPurchaseAmount(btn){
    $(".purchaseAmountBtn").each(function(){
        $(this).removeClass("purchaseAmountSelected");
    })
    switch (parseInt($(btn).data("id"))){
        case 1:
            $(btn).addClass("purchaseAmountSelected");
            purchaseAmount = 1;
            gameObj.Items.forEach(function(item){
                updateTotalCost(item);
                if($(`#${item.Name}`).hasClass("unlockedItem")){
                    $(`#${item.Name}`).find(".buymenutxt2").html(`Price: ${formatNumber(item.TotalCostMultiplied)} ₵REDITS`);
                };
            });
            break;
        case 5:
            $(btn).addClass("purchaseAmountSelected");
            purchaseAmount = 5;
            gameObj.Items.forEach(function(item){
                updateTotalCost(item);
                if($(`#${item.Name}`).hasClass("unlockedItem")){
                    $(`#${item.Name}`).find(".buymenutxt2").html(`Price: ${formatNumber(item.TotalCostMultiplied)} ₵REDITS`);
                };
            });
            break;
        case 10:
            $(btn).addClass("purchaseAmountSelected");
            purchaseAmount = 10;
            gameObj.Items.forEach(function(item){
                updateTotalCost(item);
                if($(`#${item.Name}`).hasClass("unlockedItem")){
                    $(`#${item.Name}`).find(".buymenutxt2").html(`Price: ${formatNumber(item.TotalCostMultiplied)} ₵REDITS`);
                };
            });
            break;
        case 50:
            $(btn).addClass("purchaseAmountSelected");
            purchaseAmount = 50;
            gameObj.Items.forEach(function(item){
                updateTotalCost(item);
                if($(`#${item.Name}`).hasClass("unlockedItem")){
                    $(`#${item.Name}`).find(".buymenutxt2").html(`Price: ${formatNumber(item.TotalCostMultiplied)} ₵REDITS`);
                };
            });
            break;
        case 100:
            $(btn).addClass("purchaseAmountSelected");
            purchaseAmount = 100;
            gameObj.Items.forEach(function(item){
                updateTotalCost(item);
                if($(`#${item.Name}`).hasClass("unlockedItem")){
                    $(`#${item.Name}`).find(".buymenutxt2").html(`Price: ${formatNumber(item.TotalCostMultiplied)} ₵REDITS`);
                };
            });
            break;
        default:
            $(btn).addClass("purchaseAmountSelected");
            purchaseAmount = 1;
            gameObj.Items.forEach(function(item){
                updateTotalCost(item);
                if($(`#${item.Name}`).hasClass("unlockedItem")){
                    $(`#${item.Name}`).find(".buymenutxt2").html(`Price: ${formatNumber(item.TotalCostMultiplied)} ₵REDITS`);
                };
            });
            break;
    }
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
        number = number.toFixed(2);
        number = parseFloat(number);
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
        return `${number.toFixed(2)}${suffix}`;
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
        if($("#clickme").css("display") == "block" && gameObj.Credits >= 4){
            $("#clickme").css("opacity", "0");
            setTimeout(() => {
                $("#clickme").css("display", "none");
                $("#clickme").remove();
                $("#spaceshipwrap").css('top', "58.5%");
            }, 1000);
        }

    // Create the floating div
    const floatingDiv = $('<div>').attr('id', 'floating-div').html(`<p>+${formatNumber(gameObj.ClickValue)} ₵REDITS</p>`);
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
        gameObj.Credits += gameObj.ClickValue; //adds creds probably need to account for multipliers too
        gameObj.CreditsFromClicks += gameObj.ClickValue; //add total amount produced
        updateCredsDisplay();
    }); // end of on spaceshipclick

    $(".purchaseAmountBtn").click(function(ev){ //sets purchase amount higlighter
        highlightPurchaseAmount(this)
    });

    for(let i = 0; i< gameObj.Items.length;i++){
        let item = gameObj.Items[i];
        $(`.${item.Name}imgwrap`).click(function(ev){
            if (gameObj.Credits >= item.TotalCostMultiplied){
                $(this).find('img').addClass('buymenuimg2');
                setTimeout(() => {
                    $(this).find('img').removeClass("buymenuimg2");
                }, 500);
                gameObj.Credits -= item.TotalCostMultiplied;
                item.Amount += purchaseAmount;
                updateTotalCPS(item);
                updatePrice(item);
                updateTotalCost(item);

                $(this).parent().find(".buymenutxt").html(`${item.MultipleName}: ${formatNumber(item.Amount)}`);
                $(this).parent().find(".buymenutxt2").html(`Price: ${formatNumber(item.TotalCostMultiplied)} ₵REDITS`);
                updateCredsDisplay();
                updateCreditsPerSecond();

            }
        });
    };

    //intervals and values for hovering and showing stats
    var BUYMENUITEMHOVERINTERVAL;
    $('.buymenuitem').on('mouseenter', function() {
        let itemid = $(this).attr('id')
        var item;
        for(let i = 0; i< gameObj.Items.length;i++){
            let _item = gameObj.Items[i];
            if (_item.Name==itemid){
                item = gameObj.Items[i]
            };
        };

        BUYMENUITEMHOVERINTERVAL = setInterval(() => {

            if ( item.Amount >= 1 || $(this).hasClass("unlockedItem")){
                if (!Number.isNaN(item.TotalCPS / gameObj.CreditsPerSecond)) {
                    var percent = 100 * (item.TotalCPS / gameObj.CreditsPerSecond);
                    percent = percent.toFixed(1);
                } else {
                    var percent = 0.0;
                    // handle the case where the division result is NaN
                }
                if ($("#itemproducingamt").hasClass("hidestatstxt") != false ){
                    $("#itemproducingamt").removeClass("hidestatstxt");
                }
                if ($("#itemproducingpercent").hasClass("hidestatstxt") != false ){
                    $("#itemproducingpercent").removeClass("hidestatstxt");
                }
                if ($("#itemproducingtotal").hasClass("hidestatstxt") != false ){
                    $("#itemproducingtotal").removeClass("hidestatstxt");
                    }
                $("#itemdescription").html(`${item.Description}`)
                $("#itemproducingamt").html(`Each ${item.SingularName} Produces ${formatNumber(item.CPS)} ₵REDITS per second`);
                $("#itemproducingpercent").html(`${formatNumber(item.Amount)} ${item.MultipleName} producing ${formatNumber(item.TotalCPS)} ₵REDITS per second, which is ${percent}% of total ₵REDITS production`);
                $("#itemproducingtotal").html(`Total ₵REDITS produced by ${item.MultipleName}: ${formatNumber(item.TotalCreditsProduced)}`)
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
        yPos -= 175
        if((screen.height - yPos) < 650){
            yPos -= 275
        }
        $('.stats').css("top",yPos + "px");
    })

    $('.buymenuitem').on('mouseleave', function() {
        $(".stats").css("display","none");
        clearInterval(BUYMENUITEMHOVERINTERVAL);
    });
      
}

function getRandomFloat(min, max) {
    return Math.random() * (Math.max(min, max) - Math.min(min, max)) + Math.min(min, max);
  }

function getRandomInt(min, max) { //gets random integer
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
  };
