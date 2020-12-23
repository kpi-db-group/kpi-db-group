import generatePassword = require('password-generator');

export class PasswordUtil {

    static passwordLength = 10;

    public static isAccordingToPolitics(password): boolean {
        const uppercaseMinCount = 2;
        const uppercaseMaxCount = 4;
        const numberMinCount = 2;
        const numberMaxCount = 4;
        const UPPERCASE_REGEX = /([A-ZА-ЯҐЄІЇÄÖÜß])/g;
        const NUMBER_REGEX = /([\d])/g;
        const SPECIAL_SYMBOLS_REGEX = /([^a-zA-Zа-яА-ЯҐЄІЇÄÖÜß0-9])/g;
        const uc = password.match(UPPERCASE_REGEX);
        const n = password.match(NUMBER_REGEX);
        const ss = password.match(SPECIAL_SYMBOLS_REGEX);
        return password.length === PasswordUtil.passwordLength &&
            uc && uc.length >= uppercaseMinCount && uc.length <= uppercaseMaxCount
            && n && n.length >= numberMinCount && n.length <= numberMaxCount && !ss;
    }

    public static customPassword() {
        let password = '';
        while (!PasswordUtil.isAccordingToPolitics(password)) {
            password = generatePassword(PasswordUtil.passwordLength, false, /[\w\d\-]/);
        }
        return password;
    }
}
