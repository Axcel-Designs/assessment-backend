export interface CardValidationResult {
  cardNumber: string;
  isValid: boolean;
  cardBrand: string;
  message: string;
}

export class CardService {
  /**
   * Sanitizes input by trimming leading/trailing whitespace and removing internal spaces and hyphens.
   */
  public static sanitizeCardNumber(cardNumber: string): string {
    return cardNumber.trim().replace(/[\s-]/g, '');
  }

  /**
   * Evaluates a card number using the Luhn Algorithm (Modulus 10).
   *
   * @param sanitizedCardNumber Sanitized string containing only numeric digits.
   * @returns boolean indicating whether checksum is valid.
   */
  public static isValidLuhn(sanitizedCardNumber: string): boolean {
    if (!/^\d+$/.test(sanitizedCardNumber)) {
      return false;
    }

    let sum = 0;
    let shouldDouble = false;

    // Loop through digits from right to left
    for (let i = sanitizedCardNumber.length - 1; i >= 0; i--) {
      const char = sanitizedCardNumber.charAt(i);
      let digit = parseInt(char, 10);

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  }

  /**
   * Detects the payment card brand based on Bank Identification Number (BIN) / IIN prefixes.
   *
   * @param sanitizedCardNumber Sanitized numeric card number string.
   * @returns Detected brand name string.
   */
  public static detectCardBrand(sanitizedCardNumber: string): string {
    if (/^4/.test(sanitizedCardNumber)) {
      return 'Visa';
    }
    if (/^(5[1-5]|2[2-7][0-9]{2})/.test(sanitizedCardNumber)) {
      return 'Mastercard';
    }
    if (/^3[47]/.test(sanitizedCardNumber)) {
      return 'American Express';
    }
    if (/^(6011|65|64[4-9]|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]))/.test(sanitizedCardNumber)) {
      return 'Discover';
    }
    if (/^35(2[89]|[3-8][0-9])/.test(sanitizedCardNumber)) {
      return 'JCB';
    }
    if (/^3(0[0-5]|[689])/.test(sanitizedCardNumber)) {
      return 'Diners Club';
    }
    if (/^62/.test(sanitizedCardNumber)) {
      return 'UnionPay';
    }
    if (/^(50|5[6-8]|6304|6703|6759|6761|6762|6763)/.test(sanitizedCardNumber)) {
      return 'Maestro';
    }

    return 'Unknown';
  }

  /**
   * Primary card validation logic.
   *
   * @param rawCardNumber Raw input string submitted by user.
   * @returns CardValidationResult object.
   */
  public static validateCard(rawCardNumber: string): CardValidationResult {
    const sanitized = this.sanitizeCardNumber(rawCardNumber);

    // Basic format validation: must be digits only
    if (!/^\d+$/.test(sanitized)) {
      return {
        cardNumber: sanitized,
        isValid: false,
        cardBrand: 'Unknown',
        message: 'Card number must contain only numeric digits.'
      };
    }

    // Standard card number length validation (12 to 19 digits)
    if (sanitized.length < 12 || sanitized.length > 19) {
      return {
        cardNumber: sanitized,
        isValid: false,
        cardBrand: this.detectCardBrand(sanitized),
        message: `Card number length (${sanitized.length} digits) is invalid. Must be between 12 and 19 digits.`
      };
    }

    const isValidLuhn = this.isValidLuhn(sanitized);
    const cardBrand = this.detectCardBrand(sanitized);

    if (!isValidLuhn) {
      return {
        cardNumber: sanitized,
        isValid: false,
        cardBrand,
        message: 'Card number failed Luhn checksum validation.'
      };
    }

    return {
      cardNumber: sanitized,
      isValid: true,
      cardBrand,
      message: 'Card number is valid.'
    };
  }
}
