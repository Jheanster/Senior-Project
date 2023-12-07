const AGE_DIFF_PERCENT_WEIGHT = 10
const EXP_DIFF_WEIGHT = 1
const MISSING_TRAINING_TYPE_WEIGHT = 10
const MAX_ONE_DAY_SCHEDULE_DIFF_WEIGHT = 5

const MAX_AGE_DIFF_PERCENT = 0.2
const MAX_EXP_DIFF = 30

const SECS_PER_DAY = 86400

const TRAINING_TYPE_PROPS = [
    "bodybuilding", "powerlifting", "crossfit", "calisthenics",
    "running", "cycling", "weight-loss", "general-fitness"
]


function assignProspectScore(localUser, otherUser){
    let score = 100

    ageDiffPercent = Math.abs(localUser.age - otherUser.age)/Math.min(localUser.age, otherUser.age)
    if(ageDiffPercent > MAX_AGE_DIFF_PERCENT){
        return NaN
    }else{
        score -= ageDiffPercent*AGE_DIFF_PERCENT_WEIGHT
    }

    expDiff = Math.abs(localUser.experience - otherUser.experience)
    if(expDiff > MAX_EXP_DIFF){
        return NaN
    }else{
        score -= expDiff*EXP_DIFF_WEIGHT
    }
    
    let noCommonTT = true
    TRAINING_TYPE_PROPS.forEach((ttProp) => {
        if(localUser[ttProp]){
            if(otherUser[ttProp]){
                noCommonTT = false
            }else{
                score -= MISSING_TRAINING_TYPE_WEIGHT
            }
        }
    })

    if(noCommonTT){
        return NaN
    }

    

    otherUser.score = score
}

export { assignProspectScore }