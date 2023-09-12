import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import getConfig from '../../core/config/configurations'

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport(getConfig().MAIL_SERVICE.transporter);
    }

    async sendEmail(to: string, subject: string, html: string) {
        try {
            
            const mailOptions = {
                from: getConfig().MAIL_SERVICE.fromMail,
                to,
                subject,
                html,
            };
            const info = await this.transporter.sendMail(mailOptions);
            console.log(`Message sent: ${info.messageId}`);
            } catch (error) {
            console.error(error);
            }
    }
}
