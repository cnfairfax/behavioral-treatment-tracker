import db from '../../db'

const updateEntry = (user, id, data) => {
    return new Promise((resolve, reject) => {
        switch(data.type) {
            case 'SOAP':
                db.one('update entries set lesson_scripture = $1, lesson_observation = $2, lesson_application = $3, lesson_prayer = $4 where id = $5 and user_id = $6 returning id, study_type, lesson_scripture, lesson_observation, lesson_application, lesson_prayer', [data.scripture, data.observation, data.application, data.prayer, id, user])
                    .then( (result) => {
                        resolve(result);
                    })
                    .catch( (err) => {
                        reject(err);
                    })
                break
            case 'OIA':
                db.one('update entries set lesson_scripture = $1, lesson_observation = $2, lesson_interpretations = $3, lesson_application = $4 where id = $5 and user_id = $6 returning id, study_type, lesson_scripture, lesson_observation, lesson_interpretations, lesson_application', [data.scripture, data.interpretation, data.observation, data.application, id, user])
                    .then( (result) => {
                        resolve(result);
                    })
                    .catch( (err) => {
                        reject(err);
                    })
                break
            default:
                reject('Not a valid type')
        }
    })
}

export default updateEntry;