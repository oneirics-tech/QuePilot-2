// backend/src/utils/pin.generator.js
class PinGenerator {
    generate(length = 6) {
      const min = Math.pow(10, length - 1);
      const max = Math.pow(10, length) - 1;
      return Math.floor(Math.random() * (max - min + 1) + min).toString();
    }
  
    validate(pin) {
      return /^\d{4,6}$/.test(pin);
    }
  }
  
  module.exports = new PinGenerator();
  