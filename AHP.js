const RANDOM_INDEX = {
    3: 0.52,
    4: 0.89,
    5: 1.11,
    6: 1.25,
    7: 1.35,
    8: 1.4,
    9: 1.45,
    10: 1.49
}

class AHP{

    constructor(criterias, variants){
        this.criterias = {};
        this.variants = {};
        this.CRITERIA_MATRIX = [];
        this.VARIANT_MATRIX = [];

        this.criterias.names = [...criterias];
        this.variants.names = [...variants];
        this.criterias.weights = [];
        this.variants.weights = [];

        this.CRITERIA_SLIDERS_TOTAL = (criterias.length**2 - criterias.length)/2;
        this.VARIANT_SLIDERS_TOTAL = (variants.length**2 - variants.length)/2;

        for(let i = 0; i<this.criterias.names.length; i++){
            this.variants.weights[i] = [];
        }
    }

    getGeometricMean(values, degree){
        return Math.pow(values.reduce(((el,acc) => el*acc),1), 1/degree);
    }

    getTemporaryGeomMatrix(matrix){
        for(let i=0; i<matrix.length; i++){
            for(let j=0; j<matrix.length; j++){
                matrix[i][j] = this.getGeometricMean(matrix[i][j], matrix.length);
            }
        }
        return matrix;
    }

    multiplyMatrix(A, B){
        //A - Basic Matrix
        //B - Weights
        //tempMatrix - A3 = AxB
        let LENGTH = A.length;
        let tempMatrix = [];

        for(let i=0; i<LENGTH; i++){
            let tempValue = 0;
            for(let j=0; j<LENGTH; j++){
                tempValue += A[i][j] * B[j];
            }
            tempMatrix.push(tempValue);
        }

        return tempMatrix;
    }

    divideMatrix(A3, weightMatrix){
        //C - tempMatrix A3 = AxB
        //B - Weights
        let LENGTH = A3.length;
        let lambdaMatrix = [];

        for(let i=0; i<LENGTH; i++){
            lambdaMatrix.push(A3[i]/weightMatrix[i]);
        }

        return lambdaMatrix;
    }

    getGeomConsistencyIndex(matrix, weights){
        if(matrix.length < 3){
            return 0;
        }
        else{
            let tempGeometryMatrix = this.getTemporaryGeomMatrix([...matrix]);
            let A3 = this.multiplyMatrix(tempGeometryMatrix, weights);
            let lambdaMatrix = this.divideMatrix(A3, weights);
            let lambdaMax = (lambdaMatrix.reduce((val, acc) => val+acc,0)/lambdaMatrix.length);
            let consistencyIndex = (lambdaMax - matrix.length)/(matrix.length - 1);
    
            return consistencyIndex/RANDOM_INDEX[matrix.length];
        }
    }

    getRanking(){
        let finalRanking = {
            variants: this.variants.names,
            ratings: []
        };

        for(let x = 0; x < this.variants.names.length; x++){
            let sum = 0;
            
            for(let i = 0; i < this.variants.weights.length; i++){    
                sum += this.criterias.weights[i] * this.variants.weights[i][finalRanking.ratings.length];
            }
            
            finalRanking.ratings.push(sum);
        }

        return finalRanking;
    }

    calculateSingleMatrixWeight(matrix){

        let rows = [];
        
        for(let n = 0; n < matrix.length; n++){
        
            let temparr = [];
        
            for(let j = 0; j < 3 ; j++){
                let temp = 1;
        
                for(let i = 0; i < matrix.length ; i++){
                    temp *= matrix[n][i][j];
                }
        
            temparr.push(Math.pow(temp, 1/matrix.length));
            }
        
        rows.push(temparr);
        }
        
        let rowsSumReversed = [];
        
        for(let i = 0; i < 3; i++){
            let sum = 0;
        
            for(let j = 0; j < rows.length; j++){
                sum += rows[j][i];
            }
        
            rowsSumReversed.push(sum);
        }
        
        rowsSumReversed = rowsSumReversed.reverse().map(el => 1/el);
        
        for(let i = 0; i < rows.length; i++){
            let temp = [];
        
            for(let j = 0; j < 3; j++){
                temp.push(rowsSumReversed[j] * rows[i][j]);
            }
        
            rows[i] = temp;
        }
        
        let weights_sum = 0;
        
        for(let i = 0; i < rows.length; i++){
            rows[i] = rows[i].reduce((fuzzyweight,acc) => fuzzyweight+acc)/3;
            weights_sum += rows[i];
        } 
        
        return rows.map(el => el/weights_sum);
        
    }

    calculateWeights(){

        this.criterias.weights = this.calculateSingleMatrixWeight(this.CRITERIA_MATRIX);
        
        for(let i = 0; i < this.VARIANT_MATRIX.length; i++){
            this.variants.weights[i] = this.calculateSingleMatrixWeight(this.VARIANT_MATRIX[i]);
        }
    }

    fillMatrices(criteriaValues, variantValues){

        let cIndex = 0;
        let vIndex = 0;

        for(let i = 0; i < this.CRITERIA_MATRIX.length; i++){
        
            for(let j = i+1; j < this.CRITERIA_MATRIX.length; j++){
                this.CRITERIA_MATRIX[i][j] = criteriaValues[cIndex++];
                this.CRITERIA_MATRIX[j][i] = [...this.CRITERIA_MATRIX[i][j]].reverse().map(el => 1/el);
            }
        }

        for(let i = 0; i < this.VARIANT_MATRIX.length; i++){
        
          for(let j = 0; j < this.variants.names.length; j++){
        
               for(let c = j+1; c < this.variants.names.length; c++){
                this.VARIANT_MATRIX[i][j][c] = variantValues[vIndex++];
                this.VARIANT_MATRIX[i][c][j] = [...this.VARIANT_MATRIX[i][j][c]].reverse().map(el => 1/el);
                }
            }
        }

    }

    createMatrices(){
        
        for(let i = 0; i < this.criterias.names.length; i++){
            this.CRITERIA_MATRIX[i] = []; 
            for(let j=0; j<this.criterias.names.length; j++){
                this.CRITERIA_MATRIX[i][j] = [1,1,1];
            }
        }

        for(let i = 0; i < this.criterias.names.length; i++){
            this.VARIANT_MATRIX[i] = [];

            for(let j = 0; j < this.variants.names.length; j++){
                this.VARIANT_MATRIX[i][j] = [];

                for(let c = 0; c<this.variants.names.length; c++){
                    this.VARIANT_MATRIX[i][j][c] = [1,1,1];
                }
            }
        }

    }
}

/*
myAhp = new AHP(["price or cost","storage space","hello"], ["zakup", "samodzielnie", "bbomm"]);
myAhp.createMatrices();

myAhp.fillMatrices([ [9,5,6], [3,4,5], [6,2,1/8] ], [ [5,1,1], [2,3,4], [3,4,5], [9,7,5], [5,5,9], [7,8,9], [1/4,1/3,1/2], [1/7,1/6,1/5], [4,5,6] ]);
myAhp.calculateWeights();
console.log(myAhp.getRanking());
console.log(myAhp);
*/