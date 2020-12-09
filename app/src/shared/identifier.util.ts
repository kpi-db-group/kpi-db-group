import generatePassword = require('password-generator');

export class IdentifierUtil {

  static passwordLength = 10;

  public static isAccordingToPolitics(identifier): boolean {
    const uppercaseMinCount = 2;
    const uppercaseMaxCount = 4;
    const numberMinCount = 2;
    const numberMaxCount = 4;
    const UPPERCASE_REGEX = /([A-ZА-ЯҐЄІЇÄÖÜß])/g;
    const NUMBER_REGEX = /([\d])/g;
    const SPECIAL_SYMBOLS_REGEX = /([^a-zA-Zа-яА-ЯҐЄІЇÄÖÜß0-9])/g;
    const uc = identifier.match(UPPERCASE_REGEX);
    const n = identifier.match(NUMBER_REGEX);
    const ss = identifier.match(SPECIAL_SYMBOLS_REGEX);
    return identifier.length === IdentifierUtil.passwordLength &&
      uc && uc.length >= uppercaseMinCount && uc.length <= uppercaseMaxCount
      && n && n.length >= numberMinCount && n.length <= numberMaxCount && !ss;
  }

  public static generateID() {
  let identifier = '';
  while (!IdentifierUtil.isAccordingToPolitics(identifier)) {
      identifier = generatePassword(IdentifierUtil.passwordLength, false, /[\w\d\-]/);
    }
  return identifier;
  }
}
