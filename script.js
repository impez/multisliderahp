// Referencje do głównych bloków
let start_content = document.querySelector(".start");
let criterias_content = document.querySelector(".criteriasWindow"); 
let variants_content = document.querySelector(".variantsWindow");
let ranking_content = document.querySelector(".ranking");
let experts_content = document.querySelector(".experts");
let blankinfo = document.querySelector(".blankPage");

let ahpUser;

let ahpExperts = {
    everyCriteriaWeight: [],
    everyVariantWeight: [],
    criteriaAverage: [],
    variantAverage: [],
    consistencyIndexArrayCriterias: [],
    consistencyIndexArrayVariants: []
}

// Menu - przyciski
let zacznijbtn = document.querySelector(".zacznij");
let kryteriabtn = document.querySelector(".kryteria");
let wariantybtn = document.querySelector(".warianty");
let rankingbtn = document.querySelector(".rankingBtn");
let ekspercibtn = document.querySelector(".expertsBtn");
let resetSliderValuesBtn = document.querySelectorAll(".resetSliderValues");
let newExpertBtn = document.querySelector(".newExpert");
let checkChoicesBtn = document.querySelector(".checkChoices");

let CRITERIA_SLIDER_ORDER = 0;
let VARIANT_SLIDER_ORDER = 0;
let backToVariantsBtn = document.getElementById("backToVariants");
let backToCriteriasBtn = document.getElementById("backToCriterias");

// Wstępny formularz
let submit_criteria_btn = document.querySelector(".submitCriteria");
let submit_variant_btn = document.querySelector(".submitVariant");
let criteria_input = document.querySelector(".criteriaInput");
let variant_input = document.querySelector(".variantInput");

let criteria_list = document.querySelector(".criteriaList");
let variant_list = document.querySelector(".variantList");
let listItems = document.querySelectorAll(".listItem");
let start_btn = document.getElementById("startEvaluation");
let naglowki;
let hCriteriaText = document.getElementById("hCriteria");

let nums = [];
let GLOBAL_SLIDERS = new Set();
let EXPERT_NUMBER = 1;
let CHECK_CHOICES_CHECKER = 0;
let cIndexes = [];

let GlobalCriteriaArrayList;
let GlobalVariantArrayList;
let OrderedCriteriaContentSliders = [];
let OrderedVariantContentSliders = [];
let toggleHighlight = true;

var ctx = document.getElementById('myChart');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Ocena (w %)',
            data: [],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

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

function placeSlidersInArrays(){
    for(let i=0; i<criterias_content.childElementCount; i++){
        if(criterias_content.children[i].classList.contains("slidergrp")){
            OrderedCriteriaContentSliders.push(criterias_content.children[i]);
        }
    }

    for(let i=0; i<variants_content.childElementCount; i++){
        if(variants_content.children[i].classList.contains("slidergrp")){
            OrderedVariantContentSliders.push(variants_content.children[i]);
        }   
    }
}

function removeDataFromCharts(){
    myChart.data.datasets[0].data = [];
}

function highlightSliderGroup(sliderGroup, type){
    if(toggleHighlight){
        if(type === 'criteria'){
            for(let i=0; i<OrderedCriteriaContentSliders.length; i++){
                OrderedCriteriaContentSliders[i].classList.remove("activeSlider");
            }
            sliderGroup.classList.add("activeSlider");
        }
        else if(type === 'variant'){
            for(let i=0;i<OrderedVariantContentSliders.length; i++){
                OrderedVariantContentSliders[i].classList.remove("activeSlider");
            }
            sliderGroup.classList.add("activeSlider");
        }
    }
}

