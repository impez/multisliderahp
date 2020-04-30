// Referencje do głównych bloków
let start_content = document.querySelector(".start");
let criterias_content = document.querySelector(".criteriasWindow"); 
let variants_content = document.querySelector(".variantsWindow");
let ranking_content = document.querySelector(".ranking");
let experts_content = document.querySelector(".experts");

let ahpUser;

// Menu - przyciski
let zacznijbtn = document.querySelector(".zacznij");
let kryteriabtn = document.querySelector(".kryteria");
let wariantybtn = document.querySelector(".warianty");
let rankingbtn = document.querySelector(".rankingBtn");
let ekspercibtn = document.querySelector(".expertsBtn");

// Wstępny formularz
let submit_criteria_btn = document.querySelector(".submitCriteria");
let submit_variant_btn = document.querySelector(".submitVariant");
let criteria_input = document.querySelector(".criteriaInput");
let variant_input = document.querySelector(".variantInput");

let criteria_list = document.querySelector(".criteriaList");
let variant_list = document.querySelector(".variantList");
let listItems = document.querySelectorAll(".listItem");
let start_btn = document.getElementById("startEvaluation");

let nums = [];

(function(){
    let nm1 = 900;
    let nm2 = 101;

    for(let i = 1600; i>=800; i--){
        nums.push({
            Nmb: i,
            convNmb: nm1--/100
        });
    }

    for(let i = 799; i>=0; i--){
        nums.push({
            Nmb: i,
            convNmb: 100/nm2++
        })
    }
}())

function activateButton(btn){
    if(btn.classList.contains("rankingBtn")){
        highlightoff();
        contentoff();

        btn.classList.add("highlight");
        zacznijbtn.classList.remove("disabled");
        ranking_content.classList.remove("hide");
    }

    if(btn.classList.contains("zacznij") && !btn.classList.contains("disabled")){
        highlightoff();
        contentoff();

        btn.classList.add("highlight");
        start_content.classList.remove("hide");
    }

    if(btn.classList.contains("kryteria") && !btn.classList.contains("disabled")){
        highlightoff();
        contentoff();

        btn.classList.add("highlight");
        criterias_content.classList.remove("hide");
    }

    if(btn.classList.contains("warianty") && !btn.classList.contains("disabled")){
        highlightoff();
        contentoff();

        btn.classList.add("highlight");
        variants_content.classList.remove("hide");
    }

    console.log(btn);

    if(btn.classList.contains("expertsBtn") && !btn.classList.contains("disabled")){
        highlightoff();
        contentoff();

        btn.classList.add("highlight");
        experts_content.classList.remove("hide");

        console.log(btn);
    }
}

function highlightoff(){
    zacznijbtn.classList.remove("highlight");
    kryteriabtn.classList.remove("highlight");
    wariantybtn.classList.remove("highlight");
    rankingbtn.classList.remove("highlight");
    ekspercibtn.classList.remove("highlight");
}

function contentoff(){
    start_content.classList.add("hide");
    criterias_content.classList.add("hide");
    variants_content.classList.add("hide");
    ranking_content.classList.add("hide");
    experts_content.classList.add("hide");
}

