/**
 * Encapsulates Email Alerts config for a bot.
 *
 * @author gazbert
 */
export class EmailAlertsConfig {

    constructor(public id: string,
                public exchangeId: string,
                public enabled: boolean,
                public smtpHost: string,
                public smtpPort: number,
                public accountUsername: string,
                public accountPassword: string,
                public toAddress: string,
                public fromAddress: string) {
    }

    clone() {
        return new EmailAlertsConfig(this.id, this.exchangeId, this.enabled, this.smtpHost, this.smtpPort,
        this.accountUsername, this.accountPassword, this.toAddress, this.fromAddress);
    }
}