function highlightEverySlider(){
    for(let i=0; i<OrderedCriteriaContentSliders.length; i++){
        OrderedCriteriaContentSliders[i].classList.add("activeSlider");
    }
    for(let i=0; i<OrderedVariantContentSliders.length; i++){
        OrderedVariantContentSliders[i].classList.add("activeSlider");
    }
}

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

    if(btn.classList.contains("expertsBtn") && !btn.classList.contains("disabled")){
        highlightoff();
        contentoff();

        btn.classList.add("highlight");
        experts_content.classList.remove("hide");
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

function pushChartLabels(labels){
    labels.forEach(label => {
        myChart.data.labels.push(label);
    })
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

        GLOBAL_SLIDERS.add(noUiSlider.create(newCSlider, {
            start: [500, 800, 1100],
            connect: true,
            direction: 'rtl',
            range: {
                'min': 0,
                'max': 1600
            }
        }));

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

            GLOBAL_SLIDERS.add(noUiSlider.create(newVSlider, {
                start: [500, 800, 1100],
                connect: true,
                direction: 'rtl',
                range: {
                    'min': 0,
                    'max': 1600
                }
            }));

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

    placeSlidersInArrays();
    highlightSliderGroup(OrderedCriteriaContentSliders[0], "criteria");
    highlightSliderGroup(OrderedVariantContentSliders[0], "variant");
    OrderedCriteriaContentSliders[0].addEventListener("mouseenter", () => {
        addSliderEventListeners();
    })
}

function addSliderEventListeners(){
        OrderedCriteriaContentSliders.forEach(slider => {
            slider.addEventListener("mouseover", function highlightCriteria(){
                highlightSliderGroup(slider, "criteria");
            })
        })
    
        OrderedVariantContentSliders.forEach(slider => {
            slider.addEventListener("mouseover", function highlighVariant(){
                highlightSliderGroup(slider, "variant");
            })
        })
}

function toggleSliderEventListeners(){
    toggleHighlight =! toggleHighlight;
}

function resetSlidersValues(){
    GLOBAL_SLIDERS.forEach(slider => slider.set([500,800,1100]));
}

function estimateExpertsDecisions(){

    for(let j = 0; j < ahpUser.criterias.weights.length; j++){
        let sum = 0;

        for(let i = 0; i < ahpExperts.everyCriteriaWeight.length; i++){
            sum += ahpExperts.everyCriteriaWeight[i][j];
        }
        ahpExperts.criteriaAverage.push(sum/ahpExperts.everyCriteriaWeight.length);
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
        GlobalCriteriaArrayList = criteriaArrayList;
        GlobalVariantArrayList  = variantArrayList;

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

        pushChartLabels(ahpUser.variants.names);
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
})

rankingbtn.addEventListener("click", () => {

    if(!rankingbtn.classList.contains("disabled")){
        if(ahpUser === null){
            activateButton(rankingbtn);
        }
        else if (confirm('Czy chcesz zatwierdzić swoje wybory?')) {
            blankinfo.classList.add("hide");
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

            let pExpert = document.createElement("p");
            pExpert.innerHTML = `<u>Ekspert nr. ${EXPERT_NUMBER++}</u>`;
            //ranking_content.appendChild(pExpert);
            experts_content.appendChild(pExpert);

            for(let i = 0; i < rating.variants.length; i++){
                let p = document.createElement("p");
                let singleRating = Math.round((rating.ratings[i]*100 + Number.EPSILON) * 100)/100;
                p.innerHTML = `${rating.variants[i]} (${singleRating}%)`;
                //pushChartValue(singleRating);
                //ranking_content.appendChild(p);
                myChart.data.datasets[0].data.push(singleRating);
                experts_content.appendChild(p);
            }

            let hr = document.createElement("hr");
            //ranking_content.appendChild(hr);
            experts_content.appendChild(hr);

            ahpExperts.everyCriteriaWeight.push(ahpUser.criterias.weights);
            ahpExperts.everyVariantWeight.push(ahpUser.variants.weights);

            ahpExperts.consistencyIndexArrayCriterias[EXPERT_NUMBER-2] = [];
            ahpExperts.consistencyIndexArrayVariants[EXPERT_NUMBER-2] = [];
            ahpExperts.consistencyIndexArrayCriterias[EXPERT_NUMBER-2].push(ahpUser.getGeomConsistencyIndex(ahpUser.CRITERIA_MATRIX, ahpUser.criterias.weights));
            for(let i=0; i< ahpUser.VARIANT_MATRIX.length; i++){
                ahpExperts.consistencyIndexArrayVariants[EXPERT_NUMBER-2].push(ahpUser.getGeomConsistencyIndex(ahpUser.VARIANT_MATRIX[i], ahpUser.variants.weights[i]));
            }
            
            toggleSliderEventListeners();
            ahpUser = null;
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

resetSliderValuesBtn.forEach(resetBtn => {
    resetBtn.addEventListener("click", () => {
        resetSlidersValues();
    })
})

newExpertBtn.addEventListener("click", () => {
    naglowki = document.querySelectorAll(".helem");
    CHECK_CHOICES_CHECKER = 0;
    ahpUser = {};
    ahpUser = new AHP(GlobalCriteriaArrayList, GlobalVariantArrayList);
    ahpUser.createMatrices();
    activateButton(kryteriabtn);

    hCriteriaText.removeChild(hCriteriaText.lastChild);

    naglowki.forEach(h => {
        for(let i=0; i<h.childElementCount; i++){
            if(h.children[i].classList.contains("ci")){
                h.removeChild(h.children[i]);
            }
        }
    })

    removeDataFromCharts();
    toggleSliderEventListeners();
    highlightSliderGroup(OrderedCriteriaContentSliders[0], "criteria");
    highlightSliderGroup(OrderedVariantContentSliders[0], "variant");
})

checkChoicesBtn.addEventListener("click", () => {
        if(CHECK_CHOICES_CHECKER > 0){
            activateButton(kryteriabtn);
        }
        else{
            ++CHECK_CHOICES_CHECKER;
            highlightEverySlider();

            activateButton(kryteriabtn);
            let cindexCriteria = document.createElement("p");
            cindexCriteria.innerHTML = `CR: ${ahpExperts.consistencyIndexArrayCriterias[EXPERT_NUMBER-2].pop()}`;
            cindexCriteria.classList.add("ci");
            hCriteriaText.appendChild(cindexCriteria);
            cIndexes.push(cindexCriteria);
        
            for(let i=0; i<variants_content.childElementCount; i++){
                if(variants_content.children[i].classList.contains("helem")){
                    let cindexVariant = document.createElement("p");
                    cindexVariant.innerHTML = `CR: ${ahpExperts.consistencyIndexArrayVariants[EXPERT_NUMBER-2].shift()}`;
                    cindexVariant.classList.add("ci");
                    variants_content.children[i].appendChild(cindexVariant);
                    cIndexes.push(cindexVariant);
                }
            }
        }
})

backToCriteriasBtn.addEventListener("click", () => {
    activateButton(kryteriabtn);
})

backToVariantsBtn.addEventListener("click", () => {
    activateButton(wariantybtn);
})
