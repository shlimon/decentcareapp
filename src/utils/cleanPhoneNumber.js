// utils/phoneUtils.js

/**
 * Cleans a phone number by removing all non-numeric characters
 * @param {string} phoneNumber - The phone number to clean
 * @returns {string} - The cleaned phone number containing only digits
 * 
 * Examples:
 * cleanPhoneNumber("0420 903 535") -> "0420903535"
 * cleanPhoneNumber("+0420 903 535") -> "0420903535"
 * cleanPhoneNumber("0420-903 535") -> "0420903535"
 * cleanPhoneNumber("+0420-903-535") -> "0420903535"
 */
export const cleanPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return '';
    return phoneNumber.replace(/\D/g, '');
};