function convertNumber(num){
    num = Math.floor(num);

    for(let i = 0; i < nums.length; i++) 
        if(nums[i]["Nmb"] === num) return nums[i]["convNmb"];

    return false;
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function createSliders(ahpUser){

    let spannames = [];
    let SLIDERGROUP = [];

    for(let i = 0; i < ahpUser.criterias.names.length ; i++){
        for(let j = i+1 ; j < ahpUser.criterias.names.length; j++){
            spannames.push(ahpUser.criterias.names[i]);
            spannames.push(ahpUser.criterias.names[j]);
        }
    }

    spannames.reverse();

    for(let i = 1; i <= ahpUser.CRITERIA_SLIDERS_TOTAL; i++){
        let newSpan1 = document.createElement("span");
        let newSpan2 = document.createElement("span");
        newSpan1.classList.add("sp");
        newSpan2.classList.add("sp");

        newSpan1.innerHTML = spannames.pop();
        newSpan2.innerHTML = spannames.pop();

        let newSliderGroup = document.createElement("div");
        newSliderGroup.classList.add("slidergrp");

        let newCSlider = document.createElement("div");
        newCSlider.id = `cslider${i}`
        newCSlider.classList.add("sliders");

        noUiSlider.create(newCSlider, {
            start: [500, 800, 1100],
            connect: true,
            direction: 'rtl',
            range: {
                'min': 0,
                'max': 1600
            }
        });

        newSliderGroup.appendChild(newSpan1);
        newSliderGroup.appendChild(newCSlider);
        newSliderGroup.appendChild(newSpan2);
        SLIDERGROUP.push(newSliderGroup);
    }

    SLIDERGROUP = shuffle(SLIDERGROUP);
    SLIDERGROUP.forEach(slider => {
        criterias_content.appendChild(slider);
    })

    SLIDERGROUP = [];
    spannames = [];

    for(let i = 0; i < ahpUser.variants.names.length ; i++){
        for(let j = i+1 ; j < ahpUser.variants.names.length; j++){
            spannames.push(ahpUser.variants.names[i]);
            spannames.push(ahpUser.variants.names[j]);
        }
    }

    let VARIANT_SLIDER_NUMBER = 1;

    for(let i = 0; i < ahpUser.criterias.names.length; i++){
        let h = document.createElement("h3");
        h.classList.add("helem");
        h.innerHTML = `Opierając się o <b>${ahpUser.criterias.names[i]}</b>, która alternatywa jest lepsza?`;
        variants_content.appendChild(h);
        
        let spanIndex = 0;

        for(let j = 0; j < ahpUser.VARIANT_SLIDERS_TOTAL; j++){
            let newSpan1 = document.createElement("span");
            let newSpan2 = document.createElement("span");
            newSpan1.classList.add("sp");
            newSpan2.classList.add("sp");

            newSpan1.innerHTML = spannames[spanIndex];
            newSpan2.innerHTML = spannames[spanIndex+1];
            spanIndex += 2;

            let newSliderGroup = document.createElement("div");
            newSliderGroup.classList.add("slidergrp");

            let newVSlider = document.createElement("div");
            newVSlider.id = `vslider${VARIANT_SLIDER_NUMBER++}`
            newVSlider.classList.add("sliders");

            noUiSlider.create(newVSlider, {
                start: [500, 800, 1100],
                connect: true,
                direction: 'rtl',
                range: {
                    'min': 0,
                    'max': 1600
                }
            });

            newSliderGroup.appendChild(newSpan1);
            newSliderGroup.appendChild(newVSlider);
            newSliderGroup.appendChild(newSpan2);
            //variants_content.appendChild(newSliderGroup);
            SLIDERGROUP.push(newSliderGroup);
        }

        SLIDERGROUP = shuffle(SLIDERGROUP);
        SLIDERGROUP.forEach(slider => {
            variants_content.appendChild(slider);
        })
        SLIDERGROUP = [];
    }

}

start_btn.addEventListener("click", () => {
    let criteriaArrayList = [];
    let variantArrayList = [];

    for(let i = 0; i < criteria_list.childElementCount; i++){
        criteriaArrayList.push(criteria_list.children[i].textContent);
    }
    for(let i = 0; i < variant_list.childElementCount; i++){
        variantArrayList.push(variant_list.children[i].textContent);
    }

    if(criteriaArrayList.length < 2 || variantArrayList.length < 2){
        criteriaArrayList = [];
        variantArrayList = [];
    }
    else{
        ahpUser = new AHP(criteriaArrayList, variantArrayList);
        ahpUser.createMatrices();
        console.log(ahpUser);

        createSliders(ahpUser);
    
        start_content.classList.add("hide");
        criterias_content.classList.remove("hide");
        zacznijbtn.classList.remove("highlight");
        zacznijbtn.classList.add("disabled");
        rankingbtn.classList.remove("disabled");
        ekspercibtn.classList.remove("disabled");
        kryteriabtn.classList.remove("disabled");
        kryteriabtn.classList.add("highlight");
        wariantybtn.classList.remove("disabled");
    }
})

zacznijbtn.addEventListener("click", () => {
    location.reload(); 
    activateButton(zacznijbtn);
})

wariantybtn.addEventListener("click", () => {
    if(!wariantybtn.classList.contains("disabled")){
        console.log("hello");
        activateButton(wariantybtn);
    }
})

kryteriabtn.addEventListener("click", () => {
    if(!kryteriabtn.classList.contains("disabled")){
        activateButton(kryteriabtn);
    }
})

ekspercibtn.addEventListener("click", () => {
    activateButton(ekspercibtn);
    console.log("hello");

})

rankingbtn.addEventListener("click", () => {

    if(!rankingbtn.classList.contains("disabled")){
    if (confirm('Czy chcesz zatwierdzić swoje wybory?')) {
        activateButton(rankingbtn);

        let criteriasArgs = [];
        let variantsArgs = [];

        for(let i = 1; i <= ahpUser.CRITERIA_SLIDERS_TOTAL; i++){
            let partarr = eval(`cslider${i}.noUiSlider.get()`)
            partarr.reverse();
            partarr = partarr.map(el => convertNumber(Number(el)));

            criteriasArgs.push(partarr);
        }

        for(let i = 1; i<= ahpUser.VARIANT_SLIDERS_TOTAL*ahpUser.criterias.names.length; i++){
            let partarr = eval(`vslider${i}.noUiSlider.get()`)
            partarr.reverse();
            partarr = partarr.map(el => convertNumber(Number(el)));

            variantsArgs.push(partarr);
        }

        ahpUser.fillMatrices(criteriasArgs, variantsArgs);
        ahpUser.calculateWeights();

        let rating = ahpUser.getRanking();

        for(let i = 0; i < rating.variants.length; i++){
            let p = document.createElement("p");
            p.innerHTML = `<b>${i+1}.</b> ${rating.variants[i]} (${  Math.round((rating.ratings[i]*100 + Number.EPSILON) * 100)/100 }%)`;
            ranking_content.appendChild(p);
        }

        let hr = document.createElement("hr");
        ranking_content.appendChild(hr);

      } else {

      }
    }
})

submit_criteria_btn.addEventListener("click", () => {

    if(criteria_input.value){
        let newElement = document.createElement("div");
        newElement.classList.add("listItem");
        newElement.innerHTML = criteria_input.value;
        criteria_list.appendChild(newElement);
        criteria_input.value = "";

        newElement.addEventListener("click", (event) => {
            criteria_list.removeChild(event.target);
        })
    }

})

submit_variant_btn.addEventListener("click", () => {

    if(variant_input.value){
        let newElement = document.createElement("div");
        newElement.classList.add("listItem");
        newElement.innerHTML = variant_input.value;
        variant_list.appendChild(newElement);
        variant_input.value = "";

        newElement.addEventListener("click", (event) => {
            variant_list.removeChild(event.target);
        })
    }
})
