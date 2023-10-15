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

const IDEAL_SCHEDULE_DAY_PROPS = [
    "ideal-mon", "ideal-tue", "ideal-wed", "ideal-thu", "ideal-fri", "ideal-sat", "ideal-sun"
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
    for(ttProp in TRAINING_TYPE_PROPS){
        if(localUser[ttProp]){
            if(otherUser[ttProp]){
                noCommonTT = false
            }else{
                score -= MISSING_TRAINING_TYPE_WEIGHT
            }
        }
    }

    if(noCommonTT){
        return NaN
    }

    for(dayProp in IDEAL_SCHEDULE_DAY_PROPS){
        const localResting = localUser[dayProp] == -1
        const otherResting = otherUser[dayProp] == -1

        if(localResting != otherResting){
            score -= MAX_ONE_DAY_SCHEDULE_DIFF_WEIGHT
        }else if(!localResting){
            const timeDiff = Math.abs(localUser[dayProp] - otherUser[dayProp])
            score -= timeDiff/SECS_PER_DAY*MAX_ONE_DAY_SCHEDULE_DIFF_WEIGHT
        }
    }

    return score
}

export { assignProspectScore }