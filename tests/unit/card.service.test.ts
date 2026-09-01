import { CardService } from '../../src/services/card.service';

describe('CardService Unit Tests', () => {
  describe('sanitizeCardNumber', () => {
    it('should strip internal spaces and hyphens', () => {
      expect(CardService.sanitizeCardNumber('4532 0151 1283 0366')).toBe('4532015112830366');
      expect(CardService.sanitizeCardNumber(' 4532-0151-1283-0366 ')).toBe('4532015112830366');
      expect(CardService.sanitizeCardNumber('3782-822463-10005')).toBe('378282246310005');
    });
  });

  describe('isValidLuhn', () => {
    it('should validate standard card numbers using Luhn checksum', () => {
      // Valid Visa card number
      expect(CardService.isValidLuhn('4532015112830366')).toBe(true);
      // Valid American Express
      expect(CardService.isValidLuhn('378282246310005')).toBe(true);
      // Valid Mastercard
      expect(CardService.isValidLuhn('5105105105105100')).toBe(true);
    });

    it('should reject card numbers with invalid checksums', () => {
      // Invalid Visa card (last digit changed from 6 to 7)
      expect(CardService.isValidLuhn('4532015112830367')).toBe(false);
      // Invalid Amex
      expect(CardService.isValidLuhn('378282246831004')).toBe(false);
    });

    it('should return false for non-numeric input', () => {
      expect(CardService.isValidLuhn('453201511283036A')).toBe(false);
    });
  });

  describe('detectCardBrand', () => {
    it('should accurately identify major card brands', () => {
      expect(CardService.detectCardBrand('4532015112830366')).toBe('Visa');
      expect(CardService.detectCardBrand('5412751234567890')).toBe('Mastercard');
      expect(CardService.detectCardBrand('378282246831005')).toBe('American Express');
      expect(CardService.detectCardBrand('6011000900000000')).toBe('Discover');
      expect(CardService.detectCardBrand('3528000000000000')).toBe('JCB');
      expect(CardService.detectCardBrand('36000000000000')).toBe('Diners Club');
      expect(CardService.detectCardBrand('6200000000000000')).toBe('UnionPay');
      expect(CardService.detectCardBrand('5018000000000000')).toBe('Maestro');
      expect(CardService.detectCardBrand('9999000000000000')).toBe('Unknown');
    });
  });

  describe('validateCard', () => {
    it('should return valid result for valid formatted card', () => {
      const result = CardService.validateCard('4532 0151 1283 0366');
      expect(result.isValid).toBe(true);
      expect(result.cardBrand).toBe('Visa');
      expect(result.cardNumber).toBe('4532015112830366');
    });

    it('should return invalid result for card with invalid length', () => {
      const resultShort = CardService.validateCard('12345');
      expect(resultShort.isValid).toBe(false);
      expect(resultShort.message).toContain('invalid');

      const resultLong = CardService.validateCard('123456789012345678901');
      expect(resultLong.isValid).toBe(false);
    });

    it('should return invalid result for card containing letters', () => {
      const result = CardService.validateCard('453201511283036X');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('numeric digits');
    });

    it('should return invalid result for failing Luhn checksum', () => {
      const result = CardService.validateCard('4532015112830367');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('Luhn');
    });
  });
});
