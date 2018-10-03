import MailComposer from 'nodemailer/lib/mail-composer';
import mailgun from 'mailgun-js';

const mailgunWorker = mailgun({ apiKey: 'key-5f4a41197568e6a8d0eea9c0fe610b50', domain: 'sandboxbda8b903a1704003bac1d9c40ec4b89e.mailgun.org'});

const sendMail = (options) => {
    return new Promise( (resolve, reject) => {
        if(!options || typeof options !== 'object') {
            reject('Mail object not provided');
        }

        const mail = new MailComposer(options);

        mail.compile().build( (err, message) => {
            if(err) {
                reject(err);
            }

            const data = {
                to: options.to,
                message: message.toString('ascii')
            }

            mailgunWorker.messages().sendMime(data, (err, body) => {
                if(err){
                    reject(err)
                }
                resolve('Email sent!')
            })
        })
    })
}

export default sendMail